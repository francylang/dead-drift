import type { ConditionsSnapshot, RiverConditions } from "./conditions";
import { bestBet } from "./describe";
import { buildOutlook, type DayOutlook } from "./outlook";
import { RIVERS, riverHatches, type River } from "./rivers";
import { localParts } from "./time";
import { getHourlyForecast } from "./weather";

export interface RiverToday {
  river: River;
  conditions: RiverConditions;
  days: DayOutlook[];
  best: ReturnType<typeof bestBet>;
  /** 0–1, for ranking: today's strongest hatch, discounted when the water is blown out. */
  score: number;
}

const FLOW_FACTOR = { normal: 1, low: 0.85, high: 0.5 } as const;

/** Today's outlook for one river, from the shared conditions snapshot plus its forecast. */
export async function riverToday(river: River, snapshot: ConditionsSnapshot): Promise<RiverToday> {
  const c = snapshot.rivers[river.slug];
  const weather = await getHourlyForecast(...c.coords);
  const { month } = localParts(snapshot.takenAt);
  const days = buildOutlook(
    { hatches: riverHatches(river), month, waterF: c.waterF, tempSource: c.tempSource, kind: river.kind, weather },
    snapshot.takenAt,
  );
  // Mysis don't count toward "go fish here today"; they're there every day.
  const peak = days[0].hatches.find((h) => h.hatch.order !== "crustacean")?.peak?.score ?? 0;
  const score = peak * (c.band ? FLOW_FACTOR[c.band] : 0.8);
  return { river, conditions: c, days, best: bestBet(days[0].hatches), score };
}

export async function allRiversToday(snapshot: ConditionsSnapshot): Promise<RiverToday[]> {
  return Promise.all(RIVERS.map((river) => riverToday(river, snapshot)));
}

/** Best rivers to fish today, strongest first. Ties keep the list order. */
export function rankRivers(rivers: RiverToday[]): RiverToday[] {
  return [...rivers].sort((a, b) => b.score - a.score);
}
