"use client";

import { useEffect, useRef, useState } from "react";
import { Insect } from "@/components/Insect/Insect";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { StrengthKey } from "@/components/StrengthKey/StrengthKey";
import { FIRST_HOUR, LAST_HOUR, type DayOutlook, type Level } from "@/lib/outlook";
import { shortHour } from "@/lib/time";
import styles from "./HatchTimeline.module.css";

const HOURS = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, i) => FIRST_HOUR + i);
const LEVEL_TEXT: Record<Level, string> = { likely: "Likely", possible: "Possible", slight: "Slight" };

export interface HatchTimelineProps {
  days: DayOutlook[];
  /** Local hour now. Earlier hours on the first day are dimmed. */
  currentHour?: number;
}

/**
 * Hour-by-hour hatch outlook as a real table: hatches are rows, hours are columns,
 * bar height shows how likely each hatch is. Screen readers get the level as text in every cell.
 */
export function HatchTimeline({ days, currentHour }: HatchTimelineProps) {
  const [dayKey, setDayKey] = useState(days[0]?.dateKey);
  const scroller = useRef<HTMLDivElement>(null);
  const index = Math.max(0, days.findIndex((d) => d.dateKey === dayKey));

  // On narrow screens the grid scrolls sideways; open today's view at the current hour, not 6 a.m.
  useEffect(() => {
    const el = scroller.current;
    if (!el || index !== 0 || currentHour === undefined || el.scrollWidth <= el.clientWidth) return;
    const col = el.querySelector<HTMLElement>(`[data-hour="${Math.max(FIRST_HOUR, currentHour - 1)}"]`);
    const sticky = el.querySelector<HTMLElement>("th[scope='col']");
    if (col && sticky) el.scrollLeft = col.offsetLeft - sticky.offsetWidth;
  }, [index, currentHour]);
  const day = days[index];
  if (!day) return null;

  const isPast = (hour: number) => index === 0 && currentHour !== undefined && hour < currentHour;

  return (
    <div className={styles.timeline}>
      <SegmentedControl
        label="Day"
        options={days.map((d) => ({ value: d.dateKey, label: d.label }))}
        value={day.dateKey}
        onChange={setDayKey}
      />

      {day.hatches.length === 0 ? (
        <p className={styles.empty}>
          No hatches expected {day.label.toLowerCase()}. Fish nymphs and midge larvae deep and slow.
        </p>
      ) : (
        <div ref={scroller} className={styles.scroller}>
          <table className={styles.grid}>
            <caption className="visually-hidden">
              Hourly hatch outlook, {day.label.toLowerCase()}. Each cell gives how likely the hatch is that hour.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.corner}>
                  <span className="visually-hidden">Hatch</span>
                </th>
                {HOURS.map((h) => (
                  <th key={h} scope="col" className={styles.hour} data-hour={h} data-past={isPast(h) || undefined}>
                    {shortHour(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {day.hatches.map(({ hatch, cells }) => (
                <tr key={hatch.id}>
                  <th scope="row" className={styles.name}>
                    <Insect order={hatch.order} size={28} color="var(--color-action)" />
                    <span>{hatch.name}</span>
                  </th>
                  {cells.map((cell) => (
                    <td key={cell.hour} className={styles.cell} data-past={isPast(cell.hour) || undefined}>
                      {cell.level && <span className={styles.fill} data-level={cell.level} />}
                      <span className="visually-hidden">
                        {cell.level ? LEVEL_TEXT[cell.level] : "None"}
                        {cell.reason ? `, ${cell.reason}` : ""}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {day.weather.length > 0 && (
              <tfoot>
                <tr>
                  <th scope="row" className={styles.weatherLabel}>
                    Air
                  </th>
                  {HOURS.map((h) => {
                    const w = day.weather.find((x) => x.hour === h);
                    return (
                      <td key={h} className={styles.weather} data-past={isPast(h) || undefined}>
                        {w ? `${w.airF}°` : ""}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <th scope="row" className={styles.weatherLabel}>
                    Wind
                  </th>
                  {HOURS.map((h) => {
                    const w = day.weather.find((x) => x.hour === h);
                    return (
                      <td key={h} className={styles.weather} data-past={isPast(h) || undefined}>
                        {w ? w.windMph : ""}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      <StrengthKey
        labels={["Slight", "Possible", "Likely"]}
        extras={[
          ...(index === 0 && currentHour !== undefined && currentHour > FIRST_HOUR ? ["Faded hours have passed"] : []),
          ...(day.weather.length > 0 ? ["Air in °F, wind in mph"] : []),
        ]}
      />
    </div>
  );
}
