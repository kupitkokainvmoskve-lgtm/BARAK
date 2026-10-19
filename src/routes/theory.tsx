import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { LESSONS } from "@/lib/content/lessons";
import { loadProgress, saveProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/theory")({ component: TheoryPage });

function TheoryPage() {
  const [id, setId] = useState(LESSONS[0].id);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const lesson = LESSONS.find((l) => l.id === id) ?? LESSONS[0];

  useEffect(() => {
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

  return (
    <AppShell>
      <main className="grid gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <nav className="h-fit rounded-[var(--radius-lg)] border border-border bg-surface p-2 lg:sticky lg:top-20">
          {LESSONS.map((l, i) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setId(l.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm",
                l.id === id ? "bg-surface-3 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
              )}
            >
              <span className="font-mono text-[11px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1">{l.title}</span>
              {done[l.id] ? <Check className="size-3.5 text-ok" /> : null}
            </button>
          ))}
        </nav>

        <article className="min-w-0 pb-16">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{lesson.minutes} хв</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{lesson.title}</h1>
          <div className="mt-8 space-y-8">
            {lesson.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-lg font-semibold">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-10">
            <Button onClick={mark}>{done[lesson.id] ? "Модуль пройдено · далі" : "Позначити пройденим"}</Button>
          </div>
        </article>
      </main>
    </AppShell>
  );
}
