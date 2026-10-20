import styles from "./StrengthKey.module.css";

export interface StrengthKeyProps {
  /** Labels from weakest to strongest. */
  labels: [string, string, string];
  /** Extra items after the swatches, e.g. "Line marks this month". */
  extras?: React.ReactNode[];
}

/**
 * The key shared by the hatch charts: bar height is hatch strength.
 * Weakest to strongest reads left to right, like the bars themselves.
 */
export function StrengthKey({ labels, extras = [] }: StrengthKeyProps) {
  return (
    <ul className={styles.key} aria-label="Key">
      {labels.map((label, i) => (
        <li key={label} className={styles.item}>
          <span className={styles.well} aria-hidden="true">
            <span className={styles.bar} data-strength={i + 1} />
          </span>
          {label}
        </li>
      ))}
      {extras.map((extra, i) => (
        <li key={i} className={styles.item}>
          {extra}
        </li>
      ))}
    </ul>
  );
}
