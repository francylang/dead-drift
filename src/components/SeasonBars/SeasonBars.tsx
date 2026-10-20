"use client";

import { motion, useReducedMotion } from "motion/react";
import { formatDollars, type Season } from "@/lib/cashflow";
import styles from "./SeasonBars.module.css";

const W = 720;
const H = 360;
const PAD = { top: 16, bottom: 32 };
const SCALE = { max: 140_000, min: -80_000 };

const y = (v: number) => PAD.top + ((SCALE.max - v) / (SCALE.max - SCALE.min)) * (H - PAD.top - PAD.bottom);

export interface SeasonBarsProps {
  season: Season;
  creditLine: number;
}

/** Month-end cash balance as bars. Bars spring to new values; the credit floor is the dashed line. */
export function SeasonBars({ season, creditLine }: SeasonBarsProps) {
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 26 };
  const slot = W / season.rows.length;
  const barW = slot * 0.62;
  const zero = y(0);

  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden="true">
        <line x1={0} x2={W} y1={zero} y2={zero} className={styles.zero} />
        <motion.line
          x1={0}
          x2={W}
          initial={false}
          animate={{ y1: y(-creditLine), y2: y(-creditLine) }}
          transition={transition}
          className={styles.credit}
        />
        {season.rows.map((row, i) => {
          const top = Math.min(y(row.balance), zero);
          const height = Math.abs(y(row.balance) - zero);
          const isTrough = i === season.trough.index;
          return (
            <g key={row.month}>
              <motion.rect
                x={i * slot + (slot - barW) / 2}
                width={barW}
                rx={3}
                initial={false}
                animate={{ y: top, height }}
                transition={transition}
                className={[
                  styles.bar,
                  row.balance < 0 ? styles.below : styles.above,
                  isTrough && !season.covered ? styles.short : "",
                ].join(" ")}
              />
              <text x={i * slot + slot / 2} y={H - 8} className={styles.month}>
                {row.month}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="visually-hidden">
        <caption>Month-end cash balance</caption>
        <tbody>
          {season.rows.map((row) => (
            <tr key={row.month}>
              <th scope="row">{row.month}</th>
              <td>{formatDollars(row.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
