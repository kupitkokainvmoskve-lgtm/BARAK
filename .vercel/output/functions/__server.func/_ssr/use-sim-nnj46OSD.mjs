import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-sim-nnj46OSD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var C = {
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
	guided: "#c4a24a"
};
function drawPlane(ctx, x, y, hdg, s) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(hdg);
	ctx.beginPath();
	ctx.moveTo(s * 1.5, 0);
	ctx.lineTo(-s * .9, s * .55);
	ctx.lineTo(-s * .55, 0);
	ctx.lineTo(-s * .9, -s * .55);
	ctx.closePath();
	ctx.fillStyle = C.ac;
	ctx.fill();
	ctx.strokeStyle = C.motor;
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(-s * .15, -s * 1.15);
	ctx.lineTo(-s * .15, s * 1.15);
	ctx.stroke();
	ctx.restore();
}
function SimMap({ snapRef, compact, onPoint }) {
	const canvasRef = (0, import_react.useRef)(null);
	const pointRef = (0, import_react.useRef)(onPoint);
	pointRef.current = onPoint;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		let live = true;
		const cam = {
			x: 1600,
			y: 900,
			scale: compact ? .22 : .18,
			drag: false,
			lx: 0,
			ly: 0,
			moved: 0
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
		const worldTo = (p) => {
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			return {
				x: w / 2 + (p.x - cam.x) * cam.scale,
				y: h / 2 - (p.y - cam.y) * cam.scale
			};
		};
		const screenTo = (sx, sy) => {
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			return {
				x: cam.x + (sx - w / 2) / cam.scale,
				y: cam.y - (sy - h / 2) / cam.scale
			};
		};
		const onDown = (ev) => {
			cam.drag = true;
			cam.lx = ev.clientX;
			cam.ly = ev.clientY;
			cam.moved = 0;
			canvas.setPointerCapture(ev.pointerId);
		};
		const onMove = (ev) => {
			if (!cam.drag) return;
			const dx = ev.clientX - cam.lx;
			const dy = ev.clientY - cam.ly;
			cam.moved += Math.hypot(dx, dy);
			cam.x -= dx / cam.scale;
			cam.y += dy / cam.scale;
			cam.lx = ev.clientX;
			cam.ly = ev.clientY;
		};
		const onUp = (ev) => {
			cam.drag = false;
			if (cam.moved < 8 && pointRef.current) {
				const r = canvas.getBoundingClientRect();
				pointRef.current(screenTo(ev.clientX - r.left, ev.clientY - r.top));
			}
		};
		const onWheel = (ev) => {
			ev.preventDefault();
			const factor = ev.deltaY > 0 ? .9 : 1.1;
			cam.scale = Math.min(.55, Math.max(.035, cam.scale * factor));
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
				cam.x += (s.ac.pos.x - cam.x) * .08;
				cam.y += (s.ac.pos.y - cam.y) * .08;
			}
			ctx.fillStyle = C.bg;
			ctx.fillRect(0, 0, w, h);
			const origin = worldTo({
				x: cam.x - w / cam.scale,
				y: cam.y
			});
			const step = 400 * cam.scale;
			const grid = Math.max(28, step);
			ctx.fillStyle = C.field;
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = C.grid;
			ctx.lineWidth = 1;
			for (let x = origin.x % grid - grid; x < w + grid; x += grid) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, h);
				ctx.stroke();
			}
			for (let y = origin.y % grid - grid; y < h + grid; y += grid) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(w, y);
				ctx.stroke();
			}
			const g = worldTo(s.gcs);
			ctx.strokeStyle = C.ring;
			ctx.lineWidth = 1;
			for (const r of [
				1e3,
				2e3,
				4e3
			]) {
				ctx.beginPath();
				ctx.arc(g.x, g.y, r * cam.scale, 0, Math.PI * 2);
				ctx.stroke();
			}
			const az = s.antennaAz * Math.PI / 180;
			ctx.fillStyle = C.beam;
			ctx.beginPath();
			ctx.moveTo(g.x, g.y);
			ctx.arc(g.x, g.y, 2800 * cam.scale, -az - .18, -az + .18, false);
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
				ctx.fillText(`${s.ac.mode}  ${Math.round(s.ac.alt)} м  ${Math.round(s.ac.spd * 3.6)} км/год`, 12, 22);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "size-full touch-none"
	});
}
function Horizon({ pitch, roll }) {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "h-28 w-full"
	});
}
function GimbalView({ snapRef }) {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		let live = true;
		const loop = (t) => {
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
			const zoom = 1 + s.ac.alt / 1200 * .4;
			ctx.save();
			ctx.translate(w / 2, h / 2);
			ctx.rotate(-s.ac.hdg * .15);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "h-36 w-full"
	});
}
var MODE_LABEL = {
	AUTO: "AUTO",
	CRUISE: "CRUISE",
	LOITER: "LOITER",
	RTL: "RTL",
	FBWA: "FBWA",
	GUIDED: "GUIDED"
};
function dist(a, b) {
	return Math.hypot(a.x - b.x, a.y - b.y);
}
function wrapPi(a) {
	let x = a;
	while (x > Math.PI) x -= Math.PI * 2;
	while (x < -Math.PI) x += Math.PI * 2;
	return x;
}
function headingTo(from, to) {
	return Math.atan2(to.y - from.y, to.x - from.x);
}
function azimuthDeg(from, to) {
	let deg = headingTo(from, to) * 180 / Math.PI;
	if (deg < 0) deg += 360;
	return deg;
}
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function targetFor(mode, phase, ac, waypoints, wpIndex, guided, gcs, loiter) {
	if (mode === "RTL" || phase === "rtl") return {
		pos: gcs,
		alt: phase === "land" ? 2 : 300,
		circle: dist(ac.pos, gcs) < 180
	};
	if (mode === "LOITER" || phase === "loiter") return {
		pos: loiter,
		alt: ac.alt,
		circle: true
	};
	if (mode === "GUIDED" && guided) return {
		pos: guided,
		alt: Math.max(ac.alt, 250),
		circle: dist(ac.pos, guided) < 160
	};
	if (mode === "FBWA") {
		const ahead = 900;
		return {
			pos: {
				x: ac.pos.x + Math.cos(ac.hdg) * ahead,
				y: ac.pos.y + Math.sin(ac.hdg) * ahead
			},
			alt: ac.alt,
			circle: false
		};
	}
	const wp = waypoints[Math.min(wpIndex, waypoints.length - 1)] ?? waypoints[0];
	return {
		pos: wp.pos,
		alt: wp.alt,
		circle: false
	};
}
function stepFlight(ac, dt, target, input, mode, phase) {
	const t = dt * 16;
	if (!ac.armed || phase === "ready") return {
		...ac,
		spd: 0,
		alt: 1.2
	};
	let hdg = ac.hdg;
	let alt = ac.alt;
	let spd = ac.spd;
	const pos = { ...ac.pos };
	if (phase === "armed") {
		spd = 0;
		return {
			...ac,
			pos,
			alt: 1.2,
			hdg,
			spd
		};
	}
	const desiredSpd = phase === "land" ? 16 : phase === "takeoff" ? 18 : mode === "FBWA" ? clamp(20 + input.throttle * 18, 14, 38) : 20;
	spd += (desiredSpd - spd) * Math.min(1, t * .7);
	if (target.circle) {
		const toC = headingTo(pos, target.pos);
		const tangent = toC + Math.PI / 2;
		const radial = dist(pos, target.pos);
		const want = radial > 280 ? toC : radial < 160 ? toC + Math.PI : tangent;
		hdg += wrapPi(want - hdg) * Math.min(1, t * 1.4);
	} else if (mode === "FBWA") hdg += input.roll * .55 * t;
	else {
		const want = headingTo(pos, target.pos);
		hdg += wrapPi(want - hdg) * Math.min(1, t * 1.6);
	}
	const climbCmd = mode === "FBWA" ? input.climb * 8 : clamp((target.alt - alt) / 12, -6, 8);
	alt = clamp(alt + climbCmd * t, 1.2, 3e3);
	pos.x += Math.cos(hdg) * spd * t;
	pos.y += Math.sin(hdg) * spd * t;
	const drain = spd / 20 * .004 * t;
	const battery = clamp(ac.battery - drain, 8, 100);
	const voltage = 22.2 + battery / 100 * 3.4;
	return {
		...ac,
		pos,
		alt,
		hdg,
		spd,
		battery,
		voltage,
		mode,
		armed: true
	};
}
function nextPhase(phase, mode, ac, waypoints, wpIndex, gcs) {
	if (phase === "ready" || phase === "armed") return {
		phase,
		wpIndex
	};
	if (phase === "takeoff") {
		if (ac.alt > 80 && ac.spd > 12) return {
			phase: "cruise",
			wpIndex: Math.max(wpIndex, 1)
		};
		return {
			phase,
			wpIndex
		};
	}
	if (phase === "land") {
		if (ac.alt <= 2.4 && dist(ac.pos, gcs) < 90) return {
			phase: "ready",
			wpIndex: 0
		};
		return {
			phase,
			wpIndex
		};
	}
	if (mode === "RTL") {
		if (dist(ac.pos, gcs) < 160 && ac.alt < 80) return {
			phase: "land",
			wpIndex
		};
		return {
			phase: "rtl",
			wpIndex
		};
	}
	if (mode === "LOITER" || mode === "GUIDED") return {
		phase: "loiter",
		wpIndex
	};
	if (mode === "FBWA") return {
		phase: "cruise",
		wpIndex
	};
	const wp = waypoints[wpIndex];
	if (wp && dist(ac.pos, wp.pos) < 140) {
		if (wpIndex >= waypoints.length - 1) return {
			phase: "loiter",
			wpIndex
		};
		return {
			phase: "cruise",
			wpIndex: wpIndex + 1
		};
	}
	return {
		phase: "cruise",
		wpIndex
	};
}
var GCS = {
	x: 0,
	y: 0
};
function defaultWaypoints() {
	return [
		{
			id: 1,
			pos: {
				x: 620,
				y: 40
			},
			alt: 250,
			label: "TO"
		},
		{
			id: 2,
			pos: {
				x: 2280,
				y: 380
			},
			alt: 900,
			label: "WP1"
		},
		{
			id: 3,
			pos: {
				x: 3640,
				y: 1860
			},
			alt: 950,
			label: "WP2"
		},
		{
			id: 4,
			pos: {
				x: 1760,
				y: 2480
			},
			alt: 900,
			label: "WP3"
		},
		{
			id: 5,
			pos: {
				x: 720,
				y: 980
			},
			alt: 320,
			label: "RTB"
		}
	];
}
function emptyAircraft(mode = "AUTO") {
	return {
		pos: {
			x: 28,
			y: 8
		},
		alt: 1.2,
		hdg: .05,
		spd: 0,
		mode,
		armed: false,
		voltage: 25.4,
		battery: 98
	};
}
function boot(auto) {
	const waypoints = defaultWaypoints();
	if (!auto) return {
		ac: emptyAircraft("AUTO"),
		waypoints,
		wpIndex: 0,
		trail: [],
		phase: "ready",
		guided: null,
		loiter: { ...GCS },
		last: 0,
		input: {
			roll: 0,
			climb: 0,
			throttle: .35
		}
	};
	const wp = waypoints[2];
	return {
		ac: {
			...emptyAircraft("AUTO"),
			pos: { ...wp.pos },
			alt: wp.alt,
			hdg: .7,
			spd: 20,
			armed: true,
			battery: 86,
			voltage: 25.1
		},
		waypoints,
		wpIndex: 2,
		trail: [],
		phase: "cruise",
		guided: null,
		loiter: { ...wp.pos },
		last: 0,
		input: {
			roll: 0,
			climb: 0,
			throttle: .35
		}
	};
}
function toSnap(e, now) {
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
			ctrl: e.ac.mode !== "AUTO" || e.phase === "ready" || e.phase === "armed" || e.phase === "land"
		},
		antennaAz: azimuthDeg(GCS, e.ac.pos),
		guided: e.guided,
		ready: e.ac.voltage >= 24.8 && e.phase !== "land"
	};
}
function useSim(opts) {
	const auto = opts?.auto !== false;
	const compact = Boolean(opts?.compact);
	const engine = (0, import_react.useRef)(boot(auto || compact));
	const snapRef = (0, import_react.useRef)(toSnap(engine.current, 0));
	const [hud, setHud] = (0, import_react.useState)(() => {
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
			link: s.link
		};
	});
	const setMode = (0, import_react.useCallback)((mode) => {
		const e = engine.current;
		e.ac = {
			...e.ac,
			mode
		};
		if (mode === "LOITER") e.loiter = { ...e.ac.pos };
		if (mode === "RTL") e.phase = e.ac.armed && e.phase !== "ready" ? "rtl" : e.phase;
	}, []);
	const setInput = (0, import_react.useCallback)((patch) => {
		engine.current.input = {
			...engine.current.input,
			...patch
		};
	}, []);
	const arm = (0, import_react.useCallback)(() => {
		const e = engine.current;
		if (e.ac.voltage < 24.8) return;
		e.ac = {
			...e.ac,
			armed: true,
			mode: e.ac.mode === "FBWA" ? "FBWA" : "AUTO"
		};
		e.phase = "armed";
	}, []);
	const launch = (0, import_react.useCallback)(() => {
		const e = engine.current;
		if (!e.ac.armed) {
			if (e.ac.voltage < 24.8) return;
			e.ac = {
				...e.ac,
				armed: true
			};
		}
		e.ac = {
			...e.ac,
			mode: "AUTO",
			spd: 16
		};
		e.phase = "takeoff";
		e.wpIndex = 0;
	}, []);
	const land = (0, import_react.useCallback)(() => {
		const e = engine.current;
		e.ac = {
			...e.ac,
			mode: "FBWA"
		};
		e.phase = "land";
	}, []);
	const guidedAt = (0, import_react.useCallback)((p) => {
		const e = engine.current;
		e.guided = p;
		e.ac = {
			...e.ac,
			mode: "GUIDED",
			armed: true
		};
		if (e.phase === "ready") e.phase = "armed";
		if (e.phase === "armed") return;
		e.phase = "loiter";
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		engine.current = boot(false);
		snapRef.current = toSnap(engine.current, performance.now());
	}, []);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		const loop = (t) => {
			const e = engine.current;
			const dt = e.last ? Math.min(.05, (t - e.last) / 1e3) : .016;
			e.last = t;
			const tgt = targetFor(e.ac.mode, e.phase, e.ac, e.waypoints, e.wpIndex, e.guided, GCS, e.loiter);
			e.ac = stepFlight(e.ac, dt, tgt, e.input, e.ac.mode, e.phase);
			const nxt = nextPhase(e.phase, e.ac.mode, e.ac, e.waypoints, e.wpIndex, GCS);
			e.phase = nxt.phase;
			e.wpIndex = nxt.wpIndex;
			if (e.phase === "ready") e.ac = {
				...e.ac,
				armed: false,
				spd: 0,
				alt: 1.2
			};
			e.trail = [...e.trail, { ...e.ac.pos }].slice(-420);
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
				link: s.link
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
		reset
	};
}
//#endregion
export { useSim as a, SimMap as i, Horizon as n, MODE_LABEL as r, GimbalView as t };
