import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getConditions } from "@/lib/conditions";
import { flowValue, normalValue, TREND_MARK, waterValue } from "@/lib/describe";
import { formatClock } from "@/lib/time";
import { allRiversToday } from "@/lib/today";
import styles from "./rivers.module.css";

export const metadata: Metadata = {
  title: "Gold Medal rivers — Hatch",
  description: "Live flow, water temperature, and today’s best hatch on Colorado’s Gold Medal rivers.",
};

export default async function RiversPage() {
  const snapshot = await getConditions();
  const { takenAt } = snapshot;
  const rows = await allRiversToday(snapshot);

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <h1 className={styles.title}>Gold Medal rivers</h1>
        <p className={styles.intro}>
          Colorado Parks and Wildlife’s Gold Medal waters with a live stream gauge. Flow and temperature refresh every 15
          minutes; the best bet uses today’s forecast.
        </p>

        <table className={styles.table}>
          <caption className="visually-hidden">Conditions on each river</caption>
          <thead>
            <tr>
              <th scope="col">River</th>
              <th scope="col">Flow</th>
              <th scope="col">
                Of normal<span className="visually-hidden"> (percent of median flow for today’s date)</span>
              </th>
              <th scope="col">Water</th>
              <th scope="col">Best bet today</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ river, conditions: c, best }) => (
              <tr key={river.slug} data-band={c.band ?? undefined}>
                <th scope="row" className={styles.river}>
                  <Link href={`/rivers/${river.slug}`} className={styles.link}>
                    {river.name}
                  </Link>
                  <span className={styles.reach}>{river.reach}</span>
                </th>
                <td className={styles.num}>
                  {flowValue(c)}
                  {c.trend && (
                    <span className={styles.trend} aria-label={c.trend}>
                      {" "}
                      {TREND_MARK[c.trend]}
                    </span>
                  )}
                </td>
                <td className={styles.num} data-band={c.band ?? undefined}>
                  {normalValue(c)}
                </td>
                <td className={styles.num}>
                  {waterValue(c)}
                  {c.tempSource === "estimate" && <span className={styles.est}> est.</span>}
                </td>
                <td>{best ? `${best.hatch.name}, ${best.label}` : <span className={styles.est}>Nymph it</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={styles.source}>
          Flow and temperature from USGS Water Services and Colorado DWR; forecast from the National Weather Service. Snapshot taken{" "}
          {formatClock(takenAt)}. “Est.” means the gauge doesn’t report temperature and the seasonal typical is shown.
        </p>
      </main>
    </>
  );
}
