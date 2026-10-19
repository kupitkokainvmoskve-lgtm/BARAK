import type { Aircraft, FlightMode, Phase, Vec2, Waypoint } from "./types";

export type SimSnapshot = {
  ac: Aircraft;
  gcs: Vec2;
  waypoints: Waypoint[];
  wpIndex: number;
  trail: Vec2[];
  phase: Phase;
  now: number;
  link: { video: boolean; telem: boolean; ctrl: boolean };
  antennaAz: number;
  guided: Vec2 | null;
  ready: boolean;
};

export const GCS: Vec2 = { x: 0, y: 0 };

export function defaultWaypoints(): Waypoint[] {
  return [
    { id: 1, pos: { x: 620, y: 40 }, alt: 250, label: "TO" },
    { id: 2, pos: { x: 2280, y: 380 }, alt: 900, label: "WP1" },
    { id: 3, pos: { x: 3640, y: 1860 }, alt: 950, label: "WP2" },
    { id: 4, pos: { x: 1760, y: 2480 }, alt: 900, label: "WP3" },
    { id: 5, pos: { x: 720, y: 980 }, alt: 320, label: "RTB" },
  ];
}

export function emptyAircraft(mode: FlightMode = "AUTO"): Aircraft {
  return {
    pos: { x: 28, y: 8 },
    alt: 1.2,
    hdg: 0.05,
    spd: 0,
    mode,
    armed: false,
    voltage: 25.4,
    battery: 98,
  };
}
