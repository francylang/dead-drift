import { cacheLife } from "next/cache";

/**
 * National Weather Service API. Free and keyless, but every request must send a
 * User-Agent that identifies the app. Set NWS_USER_AGENT to add a contact address.
 */
const NWS = "https://api.weather.gov";
const USER_AGENT = process.env.NWS_USER_AGENT ?? "Hatch fly-fishing demo (github.com/francylang/hatch)";
const HEADERS = { "User-Agent": USER_AGENT, Accept: "application/geo+json" };
const TIMEOUT = 8_000;

export interface HourWeather {
  /** ISO start of the hour, with offset. */
  start: string;
  airF: number;
  windMph: number;
  precipPct: number;
  /** 0 (clear) – 1 (overcast), derived from the forecast wording. */
  sky: number;
  summary: string;
}

interface NwsPeriod {
  startTime: string;
  temperature: number | { value: number };
  temperatureUnit?: string;
  windSpeed: string | { value: number };
  probabilityOfPrecipitation?: { value: number | null };
  shortForecast: string;
}

/** Point → grid lookup. The grid for a coordinate rarely changes, so cache it for weeks. */
async function forecastUrl(lat: number, lon: number): Promise<string | null> {
  "use cache";
  cacheLife("weeks");
  try {
    const res = await fetch(`${NWS}/points/${lat.toFixed(4)},${lon.toFixed(4)}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { properties?: { forecastHourly?: string } };
    return data.properties?.forecastHourly ?? null;
  } catch {
    return null;
  }
}

/** Hourly forecast for the next several days. Empty array when NWS is unreachable. */
export async function getHourlyForecast(lat: number, lon: number): Promise<HourWeather[]> {
  "use cache";
  cacheLife("hours");

  const url = await forecastUrl(lat, lon);
  if (!url) return [];
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(TIMEOUT) });
    if (!res.ok) return [];
    const data = (await res.json()) as { properties?: { periods?: NwsPeriod[] } };
    return (data.properties?.periods ?? []).map(toHour);
  } catch {
    return [];
  }
}

function toHour(p: NwsPeriod): HourWeather {
  const temp = typeof p.temperature === "number" ? p.temperature : p.temperature.value;
  return {
    start: p.startTime,
    airF: p.temperatureUnit === "C" ? Math.round(temp * 1.8 + 32) : Math.round(temp),
    windMph: parseWind(p.windSpeed),
    precipPct: p.probabilityOfPrecipitation?.value ?? 0,
    sky: skyCover(p.shortForecast),
    summary: p.shortForecast,
  };
}

/** "5 to 10 mph" → 10. Takes the top of a range. */
export function parseWind(speed: NwsPeriod["windSpeed"]): number {
  if (typeof speed !== "string") return Math.round(speed.value);
  const numbers = speed.match(/\d+/g)?.map(Number) ?? [0];
  return Math.max(...numbers);
}

/**
 * Cloud cover from NWS wording. The hourly endpoint doesn't carry sky cover as a number,
 * but its wording follows a fixed vocabulary, so the mapping is stable.
 */
export function skyCover(summary: string): number {
  const s = summary.toLowerCase();
  if (/rain|snow|shower|storm|drizzle|sleet|fog/.test(s)) return 0.9;
  if (s.includes("mostly cloudy")) return 0.75;
  if (s.includes("partly")) return 0.45;
  if (s.includes("mostly sunny") || s.includes("mostly clear")) return 0.2;
  if (/sunny|clear/.test(s)) return 0.05;
  if (/cloudy|overcast/.test(s)) return 0.9;
  return 0.5;
}
