import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as GraduationCap, d as ArrowRight, i as Radio, u as BookOpen } from "../_libs/lucide-react.mjs";
import { n as Button, r as PlaneMark, t as AppShell } from "./button-CMlUDaSB.mjs";
import { a as useSim, i as SimMap } from "./use-sim-nnj46OSD.mjs";
import { t as LESSONS } from "./lessons-DtkWHrm4.mjs";
import { t as QUESTIONS } from "./questions-Co9ZX7l9.mjs";
import { t as loadProgress } from "./progress-CiaQIGmI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CshYxQHl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PHASE_UA = {
	ready: "на землі",
	armed: "armed",
	takeoff: "зліт",
	cruise: "маршрут",
	loiter: "кружляння",
	rtl: "RTL",
	land: "посадка"
};
function Home() {
	const sim = useSim({
		auto: true,
		compact: true
	});
	const [progress, setProgress] = (0, import_react.useState)(() => ({
		lessons: 0,
		best: 0
	}));
	(0, import_react.useEffect)(() => {
		const p = loadProgress();
		setProgress({
			lessons: Object.values(p.lessons).filter(Boolean).length,
			best: p.bestScore
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-8 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-[0.22em] text-primary",
						children: "БпАК · Plain Aero"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 text-4xl font-semibold tracking-tight sm:text-5xl",
						children: ["Sh-2", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-muted",
							children: "Тренажер оператора"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-base leading-relaxed text-muted",
						children: "Жива модель місії: карта НСУ, антенний трекер, режими AUTO / FBWA / RTL, телеметрія і гімбал. Далі — курс і тести за настановою з льотної експлуатації."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/simulator",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								children: ["Відкрити симулятор", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tests",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								children: "Скласти тест"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4",
						children: [
							["60 км", "зв’язок і радіус"],
							["до 3 год", "тривалість"],
							["70 км/год", "крейсерська"],
							["10–11 кг", "злітна маса"]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-md)] border border-border bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-mono text-sm font-semibold tabular-nums text-fg",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-xs text-muted",
								children: v
							})]
						}, k))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border px-4 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaneMark, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono uppercase tracking-wider",
									children: "Місія AUTO"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-ok",
								children: "● LIVE"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-[280px] sm:h-[340px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMap, {
								snapRef: sim.snapRef,
								compact: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-px border-t border-border bg-border text-center text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-surface px-2 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted",
										children: "Фаза"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-fg",
										children: PHASE_UA[sim.hud.phase] ?? sim.hud.phase
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-surface px-2 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted",
										children: "Висота"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono tabular-nums text-fg",
										children: [Math.round(sim.hud.alt), " м"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-surface px-2 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted",
										children: "АКБ"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono tabular-nums text-fg",
										children: [Math.round(sim.hud.battery), "%"]
									})]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-12 grid gap-4 md:grid-cols-3",
				children: [
					{
						to: "/simulator",
						icon: Radio,
						title: "Симулятор",
						text: "Карта маршруту, режими, запуск з рук, RTL, Guided по кліку, горизонт і камера ZR30."
					},
					{
						to: "/tests",
						icon: GraduationCap,
						title: "Тести",
						text: `${QUESTIONS.length} питань з ТТХ, режимів, розгортання, збірки, перевірок і посадки. Залік — 80 %.`
					},
					{
						to: "/theory",
						icon: BookOpen,
						title: "Курс",
						text: `${LESSONS.length} модулів за НЛЕ: склад, ТТХ, АТ і НСУ, пульти, готовність, запуск і посадка.`
					}
				].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: card.to,
					className: "group rounded-[calc(var(--radius-md)+12px)] border border-border bg-surface p-5 transition-colors duration-[var(--motion-fast)] hover:border-border-strong hover:bg-surface-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.icon, { className: "size-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-lg font-semibold",
							children: card.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: card.text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-4 inline-flex items-center gap-1 text-sm text-primary",
							children: ["Перейти", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 transition-transform group-hover:translate-x-0.5" })]
						})
					]
				}, card.to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-10 font-mono text-xs text-subtle",
				children: [
					"Курс ",
					progress.lessons,
					"/",
					LESSONS.length,
					progress.best > 0 ? ` · найкращий тест ${progress.best}%` : ""
				]
			})
		]
	}) });
}
//#endregion
export { Home as component };
