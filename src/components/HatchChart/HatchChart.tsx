"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Insect } from "@/components/Insect/Insect";
import { MONTH_NAMES, MONTHS, type Hatch, type Intensity } from "@/lib/hatches";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import styles from "./HatchChart.module.css";

const STRENGTH = ["None", "Around", "Good", "Peak"];

export interface HatchChartProps {
  hatches: Hatch[];
  caption: string;
  /** Draws a rule down the current month. */
  currentMonth?: number;
}

/**
 * The angler's hatch chart: hatches down, months across. As it scrolls into view each row
 * inks in left to right, row after row, tied to scroll position so it reverses on the way back up.
 */
export function HatchChart({ hatches, caption, currentMonth }: HatchChartProps) {
  const ref = useRef<HTMLTableElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });

  return (
    <div className={styles.scroller}>
      <table ref={ref} className={styles.chart}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.corner}>
              <span className="visually-hidden">Hatch</span>
            </th>
            {MONTHS.map((m, i) => (
              <th key={m} scope="col" className={styles.month} data-current={i === currentMonth || undefined}>
                <abbr title={MONTH_NAMES[i]}>{m}</abbr>
              </th>
            ))}
            <th scope="col" className={styles.hooks}>
              Hook
            </th>
          </tr>
        </thead>
        <tbody>
          {hatches.map((hatch, row) => (
            <tr key={hatch.id}>
              <th scope="row" className={styles.name}>
                <Insect order={hatch.order} size={28} color="var(--color-action)" />
                <span>{hatch.name}</span>
              </th>
              {hatch.months.map((intensity, col) => (
                <Cell
                  key={col}
                  intensity={intensity}
                  current={col === currentMonth}
                  progress={scrollYProgress}
                  animate={!reduce}
                  // Each row starts a little after the one above; cells sweep left to right.
                  start={row / (hatches.length + 4) + col * 0.018}
                />
              ))}
              <td className={styles.hookSize}>#{hatch.hooks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({
  intensity,
  current,
  progress,
  animate,
  start,
}: {
  intensity: Intensity;
  current: boolean;
  progress: MotionValue<number>;
  animate: boolean;
  start: number;
}) {
  const reveal = useTransform(progress, [start, start + 0.12], [0, 1], { clamp: true });

  return (
    <td className={styles.cell} data-current={current || undefined}>
      {intensity > 0 && (
        <motion.span
          className={styles.fill}
          data-intensity={intensity}
          style={animate ? { scaleX: reveal, opacity: reveal } : undefined}
        />
      )}
      <span className="visually-hidden">{STRENGTH[intensity]}</span>
    </td>
  );
}
