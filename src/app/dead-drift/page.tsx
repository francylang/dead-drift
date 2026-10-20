import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button/Button";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getConditions } from "@/lib/conditions";
import { normalValue } from "@/lib/describe";
import { RIVERS, riverHatches, statewideHatches } from "@/lib/rivers";
import { formatClock, localParts } from "@/lib/time";
import { allRiversToday, rankRivers } from "@/lib/today";
import { Hero } from "./Hero";
import { RiverHatchChart } from "./RiverHatchChart";
import styles from "./landing.module.css";
import { BRAND, ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} — know what’s coming off the water`,
  description: "Live river gauges, the forecast, and the season, turned into what’s hatching and what to tie on.",
};

const SIGNALS = [
  {
    title: "Water temperature",
    body: "Each insect hatches inside a temperature window. It reads every river’s gauge, or the season’s typical temperature when a gauge doesn’t report one.",
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

const FLOW_PHRASE = { low: "low for the date", normal: "normal for the date", high: "high for the date" } as const;

export default async function HatchPage() {
  const snapshot = await getConditions();
  const { month } = localParts(snapshot.takenAt);
  const ranked = rankRivers(await allRiversToday(snapshot));
  const top = ranked.slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main>
        <Hero hatches={statewideHatches()} currentMonth={month} where="on Colorado’s Gold Medal rivers" />

        <section className={styles.section} aria-labelledby="today-title">
          <h2 id="today-title" className={styles.sectionTitle}>
            Where to fish today
          </h2>
          <p className={styles.chartIntro}>
            Ranked by today’s strongest hatch, with blown-out water pushed down the list.
          </p>
          <ol className={styles.picks}>
            {top.map(({ river, conditions: c, best }) => (
              <li key={river.slug} className={styles.pick}>
                <div className={styles.pickRiver}>
                  <Link href={ROUTES.river(river.slug)} className={styles.pickName}>
                    {river.name}
                  </Link>
                  <span className={styles.pickReach}>{river.reach}</span>
                </div>
                <p className={styles.pickHatch}>{best ? `${best.hatch.name}, ${best.label}` : "Nymph it deep"}</p>
                <p className={styles.pickFlow}>
                  {c.flowCfs === null
                    ? `${c.waterF}°F water`
                    : `${c.flowCfs.toLocaleString("en-US")} cfs${c.band ? `, ${FLOW_PHRASE[c.band]}` : ""}`}
                  {c.pctOfMedian !== null && <span className="visually-hidden"> ({normalValue(c)} of median)</span>}
                </p>
              </li>
            ))}
          </ol>
          <p className={styles.source}>
            Live USGS gauges and the National Weather Service forecast, refreshed every 15 minutes. Snapshot{" "}
            {formatClock(snapshot.takenAt)}. <Link href={ROUTES.rivers}>See all {RIVERS.length} Gold Medal rivers</Link>.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="chart-title">
          <h2 id="chart-title" className={styles.sectionTitle}>
            A year on the water
          </h2>
          <p className={styles.chartIntro}>
            The hatch chart every fly shop pins by the register, month by month. Taller bars mean a heavier hatch.
          </p>
          <RiverHatchChart
            rivers={RIVERS.map((r) => ({
              slug: r.slug,
              label: `${r.name}, ${r.reach}`,
              region: r.region,
              hatches: riverHatches(r),
            }))}
            initial={ranked[0].river.slug}
            currentMonth={month}
          />
        </section>

        <section className={styles.section} aria-labelledby="how-title">
          <h2 id="how-title" className={styles.sectionTitle}>
            What {BRAND.name} reads
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
          <Button href={ROUTES.plan}>Read the river</Button>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          {BRAND.name} is a portfolio project designed and built by <Link href="/">Francy Kessler</Link>. Hatch timing and hook
          sizes are compiled from fly shop hatch charts and reports; treat them as a starting point and check with a
          local shop before you drive.
        </p>
      </footer>
    </>
  );
}
