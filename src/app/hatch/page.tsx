import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button/Button";
import { HatchChart } from "@/components/HatchChart/HatchChart";
import { HatchList } from "@/components/HatchList/HatchList";
import { Readings } from "@/components/Readings/Readings";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getRiverConditions } from "@/lib/conditions";
import { flowDetail, flowValue, normalDetail, normalValue, waterDetail, waterValue } from "@/lib/describe";
import { activeHatches } from "@/lib/hatches";
import { RIVER_BY_SLUG, RIVERS, riverHatches } from "@/lib/rivers";
import { formatClock, localParts } from "@/lib/time";
import { Hero } from "./Hero";
import styles from "./hatch.module.css";

export const metadata: Metadata = {
  title: "Hatch — know what’s coming off the water",
  description: "Live river gauges, the forecast, and the season, turned into what’s hatching and what to tie on.",
};

const SIGNALS = [
  {
    title: "Water temperature",
    body: "Each insect hatches inside a temperature window. Hatch reads the river’s USGS gauge, or the season’s typical temperature when the gauge doesn’t report one.",
  },
  {
    title: "Time of year",
    body: "Midges carry the winter, caddis and PMDs own late spring, tricos fill August mornings, and blue-winged olives bookend the season.",
  },
  {
    title: "The forecast",
    body: "Cloud cover, wind, and air temperature from the National Weather Service, hour by hour. Gray afternoons bring olives; a warm breeze puts hoppers on the water.",
  },
  {
    title: "Time of day",
    body: "Trico spinners fall at sunrise, olives come off on gray afternoons, caddis skitter at dusk. Pick when you’ll be on the water.",
  },
];

const DECKERS = RIVER_BY_SLUG["south-platte-deckers"];

export default async function HatchPage() {
  const { takenAt, conditions: c } = await getRiverConditions(DECKERS);
  const { month } = localParts(takenAt);
  const hatches = riverHatches(DECKERS);
  const now = activeHatches({ month, waterF: c.waterF, time: "afternoon" }, hatches);

  return (
    <>
      <SiteHeader />

      <main>
        <Hero hatches={hatches} currentMonth={month} />

        <section className={styles.section} aria-labelledby="now-title">
          <h2 id="now-title" className={styles.sectionTitle}>
            This afternoon at Deckers
          </h2>
          <Readings
            items={[
              { label: "Flow", value: flowValue(c), detail: flowDetail(c) },
              { label: "Compared with normal", value: normalValue(c), detail: normalDetail(c, takenAt) },
              { label: "Water", value: waterValue(c), detail: waterDetail(c) },
            ]}
          />
          <div className={styles.nowList}>
            <HatchList hatches={now} />
          </div>
          <p className={styles.source}>
            Flow from USGS gauge {DECKERS.gauge.id}
            {c.readAt && `, read ${formatClock(c.readAt)}`}. Refreshes every 15 minutes.{" "}
            <Link href={`/rivers/${DECKERS.slug}`}>Hourly outlook for Deckers</Link> or{" "}
            <Link href="/rivers">all {RIVERS.length} Gold Medal rivers</Link>.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="chart-title">
          <h2 id="chart-title" className={styles.sectionTitle}>
            A year on the South Platte
          </h2>
          <p className={styles.chartIntro}>
            The hatch chart every fly shop pins by the register. Darker means heavier; the line marks this month.
          </p>
          <HatchChart
            hatches={hatches}
            currentMonth={month}
            caption="Hatch chart for the South Platte at Deckers: how strong each hatch is by month, with hook sizes."
          />
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
          Hatch is a portfolio project designed and built by <Link href="/">Francy Kessler</Link>. South Platte hatch
          timing and hook sizes follow{" "}
          <a href="https://theflyfishingplace.com/pages/south-platte-river-colorado-hatch-chart">
            The Fly Fishing Place’s chart
          </a>
          ; other rivers draw on regional charts and shop reports. Temperature windows are approximate.
        </p>
      </footer>
    </>
  );
}
