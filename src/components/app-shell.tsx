import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, LayoutGrid, Radio, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";
import { PlaneMark } from "@/components/owl-mark";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Огляд", icon: LayoutGrid },
  { to: "/simulator", label: "Симулятор", icon: Radio },
  { to: "/tests", label: "Тести", icon: GraduationCap },
  { to: "/theory", label: "Курс", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 text-fg">
            <span className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-primary-foreground">
              <PlaneMark className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight">Sh-2</span>
              <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Тренажер
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-[var(--radius-sm)] px-2.5 text-sm transition-colors duration-[var(--motion-quick)] sm:px-3",
                    active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-[1400px]">{children}</div>
    </div>
  );
}
