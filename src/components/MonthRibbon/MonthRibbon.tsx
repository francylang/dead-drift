"use client";

import { useId, useRef } from "react";
import { motion } from "motion/react";
import { MONTH_NAMES, MONTHS } from "@/lib/hatches";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import styles from "./MonthRibbon.module.css";

export interface MonthRibbonProps {
  label: string;
  value: number;
  onChange: (month: number) => void;
  /** 0–1 per month: how much is hatching. Drawn as a bar so the season's shape is visible. */
  activity: number[];
  /** Marks today's month. */
  currentMonth?: number;
  tone?: "paper" | "water";
}

/**
 * Twelve months as a native radio group (arrow keys, screen readers, form semantics),
 * plus pointer scrubbing: press anywhere on the ribbon and drag to sweep through the year.
 */
export function MonthRibbon({ label, value, onChange, activity, currentMonth, tone = "paper" }: MonthRibbonProps) {
  const name = useId();
  const track = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  const monthAt = (clientX: number) => {
    const rect = track.current!.getBoundingClientRect();
    return Math.min(11, Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * 12)));
  };

  const scrub = (event: React.PointerEvent) => {
    const month = monthAt(event.clientX);
    if (month !== value) onChange(month);
  };

  return (
    <fieldset className={styles.fieldset} data-tone={tone}>
      <legend className={styles.legend}>{label}</legend>
      <div
        ref={track}
        className={styles.track}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          scrub(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e);
        }}
      >
        {MONTHS.map((month, i) => {
          const checked = i === value;
          return (
            <label key={month} className={styles.month} data-checked={checked || undefined}>
              <input
                type="radio"
                name={name}
                value={i}
                checked={checked}
                onChange={() => onChange(i)}
                className={styles.input}
                aria-label={`${MONTH_NAMES[i]}${i === currentMonth ? ", this month" : ""}`}
              />
              <span className={styles.barWell} aria-hidden="true">
                <motion.span
                  className={styles.bar}
                  initial={false}
                  animate={{ scaleY: Math.max(0.06, activity[i] ?? 0) }}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                />
              </span>
              {checked && (
                <motion.span
                  layoutId={`${name}-marker`}
                  className={styles.marker}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 40 }}
                />
              )}
              <span className={styles.name} aria-hidden="true">
                {month}
              </span>
              {i === currentMonth && <span className={styles.now} aria-hidden="true" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
