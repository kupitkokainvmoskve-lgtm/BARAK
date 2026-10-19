import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GimbalView, Horizon, SimMap } from "@/components/sim-map";
import { Button } from "@/components/ui/button";
import { useSim } from "@/hooks/use-sim";
import { MODE_LABEL, type FlightMode } from "@/lib/sim/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulator")({ component: SimulatorPage });

const MODES: FlightMode[] = ["AUTO", "FBWA", "CRUISE", "LOITER", "GUIDED", "RTL"];

const PHASE_UA: Record<string, string> = {
  ready: "На землі",
  armed: "Armed",
  takeoff: "Зліт",
  cruise: "Маршрут",
  loiter: "Кружляння",
  rtl: "Повернення",
  land: "Посадка",
};

function SimulatorPage() {
  const sim = useSim({ auto: false, compact: false });
  const roll = sim.hud.mode === "LOITER" ? 0.18 : Math.sin(sim.hud.hdg) * 0.08;
  const pitch = Math.max(-0.3, Math.min(0.3, (20 - sim.hud.spd) * -0.015 + (sim.hud.phase === "takeoff" ? 0.2 : 0)));

  return (
    <AppShell>
      <main className="flex min-h-[calc(100dvh-56px)] flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <div className="mr-auto">
            <h1 className="text-base font-semibold">Симулятор НСУ</h1>
            <p className="text-xs text-muted">
              {PHASE_UA[sim.hud.phase]} · {sim.hud.mode}
              {sim.hud.voltage >= 24.8 ? " · Ready To Fly" : " · низька напруга"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {MODES.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => sim.setMode(id)}
                className={cn(
                  "h-11 rounded-[var(--radius-sm)] px-3 text-xs font-medium",
                  sim.hud.mode === id ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted",
                )}
              >
                {MODE_LABEL[id]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid flex-1 lg:grid-cols-[1fr_320px]">
          <div className="relative min-h-[360px] border-b border-border lg:border-b-0 lg:border-r">
            <SimMap snapRef={sim.snapRef} onPoint={sim.guidedAt} />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
              <Button size="sm" variant={sim.hud.armed ? "secondary" : "default"} onClick={sim.arm}>
                {sim.hud.armed ? "Armed" : "Arm"}
              </Button>
              <Button size="sm" onClick={sim.launch}>
                <Play />
                Запуск AUTO
              </Button>
              <Button size="sm" variant="secondary" onClick={sim.land}>
                <Pause />
                FBWA посадка
              </Button>
              <Button size="sm" variant="ghost" onClick={sim.reset}>
                <RotateCcw />
                Скинути
              </Button>
            </div>
          </div>

          <aside className="flex max-h-[70vh] flex-col gap-4 overflow-auto bg-surface p-4 lg:max-h-none">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Телеметрія</h2>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                {[
                  ["Висота", `${Math.round(sim.hud.alt)} м`],
                  ["Швидкість", `${Math.round(sim.hud.spd * 3.6)} км/год`],
                  ["Курс", `${Math.round((((sim.hud.hdg * 180) / Math.PI) + 360) % 360)}°`],
                  ["АКБ", `${sim.hud.voltage.toFixed(1)} В`],
                  ["Заряд", `${Math.round(sim.hud.battery)}%`],
                  ["АТ азимут", `${Math.round(sim.hud.antennaAz)}°`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-[var(--radius-sm)] border border-border bg-bg p-2">
                    <div className="text-xs text-muted">{k}</div>
                    <div className="font-mono tabular-nums">{v}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Зв’язок</h2>
              <ul className="mt-2 space-y-1 text-sm">
                <li className={sim.hud.link.video ? "text-ok" : "text-danger"}>
                  Відео {sim.hud.link.video ? "є" : "немає"}
                </li>
                <li className={sim.hud.link.telem ? "text-ok" : "text-danger"}>
                  Телеметрія {sim.hud.link.telem ? "є" : "немає"}
                </li>
                <li className="text-muted">
                  Керування {sim.hud.link.ctrl ? "пульт активний" : "AUTO, пульт можна вимкнути"}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Горизонт</h2>
              <div className="mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-border">
                <Horizon pitch={pitch} roll={roll} />
              </div>
            </section>

            <section>
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Камера ZR30</h2>
              <div className="mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-border">
                <GimbalView snapRef={sim.snapRef} />
              </div>
            </section>

            {sim.hud.mode === "FBWA" ? (
              <section>
                <h2 className="font-mono text-xs uppercase tracking-wider text-muted">FBWA</h2>
                <div className="mt-2 grid grid-cols-2 gap-1">
                  <Button size="sm" variant="secondary" onClick={() => sim.setInput({ roll: -0.7 })}>
                    Крен ліворуч
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => sim.setInput({ roll: 0.7 })}>
                    Крен праворуч
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => sim.setInput({ climb: 1 })}>
                    Набір
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => sim.setInput({ climb: -1 })}>
                    Зниження
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="col-span-2"
                    onClick={() => sim.setInput({ roll: 0, climb: 0 })}
                  >
                    Нейтраль
                  </Button>
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
