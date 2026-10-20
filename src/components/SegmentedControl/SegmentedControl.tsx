"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useId } from "react";
import { motion } from "motion/react";
import styles from "./SegmentedControl.module.css";

export interface SegmentedControlProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * A native radio group styled as segments, so arrow keys, form semantics and
 * screen-reader announcements come for free. The selection pill slides between options.
 */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  const name = useId();
  const reduce = usePrefersReducedMotion();

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.track}>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label key={option.value} className={styles.option} data-checked={checked || undefined}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className={styles.input}
              />
              {checked && (
                <motion.span
                  layoutId={`${name}-pill`}
                  className={styles.pill}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className={styles.text}>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
