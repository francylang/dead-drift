import type { Metadata } from "next";
import Link from "next/link";
import { getConditions, GAUGE } from "@/lib/conditions";
import { RiverPlanner } from "./RiverPlanner";
import styles from "./river.module.css";

export const metadata: Metadata = {
  title: "Read the river — Hatch",
};

export default async function RiverPage() {
  const conditions = await getConditions();

  return (
    <main className={styles.page}>
      <Link href="/hatch" className={styles.back}>
        Back to Hatch
      </Link>
      <h1 className={styles.title}>Read the river</h1>
      <p className={styles.intro}>
        South Platte at Deckers. Starts from today: {conditions.waterF}°F
        {conditions.tempSource === "estimate" ? " (estimated for the season)" : ` from gauge ${GAUGE.id}`}
        {conditions.flowCfs !== null && `, ${conditions.flowCfs} cfs`}.
      </p>
      <RiverPlanner today={{ month: conditions.month, waterF: conditions.waterF, time: "afternoon" }} />
    </main>
  );
}
