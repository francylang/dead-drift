"use client";

import { useState } from "react";
import { HatchChart } from "@/components/HatchChart/HatchChart";
import { SelectField } from "@/components/SelectField/SelectField";
import type { Hatch } from "@/lib/hatches";
import styles from "./landing.module.css";

export interface ChartRiver {
  slug: string;
  label: string;
  region: string;
  hatches: Hatch[];
}

/** The hatch chart with a river picker. Starts on whichever river the page suggests. */
export function RiverHatchChart({ rivers, initial, currentMonth }: { rivers: ChartRiver[]; initial: string; currentMonth: number }) {
  const [slug, setSlug] = useState(initial);
  const river = rivers.find((r) => r.slug === slug) ?? rivers[0];

  return (
    <div className={styles.chartBlock}>
      <div className={styles.chartPicker}>
        <SelectField
          label="River"
          value={river.slug}
          options={rivers.map((r) => ({ value: r.slug, label: r.label, group: r.region }))}
          onChange={setSlug}
        />
      </div>
      <HatchChart
        hatches={river.hatches}
        currentMonth={currentMonth}
        caption={`Hatch chart for the ${river.label}: how strong each hatch is by month, with hook sizes.`}
      />
    </div>
  );
}
