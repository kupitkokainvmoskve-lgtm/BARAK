import { useCallback, useEffect, useRef, useState } from "react";
import {
  azimuthDeg,
  dist,
  nextPhase,
  stepFlight,
  targetFor,
  type FlightInput,
} from "@/lib/sim/physics";
import { defaultWaypoints, emptyAircraft, GCS, type SimSnapshot } from "@/lib/sim/snapshot";
import { type FlightMode, type Phase, type Vec2 } from "@/lib/sim/types";

const TRAIL_MAX = 420;

type Engine = {
  ac: ReturnType<typeof emptyAircraft>;
  waypoints: ReturnType<typeof defaultWaypoints>;
  wpIndex: number;
  trail: Vec2[];
  phase: Phase;
  guided: Vec2 | null;
  loiter: Vec2;
  last: number;
  input: FlightInput;
};

function boot(auto: boolean): Engine {
  const waypoints = defaultWaypoints();
  if (!auto) {
    return {
      ac: emptyAircraft("AUTO"),
      waypoints,
      wpIndex: 0,
      trail: [],
      phase: "ready",
      guided: null,
      loiter: { ...GCS },
      last: 0,
      input: { roll: 0, climb: 0, throttle: 0.35 },
    };
  }
  const wp = waypoints[2];
  return {
    ac: {
      ...emptyAircraft("AUTO"),
      pos: { ...wp.pos },
      alt: wp.alt,
      hdg: 0.7,
      spd: 20,
      armed: true,
      battery: 86,
      voltage: 25.1,
    },
    waypoints,
    wpIndex: 2,
    trail: [],
    phase: "cruise",
    guided: null,
    loiter: { ...wp.pos },
    last: 0,
    input: { roll: 0, climb: 0, throttle: 0.35 },
  };
}

function toSnap(e: Engine, now: number): SimSnapshot {
  return {
    ac: e.ac,
    gcs: GCS,
    waypoints: e.waypoints,
    wpIndex: e.wpIndex,
    trail: e.trail,
    phase: e.phase,
    now,
    link: {
      video: e.phase !== "ready" || e.ac.armed,
      telem: true,
      ctrl: e.ac.mode !== "AUTO" || e.phase === "ready" || e.phase === "armed" || e.phase === "land",
    },
    antennaAz: azimuthDeg(GCS, e.ac.pos),
    guided: e.guided,
    ready: e.ac.voltage >= 24.8 && e.phase !== "land",
  };
}

export function useSim(opts?: { auto?: boolean; compact?: boolean }) {
  const auto = opts?.auto !== false;
  const compact = Boolean(opts?.compact);
  const engine = useRef<Engine>(boot(auto || compact));
  const snapRef = useRef<SimSnapshot>(toSnap(engine.current, 0));
  const [hud, setHud] = useState(() => {
    const s = snapRef.current;
    return {
      phase: s.phase,
      mode: s.ac.mode,
      alt: s.ac.alt,
      spd: s.ac.spd,
      battery: s.ac.battery,
      voltage: s.ac.voltage,
      armed: s.ac.armed,
      wpIndex: s.wpIndex,
      ready: s.ready,
      antennaAz: s.antennaAz,
      hdg: s.ac.hdg,
      link: s.link,
    };
  });

  const setMode = useCallback((mode: FlightMode) => {
    const e = engine.current;
    e.ac = { ...e.ac, mode };
    if (mode === "LOITER") e.loiter = { ...e.ac.pos };
    if (mode === "RTL") e.phase = e.ac.armed && e.phase !== "ready" ? "rtl" : e.phase;
  }, []);

  const setInput = useCallback((patch: Partial<FlightInput>) => {
    engine.current.input = { ...engine.current.input, ...patch };
  }, []);

  const arm = useCallback(() => {
    const e = engine.current;
    if (e.ac.voltage < 24.8) return;
    e.ac = { ...e.ac, armed: true, mode: e.ac.mode === "FBWA" ? "FBWA" : "AUTO" };
    e.phase = "armed";
  }, []);

  const launch = useCallback(() => {
    const e = engine.current;
    if (!e.ac.armed) {
      if (e.ac.voltage < 24.8) return;
      e.ac = { ...e.ac, armed: true };
    }
    e.ac = { ...e.ac, mode: "AUTO", spd: 16 };
    e.phase = "takeoff";
    e.wpIndex = 0;
  }, []);

  const land = useCallback(() => {
    const e = engine.current;
    e.ac = { ...e.ac, mode: "FBWA" };
    e.phase = "land";
  }, []);

  const guidedAt = useCallback((p: Vec2) => {
    const e = engine.current;
    e.guided = p;
    e.ac = { ...e.ac, mode: "GUIDED", armed: true };
    if (e.phase === "ready") e.phase = "armed";
    if (e.phase === "armed") return;
    e.phase = "loiter";
  }, []);

  const reset = useCallback(() => {
    engine.current = boot(false);
    snapRef.current = toSnap(engine.current, performance.now());
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      const e = engine.current;
      const dt = e.last ? Math.min(0.05, (t - e.last) / 1000) : 0.016;
      e.last = t;
      const tgt = targetFor(e.ac.mode, e.phase, e.ac, e.waypoints, e.wpIndex, e.guided, GCS, e.loiter);
      e.ac = stepFlight(e.ac, dt, tgt, e.input, e.ac.mode, e.phase);
      const nxt = nextPhase(e.phase, e.ac.mode, e.ac, e.waypoints, e.wpIndex, GCS);
      e.phase = nxt.phase;
      e.wpIndex = nxt.wpIndex;
      if (e.phase === "ready") {
        e.ac = { ...e.ac, armed: false, spd: 0, alt: 1.2 };
      }
      e.trail = [...e.trail, { ...e.ac.pos }].slice(-TRAIL_MAX);
      snapRef.current = toSnap(e, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const hudTimer = window.setInterval(() => {
      const s = snapRef.current;
      setHud({
        phase: s.phase,
        mode: s.ac.mode,
        alt: s.ac.alt,
        spd: s.ac.spd,
        battery: s.ac.battery,
        voltage: s.ac.voltage,
        armed: s.ac.armed,
        wpIndex: s.wpIndex,
        ready: s.ready,
        antennaAz: s.antennaAz,
        hdg: s.ac.hdg,
        link: s.link,
      });
    }, 160);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(hudTimer);
    };
  }, []);

  return {
    snapRef,
    hud,
    setMode,
    setInput,
    arm,
    launch,
    land,
    guidedAt,
    reset,
  };
}
