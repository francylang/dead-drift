import type { Hatch, TimeOfDay } from "./hatches";
import type { RiverKind } from "./rivers";
import { localParts } from "./time";
import type { HourWeather } from "./weather";

/** Fishing hours shown in the outlook, local time. */
export const FIRST_HOUR = 6;
export const LAST_HOUR = 20;

export type Level = "likely" | "possible" | "slight";

export interface HourCell {
  hour: number;
  /** 0–1 */
  score: number;
  level: Level | null;
  /** Short reason when weather moved the score, e.g. "overcast", "windy". */
  reason?: string;
}

export interface HatchOutlook {
  hatch: Hatch;
  cells: HourCell[];
  peak: HourCell | null;
}

export interface DayOutlook {
  dateKey: string;
  label: string;
  hatches: HatchOutlook[];
  weather: (HourWeather & { hour: number })[];
}

export interface OutlookInputs {
  hatches: Hatch[];
  month: number;
  waterF: number;
  /** Diurnal warming is only modeled for estimated temps; a gauge reading is the truth. */
  tempSource: "gauge" | "estimate";
  kind: RiverKind;
  /** Hourly weather. Hours without weather still get a base score. */
  weather: HourWeather[];
}

export function timeOfDay(hour: number): TimeOfDay {
  if (hour < 11) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

/** Freestones warm a few degrees through the afternoon; tailwaters barely move. */
function diurnalOffset(hour: number, kind: RiverKind) {
  if (kind === "tailwater") return 0;
  if (hour < 10) return -1;
  if (hour < 17) return 3;
  return 1;
}

/** Hour each hatch is usually heaviest, local time. */
const PEAK_HOUR: Record<string, number> = {
  trico: 8,
  pmd: 10,
  midge: 13,
  bwo: 14,
  mahogany: 14,
  hopper: 14,
  "golden-stone": 15,
  salmonfly: 15,
  "green-drake": 15,
  "mothers-day-caddis": 16,
  "yellow-sally": 17,
  caddis: 18,
};

export function peakHourOf(hatch: Hatch): number {
  if (PEAK_HOUR[hatch.id] !== undefined) return PEAK_HOUR[hatch.id];
  if (hatch.times.length === 1 && hatch.times[0] === "morning") return 9;
  if (hatch.times.includes("evening") && !hatch.times.includes("morning")) return 17;
  return 14;
}

/** Hatches build to a peak and taper off: 10% per hour from the peak, never below 40%. */
function dayShape(hatch: Hatch, hour: number) {
  if (hatch.order === "crustacean") return 1;
  return Math.max(0.4, 1 - Math.abs(hour - peakHourOf(hatch)) * 0.1);
}

export function levelOf(score: number): Level | null {
  if (score >= 0.66) return "likely";
  if (score >= 0.33) return "possible";
  if (score > 0.05) return "slight";
  return null;
}

/**
 * Scores one hatch for one hour. The base is the river's monthly intensity; the hatch
 * has to be inside its water-temperature window and its time of day. Weather then nudges it:
 * olives and midges like overcast, big mayflies hate wind, hoppers like a breeze and warm air.
 */
export function scoreHour(hatch: Hatch, hour: number, inputs: OutlookInputs, weather?: HourWeather): HourCell {
  const intensity = hatch.months[inputs.month];
  const empty = { hour, score: 0, level: null };
  if (intensity === 0) return empty;
  if (!hatch.times.includes(timeOfDay(hour))) return empty;
  if (hatch.id === "trico" && hour > 10) return empty;

  const water = inputs.waterF + (inputs.tempSource === "estimate" ? diurnalOffset(hour, inputs.kind) : 0);
  if (hatch.waterF && (water < hatch.waterF[0] - 2 || water > hatch.waterF[1] + 2)) return empty;

  // Mysis aren't a hatch: steady food below the dam, never the headline.
  let score = (intensity / 3) * (hatch.order === "crustacean" ? 0.75 : 1) * dayShape(hatch, hour);
  let reason: string | undefined;

  if (weather) {
    const overcast = weather.sky >= 0.7;
    const bright = weather.sky <= 0.25;
    const windy = weather.windMph > 15;

    if (hatch.id === "bwo" || hatch.order === "midge") {
      if (overcast) [score, reason] = [score * 1.3, "overcast"];
      else if (bright) score *= 0.75;
    }
    if (hatch.id === "green-drake" && overcast) [score, reason] = [score * 1.2, "overcast"];
    if (hatch.order === "mayfly" && windy) [score, reason] = [score * 0.7, "windy"];
    if (hatch.order === "caddis" && hour >= 17) score *= 1.15;
    if (hatch.order === "terrestrial") {
      if (weather.airF < 60) [score, reason] = [score * 0.5, "cool"];
      else if (weather.windMph >= 8 && weather.windMph <= 20) [score, reason] = [score * 1.25, "breezy"];
      if (weather.precipPct > 50) score *= 0.6;
    }
    if (hatch.order !== "crustacean" && weather.precipPct > 70 && hatch.id !== "bwo") score *= 0.8;
  }

  // Not capped at 1: a gray afternoon that pushes olives past "peak" should still rank above a sunny one.
  return { hour, score, level: levelOf(score), reason };
}

/** Today and tomorrow, hour by hour, for every hatch on the river. */
export function buildOutlook(inputs: OutlookInputs, now: string): DayOutlook[] {
  const today = localParts(now);
  const tomorrow = localParts(new Date(new Date(now).getTime() + 24 * 3600 * 1000));
  const hours = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, i) => FIRST_HOUR + i);

  const byDay = new Map<string, Map<number, HourWeather>>();
  for (const w of inputs.weather) {
    const p = localParts(w.start);
    if (!byDay.has(p.dateKey)) byDay.set(p.dateKey, new Map());
    byDay.get(p.dateKey)!.set(p.hour, w);
  }

  return [
    { key: today.dateKey, label: "Today" },
    { key: tomorrow.dateKey, label: "Tomorrow" },
  ].map(({ key, label }) => {
    const weatherByHour = byDay.get(key) ?? new Map<number, HourWeather>();
    const hatches = inputs.hatches
      .map((hatch) => {
        const cells = hours.map((h) => scoreHour(hatch, h, inputs, weatherByHour.get(h)));
        const peak = cells.reduce<HourCell | null>((best, c) => (c.score > (best?.score ?? 0) ? c : best), null);
        return { hatch, cells, peak };
      })
      .filter((h) => h.peak)
      .sort((a, b) => b.peak!.score - a.peak!.score);

    const weather = hours.flatMap((hour) => {
      const w = weatherByHour.get(hour);
      return w ? [{ ...w, hour }] : [];
    });

    return { dateKey: key, label, hatches, weather };
  });
}

/**
 * The hatch's best stretch of the day: contiguous hours around the peak scoring at least
 * 85% of it (and at least "possible"). Weather shifts and narrows it; e.g. "1p–4p".
 */
export function windowOf(outlook: HatchOutlook): [number, number] | null {
  const peak = outlook.peak;
  if (!peak) return null;
  const floor = Math.max(0.33, peak.score * 0.85);
  const good = new Set(outlook.cells.filter((c) => c.score >= floor).map((c) => c.hour));
  if (!good.has(peak.hour)) return null;
  let start = peak.hour;
  let end = peak.hour;
  while (good.has(start - 1)) start--;
  while (good.has(end + 1)) end++;
  return [start, end];
}
