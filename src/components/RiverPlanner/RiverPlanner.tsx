"use client";

import { useId, useState } from "react";
import { Button } from "@/components/Button/Button";
import { HatchList } from "@/components/HatchList/HatchList";
import { RangeField } from "@/components/RangeField/RangeField";
import { RiverScene } from "@/components/RiverScene/RiverScene";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { SelectField } from "@/components/SelectField/SelectField";
import { activeHatches, MONTH_NAMES, MONTHS, type Hatch, type RiverState, type TimeOfDay } from "@/lib/hatches";
import styles from "./RiverPlanner.module.css";

const TIMES: { value: TimeOfDay; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

export interface PlannerRiver {
  slug: string;
  name: string;
  reach: string;
  region: string;
  hatches: Hatch[];
  /** Today's conditions on this river: the starting point and the reset target. */
  today: RiverState;
}

export interface RiverPlannerProps {
  rivers: PlannerRiver[];
  /** Which river to start on. Defaults to the first. */
  initial?: string;
  /** Heading level for the results title, so it nests under the page's outline. */
  headingLevel?: 2 | 3;
}

/**
 * What-if planner for one river, or any of several when given more than one:
 * set month, water temperature and time of day, see what rises and what to tie on.
 */
export function RiverPlanner({ rivers, initial, headingLevel = 2 }: RiverPlannerProps) {
  const [slug, setSlug] = useState(initial ?? rivers[0].slug);
  const river = rivers.find((r) => r.slug === slug) ?? rivers[0];
  const [state, setState] = useState<RiverState>(river.today);
  const titleId = useId();

  const set = <K extends keyof RiverState>(key: K) => (value: RiverState[K]) => setState((s) => ({ ...s, [key]: value }));
  const chooseRiver = (next: string) => {
    setSlug(next);
    setState(rivers.find((r) => r.slug === next)!.today);
  };

  const hatches = activeHatches(state, river.hatches);
  const { today } = river;
  const isToday = state.month === today.month && state.waterF === today.waterF && state.time === today.time;
  const Heading = `h${headingLevel}` as const;
  const onRiver = river.name.endsWith("Creek") ? river.name : `the ${river.name}`;

  return (
    <div className={styles.layout}>
      <div className={styles.scene}>
        <RiverScene hatches={hatches} />
        <p className={styles.sceneCaption} aria-hidden="true">
          {MONTH_NAMES[state.month]} {state.time}, {state.waterF}°F
        </p>
      </div>

      <div className={styles.controls}>
        {rivers.length > 1 && (
          <div className={styles.picker}>
            <SelectField
              label="River"
              value={river.slug}
              options={rivers.map((r) => ({ value: r.slug, label: `${r.name}, ${r.reach}`, group: r.region }))}
              onChange={chooseRiver}
            />
          </div>
        )}
        <RangeField label="Month" value={state.month} min={0} max={11} format={(i) => MONTHS[i]} onChange={set("month")} />
        <RangeField
          label="Water temperature"
          value={state.waterF}
          min={32}
          max={68}
          format={(v) => `${v}°F`}
          onChange={set("waterF")}
        />
        <SegmentedControl label="When you’ll be on the water" options={TIMES} value={state.time} onChange={set("time")} />
        <Button variant="quiet" onClick={() => setState(today)} disabled={isToday}>
          Use today’s conditions
        </Button>
      </div>

      <section className={styles.results} aria-labelledby={titleId} aria-live="polite">
        <Heading id={titleId} className={styles.resultsTitle}>
          {hatches.length === 0
            ? `Nothing rising on ${onRiver}`
            : `${hatches.length} ${hatches.length === 1 ? "hatch" : "hatches"} on ${onRiver}`}
        </Heading>
        <HatchList hatches={hatches} />
      </section>
    </div>
  );
}
