"use client";

import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { HatchList } from "@/components/HatchList/HatchList";
import { RangeField } from "@/components/RangeField/RangeField";
import { RiverScene } from "@/components/RiverScene/RiverScene";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { activeHatches, MONTH_NAMES, MONTHS, type RiverState, type TimeOfDay } from "@/lib/hatches";
import styles from "./river.module.css";

const TIMES: { value: TimeOfDay; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

export function RiverPlanner({ today }: { today: RiverState }) {
  const [state, setState] = useState<RiverState>(today);
  const set = <K extends keyof RiverState>(key: K) => (value: RiverState[K]) => setState((s) => ({ ...s, [key]: value }));

  const hatches = activeHatches(state);
  const isToday = state.month === today.month && state.waterF === today.waterF && state.time === today.time;

  return (
    <div className={styles.layout}>
      <div className={styles.scene}>
        <RiverScene hatches={hatches} />
        <p className={styles.sceneCaption} aria-hidden="true">
          {MONTH_NAMES[state.month]} {state.time}, {state.waterF}°F
        </p>
      </div>

      <div className={styles.controls}>
        <RangeField label="Month" value={state.month} min={0} max={11} format={(i) => MONTHS[i]} onChange={set("month")} />
        <RangeField
          label="Water temperature"
          value={state.waterF}
          min={34}
          max={68}
          format={(v) => `${v}°F`}
          onChange={set("waterF")}
        />
        <SegmentedControl label="When you’ll be on the water" options={TIMES} value={state.time} onChange={set("time")} />
        <Button variant="quiet" onClick={() => setState(today)} disabled={isToday}>
          Use today’s conditions
        </Button>
      </div>

      <section className={styles.results} aria-labelledby="results-title" aria-live="polite">
        <h2 id="results-title" className={styles.resultsTitle}>
          {hatches.length === 0
            ? "Nothing rising"
            : `${hatches.length} ${hatches.length === 1 ? "hatch" : "hatches"} on the water`}
        </h2>
        <HatchList hatches={hatches} />
      </section>
    </div>
  );
}
