"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { formatDollars, MONTHS, type Season } from "@/lib/cashflow";
import styles from "./CashCurve.module.css";

const W = 1200;
const H = 420;
const PAD = { top: 40, right: 24, bottom: 48, left: 24 };

export interface CashCurveProps {
  season: Season;
  /** 0–1. Drives how much of the line is drawn. Omit to draw it fully. */
  progress?: MotionValue<number>;
}

export function CashCurve({ season, progress }: CashCurveProps) {
  const fallback = useMotionValue(1);
  const drawn = progress ?? fallback;

  const balances = season.rows.map((r) => r.balance);
  const max = Math.max(0, ...balances);
  const min = Math.min(0, ...balances);
  const x = (i: number) => PAD.left + (i / (balances.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + ((max - v) / (max - min)) * (H - PAD.top - PAD.bottom);

  const d = balances.map((b, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(b).toFixed(1)}`).join(" ");

  const { index: troughIndex, balance: troughBalance } = season.trough;
  const troughAt = troughIndex / (balances.length - 1);
  const markerOpacity = useTransform(drawn, [troughAt - 0.02, troughAt + 0.04], [0, 1]);

  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden="true">
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} className={styles.zero} />
        {MONTHS.map((m, i) => (
          <text key={m} x={x(i)} y={H - 16} className={styles.month}>
            {m}
          </text>
        ))}
        <motion.path d={d} className={styles.line} style={{ pathLength: drawn }} />
        <motion.g style={{ opacity: markerOpacity }}>
          <circle cx={x(troughIndex)} cy={y(troughBalance)} r={9} className={styles.trough} />
          <text x={x(troughIndex)} y={y(troughBalance) + 40} className={styles.troughLabel}>
            {formatDollars(troughBalance)} in {MONTHS[troughIndex]}
          </text>
        </motion.g>
      </svg>
      <figcaption className="visually-hidden">
        Cash on hand across the year. It falls through spring and summer, bottoms out at{" "}
        {formatDollars(troughBalance)} in {MONTHS[troughIndex]}, and recovers after harvest sales.
      </figcaption>
    </figure>
  );
}
