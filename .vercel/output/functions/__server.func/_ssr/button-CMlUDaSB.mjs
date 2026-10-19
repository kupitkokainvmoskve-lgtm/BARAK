import { S as require_jsx_runtime, b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as GraduationCap, i as Radio, s as LayoutGrid, u as BookOpen } from "../_libs/lucide-react.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CMlUDaSB.js
var import_jsx_runtime = require_jsx_runtime();
function PlaneMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 64 64",
		className,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M32 6c-1.2 0-2 1.4-2 3v14L8 36v4l22-8v14l-8 6v4l10-3 10 3v-4l-8-6V32l22 8v-4L34 23V9c0-1.6-.8-3-2-3z"
		})
	});
}
function cn(...parts) {
	return twMerge(parts.filter(Boolean).join(" "));
}
var NAV = [
	{
		to: "/",
		label: "Огляд",
		icon: LayoutGrid
	},
	{
		to: "/simulator",
		label: "Симулятор",
		icon: Radio
	},
	{
		to: "/tests",
		label: "Тести",
		icon: GraduationCap
	},
	{
		to: "/theory",
		label: "Курс",
		icon: BookOpen
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-w-0 items-center gap-2.5 text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaneMark, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-semibold tracking-tight",
							children: "Sh-2"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted",
							children: "Тренажер"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex items-center gap-1",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-10 items-center gap-2 rounded-[var(--radius-sm)] px-2.5 text-sm transition-colors duration-[var(--motion-quick)] sm:px-3", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: item.label
							})]
						}, item.to);
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1400px]",
			children
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary-hover",
			secondary: "bg-surface-2 text-fg border border-border hover:bg-surface-3",
			ghost: "text-muted hover:text-fg hover:bg-surface-2",
			outline: "border border-border-strong bg-transparent text-fg hover:bg-surface-2",
			danger: "bg-danger text-fg hover:opacity-90"
		},
		size: {
			default: "h-11 rounded-[var(--radius-sm)] px-4 text-sm",
			sm: "h-9 rounded-[var(--radius-xs)] px-3 text-xs",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-sm",
			icon: "size-11 rounded-[var(--radius-sm)]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { cn as i, Button as n, PlaneMark as r, AppShell as t };
