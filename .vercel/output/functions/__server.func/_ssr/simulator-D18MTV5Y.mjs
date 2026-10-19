import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Play, o as Pause, r as RotateCcw } from "../_libs/lucide-react.mjs";
import { i as cn, n as Button, t as AppShell } from "./button-CMlUDaSB.mjs";
import { a as useSim, i as SimMap, n as Horizon, r as MODE_LABEL, t as GimbalView } from "./use-sim-nnj46OSD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/simulator-D18MTV5Y.js
var import_jsx_runtime = require_jsx_runtime();
var MODES = [
	"AUTO",
	"FBWA",
	"CRUISE",
	"LOITER",
	"GUIDED",
	"RTL"
];
var PHASE_UA = {
	ready: "На землі",
	armed: "Armed",
	takeoff: "Зліт",
	cruise: "Маршрут",
	loiter: "Кружляння",
	rtl: "Повернення",
	land: "Посадка"
};
function SimulatorPage() {
	const sim = useSim({
		auto: false,
		compact: false
	});
	const roll = sim.hud.mode === "LOITER" ? .18 : Math.sin(sim.hud.hdg) * .08;
	const pitch = Math.max(-.3, Math.min(.3, (20 - sim.hud.spd) * -.015 + (sim.hud.phase === "takeoff" ? .2 : 0)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-[calc(100dvh-56px)] flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mr-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-base font-semibold",
					children: "Симулятор НСУ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						PHASE_UA[sim.hud.phase],
						" · ",
						sim.hud.mode,
						sim.hud.voltage >= 24.8 ? " · Ready To Fly" : " · низька напруга"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1",
				children: MODES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => sim.setMode(id),
					className: cn("h-11 rounded-[var(--radius-sm)] px-3 text-xs font-medium", sim.hud.mode === id ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted"),
					children: MODE_LABEL[id]
				}, id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid flex-1 lg:grid-cols-[1fr_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-[360px] border-b border-border lg:border-b-0 lg:border-r",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMap, {
					snapRef: sim.snapRef,
					onPoint: sim.guidedAt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: sim.hud.armed ? "secondary" : "default",
							onClick: sim.arm,
							children: sim.hud.armed ? "Armed" : "Arm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: sim.launch,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), "Запуск AUTO"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: sim.land,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}), "FBWA посадка"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: sim.reset,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Скинути"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex max-h-[70vh] flex-col gap-4 overflow-auto bg-surface p-4 lg:max-h-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-xs uppercase tracking-wider text-muted",
						children: "Телеметрія"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid grid-cols-2 gap-2 text-sm",
						children: [
							["Висота", `${Math.round(sim.hud.alt)} м`],
							["Швидкість", `${Math.round(sim.hud.spd * 3.6)} км/год`],
							["Курс", `${Math.round((sim.hud.hdg * 180 / Math.PI + 360) % 360)}°`],
							["АКБ", `${sim.hud.voltage.toFixed(1)} В`],
							["Заряд", `${Math.round(sim.hud.battery)}%`],
							["АТ азимут", `${Math.round(sim.hud.antennaAz)}°`]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-sm)] border border-border bg-bg p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono tabular-nums",
								children: v
							})]
						}, k))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-xs uppercase tracking-wider text-muted",
						children: "Зв’язок"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: sim.hud.link.video ? "text-ok" : "text-danger",
								children: ["Відео ", sim.hud.link.video ? "є" : "немає"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: sim.hud.link.telem ? "text-ok" : "text-danger",
								children: ["Телеметрія ", sim.hud.link.telem ? "є" : "немає"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-muted",
								children: ["Керування ", sim.hud.link.ctrl ? "пульт активний" : "AUTO, пульт можна вимкнути"]
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-xs uppercase tracking-wider text-muted",
						children: "Горизонт"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Horizon, {
							pitch,
							roll
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-xs uppercase tracking-wider text-muted",
						children: "Камера ZR30"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GimbalView, { snapRef: sim.snapRef })
					})] }),
					sim.hud.mode === "FBWA" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-xs uppercase tracking-wider text-muted",
						children: "FBWA"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid grid-cols-2 gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => sim.setInput({ roll: -.7 }),
								children: "Крен ліворуч"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => sim.setInput({ roll: .7 }),
								children: "Крен праворуч"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => sim.setInput({ climb: 1 }),
								children: "Набір"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => sim.setInput({ climb: -1 }),
								children: "Зниження"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "col-span-2",
								onClick: () => sim.setInput({
									roll: 0,
									climb: 0
								}),
								children: "Нейтраль"
							})
						]
					})] }) : null
				]
			})]
		})]
	}) });
}
//#endregion
export { SimulatorPage as component };
