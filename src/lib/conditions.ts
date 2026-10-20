import { cacheLife } from "next/cache";
import { TYPICAL_WATER_F } from "./hatches";

/** USGS 06701900 — South Platte River below Brush Creek near Trumbull (Deckers). */
export const GAUGE = {
  id: "06701900",
  name: "South Platte at Deckers",
  url: "https://waterdata.usgs.gov/monitoring-location/USGS-06701900/",
};

export interface Conditions {
  month: number;
  flowCfs: number | null;
  waterF: number;
  /** "gauge" when USGS reported temperature, "estimate" when it's the monthly typical. */
  tempSource: "gauge" | "estimate";
  /** ISO timestamp of the newest reading, or null if the gauge couldn't be reached. */
  readAt: string | null;
}

interface IvValue {
  value: string;
  dateTime: string;
}
interface IvSeries {
  variable: { variableCode: { value: string }[] };
  values: { value: IvValue[] }[];
}
interface IvResponse {
  value: { timeSeries: IvSeries[] };
}

const denverMonth = (date: Date) =>
  Number(new Intl.DateTimeFormat("en-US", { month: "numeric", timeZone: "America/Denver" }).format(date)) - 1;

function latest(series: IvSeries[], code: string): IvValue | null {
  const match = series.find((s) => s.variable.variableCode[0]?.value === code);
  const values = match?.values[0]?.value ?? [];
  const last = values.at(-1);
  if (!last || Number(last.value) <= -999) return null; // USGS uses -999999 for missing
  return last;
}

/**
 * Current flow and water temperature from the USGS Instantaneous Values service.
 * Cached for 15 minutes. Never throws: falls back to the monthly typical temperature.
 */
export async function getConditions(): Promise<Conditions> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });

  const month = denverMonth(new Date());
  const fallback: Conditions = {
    month,
    flowCfs: null,
    waterF: TYPICAL_WATER_F[month],
    tempSource: "estimate",
    readAt: null,
  };

  try {
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${GAUGE.id}&parameterCd=00010,00060&siteStatus=active`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    if (!res.ok) return fallback;
    const data = (await res.json()) as IvResponse;
    const series = data.value.timeSeries;

    const flow = latest(series, "00060");
    const tempC = latest(series, "00010");

    return {
      month,
      flowCfs: flow ? Math.round(Number(flow.value)) : null,
      waterF: tempC ? Math.round(Number(tempC.value) * 1.8 + 32) : TYPICAL_WATER_F[month],
      tempSource: tempC ? "gauge" : "estimate",
      readAt: flow?.dateTime ?? tempC?.dateTime ?? null,
    };
  } catch {
    return fallback;
  }
}
