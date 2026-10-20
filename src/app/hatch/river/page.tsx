import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getRiverConditions } from "@/lib/conditions";
import { RIVER_BY_SLUG } from "@/lib/rivers";
import { localParts } from "@/lib/time";
import { RiverPlanner } from "./RiverPlanner";
import styles from "./river.module.css";

export const metadata: Metadata = {
  title: "Read the river — Hatch",
};

const DECKERS = RIVER_BY_SLUG["south-platte-deckers"];

export default async function ReadTheRiverPage() {
  const { takenAt, conditions: c } = await getRiverConditions(DECKERS);
  const { month } = localParts(takenAt);

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <h1 className={styles.title}>Read the river</h1>
        <p className={styles.intro}>
          South Platte at Deckers. Starts from today: {c.waterF}°F
          {c.tempSource === "estimate" ? " (estimated for the season)" : ` from gauge ${DECKERS.gauge.id}`}
          {c.flowCfs !== null && `, ${c.flowCfs} cfs`}. Change anything to see what would be on the water.
        </p>
        <RiverPlanner today={{ month, waterF: c.waterF, time: "afternoon" }} />
      </main>
    </>
  );
}
