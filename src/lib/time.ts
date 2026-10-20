export const TIME_ZONE = "America/Denver";

const parts = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  hourCycle: "h23",
});

/** Calendar fields for an instant, in Colorado time. Month is 0-based. */
export function localParts(date: Date | string) {
  const p = Object.fromEntries(parts.formatToParts(new Date(date)).map((x) => [x.type, x.value]));
  return {
    year: Number(p.year),
    month: Number(p.month) - 1,
    day: Number(p.day),
    hour: Number(p.hour),
    /** "YYYY-M-D", for grouping hours by day. */
    dateKey: `${p.year}-${p.month}-${p.day}`,
  };
}

export function formatClock(date: Date | string) {
  return new Date(date).toLocaleString("en-US", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** 6 → "6a", 13 → "1p". */
export function shortHour(hour: number) {
  const h = hour % 12 || 12;
  return `${h}${hour < 12 ? "a" : "p"}`;
}
