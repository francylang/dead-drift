import { HATCH_LIBRARY, type Hatch } from "./hatches";

type Months = Hatch["months"];

export type RiverKind = "tailwater" | "freestone";

export interface River {
  slug: string;
  name: string;
  /** The Gold Medal reach this page covers, in the angler's terms. */
  reach: string;
  region: string;
  kind: RiverKind;
  /** USGS site number for the gauge used for flow (and temperature, where reported). */
  gauge: { id: string; name: string };
  /** Fallback coordinates for the weather forecast when the gauge can't be reached. */
  coords: [lat: number, lon: number];
  /** Hatch ids from the library, with optional per-river monthly timing. */
  hatches: (string | { id: string; months: Months })[];
}

const m = (...months: number[]) => months as Months;

/**
 * Colorado Gold Medal river reaches with a USGS gauge. The Dream Stream and the
 * Middle Fork of the South Platte only have state (DWR) telemetry and come later.
 * Per-river timing beyond the South Platte draws on regional hatch charts and shop
 * reports; it's a starting point, not a guarantee.
 */
export const RIVERS: River[] = [
  {
    slug: "south-platte-deckers",
    name: "South Platte",
    reach: "Cheesman Canyon to Deckers",
    region: "Front Range",
    kind: "tailwater",
    gauge: { id: "06701900", name: "South Platte below Brush Creek near Trumbull" },
    coords: [39.26, -105.222],
    hatches: ["midge", "bwo", "caddis", "pmd", "golden-stone", "yellow-sally", "trico", "mahogany", "hopper"],
  },
  {
    slug: "arkansas",
    name: "Arkansas",
    reach: "Lake Fork to Parkdale",
    region: "Upper Arkansas",
    kind: "freestone",
    gauge: { id: "07091200", name: "Arkansas River near Nathrop" },
    coords: [38.745, -106.077],
    hatches: ["midge", "bwo", "mothers-day-caddis", "caddis", "pmd", "golden-stone", "yellow-sally", "hopper"],
  },
  {
    slug: "fryingpan",
    name: "Fryingpan",
    reach: "Ruedi Dam to the Roaring Fork",
    region: "Roaring Fork Valley",
    kind: "tailwater",
    gauge: { id: "09080400", name: "Fryingpan River near Ruedi" },
    coords: [39.365, -106.823],
    hatches: [
      "midge",
      "mysis",
      { id: "bwo", months: m(0, 2, 3, 1, 0, 0, 0, 1, 2, 3, 2, 0) },
      { id: "pmd", months: m(0, 0, 0, 0, 0, 0, 3, 3, 1, 0, 0, 0) },
      { id: "green-drake", months: m(0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 0) },
      { id: "salmonfly", months: m(0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0) },
      "yellow-sally",
      "caddis",
      "hopper",
    ],
  },
  {
    slug: "roaring-fork",
    name: "Roaring Fork",
    reach: "Basalt to Glenwood Springs",
    region: "Roaring Fork Valley",
    kind: "freestone",
    gauge: { id: "09085000", name: "Roaring Fork River at Glenwood Springs" },
    coords: [39.544, -107.329],
    hatches: [
      "midge",
      "bwo",
      "caddis",
      "pmd",
      { id: "green-drake", months: m(0, 0, 0, 0, 0, 2, 3, 1, 0, 0, 0, 0) },
      "golden-stone",
      "yellow-sally",
      "hopper",
    ],
  },
  {
    slug: "blue",
    name: "Blue",
    reach: "Dillon Dam through Silverthorne",
    region: "Summit County",
    kind: "tailwater",
    gauge: { id: "09050700", name: "Blue River below Dillon" },
    coords: [39.626, -106.066],
    hatches: ["midge", "mysis", "bwo", "pmd", "caddis"],
  },
  {
    slug: "colorado",
    name: "Colorado",
    reach: "Windy Gap to Kremmling",
    region: "Middle Park",
    kind: "freestone",
    gauge: { id: "09058000", name: "Colorado River near Kremmling" },
    coords: [40.037, -106.44],
    hatches: [
      "midge",
      "bwo",
      "caddis",
      { id: "salmonfly", months: m(0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0) },
      "golden-stone",
      "pmd",
      "yellow-sally",
      "trico",
      "hopper",
    ],
  },
  {
    slug: "gunnison-black-canyon",
    name: "Gunnison",
    reach: "Black Canyon and Gunnison Gorge",
    region: "Gunnison Basin",
    kind: "tailwater",
    gauge: { id: "09128000", name: "Gunnison River below Gunnison Tunnel" },
    coords: [38.529, -107.649],
    hatches: [
      "midge",
      "bwo",
      { id: "salmonfly", months: m(0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0) },
      "golden-stone",
      "pmd",
      "caddis",
      "yellow-sally",
      "mahogany",
      "hopper",
    ],
  },
  {
    slug: "gunnison-upper",
    name: "Gunnison",
    reach: "Almont to Twin Bridges",
    region: "Gunnison Basin",
    kind: "freestone",
    gauge: { id: "09114500", name: "Gunnison River near Gunnison" },
    coords: [38.542, -106.949],
    hatches: [
      "midge",
      "bwo",
      "caddis",
      "pmd",
      "yellow-sally",
      { id: "hopper", months: m(0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 0) },
    ],
  },
  {
    slug: "taylor",
    name: "Taylor",
    reach: "Below Taylor Park Reservoir",
    region: "Gunnison Basin",
    kind: "tailwater",
    gauge: { id: "09109000", name: "Taylor River below Taylor Park Reservoir" },
    coords: [38.818, -106.609],
    hatches: ["midge", "mysis", "bwo", "pmd", "caddis"],
  },
  {
    slug: "rio-grande",
    name: "Rio Grande",
    reach: "South Fork to Del Norte",
    region: "San Luis Valley",
    kind: "freestone",
    gauge: { id: "08220000", name: "Rio Grande near Del Norte" },
    coords: [37.69, -106.46],
    hatches: [
      "midge",
      "bwo",
      "caddis",
      { id: "salmonfly", months: m(0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0, 0) },
      "golden-stone",
      "pmd",
      "hopper",
    ],
  },
  {
    slug: "animas",
    name: "Animas",
    reach: "Through Durango",
    region: "Southwest",
    kind: "freestone",
    gauge: { id: "09361500", name: "Animas River at Durango" },
    coords: [37.279, -107.88],
    hatches: ["midge", "bwo", "caddis", "golden-stone", "pmd", "hopper"],
  },
  {
    slug: "north-platte",
    name: "North Platte",
    reach: "Northgate Canyon to Wyoming",
    region: "North Park",
    kind: "freestone",
    gauge: { id: "06620000", name: "North Platte River near Northgate" },
    coords: [40.937, -106.338],
    hatches: ["midge", "bwo", "caddis", "golden-stone", "pmd", "yellow-sally", "hopper"],
  },
  {
    slug: "gore-creek",
    name: "Gore Creek",
    reach: "Red Sandstone Creek to the Eagle",
    region: "Vail Valley",
    kind: "freestone",
    gauge: { id: "09066325", name: "Gore Creek above Red Sandstone Creek at Vail" },
    coords: [39.64, -106.385],
    hatches: ["midge", "bwo", "caddis", "pmd", "golden-stone", "yellow-sally"],
  },
];

export const RIVER_BY_SLUG = Object.fromEntries(RIVERS.map((r) => [r.slug, r]));

/** The river's hatches with any per-river timing applied. */
export function riverHatches(river: River): Hatch[] {
  return river.hatches.map((entry) => {
    if (typeof entry === "string") return HATCH_LIBRARY[entry];
    return { ...HATCH_LIBRARY[entry.id], months: entry.months };
  });
}
