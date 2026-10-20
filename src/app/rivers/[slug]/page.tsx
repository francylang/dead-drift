import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HatchTimeline } from "@/components/HatchTimeline/HatchTimeline";
import { Readings } from "@/components/Readings/Readings";
import { RiverPlanner } from "@/components/RiverPlanner/RiverPlanner";
import { RiverScene } from "@/components/RiverScene/RiverScene";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getConditions } from "@/lib/conditions";
import { flowDetail, flowValue, normalDetail, normalValue, waterDetail, waterValue } from "@/lib/describe";
import { buildOutlook } from "@/lib/outlook";
import { plannerRiver } from "@/lib/planner";
import { gaugeAgency, gaugeUrl, RIVER_BY_SLUG, RIVERS, riverHatches } from "@/lib/rivers";
import { formatClock, localParts } from "@/lib/time";
import { getHourlyForecast } from "@/lib/weather";
import styles from "./river.module.css";

export function generateStaticParams() {
  return RIVERS.map((river) => ({ slug: river.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rivers/[slug]">): Promise<Metadata> {
  const river = RIVER_BY_SLUG[(await params).slug];
  return river ? { title: `${river.name}, ${river.reach} — Hatch` } : {};
}

export default async function RiverPage({ params }: PageProps<"/rivers/[slug]">) {
  const river = RIVER_BY_SLUG[(await params).slug];
  if (!river) notFound();

  const snapshot = await getConditions();
  const { takenAt } = snapshot;
  const c = snapshot.rivers[river.slug];
  const weather = await getHourlyForecast(...c.coords);
  const now = localParts(takenAt);
  const hatches = riverHatches(river);
  const days = buildOutlook(
    { hatches, month: now.month, waterF: c.waterF, tempSource: c.tempSource, kind: river.kind, weather },
    takenAt,
  );

  const current = weather.find((w) => localParts(w.start).hour === now.hour && localParts(w.start).dateKey === now.dateKey);
  // The river scene shows what's on the water today: anything the outlook rates possible or better.
  const onTheWater = days[0].hatches
    .filter((h) => h.peak && h.peak.score >= 0.33)
    .map((h) => ({ hatch: h.hatch, intensity: h.hatch.months[now.month] }));

  return (
    <>
      <SiteHeader />
      <main>
        <section className={styles.head} aria-labelledby="river-title">
          <div className={styles.scene}>
            <RiverScene hatches={onTheWater} density={0.6} />
          </div>
          <div className={styles.headCopy}>
            <Link href="/rivers" className={styles.back}>
              All Gold Medal rivers
            </Link>
            <h1 id="river-title" className={styles.title}>
              {river.name}
            </h1>
            <p className={styles.reach}>
              {river.reach}. {river.kind === "tailwater" ? "Tailwater" : "Freestone"} in the {river.region}.
            </p>
          </div>
        </section>

        <div className={styles.body}>
          <section aria-labelledby="now-title">
            <h2 id="now-title" className={styles.sectionTitle}>
              Right now
            </h2>
            <Readings
              items={[
                { label: "Flow", value: flowValue(c), detail: flowDetail(c) },
                { label: "Compared with normal", value: normalValue(c), detail: normalDetail(c, takenAt) },
                { label: "Water", value: waterValue(c), detail: waterDetail(c) },
                current
                  ? { label: "Weather", value: current.summary, detail: `${current.airF}°F, wind ${current.windMph} mph` }
                  : { label: "Weather", value: "Unavailable", detail: "The forecast didn’t load" },
              ]}
            />
          </section>

          <section aria-labelledby="outlook-title">
            <h2 id="outlook-title" className={styles.sectionTitle}>
              Hatch outlook
            </h2>
            <p className={styles.note}>
              Built from the season, water temperature, and the hourly forecast. Overcast favors olives and midges;
              wind keeps big mayflies down; a warm breeze puts hoppers on the water.
            </p>
            <HatchTimeline days={days} currentHour={now.hour} />
          </section>

          <section aria-labelledby="plan-title">
            <h2 id="plan-title" className={styles.sectionTitle}>
              Plan another day
            </h2>
            <p className={styles.note}>
              Starts from today on {river.name.endsWith("Creek") ? river.name : `the ${river.name}`}. Change the month, water temperature, or time of day to see what
              would be rising.
            </p>
            <RiverPlanner rivers={[plannerRiver(river, snapshot)]} headingLevel={3} />
          </section>

          <p className={styles.source}>
            Flow from {gaugeAgency(river)} gauge{" "}
            <a href={gaugeUrl(river)}>
              {river.gauge.id}, {river.gauge.name}
            </a>
            {c.readAt && `, read ${formatClock(c.readAt)}`}.
            {river.gauge.source === "dwr" && river.gauge.statsId && ` Normal flows from USGS ${river.gauge.statsId}.`}{" "}
            Forecast from the National Weather Service. Hatch timing
            is a starting point from regional charts; check with a local shop before you drive.
          </p>
        </div>
      </main>
    </>
  );
}
