import { cacheLife } from "next/cache";
import { TYPICAL_WATER_F } from "./hatches";
import { RIVERS } from "./rivers";
import { localParts } from "./time";
import { getDwrFlow } from "./dwr";
import { getFlowNormals, getGauges, type FlowNormal, type Reading } from "./usgs";

export type Trend = "rising" | "falling" | "steady";
export type FlowBand = "low" | "normal" | "high";

export interface RiverConditions {
  slug: string;
  flowCfs: number | null;
  /** Change over the last ~24h. */
  trend: Trend | null;
  normal: FlowNormal | null;
  /** Current flow as a percent of the median for today's date. */
  pctOfMedian: number | null;
  band: FlowBand | null;
  waterF: number;
  tempSource: "gauge" | "estimate";
  readAt: string | null;
  coords: [number, number];
}

export interface ConditionsSnapshot {
  /** When this snapshot was taken. Every page derives "today" from this. */
  takenAt: string;
  rivers: Record<string, RiverConditions>;
}

const USGS_IDS = RIVERS.flatMap((r) => (r.gauge.source === "usgs" ? [r.gauge.id] : []));
const STATS_IDS = RIVERS.flatMap((r) =>
  r.gauge.source === "usgs" ? [r.gauge.id] : r.gauge.statsId ? [r.gauge.statsId] : [],
);
const DWR_IDS = RIVERS.flatMap((r) => (r.gauge.source === "dwr" ? [r.gauge.id] : []));

/**
 * Current conditions for every river in one cached snapshot: one USGS IV request,
 * one statistics request. Refreshes every 15 minutes.
 */
export async function getConditions(): Promise<ConditionsSnapshot> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });

  const takenAt = new Date().toISOString();
  const [gauges, normals, dwrFlows] = await Promise.all([
    getGauges(USGS_IDS),
    getFlowNormals(STATS_IDS),
    Promise.all(DWR_IDS.map(getDwrFlow)),
  ]);
  const dwr: Record<string, Reading[]> = Object.fromEntries(DWR_IDS.map((id, i) => [id, dwrFlows[i]]));
  const today = localParts(takenAt);
  const dayKey = `${today.month + 1}-${today.day}`;

  const rivers = Object.fromEntries(
    RIVERS.map((river) => {
      const g = river.gauge;
      const gauge = g.source === "usgs" ? gauges[g.id] : undefined;
      const flow = g.source === "usgs" ? (gauge?.flow ?? []) : (dwr[g.id] ?? []);
      const latest = flow.at(-1) ?? null;
      const tempC = gauge?.tempC.at(-1) ?? null;
      const statsId = g.source === "usgs" ? g.id : g.statsId;
      const normal = (statsId && normals[statsId]?.[dayKey]) || null;
      const pctOfMedian = latest && normal?.p50 ? Math.round((latest.value / normal.p50) * 100) : null;

      const conditions: RiverConditions = {
        slug: river.slug,
        flowCfs: latest ? Math.round(latest.value) : null,
        trend: trendOf(flow.map((r) => r.value)),
        normal,
        pctOfMedian,
        band: latest && normal ? bandOf(latest.value, normal) : null,
        waterF: tempC ? Math.round(tempC.value * 1.8 + 32) : TYPICAL_WATER_F[river.kind][today.month],
        tempSource: tempC ? "gauge" : "estimate",
        readAt: latest?.at ?? tempC?.at ?? null,
        coords: gauge?.coords ?? river.coords,
      };
      return [river.slug, conditions];
    }),
  );

  return { takenAt, rivers };
}

/** Rising or falling when the last 24h moved more than 10%. */
export function trendOf(values: number[]): Trend | null {
  if (values.length < 2) return null;
  const first = values[0];
  const last = values[values.length - 1];
  if (first <= 0) return "steady";
  const change = (last - first) / first;
  if (change > 0.1) return "rising";
  if (change < -0.1) return "falling";
  return "steady";
}

export function bandOf(flow: number, normal: FlowNormal): FlowBand {
  if (flow < normal.p25) return "low";
  if (flow > normal.p75) return "high";
  return "normal";
}
