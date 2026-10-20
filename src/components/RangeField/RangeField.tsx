"use client";

import { useId } from "react";
import styles from "./RangeField.module.css";

export interface RangeFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Text shown beside the label and announced as aria-valuetext. */
  format?: (value: number) => string;
  onChange: (value: number) => void;
}

export function RangeField({ label, value, min, max, step = 1, format = String, onChange }: RangeFieldProps) {
  const id = useId();
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.field}>
      <div className={styles.header}>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className={styles.value}>
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className={styles.input}
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        style={{ "--fill": `${percent}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </div>
  );
}
