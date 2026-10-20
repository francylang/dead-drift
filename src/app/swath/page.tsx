import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button/Button";
import { Hero } from "./Hero";
import styles from "./swath.module.css";

export const metadata: Metadata = {
  title: "Swath — cash flow that follows the season",
};

const STEPS = [
  {
    title: "Bring in last season",
    body: "Connect your bank or drop in last year's ledger. Swath sorts seed, fertilizer, fuel, and labor by month.",
  },
  {
    title: "Set this year's timing",
    body: "Pick a harvest window and a yield estimate. Sales land when the elevator actually pays, not when the crop comes in.",
  },
  {
    title: "Size the line you need",
    body: "See the lowest balance of the year and when it hits. Take that number to your lender before planting.",
  },
];

export default function SwathPage() {
  return (
    <>
      <header className={styles.bar}>
        <Link href="/swath" className={styles.wordmark}>
          Swath
        </Link>
        <nav aria-label="Product">
          <Link href="/swath/plan">Planner</Link>
        </nav>
      </header>

      <main>
        <Hero />

        <section id="how" className={styles.section} aria-labelledby="how-title">
          <h2 id="how-title" className={styles.sectionTitle}>
            Three steps, done once a year
          </h2>
          <ol className={styles.steps}>
            {STEPS.map((step) => (
              <li key={step.title} className={styles.step}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.closer} aria-labelledby="closer-title">
          <h2 id="closer-title" className={styles.sectionTitle}>
            Try it with your own numbers
          </h2>
          <p>Move the harvest a month later and watch the low point move with it.</p>
          <Button href="/swath/plan">Plan a season</Button>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          Swath is a fictional product, designed and built by <Link href="/">Francy Kessler</Link> as a
          portfolio piece.
        </p>
      </footer>
    </>
  );
}
