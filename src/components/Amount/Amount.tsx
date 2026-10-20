import { formatDollars } from "@/lib/cashflow";
import styles from "./Amount.module.css";

export interface AmountProps {
  value: number;
  size?: "md" | "lg";
  /** Color by sign: income reads canola, a negative balance reads soil. */
  tone?: "auto" | "neutral";
}

export function Amount({ value, size = "md", tone = "auto" }: AmountProps) {
  const sign = tone === "neutral" ? "neutral" : value < 0 ? "negative" : "positive";
  return (
    <data value={value} className={`${styles.amount} ${styles[size]} ${styles[sign]}`}>
      {formatDollars(value)}
    </data>
  );
}
