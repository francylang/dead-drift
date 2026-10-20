import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button/Button";
import { HatchList } from "@/components/HatchList/HatchList";
import { getConditions, GAUGE } from "@/lib/conditions";
import { activeHatches } from "@/lib/hatches";
import { Hero } from "./Hero";
import styles from "./hatch.module.css";

export const metadata: Metadata = {
  title: "Hatch — know what’s coming off the water",
  description: "Hatch reads river gauges and the season to tell you which insects are hatching and what to tie on.",
};

const SIGNALS = [
  {
    title: "Water temperature",
    body: "Each insect hatches inside a temperature window. Hatch reads the nearest USGS gauge, or the season’s typical temperature when the gauge doesn’t report one.",
  },
  {
    title: "Time of year",
    body: "Midges carry the winter, caddis and PMDs own late spring, tricos fill August mornings, and blue-winged olives bookend the season.",
  },
  {
    title: "Time of day",
    body: "Trico spinners fall at sunrise, olives come off on gray afternoons, caddis skitter at dusk. Pick when you’ll be on the water.",
  },
];

export default async function HatchPage() {
  const conditions = await getConditions();
  const now = activeHatches({ month: conditions.month, waterF: conditions.waterF, time: "afternoon" });

  return (
    <>
      <header className={styles.bar}>
        <Link href="/hatch" className={styles.wordmark}>
          Hatch
        </Link>
        <nav aria-label="Product">
          <Link href="/hatch/river">Read the river</Link>
        </nav>
      </header>

      <main>
        <Hero startMonth={conditions.month} />

        <section className={styles.section} aria-labelledby="now-title">
          <div className={styles.nowHeader}>
            <h2 id="now-title" className={styles.sectionTitle}>
              This afternoon at Deckers
            </h2>
            <dl className={styles.readings}>
              <div>
                <dt>Flow</dt>
                <dd>{conditions.flowCfs === null ? "Unavailable" : `${conditions.flowCfs} cfs`}</dd>
              </div>
              <div>
                <dt>Water</dt>
                <dd>
                  {conditions.waterF}°F
                  {conditions.tempSource === "estimate" && <span className={styles.estimate}> estimated</span>}
                </dd>
              </div>
            </dl>
          </div>
          <HatchList hatches={now} />
          <p className={styles.source}>
            Flow from USGS gauge <a href={GAUGE.url}>{GAUGE.id}</a>
            {conditions.readAt &&
              `, read ${new Date(conditions.readAt).toLocaleString("en-US", {
                timeZone: "America/Denver",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}`}
            . Refreshes every 15 minutes.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="how-title">
          <h2 id="how-title" className={styles.sectionTitle}>
            What Hatch reads
          </h2>
          <ul className={styles.signals}>
            {SIGNALS.map((s) => (
              <li key={s.title} className={styles.signal}>
                <h3 className={styles.signalTitle}>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.closer} aria-labelledby="closer-title">
          <h2 id="closer-title" className={styles.sectionTitle}>
            Plan a day on the water
          </h2>
          <p>Set the month, the water temperature, and when you’ll get there. See what’s rising and what to tie on.</p>
          <Button href="/hatch/river">Read the river</Button>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          Hatch is a fictional product, designed and built by <Link href="/">Francy Kessler</Link>. Hatch timing and
          hook sizes follow{" "}
          <a href="https://theflyfishingplace.com/pages/south-platte-river-colorado-hatch-chart">
            The Fly Fishing Place’s South Platte chart
          </a>
          ; temperature windows are approximate.
        </p>
      </footer>
    </>
  );
}
