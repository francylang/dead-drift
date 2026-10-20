"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import type { ActiveHatch, Intensity } from "@/lib/hatches";
import { Insect } from "@/components/Insect/Insect";
import styles from "./HatchList.module.css";

const STRENGTH: Record<Exclude<Intensity, 0>, string> = { 1: "Sparse", 2: "Good", 3: "Peak" };

export interface HatchListProps {
  hatches: ActiveHatch[];
  /** Shown when nothing is on the water. */
  empty?: string;
}

/** Field-book rows: what's hatching, how strongly, and what to tie on. */
export function HatchList({ hatches, empty = "Nothing hatching. Fish nymphs deep and slow." }: HatchListProps) {
  const reduce = usePrefersReducedMotion();

  if (hatches.length === 0) {
    return <p className={styles.empty}>{empty}</p>;
  }

  return (
    <ul className={styles.list}>
      <AnimatePresence initial={false} mode="popLayout">
        {hatches.map(({ hatch, intensity }) => (
          <motion.li
            key={hatch.id}
            layout={!reduce}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }}
            className={styles.row}
          >
            <span className={styles.glyph}>
              <Insect order={hatch.order} size={36} color="var(--color-action)" />
            </span>
            <div className={styles.what}>
              <span className={styles.name}>{hatch.name}</span>
              <i className={styles.taxon}>{hatch.taxon}</i>
            </div>
            <span className={styles.strength} data-intensity={intensity}>
              {STRENGTH[intensity as 1 | 2 | 3]}
            </span>
            <span className={styles.hooks}>
              <span className="visually-hidden">Hook sizes </span>#{hatch.hooks}
            </span>
            <p className={styles.note}>{hatch.note}</p>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
