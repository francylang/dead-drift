import type { PlannerRiver } from "@/components/RiverPlanner/RiverPlanner";
import type { ConditionsSnapshot } from "./conditions";
import { riverHatches, type River } from "./rivers";
import { localParts } from "./time";

/** Everything the client-side planner needs for one river, seeded from the live snapshot. */
export function plannerRiver(river: River, snapshot: ConditionsSnapshot): PlannerRiver {
  const { month } = localParts(snapshot.takenAt);
  return {
    slug: river.slug,
    name: river.name,
    reach: river.reach,
    region: river.region,
    hatches: riverHatches(river),
    today: { month, waterF: snapshot.rivers[river.slug].waterF, time: "afternoon" },
  };
}
