/**
 * Hatch library. HATCHES is the South Platte set (Deckers / Cheesman Canyon), with timing
 * and hook sizes from The Fly Fishing Place's South Platte chart. RIVER_HATCHES adds the
 * signature hatches of other Gold Medal waters; rivers.ts picks from both and can override
 * monthly timing per river. Water-temperature windows are approximate working ranges.
 */

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export type Order = "mayfly" | "caddis" | "stonefly" | "midge" | "terrestrial" | "crustacean";
export type TimeOfDay = "morning" | "afternoon" | "evening";

/** 0 = absent, 1 = sparse, 2 = good, 3 = peak */
export type Intensity = 0 | 1 | 2 | 3;

export interface Hatch {
  id: string;
  name: string;
  /** Plural as it reads mid-sentence, e.g. "blue-winged olives", "PMDs". */
  plural: string;
  taxon: string;
  order: Order;
  hooks: string;
  /** Intensity by month, Jan–Dec. */
  months: [Intensity, Intensity, Intensity, Intensity, Intensity, Intensity,
           Intensity, Intensity, Intensity, Intensity, Intensity, Intensity];
  /** Water temperature window in °F. Null when water temp doesn't gate it (terrestrials, mysis). */
  waterF: [number, number] | null;
  times: TimeOfDay[];
  note: string;
}

export const HATCHES: Hatch[] = [
  {
    id: "midge",
    plural: "midges",
    name: "Midges",
    taxon: "Chironomidae",
    order: "midge",
    hooks: "20–24",
    months: [3, 3, 3, 2, 1, 1, 1, 1, 1, 2, 3, 3],
    waterF: [34, 52],
    times: ["morning", "afternoon", "evening"],
    note: "Pupa under an adult on calm, gray afternoons.",
  },
  {
    id: "bwo",
    plural: "blue-winged olives",
    name: "Blue-winged olive",
    taxon: "Baetis",
    order: "mayfly",
    hooks: "18–22",
    months: [1, 1, 2, 2, 1, 0, 0, 0, 3, 3, 2, 1],
    waterF: [40, 56],
    times: ["afternoon"],
    note: "Best on overcast afternoons. Sparse duns, emergers in the film.",
  },
  {
    id: "caddis",
    plural: "caddis",
    name: "Caddis",
    taxon: "Trichoptera",
    order: "caddis",
    hooks: "14–18",
    months: [0, 0, 1, 3, 2, 2, 2, 1, 0, 0, 0, 0],
    waterF: [50, 64],
    times: ["afternoon", "evening"],
    note: "Tan and dark early. Elk hair caddis skated in the evening.",
  },
  {
    id: "pmd",
    plural: "PMDs",
    name: "Pale morning dun",
    taxon: "Ephemerella",
    order: "mayfly",
    hooks: "16–18",
    months: [0, 0, 0, 1, 3, 3, 2, 1, 0, 0, 0, 0],
    waterF: [52, 62],
    times: ["morning"],
    note: "Pheasant tail dropper until the duns show.",
  },
  {
    id: "golden-stone",
    plural: "golden stones",
    name: "Golden stonefly",
    taxon: "Perlidae",
    order: "stonefly",
    hooks: "8–12",
    months: [0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0],
    waterF: [50, 60],
    times: ["afternoon"],
    note: "Nymphs in fast water in May, dries along the banks in June.",
  },
  {
    id: "yellow-sally",
    plural: "yellow sallies",
    name: "Yellow sally",
    taxon: "Isoperla",
    order: "stonefly",
    hooks: "14–18",
    months: [0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0],
    waterF: [52, 64],
    times: ["afternoon", "evening"],
    note: "Riffles. Small yellow stimulator.",
  },
  {
    id: "trico",
    plural: "tricos",
    name: "Trico",
    taxon: "Tricorythodes",
    order: "mayfly",
    hooks: "20–24",
    months: [0, 0, 0, 0, 0, 0, 3, 3, 2, 0, 0, 0],
    waterF: [56, 68],
    times: ["morning"],
    note: "Early spinner falls on flat water. 6X or 7X.",
  },
  {
    id: "mahogany",
    plural: "mahogany duns",
    name: "Mahogany dun",
    taxon: "Paraleptophlebia",
    order: "mayfly",
    hooks: "14–16",
    months: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0],
    waterF: [46, 58],
    times: ["afternoon"],
    note: "A second fall dry alongside BWOs.",
  },
  {
    id: "hopper",
    plural: "hoppers",
    name: "Hoppers",
    taxon: "Acrididae",
    order: "terrestrial",
    hooks: "8–12",
    months: [0, 0, 0, 0, 0, 0, 2, 3, 1, 0, 0, 0],
    waterF: null,
    times: ["afternoon"],
    note: "Meadow edges and grassy banks on windy afternoons.",
  },
];

