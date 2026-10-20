import { cacheLife } from "next/cache";
import { TYPICAL_WATER_F } from "./hatches";
import { RIVERS } from "./rivers";
import { localParts } from "./time";
import { getFlowNormals, getGauges, type FlowNormal } from "./usgs";

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

const SITE_IDS = RIVERS.map((r) => r.gauge.id);

/**
 * Current conditions for every river in one cached snapshot: one USGS IV request,
 * one statistics request. Refreshes every 15 minutes.
 */
export async function getConditions(): Promise<ConditionsSnapshot> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });

  const takenAt = new Date().toISOString();
  const [gauges, normals] = await Promise.all([getGauges(SITE_IDS), getFlowNormals(SITE_IDS)]);
  const today = localParts(takenAt);
  const dayKey = `${today.month + 1}-${today.day}`;

  const rivers = Object.fromEntries(
    RIVERS.map((river) => {
      const gauge = gauges[river.gauge.id];
      const flow = gauge?.flow ?? [];
      const latest = flow.at(-1) ?? null;
      const tempC = gauge?.tempC.at(-1) ?? null;
      const normal = normals[river.gauge.id]?.[dayKey] ?? null;
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
