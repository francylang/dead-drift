"use client";

import { useId } from "react";
import styles from "./SelectField.module.css";

export interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; group?: string }[];
  onChange: (value: T) => void;
}

/** A native select, styled. Options with a `group` are wrapped in optgroups. */
export function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  const id = useId();
  const groups = [...new Set(options.map((o) => o.group))];

  const renderOptions = (items: typeof options) =>
    items.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ));

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.wrap}>
        <select id={id} className={styles.select} value={value} onChange={(e) => onChange(e.currentTarget.value as T)}>
          {groups.length > 1 || groups[0]
            ? groups.map((group) => (
                <optgroup key={group ?? "other"} label={group ?? "Other"}>
                  {renderOptions(options.filter((o) => o.group === group))}
                </optgroup>
              ))
            : renderOptions(options)}
        </select>
        <svg className={styles.chevron} viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
