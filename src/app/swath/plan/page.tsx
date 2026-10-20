import type { Metadata } from "next";
import Link from "next/link";
import { Planner } from "./Planner";
import styles from "./plan.module.css";

export const metadata: Metadata = {
  title: "Plan a season — Swath",
};

export default function PlanPage() {
  return (
    <main className={styles.page}>
      <Link href="/swath" className={styles.back}>
        Back to Swath
      </Link>
      <h1 className={styles.title}>Plan a season</h1>
      <p className={styles.intro}>
        A small grain operation with $52,000 on hand in January. Change when the crop comes off and how
        it yields, and see whether the operating line holds.
      </p>
      <Planner />
    </main>
  );
}
