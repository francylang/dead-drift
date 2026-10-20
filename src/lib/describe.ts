import type { RiverConditions } from "./conditions";
import { MONTHS } from "./hatches";
import { windowOf, type HatchOutlook } from "./outlook";
import { localParts, shortHour } from "./time";

/** Plain-language strings for conditions, shared by every page that shows them. */

export const flowValue = (c: RiverConditions) => (c.flowCfs === null ? "Unavailable" : `${c.flowCfs.toLocaleString("en-US")} cfs`);

export function flowDetail(c: RiverConditions) {
  if (c.flowCfs === null) return "The gauge didn’t respond";
  if (!c.trend) return "No 24-hour trend yet";
  return { rising: "Rising over 24 hours", falling: "Falling over 24 hours", steady: "Steady over 24 hours" }[c.trend];
}

export const TREND_MARK = { rising: "↑", falling: "↓", steady: "→" } as const;

export const normalValue = (c: RiverConditions) => (c.pctOfMedian === null ? "No record" : `${c.pctOfMedian}%`);

export function normalDetail(c: RiverConditions, takenAt: string) {
  if (!c.normal || c.pctOfMedian === null) return "No long-term record for this date";
  const { month, day } = localParts(takenAt);
  const band = { low: "Low for the date", normal: "Normal range", high: "High for the date" }[c.band ?? "normal"];
  return `${band}. Median for ${MONTHS[month]} ${day} is ${c.normal.p50.toLocaleString("en-US")} cfs.`;
}

export const waterValue = (c: RiverConditions) => `${c.waterF}°F`;

export const waterDetail = (c: RiverConditions) =>
  c.tempSource === "gauge" ? "From the gauge" : "Estimated for the season";

/** "Olives 11a–4p" for the strongest hatch, or null. */
export function bestBet(outlooks: HatchOutlook[]) {
  for (const outlook of outlooks) {
    const window = windowOf(outlook);
    if (window) {
      const [start, end] = window;
      return { hatch: outlook.hatch, label: start === end ? shortHour(start) : `${shortHour(start)}–${shortHour(end + 1)}` };
    }
  }
  return null;
}
