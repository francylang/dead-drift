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
  let score = (intensity / 3) * (hatch.order === "crustacean" ? 0.75 : 1);
  // Midges trickle off all day but the real hatch is midday.
  if (hatch.order === "midge" && timeOfDay(hour) !== "afternoon") score *= 0.7;
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

  score = Math.min(1, score);
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

/** Contiguous hours at or above "possible", for one-line summaries: "1p–4p". */
export function windowOf(outlook: HatchOutlook): [number, number] | null {
  const good = outlook.cells.filter((c) => c.score >= 0.33).map((c) => c.hour);
  if (good.length === 0) return null;
  const peak = outlook.peak!.hour;
  let start = peak;
  let end = peak;
  while (good.includes(start - 1)) start--;
  while (good.includes(end + 1)) end++;
  return good.includes(peak) ? [start, end] : null;
}
