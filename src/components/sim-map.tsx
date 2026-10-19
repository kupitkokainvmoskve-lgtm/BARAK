import { useEffect, useRef, type RefObject } from "react";
import type { SimSnapshot } from "@/lib/sim/snapshot";
import type { Vec2 } from "@/lib/sim/types";

const C = {
  bg: "#0c1117",
  field: "#121a16",
  field2: "#0e1612",
  grid: "rgba(232,237,242,0.05)",
  forest: "#18241c",
  path: "rgba(45,125,210,0.55)",
  pathDim: "rgba(45,125,210,0.22)",
  wp: "#8eb8e8",
  wpActive: "#e8edf2",
  gcs: "#3d9a5c",
  beam: "rgba(45,125,210,0.14)",
  beamEdge: "rgba(45,125,210,0.4)",
  trail: "rgba(232,237,242,0.35)",
  ac: "#e8edf2",
  motor: "#2d7dd2",
  text: "#e8edf2",
  muted: "#8b97a5",
  ring: "rgba(232,237,242,0.08)",
  guided: "#c4a24a",
};

function drawPlane(ctx: CanvasRenderingContext2D, x: number, y: number, hdg: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(hdg);
  ctx.beginPath();
  ctx.moveTo(s * 1.5, 0);
  ctx.lineTo(-s * 0.9, s * 0.55);
  ctx.lineTo(-s * 0.55, 0);
  ctx.lineTo(-s * 0.9, -s * 0.55);
  ctx.closePath();
  ctx.fillStyle = C.ac;
  ctx.fill();
  ctx.strokeStyle = C.motor;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-s * 0.15, -s * 1.15);
  ctx.lineTo(-s * 0.15, s * 1.15);
  ctx.stroke();
  ctx.restore();
}

