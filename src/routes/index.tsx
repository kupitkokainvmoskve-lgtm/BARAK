import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GraduationCap, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PlaneMark } from "@/components/owl-mark";
import { SimMap } from "@/components/sim-map";
import { Button } from "@/components/ui/button";
import { LESSONS } from "@/lib/content/lessons";
import { QUESTIONS } from "@/lib/content/questions";
import { loadProgress } from "@/lib/progress";
import { useSim } from "@/hooks/use-sim";

export const Route = createFileRoute("/")({ component: Home });

const PHASE_UA: Record<string, string> = {
  ready: "на землі",
  armed: "armed",
  takeoff: "зліт",
  cruise: "маршрут",
  loiter: "кружляння",
  rtl: "RTL",
  land: "посадка",
};

function Home() {
  const sim = useSim({ auto: true, compact: true });
  const [progress, setProgress] = useState(() => ({ lessons: 0, best: 0 }));

  useEffect(() => {
    const p = loadProgress();
    setProgress({
      lessons: Object.values(p.lessons).filter(Boolean).length,
      best: p.bestScore,
    });
  }, []);

  return (
    <AppShell>
      <main className="px-4 py-8 sm:py-12">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">БпАК · Plain Aero</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Sh-2
              <span className="mt-1 block text-muted">Тренажер оператора</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Жива модель місії: карта НСУ, антенний трекер, режими AUTO / FBWA / RTL, телеметрія і
              гімбал. Далі — курс і тести за настановою з льотної експлуатації.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/simulator">
                <Button size="lg">
                  Відкрити симулятор
                  <ArrowRight />
                </Button>
              </Link>
              <Link to="/tests">
                <Button size="lg" variant="secondary">
                  Скласти тест
                </Button>
              </Link>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["60 км", "зв’язок і радіус"],
                ["до 3 год", "тривалість"],
                ["70 км/год", "крейсерська"],
                ["10–11 кг", "злітна маса"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[var(--radius-md)] border border-border bg-surface p-3">
                  <dt className="font-mono text-sm font-semibold tabular-nums text-fg">{k}</dt>
                  <dd className="mt-1 text-xs text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs text-muted">
                <PlaneMark className="h-4 w-4 text-primary" />
                <span className="font-mono uppercase tracking-wider">Місія AUTO</span>
              </div>
              <span className="font-mono text-xs text-ok">● LIVE</span>
            </div>
            <div className="h-[280px] sm:h-[340px]">
              <SimMap snapRef={sim.snapRef} compact />
            </div>
            <div className="grid grid-cols-3 gap-px border-t border-border bg-border text-center text-xs">
              <div className="bg-surface px-2 py-2">
                <div className="text-muted">Фаза</div>
                <div className="font-mono text-fg">{PHASE_UA[sim.hud.phase] ?? sim.hud.phase}</div>
              </div>
              <div className="bg-surface px-2 py-2">
                <div className="text-muted">Висота</div>
                <div className="font-mono tabular-nums text-fg">{Math.round(sim.hud.alt)} м</div>
              </div>
              <div className="bg-surface px-2 py-2">
                <div className="text-muted">АКБ</div>
                <div className="font-mono tabular-nums text-fg">{Math.round(sim.hud.battery)}%</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              to: "/simulator" as const,
              icon: Radio,
              title: "Симулятор",
              text: "Карта маршруту, режими, запуск з рук, RTL, Guided по кліку, горизонт і камера ZR30.",
            },
            {
              to: "/tests" as const,
              icon: GraduationCap,
              title: "Тести",
              text: `${QUESTIONS.length} питань з ТТХ, режимів, розгортання, збірки, перевірок і посадки. Залік — 80 %.`,
            },
            {
              to: "/theory" as const,
              icon: BookOpen,
              title: "Курс",
              text: `${LESSONS.length} модулів за НЛЕ: склад, ТТХ, АТ і НСУ, пульти, готовність, запуск і посадка.`,
            },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group rounded-[calc(var(--radius-md)+12px)] border border-border bg-surface p-5 transition-colors duration-[var(--motion-fast)] hover:border-border-strong hover:bg-surface-2"
            >
              <card.icon className="size-5 text-primary" />
              <h2 className="mt-4 text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                Перейти
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </section>

        <p className="mt-10 font-mono text-xs text-subtle">
          Курс {progress.lessons}/{LESSONS.length}
          {progress.best > 0 ? ` · найкращий тест ${progress.best}%` : ""}
        </p>
      </main>
    </AppShell>
  );
}
