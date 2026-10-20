"use client";

import { useRef } from "react";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/Button/Button";
import { CashCurve } from "@/components/CashCurve/CashCurve";
import { DEFAULT_INPUTS, planSeason } from "@/lib/cashflow";
import styles from "./swath.module.css";

const season = planSeason(DEFAULT_INPUTS);

/**
 * The one orchestrated moment on the page: the season's cash line draws as you scroll
 * through a pinned hero, and the low point is called out when the line reaches it.
 */
export function Hero() {
  const track = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const drawn = useTransform(scrollYProgress, [0.05, 0.8], [0.02, 1], { clamp: true });

  return (
    <section ref={track} className={reduce ? styles.heroStatic : styles.heroTrack}>
      <div className={styles.heroPin}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>Know how low cash will run before you plant.</h1>
          <p className={styles.lede}>
            Swath maps a season of spending and crop sales, so you size the operating line in January
            instead of finding out in August.
          </p>
          <div className={styles.actions}>
            <Button href="/swath/plan">Plan a season</Button>
            <Button href="#how" variant="quiet">
              How it works
            </Button>
          </div>
        </div>
        <CashCurve season={season} progress={reduce ? undefined : drawn} />
      </div>
    </section>
  );
}
