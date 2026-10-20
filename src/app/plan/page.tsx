import type { Metadata } from "next";
import { RiverPlanner } from "@/components/RiverPlanner/RiverPlanner";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getConditions } from "@/lib/conditions";
import { plannerRiver } from "@/lib/planner";
import { RIVERS } from "@/lib/rivers";
import styles from "./river.module.css";
import { pageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("Read the river"),
};

export default async function ReadTheRiverPage() {
  const snapshot = await getConditions();

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <h1 className={styles.title}>Read the river</h1>
        <p className={styles.intro}>
          Pick a Gold Medal river. It starts from today’s water temperature; change the month, temperature, or time of
          day to see what would be on the water and what to tie on.
        </p>
        <RiverPlanner rivers={RIVERS.map((r) => plannerRiver(r, snapshot))} initial="south-platte-deckers" />
      </main>
    </>
  );
}
