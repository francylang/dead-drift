import { cacheLife } from "next/cache";
import { TIME_ZONE } from "./time";
import type { Reading } from "./usgs";

/**
 * Colorado Division of Water Resources telemetry (CDSS REST API). Covers stations USGS
 * runs only seasonally, like the Arkansas at Salida. Keyless with daily anonymous limits;
 * one cached request per station per 15 minutes stays far under them.
 */
const DWR = "https://dwr.state.co.us/Rest/GET/api/v2/telemetrystations/telemetrytimeseriesraw/";
const TIMEOUT = 8_000;

interface DwrRow {
  measDateTime: string;
  measValue: number | null;
}

/** Last ~24h of discharge (cfs) for a DWR station abbreviation, oldest first. */
export async function getDwrFlow(abbrev: string): Promise<Reading[]> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });

  const since = new Date(Date.now() - 26 * 3600 * 1000);
  const startDate = since.toLocaleDateString("en-US", { timeZone: TIME_ZONE });
  const url = `${DWR}?format=json&abbrev=${encodeURIComponent(abbrev)}&parameter=DISCHRG&startDate=${startDate}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
    if (!res.ok) return [];
    const data = (await res.json()) as { ResultList?: DwrRow[] };
    return (data.ResultList ?? [])
      .filter((r) => typeof r.measValue === "number" && r.measValue >= 0)
      .map((r) => ({ value: r.measValue as number, at: withDenverOffset(r.measDateTime) }))
      .filter((r) => Date.parse(r.at) >= since.getTime() + 2 * 3600 * 1000)
      .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  } catch {
    return [];
  }
}

/** DWR timestamps are Colorado local time with no offset; attach the right one (MST or MDT). */
export function withDenverOffset(local: string): string {
  const guess = new Date(`${local}Z`);
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, timeZoneName: "longOffset" })
    .formatToParts(guess)
    .find((p) => p.type === "timeZoneName")?.value; // e.g. "GMT-06:00"
  const offset = name?.replace("GMT", "") || "-07:00";
  return `${local.slice(0, 19)}${offset}`;
}
