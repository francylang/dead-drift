import styles from "./Readings.module.css";

export interface Reading {
  label: string;
  value: React.ReactNode;
  /** Secondary line: units, source, or how this compares to normal. */
  detail?: React.ReactNode;
}

/** A row of gauge-style readings. Server-renderable; no state. */
export function Readings({ items }: { items: Reading[] }) {
  return (
    <dl className={styles.readings}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
          {item.detail && <dd className={styles.detail}>{item.detail}</dd>}
        </div>
      ))}
    </dl>
  );
}
