import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { QUESTIONS, TOPICS } from "@/lib/content/questions";
import { loadProgress, saveProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tests")({ component: TestsPage });

const PASS = 80;

type TopicFilter = "all" | (typeof TOPICS)[number];

function TestsPage() {
  const [topic, setTopic] = useState<TopicFilter>("all");
  const pool = useMemo(
    () => (topic === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.topic === topic)),
    [topic],
  );
  const [mode, setMode] = useState<"idle" | "quiz" | "done">("idle");
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [pct, setPct] = useState(0);
  const [best, setBest] = useState(() => {
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

  const choose = (idx: number) => {
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
      const finalPct = Math.round((scoreRef.current / pool.length) * 100);
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

  const changeTopic = (t: TopicFilter) => {
    setTopic(t);
    resetQuiz();
    setMode("idle");
  };

  const passed = pct >= PASS;

  return (
    <AppShell>
      <main className="px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Контроль знань</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Тести оператора</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {QUESTIONS.length} питань за НЛЕ БпАК Sh-2. Залік — {PASS} %.
            {best > 0 ? ` Найкращий результат: ${best} %.` : ""}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => changeTopic("all")}
              className={cn(
                "h-11 rounded-[var(--radius-sm)] px-3 text-xs font-medium",
                topic === "all" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted",
              )}
            >
              Усі теми · {QUESTIONS.length}
            </button>
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => changeTopic(t)}
                className={cn(
                  "h-11 rounded-[var(--radius-sm)] px-3 text-xs font-medium",
                  topic === t ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {mode === "idle" && (
            <section className="mt-8 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
              <p className="text-sm text-muted">
                Обрано {pool.length} питань
                {topic === "all" ? " з усіх тем" : ` · ${topic}`}.
              </p>
              <div className="mt-6">
                <Button size="lg" onClick={start}>
                  Почати тест
                </Button>
              </div>
            </section>
          )}

          {mode === "quiz" && q && (
            <section className="mt-8">
              <div className="flex items-center justify-between gap-3 text-xs text-muted">
                <span className="font-mono tabular-nums">
                  {i + 1} / {pool.length}
                </span>
                <span className="font-mono tabular-nums">вірно {score}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full bg-primary transition-[width] duration-[var(--motion-fast)]"
                  style={{ width: `${((i + (revealed ? 1 : 0)) / pool.length) * 100}%` }}
                />
              </div>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-subtle">{q.topic}</p>
              <h2 className="mt-2 text-xl font-semibold leading-snug">{q.q}</h2>
              <ul className="mt-5 space-y-2">
                {q.options.map((opt, idx) => {
                  const isPick = picked === idx;
                  const isAnswer = idx === q.answer;
                  const show = revealed;
                  return (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => choose(idx)}
                        disabled={revealed}
                        className={cn(
                          "flex min-h-11 w-full items-start gap-3 rounded-[var(--radius-md)] border px-3 py-3 text-left text-sm leading-snug",
                          !show && "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
                          show && isAnswer && "border-ok bg-ok/15 text-fg",
                          show && isPick && !isAnswer && "border-danger bg-danger/15 text-fg",
                          show && !isPick && !isAnswer && "border-border bg-surface text-muted",
                        )}
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[10px]">
                          {show && isAnswer ? (
                            <Check className="size-3 text-ok" />
                          ) : show && isPick ? (
                            <X className="size-3 text-danger" />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </span>
                        <span>{opt}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {revealed && (
                <div className="mt-5">
                  <Button onClick={next}>{i + 1 >= pool.length ? "Завершити" : "Далі"}</Button>
                </div>
              )}
            </section>
          )}

          {mode === "done" && (
            <section className="mt-8 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">Результат</p>
              <p
                className={cn(
                  "mt-2 text-5xl font-semibold tabular-nums tracking-tight",
                  passed ? "text-ok" : "text-danger",
                )}
              >
                {pct}%
              </p>
              <p className="mt-2 text-sm text-muted">
                {scoreRef.current} з {pool.length} правильних. {passed ? "Залік складено." : "Залік не складено."}{" "}
                Поріг — {PASS} %.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button onClick={start}>
                  <RotateCcw />
                  Ще раз
                </Button>
                <Button variant="secondary" onClick={() => changeTopic("all")}>
                  Інша тема
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>
    </AppShell>
  );
}
