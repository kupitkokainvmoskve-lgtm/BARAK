export type FlightMode = "AUTO" | "CRUISE" | "LOITER" | "RTL" | "FBWA" | "GUIDED";

export type Phase = "ready" | "armed" | "takeoff" | "cruise" | "loiter" | "rtl" | "land";

export type Vec2 = { x: number; y: number };

export type Waypoint = {
  id: number;
  pos: Vec2;
  alt: number;
  label: string;
};

export type Aircraft = {
  pos: Vec2;
  alt: number;
  hdg: number;
  spd: number;
  mode: FlightMode;
  armed: boolean;
  voltage: number;
  battery: number;
};

export const MODE_LABEL: Record<FlightMode, string> = {
  AUTO: "AUTO",
  CRUISE: "CRUISE",
  LOITER: "LOITER",
  RTL: "RTL",
  FBWA: "FBWA",
  GUIDED: "GUIDED",
};

export const CRUISE_MS = 20;
export const STALL_MS = 14;
export const MAX_MS = 38;
export const WORK_ALT = 900;
export const TACTICAL_M = 60_000;