/** Signature hatches of other Gold Medal waters. */
export const RIVER_HATCHES: Hatch[] = [
  {
    id: "mothers-day-caddis",
    plural: "Mother’s Day caddis",
    name: "Mother’s Day caddis",
    taxon: "Brachycentrus",
    order: "caddis",
    hooks: "14–16",
    months: [0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    waterF: [51, 58],
    times: ["afternoon", "evening"],
    note: "Starts near 54°F. Blizzard hatches move upstream daily; nymph before the rise.",
  },
  {
    id: "salmonfly",
    plural: "salmonflies",
    name: "Salmonfly",
    taxon: "Pteronarcys californica",
    order: "stonefly",
    hooks: "4–8",
    months: [0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0],
    waterF: [48, 60],
    times: ["afternoon"],
    note: "Big foam dries tight to the banks. Short window, worth planning around.",
  },
  {
    id: "green-drake",
    plural: "green drakes",
    name: "Green drake",
    taxon: "Drunella grandis",
    order: "mayfly",
    hooks: "10–12",
    months: [0, 0, 0, 0, 0, 1, 3, 2, 1, 0, 0, 0],
    waterF: [48, 60],
    times: ["afternoon", "evening"],
    note: "Big, slow duns that bring up the best fish. Cloudy afternoons are prime.",
  },
  {
    id: "mysis",
    plural: "mysis shrimp",
    name: "Mysis shrimp",
    taxon: "Mysis diluviana",
    order: "crustacean",
    hooks: "16–20",
    months: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    waterF: null,
    times: ["morning", "afternoon", "evening"],
    note: "Not a hatch. Washed through the dam year-round; strongest in the first mile.",
  },
];

/** Every hatch the app knows about, by id. */
export const HATCH_LIBRARY: Record<string, Hatch> = Object.fromEntries(
  [...HATCHES, ...RIVER_HATCHES].map((h) => [h.id, h]),
);

export interface RiverState {
  month: number; // 0–11
  waterF: number;
  time: TimeOfDay;
}

export interface ActiveHatch {
  hatch: Hatch;
  intensity: Intensity;
}

/**
 * What's likely on the water: in season, inside its temperature window
 * (terrestrials ignore water temp), and at the right time of day.
 * Sorted strongest first.
 */
export function activeHatches({ month, waterF, time }: RiverState, hatches: Hatch[] = HATCHES): ActiveHatch[] {
  return hatches.flatMap((hatch) => {
    const intensity = hatch.months[month];
    if (intensity === 0) return [];
    if (!hatch.times.includes(time)) return [];
    if (hatch.waterF && (waterF < hatch.waterF[0] || waterF > hatch.waterF[1])) return [];
    return [{ hatch, intensity }];
  }).sort((a, b) => b.intensity - a.intensity);
}

/** Everything in season for a month, ignoring temperature and time. Used by the landing hero. */
export function seasonalHatches(month: number, hatches: Hatch[] = HATCHES): ActiveHatch[] {
  return hatches.flatMap((hatch) =>
    hatch.months[month] > 0 ? [{ hatch, intensity: hatch.months[month] }] : [],
  ).sort((a, b) => b.intensity - a.intensity);
}

/**
 * Typical water temperature by month, °F, used when a gauge doesn't report one.
 * Rough, and always labeled as an estimate in the UI. Bottom-release tailwaters
 * stay cool in summer and ice-free in winter; freestones swing with the seasons.
 */
export const TYPICAL_WATER_F = {
  tailwater: [39, 39, 40, 42, 45, 48, 51, 53, 52, 49, 44, 40],
  freestone: [33, 33, 36, 41, 46, 50, 57, 59, 53, 45, 38, 34],
} as const;

/** How much is hatching each month, 0–1 relative to the busiest month. */
export function activityByMonth(hatches: Hatch[] = HATCHES): number[] {
  const totals = MONTHS.map((_, i) =>
    hatches.reduce((sum, h) => sum + (h.order === "crustacean" ? 0 : h.months[i]), 0),
  );
  const max = Math.max(1, ...totals);
  return totals.map((t) => t / max);
}
