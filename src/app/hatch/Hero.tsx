"use client";

import { useState } from "react";
import { MonthRibbon } from "@/components/MonthRibbon/MonthRibbon";
import { RiverScene } from "@/components/RiverScene/RiverScene";
import { activityByMonth, MONTH_NAMES, seasonalHatches, type Hatch } from "@/lib/hatches";
import styles from "./hatch.module.css";

const list = new Intl.ListFormat("en-US", { style: "long", type: "conjunction" });

/**
 * Opens on this month's river. The season ribbon along the bottom lets you drag
 * through the year; its bars show how much is hatching each month.
 */
export function Hero({ hatches, currentMonth, where }: { hatches: Hatch[]; currentMonth: number; where: string }) {
  const [month, setMonth] = useState(currentMonth);
  const onTheWater = seasonalHatches(month, hatches);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroScene}>
        <RiverScene hatches={onTheWater} />
      </div>
      <div className={styles.heroCopy}>
        <h1 id="hero-title" className={styles.heroTitle}>
          Know what’s coming off the water before you rig up.
        </h1>
        <div className={styles.heroMonth} aria-live="polite">
          <p className={styles.monthName}>
            {MONTH_NAMES[month]}
            {month === currentMonth && <span className={styles.nowTag}>this month</span>}
          </p>
          <p className={styles.monthHatches}>
            {onTheWater.length > 0
              ? `${list.format(onTheWater.slice(0, 5).map((h) => h.hatch.plural))} ${where}`
              : `Quiet water ${where}`}
          </p>
        </div>
        <div className={styles.ribbon}>
          <MonthRibbon
            label="Drag through the season"
            value={month}
            onChange={setMonth}
            activity={activityByMonth(hatches)}
            currentMonth={currentMonth}
            tone="water"
          />
        </div>
      </div>
    </section>
  );
}
