"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import type { ActiveHatch, Order } from "@/lib/hatches";
import { InsectShape } from "@/components/Insect/Insect";
import styles from "./RiverScene.module.css";

const W = 1200;
const H = 600;
const SURFACE = 380;

const SCALE: Record<Order, number> = { mayfly: 1, caddis: 1, stonefly: 1.35, midge: 0.6, terrestrial: 1.25 };
const PER_INTENSITY = 5;

/** Small deterministic PRNG so server and client place insects identically. */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export interface RiverSceneProps {
  hatches: ActiveHatch[];
  /** Multiplies insect counts. 1 is a normal hatch. */
  density?: number;
  /** Accessible description of the scene. Omit when the hatch is described elsewhere. */
  label?: string;
}

export function RiverScene({ hatches, density = 1, label }: RiverSceneProps) {
  const reduce = usePrefersReducedMotion();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={styles.scene}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id="hatch-air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-water-deep)" />
          <stop offset="1" stopColor="var(--color-water)" />
        </linearGradient>
        <linearGradient id="hatch-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-water-surface)" />
          <stop offset="1" stopColor="var(--color-water-deep)" />
        </linearGradient>
      </defs>

      <rect width={W} height={SURFACE} fill="url(#hatch-air)" />
      <rect y={SURFACE} width={W} height={H - SURFACE} fill="url(#hatch-water)" />
      <Glints />

      <AnimatePresence>
        {hatches.map(({ hatch, intensity }) => (
          <motion.g
            key={hatch.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.6 }}
            style={{ color: `var(--color-${hatch.order})` }}
          >
            {Array.from({ length: Math.round(intensity * PER_INTENSITY * density) }, (_, i) => (
              <Riser key={i} seed={`${hatch.id}-${i}`} order={hatch.order} reduce={reduce} />
            ))}
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>
  );
}

function Riser({ seed, order, reduce }: { seed: string; order: Order; reduce: boolean }) {
  const rand = seeded(seed);
  const x = 40 + rand() * (W - 80);
  const drift = (rand() - 0.5) * 160;
  const top = 40 + rand() * 180;
  const duration = 5 + rand() * 5;
  const delay = rand() * 8;
  const scale = SCALE[order] * (0.8 + rand() * 0.4);
  const facing = rand() > 0.5 ? 1 : -1;

  const shape = (
    <g transform={`scale(${scale * facing} ${scale}) translate(-20 -22)`}>
      <InsectShape order={order} />
    </g>
  );

  if (reduce) {
    const y = top + rand() * (SURFACE - top - 40);
    return <g transform={`translate(${x + drift / 2} ${y})`}>{shape}</g>;
  }

  return (
    <motion.g
      initial={{ x, y: SURFACE, opacity: 0 }}
      animate={{ x: [x, x + drift * 0.4, x + drift], y: [SURFACE, (SURFACE + top) / 2, top], opacity: [0, 1, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, repeatDelay: rand() * 3, ease: "easeOut" }}
    >
      {shape}
    </motion.g>
  );
}

/** Static highlight strokes on the water. Not animated: the insects are the motion. */
function Glints() {
  const rand = seeded("glints");
  return (
    <g className={styles.glints}>
      {Array.from({ length: 28 }, (_, i) => {
        const y = SURFACE + 10 + Math.pow(rand(), 1.6) * (H - SURFACE - 20);
        const x = rand() * W;
        const len = 20 + rand() * 90 * (1 - (y - SURFACE) / (H - SURFACE));
        return <line key={i} x1={x} x2={x + len} y1={y} y2={y} />;
      })}
    </g>
  );
}
