import { cacheLife } from "next/cache";

/**
 * USGS Water Services. No API key. Two calls cover every river:
 *  - Instantaneous Values (IV): last 24h of flow (00060) and water temp (00010)
 *  - Statistics: daily flow percentiles for each day of the year
 * Both are cached and never throw; callers get empty results when USGS is unreachable.
 */

const IV = "https://waterservices.usgs.gov/nwis/iv/";
const STAT = "https://waterservices.usgs.gov/nwis/stat/";
const TIMEOUT = 8_000;

export interface Reading {
  value: number;
  at: string;
}

export interface GaugeSeries {
  siteId: string;
  name: string;
  coords: [number, number] | null;
  flow: Reading[];
  /** Water temperature in °C, newest last. Empty when the gauge doesn't report it. */
  tempC: Reading[];
}

interface IvValue {
  value: string;
  dateTime: string;
}
interface IvSeries {
  sourceInfo: {
    siteName: string;
    siteCode: { value: string }[];
    geoLocation?: { geogLocation?: { latitude: number; longitude: number } };
  };
  variable: { variableCode: { value: string }[]; noDataValue?: number };
  values: { value: IvValue[] }[];
}

function readings(series: IvSeries): Reading[] {
  const noData = series.variable.noDataValue ?? -999999;
  return (series.values[0]?.value ?? [])
    .map((v) => ({ value: Number(v.value), at: v.dateTime }))
    .filter((r) => Number.isFinite(r.value) && r.value !== noData);
}

/** Last 24 hours of flow and water temperature for the given sites, keyed by site id. */
export async function getGauges(siteIds: string[]): Promise<Record<string, GaugeSeries>> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });

  const url = `${IV}?format=json&sites=${siteIds.join(",")}&parameterCd=00060,00010&period=P1D&siteStatus=all`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
    if (!res.ok) return {};
    const data = (await res.json()) as { value: { timeSeries: IvSeries[] } };

    const gauges: Record<string, GaugeSeries> = {};
    for (const series of data.value.timeSeries) {
      const siteId = series.sourceInfo.siteCode[0]?.value;
      if (!siteId) continue;
      const geo = series.sourceInfo.geoLocation?.geogLocation;
      const gauge = (gauges[siteId] ??= {
        siteId,
        name: series.sourceInfo.siteName,
        coords: geo ? [geo.latitude, geo.longitude] : null,
        flow: [],
        tempC: [],
      });
      const code = series.variable.variableCode[0]?.value;
      if (code === "00060") gauge.flow = readings(series);
      if (code === "00010") gauge.tempC = readings(series);
    }
    return gauges;
  } catch {
    return {};
  }
}

export interface FlowNormal {
  p25: number;
  p50: number;
  p75: number;
  /** Years of record behind the numbers. */
  years: number;
}

/**
 * Daily flow percentiles for each site, keyed by site id, then "M-D" (e.g. "10-20").
 * Changes once a year at most, so it's cached for a week.
 */
export async function getFlowNormals(siteIds: string[]): Promise<Record<string, Record<string, FlowNormal>>> {
  "use cache";
  cacheLife("weeks");

  // The statistics service limits sites per request, so ask in batches of 10.
  const batches = Array.from({ length: Math.ceil(siteIds.length / 10) }, (_, i) => siteIds.slice(i * 10, i * 10 + 10));
  const results = await Promise.all(
    batches.map(async (batch) => {
      const url = `${STAT}?format=rdb&sites=${batch.join(",")}&statReportType=daily&statTypeCd=p25,p50,p75&parameterCd=00060`;
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
        return res.ok ? parseStatRdb(await res.text()) : {};
      } catch {
        return {};
      }
    }),
  );
  return Object.assign({}, ...results);
}

/** Parses the USGS RDB (tab-separated) statistics format. Exported for tests. */
export function parseStatRdb(text: string): Record<string, Record<string, FlowNormal>> {
  const lines = text.split("\n").filter((l) => l && !l.startsWith("#"));
  if (lines.length < 3) return {};

  const header = lines[0].split("\t");
  const col = (name: string) => header.indexOf(name);
  const [site, month, day, p25, p50, p75, begin, end] = [
    "site_no", "month_nu", "day_nu", "p25_va", "p50_va", "p75_va", "begin_yr", "end_yr",
  ].map(col);

  const out: Record<string, Record<string, FlowNormal>> = {};
  // lines[1] is the column-format row (e.g. "5s 15s ..."); data starts at lines[2].
  for (const line of lines.slice(2)) {
    const cells = line.split("\t");
    const median = Number(cells[p50]);
    if (!cells[site] || !Number.isFinite(median) || cells[p50] === "") continue;
    // A site can report more than one time series; keep the first one we see per day.
    const key = `${cells[month]}-${cells[day]}`;
    (out[cells[site]] ??= {})[key] ??= {
      p25: Number(cells[p25]),
      p50: median,
      p75: Number(cells[p75]),
      years: Number(cells[end]) - Number(cells[begin]) + 1,
    };
  }
  return out;
}
