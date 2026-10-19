import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Check, r as RotateCcw, t as X } from "../_libs/lucide-react.mjs";
import { i as cn, n as Button, t as AppShell } from "./button-CMlUDaSB.mjs";
import { n as TOPICS, t as QUESTIONS } from "./questions-Co9ZX7l9.mjs";
import { n as saveProgress, t as loadProgress } from "./progress-CiaQIGmI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tests-BhCLI177.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PASS = 80;
function TestsPage() {
	const [topic, setTopic] = (0, import_react.useState)("all");
	const pool = (0, import_react.useMemo)(() => topic === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.topic === topic), [topic]);
	const [mode, setMode] = (0, import_react.useState)("idle");
	const [i, setI] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [score, setScore] = (0, import_react.useState)(0);
	const scoreRef = (0, import_react.useRef)(0);
	const [pct, setPct] = (0, import_react.useState)(0);
	const [best, setBest] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return 0;
		return loadProgress().bestScore;
	});
	const q = pool[i];
	const resetQuiz = () => {
		scoreRef.current = 0;
		setScore(0);
		setI(0);
		setPicked(null);
		setRevealed(false);
		setPct(0);
	};
	const start = () => {
		resetQuiz();
		setMode("quiz");
	};
	const choose = (idx) => {
		if (revealed || !q) return;
		setPicked(idx);
		setRevealed(true);
		if (idx === q.answer) {
			scoreRef.current += 1;
			setScore(scoreRef.current);
		}
	};
	const next = () => {
		if (i + 1 >= pool.length) {
			const finalPct = Math.round(scoreRef.current / pool.length * 100);
			setPct(finalPct);
			const p = loadProgress();
			p.attempts += 1;
			p.lastScore = finalPct;
			p.bestScore = Math.max(p.bestScore, finalPct);
			saveProgress(p);
			setBest(p.bestScore);
			setMode("done");
			return;
		}
		setI((n) => n + 1);
		setPicked(null);
		setRevealed(false);
	};
	const changeTopic = (t) => {
		setTopic(t);
		resetQuiz();
		setMode("idle");
	};
	const passed = pct >= PASS;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "px-4 py-6 sm:py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.18em] text-primary",
					children: "Контроль знань"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-semibold tracking-tight",
					children: "Тести оператора"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: [
						QUESTIONS.length,
						" питань за НЛЕ БпАК Sh-2. Залік — ",
						PASS,
						" %.",
						best > 0 ? ` Найкращий результат: ${best} %.` : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => changeTopic("all"),
						className: cn("h-11 rounded-[var(--radius-sm)] px-3 text-xs font-medium", topic === "all" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted"),
						children: ["Усі теми · ", QUESTIONS.length]
					}), TOPICS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => changeTopic(t),
						className: cn("h-11 rounded-[var(--radius-sm)] px-3 text-xs font-medium", topic === t ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted"),
						children: t
					}, t))]
				}),
				mode === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 rounded-[var(--radius-lg)] border border-border bg-surface p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Обрано ",
							pool.length,
							" питань",
							topic === "all" ? " з усіх тем" : ` · ${topic}`,
							"."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							onClick: start,
							children: "Почати тест"
						})
					})]
				}),
				mode === "quiz" && q && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono tabular-nums",
								children: [
									i + 1,
									" / ",
									pool.length
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono tabular-nums",
								children: ["вірно ", score]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-1 overflow-hidden rounded-full bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary transition-[width] duration-[var(--motion-fast)]",
								style: { width: `${(i + (revealed ? 1 : 0)) / pool.length * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-mono text-xs uppercase tracking-wider text-subtle",
							children: q.topic
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-xl font-semibold leading-snug",
							children: q.q
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-5 space-y-2",
							children: q.options.map((opt, idx) => {
								const isPick = picked === idx;
								const isAnswer = idx === q.answer;
								const show = revealed;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => choose(idx),
									disabled: revealed,
									className: cn("flex min-h-11 w-full items-start gap-3 rounded-[var(--radius-md)] border px-3 py-3 text-left text-sm leading-snug", !show && "border-border bg-surface hover:border-border-strong hover:bg-surface-2", show && isAnswer && "border-ok bg-ok/15 text-fg", show && isPick && !isAnswer && "border-danger bg-danger/15 text-fg", show && !isPick && !isAnswer && "border-border bg-surface text-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[10px]",
										children: show && isAnswer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-ok" }) : show && isPick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3 text-danger" }) : String.fromCharCode(65 + idx)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt })]
								}) }, opt);
							})
						}),
						revealed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: next,
								children: i + 1 >= pool.length ? "Завершити" : "Далі"
							})
						})
					]
				}),
				mode === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 rounded-[var(--radius-lg)] border border-border bg-surface p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-muted",
							children: "Результат"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("mt-2 text-5xl font-semibold tabular-nums tracking-tight", passed ? "text-ok" : "text-danger"),
							children: [pct, "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [
								scoreRef.current,
								" з ",
								pool.length,
								" правильних. ",
								passed ? "Залік складено." : "Залік не складено.",
								" ",
								"Поріг — ",
								PASS,
								" %."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: start,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Ще раз"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => changeTopic("all"),
								children: "Інша тема"
							})]
						})
					]
				})
			]
		})
	}) });
}
//#endregion
export { TestsPage as component };
