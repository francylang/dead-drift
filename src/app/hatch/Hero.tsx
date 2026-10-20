"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { RiverScene } from "@/components/RiverScene/RiverScene";
import { MONTH_NAMES, seasonalHatches } from "@/lib/hatches";
import styles from "./hatch.module.css";

const list = new Intl.ListFormat("en-US", { style: "long", type: "conjunction" });

/**
 * The page's one orchestrated moment: scrolling moves the river through a year.
 * The pinned scene swaps hatches month by month, midges in January through
 * tricos in August and back to midges in December.
 */
export function Hero({ startMonth }: { startMonth: number }) {
  const track = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [month, setMonth] = useState(reduce ? startMonth : 0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    const next = Math.min(11, Math.floor(p * 12));
    if (next !== month) setMonth(next);
  });

  const hatches = seasonalHatches(month);

  return (
    <section ref={track} className={reduce ? styles.heroStatic : styles.heroTrack} aria-labelledby="hero-title">
      <div className={styles.heroPin}>
        <div className={styles.heroScene}>
          <RiverScene hatches={hatches} />
        </div>
        <div className={styles.heroCopy}>
          <h1 id="hero-title" className={styles.heroTitle}>
            Know what’s coming off the water before you rig up.
          </h1>
          <div className={styles.heroMonth} aria-live="polite">
            <p className={styles.monthName}>{MONTH_NAMES[month]}</p>
            <p className={styles.monthHatches}>
              {list.format(hatches.map((h) => h.hatch.plural))} on the South Platte
            </p>
          </div>
          {!reduce && <p className={styles.scrollHint}>Scroll to move through the year</p>}
        </div>
      </div>
    </section>
  );
}
