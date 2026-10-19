import { CRUISE_MS, MAX_MS, STALL_MS, type Aircraft, type FlightMode, type Phase, type Vec2, type Waypoint } from "./types";

export const TIME_SCALE = 16;

export function dist(a: Vec2, b: Vec2) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function wrapPi(a: number) {
  let x = a;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
}

export function headingTo(from: Vec2, to: Vec2) {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

export function azimuthDeg(from: Vec2, to: Vec2) {
  let deg = (headingTo(from, to) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export type FlightInput = {
  roll: number;
  climb: number;
  throttle: number;
};

export function targetFor(
  mode: FlightMode,
  phase: Phase,
  ac: Aircraft,
  waypoints: Waypoint[],
  wpIndex: number,
  guided: Vec2 | null,
  gcs: Vec2,
  loiter: Vec2,
): { pos: Vec2; alt: number; circle: boolean } {
  if (mode === "RTL" || phase === "rtl") {
    return { pos: gcs, alt: phase === "land" ? 2 : 300, circle: dist(ac.pos, gcs) < 180 };
  }
  if (mode === "LOITER" || phase === "loiter") {
    return { pos: loiter, alt: ac.alt, circle: true };
  }
  if (mode === "GUIDED" && guided) {
    return { pos: guided, alt: Math.max(ac.alt, 250), circle: dist(ac.pos, guided) < 160 };
  }
  if (mode === "FBWA") {
    const ahead = 900;
    return {
      pos: { x: ac.pos.x + Math.cos(ac.hdg) * ahead, y: ac.pos.y + Math.sin(ac.hdg) * ahead },
      alt: ac.alt,
      circle: false,
    };
  }
  const wp = waypoints[Math.min(wpIndex, waypoints.length - 1)] ?? waypoints[0];
  return { pos: wp.pos, alt: wp.alt, circle: false };
}

export function stepFlight(
  ac: Aircraft,
  dt: number,
  target: { pos: Vec2; alt: number; circle: boolean },
  input: FlightInput,
  mode: FlightMode,
  phase: Phase,
): Aircraft {
  const t = dt * TIME_SCALE;
  if (!ac.armed || phase === "ready") {
    return { ...ac, spd: 0, alt: 1.2 };
  }

  let hdg = ac.hdg;
  let alt = ac.alt;
  let spd = ac.spd;
  const pos = { ...ac.pos };

  if (phase === "armed") {
    spd = 0;
    return { ...ac, pos, alt: 1.2, hdg, spd };
  }

  const desiredSpd =
    phase === "land"
      ? 16
      : phase === "takeoff"
        ? 18
        : mode === "FBWA"
          ? clamp(STALL_MS + 6 + input.throttle * (MAX_MS - STALL_MS - 6), STALL_MS, MAX_MS)
          : CRUISE_MS;

  spd += (desiredSpd - spd) * Math.min(1, t * 0.7);

  if (target.circle) {
    const toC = headingTo(pos, target.pos);
    const tangent = toC + Math.PI / 2;
    const radial = dist(pos, target.pos);
    const want = radial > 280 ? toC : radial < 160 ? toC + Math.PI : tangent;
    hdg += wrapPi(want - hdg) * Math.min(1, t * 1.4);
  } else if (mode === "FBWA") {
    hdg += input.roll * 0.55 * t;
  } else {
    const want = headingTo(pos, target.pos);
    hdg += wrapPi(want - hdg) * Math.min(1, t * 1.6);
  }

  const climbCmd =
    mode === "FBWA" ? input.climb * 8 : clamp((target.alt - alt) / 12, -6, 8);
  alt = clamp(alt + climbCmd * t, 1.2, 3000);

  pos.x += Math.cos(hdg) * spd * t;
  pos.y += Math.sin(hdg) * spd * t;

  const drain = (spd / CRUISE_MS) * 0.004 * t;
  const battery = clamp(ac.battery - drain, 8, 100);
  const voltage = 22.2 + (battery / 100) * 3.4;

  return { ...ac, pos, alt, hdg, spd, battery, voltage, mode, armed: true };
}

export function nextPhase(
  phase: Phase,
  mode: FlightMode,
  ac: Aircraft,
  waypoints: Waypoint[],
  wpIndex: number,
  gcs: Vec2,
): { phase: Phase; wpIndex: number } {
  if (phase === "ready" || phase === "armed") return { phase, wpIndex };

  if (phase === "takeoff") {
    if (ac.alt > 80 && ac.spd > 12) return { phase: "cruise", wpIndex: Math.max(wpIndex, 1) };
    return { phase, wpIndex };
  }

  if (phase === "land") {
    if (ac.alt <= 2.4 && dist(ac.pos, gcs) < 90) return { phase: "ready", wpIndex: 0 };
    return { phase, wpIndex };
  }

  if (mode === "RTL") {
    if (dist(ac.pos, gcs) < 160 && ac.alt < 80) return { phase: "land", wpIndex };
    return { phase: "rtl", wpIndex };
  }
  if (mode === "LOITER" || mode === "GUIDED") return { phase: "loiter", wpIndex };
  if (mode === "FBWA") return { phase: "cruise", wpIndex };

  const wp = waypoints[wpIndex];
  if (wp && dist(ac.pos, wp.pos) < 140) {
    if (wpIndex >= waypoints.length - 1) return { phase: "loiter", wpIndex };
    return { phase: "cruise", wpIndex: wpIndex + 1 };
  }
  return { phase: "cruise", wpIndex };
}