export function SimMap({
  snapRef,
  compact,
  onPoint,
}: {
  snapRef: RefObject<SimSnapshot>;
  compact?: boolean;
  onPoint?: (p: Vec2) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointRef = useRef(onPoint);
  pointRef.current = onPoint;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let live = true;
    const cam = {
      x: 1600,
      y: 900,
      scale: compact ? 0.22 : 0.18,
      drag: false,
      lx: 0,
      ly: 0,
      moved: 0,
    };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const worldTo = (p: Vec2) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      return {
        x: w / 2 + (p.x - cam.x) * cam.scale,
        y: h / 2 - (p.y - cam.y) * cam.scale,
      };
    };
    const screenTo = (sx: number, sy: number): Vec2 => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      return {
        x: cam.x + (sx - w / 2) / cam.scale,
        y: cam.y - (sy - h / 2) / cam.scale,
      };
    };

    const onDown = (ev: PointerEvent) => {
      cam.drag = true;
      cam.lx = ev.clientX;
      cam.ly = ev.clientY;
      cam.moved = 0;
      canvas.setPointerCapture(ev.pointerId);
    };
    const onMove = (ev: PointerEvent) => {
      if (!cam.drag) return;
      const dx = ev.clientX - cam.lx;
      const dy = ev.clientY - cam.ly;
      cam.moved += Math.hypot(dx, dy);
      cam.x -= dx / cam.scale;
      cam.y += dy / cam.scale;
      cam.lx = ev.clientX;
      cam.ly = ev.clientY;
    };
    const onUp = (ev: PointerEvent) => {
      cam.drag = false;
      if (cam.moved < 8 && pointRef.current) {
        const r = canvas.getBoundingClientRect();
        pointRef.current(screenTo(ev.clientX - r.left, ev.clientY - r.top));
      }
    };
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const factor = ev.deltaY > 0 ? 0.9 : 1.1;
      cam.scale = Math.min(0.55, Math.max(0.035, cam.scale * factor));
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const draw = () => {
      if (!live) return;
      const s = snapRef.current;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (compact) {
        cam.x += (s.ac.pos.x - cam.x) * 0.08;
        cam.y += (s.ac.pos.y - cam.y) * 0.08;
      }
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);

      const origin = worldTo({ x: cam.x - w / cam.scale, y: cam.y });
      const step = 400 * cam.scale;
      const grid = Math.max(28, step);
      ctx.fillStyle = C.field;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = C.grid;
      ctx.lineWidth = 1;
      for (let x = (origin.x % grid) - grid; x < w + grid; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = (origin.y % grid) - grid; y < h + grid; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const g = worldTo(s.gcs);
      ctx.strokeStyle = C.ring;
      ctx.lineWidth = 1;
      for (const r of [1000, 2000, 4000]) {
        ctx.beginPath();
        ctx.arc(g.x, g.y, r * cam.scale, 0, Math.PI * 2);
        ctx.stroke();
      }

      const az = (s.antennaAz * Math.PI) / 180;
      ctx.fillStyle = C.beam;
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.arc(g.x, g.y, 2800 * cam.scale, -az - 0.18, -az + 0.18, false);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = C.beamEdge;
      ctx.stroke();

      if (s.waypoints.length > 1) {
        ctx.strokeStyle = C.pathDim;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        s.waypoints.forEach((wp, i) => {
          const p = worldTo(wp.pos);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (s.trail.length > 1) {
        ctx.strokeStyle = C.trail;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        s.trail.forEach((p, i) => {
          const q = worldTo(p);
          if (i === 0) ctx.moveTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
        });
        ctx.stroke();
      }

      s.waypoints.forEach((wp, i) => {
        const p = worldTo(wp.pos);
        ctx.fillStyle = i === s.wpIndex ? C.wpActive : C.wp;
        ctx.beginPath();
        ctx.arc(p.x, p.y, i === s.wpIndex ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = C.muted;
        ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
        ctx.fillText(`${wp.label}  ${wp.alt} м`, p.x + 8, p.y - 6);
      });

      if (s.guided) {
        const p = worldTo(s.guided);
        ctx.strokeStyle = C.guided;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = C.gcs;
      ctx.fillRect(g.x - 4, g.y - 4, 8, 8);
      ctx.strokeStyle = C.muted;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(g.x, g.y - 16);
      ctx.stroke();
      ctx.fillStyle = C.muted;
      ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
      ctx.fillText("НСУ / АТ", g.x + 8, g.y + 14);

      const a = worldTo(s.ac.pos);
      drawPlane(ctx, a.x, a.y, -s.ac.hdg, compact ? 11 : 13);

      if (!compact) {
        ctx.fillStyle = C.text;
        ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
        ctx.fillText(
          `${s.ac.mode}  ${Math.round(s.ac.alt)} м  ${Math.round(s.ac.spd * 3.6)} км/год`,
          12,
          22,
        );
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      live = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [compact, snapRef]);

  return <canvas ref={canvasRef} className="size-full touch-none" />;
}

export function Horizon({ pitch, roll }: { pitch: number; roll: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let live = true;
    const loop = () => {
      if (!live) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(roll);
      const shift = pitch * 18;
      ctx.fillStyle = "#3a5870";
      ctx.fillRect(-w, -h * 2 + shift, w * 2, h * 2);
      ctx.fillStyle = "#5a4632";
      ctx.fillRect(-w, shift, w * 2, h * 2);
      ctx.strokeStyle = "rgba(232,237,242,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-w, shift);
      ctx.lineTo(w, shift);
      ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = "#e8edf2";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 22, h / 2);
      ctx.lineTo(w / 2 - 6, h / 2);
      ctx.moveTo(w / 2 + 6, h / 2);
      ctx.lineTo(w / 2 + 22, h / 2);
      ctx.moveTo(w / 2, h / 2 - 5);
      ctx.lineTo(w / 2, h / 2 + 5);
      ctx.stroke();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      live = false;
      cancelAnimationFrame(raf);
    };
  }, [pitch, roll]);
  return <canvas ref={canvasRef} className="h-28 w-full" />;
}

export function GimbalView({ snapRef }: { snapRef: RefObject<SimSnapshot> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let live = true;
    const loop = (t: number) => {
      if (!live) return;
      const s = snapRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0e1612";
      ctx.fillRect(0, 0, w, h);
      const zoom = 1 + (s.ac.alt / 1200) * 0.4;
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-s.ac.hdg * 0.15);
      ctx.scale(zoom, zoom);
      for (let i = -8; i <= 8; i++) {
        ctx.strokeStyle = i % 4 === 0 ? "rgba(61,154,92,0.28)" : "rgba(61,154,92,0.12)";
        ctx.beginPath();
        ctx.moveTo(-w, i * 18);
        ctx.lineTo(w, i * 18);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i * 22, -h);
        ctx.lineTo(i * 22, h);
        ctx.stroke();
      }
      const ox = Math.sin(t / 1800) * 40;
      const oy = Math.cos(t / 2200) * 18;
      ctx.fillStyle = "#6a5a40";
      ctx.fillRect(-10 + ox, -6 + oy, 22, 12);
      ctx.fillStyle = "#3a4a38";
      ctx.fillRect(30 + ox, 20 + oy, 16, 9);
      ctx.restore();
      ctx.strokeStyle = "rgba(232,237,242,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 16, h / 2);
      ctx.lineTo(w / 2 + 16, h / 2);
      ctx.moveTo(w / 2, h / 2 - 16);
      ctx.lineTo(w / 2, h / 2 + 16);
      ctx.stroke();
      ctx.strokeStyle = "rgba(45,125,210,0.7)";
      ctx.strokeRect(18, 14, w - 36, h - 28);
      ctx.fillStyle = "#8b97a5";
      ctx.font = "10px IBM Plex Mono, ui-monospace, monospace";
      ctx.fillText("ZR30  1080p", 24, 28);
      ctx.fillText(`${Math.round(s.ac.alt)} м`, w - 70, 28);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      live = false;
      cancelAnimationFrame(raf);
    };
  }, [snapRef]);
  return <canvas ref={canvasRef} className="h-36 w-full" />;
}
