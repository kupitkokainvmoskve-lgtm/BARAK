import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Check } from "../_libs/lucide-react.mjs";
import { i as cn, n as Button, t as AppShell } from "./button-CMlUDaSB.mjs";
import { t as LESSONS } from "./lessons-DtkWHrm4.mjs";
import { n as saveProgress, t as loadProgress } from "./progress-CiaQIGmI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theory-DOGzhiun.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TheoryPage() {
	const [id, setId] = (0, import_react.useState)(LESSONS[0].id);
	const [done, setDone] = (0, import_react.useState)({});
	const lesson = LESSONS.find((l) => l.id === id) ?? LESSONS[0];
	(0, import_react.useEffect)(() => {
		setDone(loadProgress().lessons);
	}, []);
	const mark = () => {
		const p = loadProgress();
		p.lessons[lesson.id] = true;
		saveProgress(p);
		setDone({ ...p.lessons });
		const idx = LESSONS.findIndex((l) => l.id === lesson.id);
		if (idx < LESSONS.length - 1) setId(LESSONS[idx + 1].id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "h-fit rounded-[var(--radius-lg)] border border-border bg-surface p-2 lg:sticky lg:top-20",
			children: LESSONS.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setId(l.id),
				className: cn("flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm", l.id === id ? "bg-surface-3 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[11px] text-subtle",
						children: String(i + 1).padStart(2, "0")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: l.title
					}),
					done[l.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-ok" }) : null
				]
			}, l.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "min-w-0 pb-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[11px] uppercase tracking-wider text-muted",
					children: [lesson.minutes, " хв"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl font-semibold tracking-tight",
					children: lesson.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-8",
					children: lesson.sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: s.heading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-3 text-[15px] leading-relaxed text-muted",
						children: s.body.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p))
					})] }, s.heading))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: mark,
						children: done[lesson.id] ? "Модуль пройдено · далі" : "Позначити пройденим"
					})
				})
			]
		})]
	}) });
}
//#endregion
export { TheoryPage as component };
