import { describe, expect, test } from "vitest";
import { bandOf, trendOf } from "./conditions";
import { HATCH_LIBRARY } from "./hatches";
import { buildOutlook, scoreHour, windowOf, type OutlookInputs } from "./outlook";
import { RIVER_BY_SLUG, RIVERS, riverHatches } from "./rivers";
import { parseStatRdb } from "./usgs";
import { parseWind, skyCover, type HourWeather } from "./weather";

describe("USGS statistics RDB", () => {
  // Verbatim shape of a real response for 09080400 (comment lines trimmed).
  const rdb = [
    "# US Geological Survey",
    "agency_cd\tsite_no\tparameter_cd\tts_id\tloc_web_ds\tmonth_nu\tday_nu\tbegin_yr\tend_yr\tcount_nu\tp25_va\tp50_va\tp75_va",
    "5s\t15s\t5s\t10n\t15s\t3n\t3n\t6n\t6n\t8n\t12s\t12s\t12s",
    "USGS\t09080400\t00060\t18705\t\t1\t1\t1969\t2025\t57\t75\t95\t155",
    "USGS\t09080400\t00060\t18705\t\t10\t20\t1969\t2025\t57\t110\t140\t190",
    "",
  ].join("\n");

  test("keys percentiles by site and month-day", () => {
    const out = parseStatRdb(rdb);
    expect(out["09080400"]["1-1"]).toEqual({ p25: 75, p50: 95, p75: 155, years: 57 });
    expect(out["09080400"]["10-20"].p50).toBe(140);
  });

  test("returns nothing for an empty or error body", () => {
    expect(parseStatRdb("")).toEqual({});
    expect(parseStatRdb("# No sites found")).toEqual({});
  });
});

describe("flow trend and band", () => {
  test("trend needs a >10% move", () => {
    expect(trendOf([100, 105])).toBe("steady");
    expect(trendOf([100, 130])).toBe("rising");
    expect(trendOf([100, 80])).toBe("falling");
    expect(trendOf([100])).toBeNull();
  });

  test("band compares against the 25th and 75th percentiles", () => {
    const normal = { p25: 80, p50: 100, p75: 140, years: 30 };
    expect(bandOf(60, normal)).toBe("low");
    expect(bandOf(100, normal)).toBe("normal");
    expect(bandOf(200, normal)).toBe("high");
  });
});

describe("NWS parsing", () => {
  test("wind takes the top of a range", () => {
    expect(parseWind("5 to 10 mph")).toBe(10);
    expect(parseWind("7 mph")).toBe(7);
    expect(parseWind({ value: 12.4 })).toBe(12);
  });

  test("sky cover from forecast wording", () => {
    expect(skyCover("Sunny")).toBeLessThan(0.1);
    expect(skyCover("Mostly Sunny")).toBe(0.2);
    expect(skyCover("Partly Cloudy")).toBe(0.45);
    expect(skyCover("Mostly Cloudy")).toBe(0.75);
    expect(skyCover("Chance Rain Showers")).toBe(0.9);
  });
});

describe("rivers", () => {
  test("every river's hatches resolve to the library", () => {
    for (const river of RIVERS) {
      for (const hatch of riverHatches(river)) expect(hatch, `${river.slug}`).toBeDefined();
    }
  });

  test("slugs are unique", () => {
    expect(new Set(RIVERS.map((r) => r.slug)).size).toBe(RIVERS.length);
  });

  test("per-river timing overrides the library", () => {
    const pan = riverHatches(RIVER_BY_SLUG.fryingpan);
    expect(pan.find((h) => h.id === "green-drake")!.months[7]).toBe(3);
  });
});

describe("outlook", () => {
  const hour = (h: number, w: Partial<HourWeather> = {}): HourWeather => ({
    start: `2026-10-20T${String(h).padStart(2, "0")}:00:00-06:00`,
    airF: 58,
    windMph: 5,
    precipPct: 0,
    sky: 0.5,
    summary: "Partly Cloudy",
    ...w,
  });
  const base: OutlookInputs = {
    hatches: riverHatches(RIVER_BY_SLUG["south-platte-deckers"]),
    month: 9,
    waterF: 48,
    tempSource: "gauge",
    kind: "tailwater",
    weather: [],
  };
  const bwo = HATCH_LIBRARY.bwo;

  test("overcast boosts olives, sun suppresses them", () => {
    const gray = scoreHour(bwo, 14, base, hour(14, { sky: 0.9 }));
    const sunny = scoreHour(bwo, 14, base, hour(14, { sky: 0.05 }));
    expect(gray.score).toBeGreaterThan(sunny.score);
    expect(gray.reason).toBe("overcast");
  });

  test("hatches stay inside their time of day and temperature window", () => {
    expect(scoreHour(bwo, 8, base).score).toBe(0); // olives are an afternoon hatch
    expect(scoreHour(bwo, 14, { ...base, waterF: 34 }).score).toBe(0); // too cold
    expect(scoreHour(HATCH_LIBRARY.trico, 14, { ...base, month: 7, waterF: 60 }).score).toBe(0);
  });

  test("builds today and tomorrow with a contiguous peak window", () => {
    const weather = Array.from({ length: 15 }, (_, i) => hour(6 + i, { sky: 0.85 }));
    const [today, tomorrow] = buildOutlook({ ...base, weather }, "2026-10-20T08:00:00-06:00");
    expect(today.label).toBe("Today");
    expect(tomorrow.label).toBe("Tomorrow");
    const olives = today.hatches.find((h) => h.hatch.id === "bwo")!;
    expect(windowOf(olives)).toEqual([13, 15]);
    expect(today.weather).toHaveLength(15);
  });

  test("clouds arriving late push the olive window later", () => {
    const weather = Array.from({ length: 15 }, (_, i) => hour(6 + i, { sky: 6 + i >= 15 ? 0.85 : 0.45 }));
    const [today] = buildOutlook({ ...base, weather }, "2026-10-20T08:00:00-06:00");
    const olives = today.hatches.find((h) => h.hatch.id === "bwo")!;
    expect(windowOf(olives)).toEqual([14, 16]);
  });
});

describe("ranking", () => {
  test("strongest hatch first, ties keep list order", async () => {
    const { rankRivers } = await import("./today");
    const r = (slug: string, score: number) => ({ river: RIVER_BY_SLUG[slug], score }) as never;
    const ranked = rankRivers([r("blue", 0.4), r("fryingpan", 0.9), r("taylor", 0.4)]);
    expect(ranked.map((x: { river: { slug: string } }) => x.river.slug)).toEqual(["fryingpan", "blue", "taylor"]);
  });
});

describe("Colorado DWR timestamps", () => {
  test("attach MDT in summer and MST in winter", async () => {
    const { withDenverOffset } = await import("./dwr");
    expect(withDenverOffset("2026-10-20T13:15:00")).toBe("2026-10-20T13:15:00-06:00");
    expect(withDenverOffset("2026-12-20T13:15:00")).toBe("2026-12-20T13:15:00-07:00");
  });
});
