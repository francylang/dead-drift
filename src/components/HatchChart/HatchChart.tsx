import { Insect } from "@/components/Insect/Insect";
import { StrengthKey } from "@/components/StrengthKey/StrengthKey";
import { MONTH_NAMES, MONTHS, type Hatch } from "@/lib/hatches";
import styles from "./HatchChart.module.css";

const STRENGTH = ["None", "Sparse", "Good", "Peak"];

export interface HatchChartProps {
  hatches: Hatch[];
  caption: string;
  /** Draws a rule down the current month. */
  currentMonth?: number;
}

/**
 * The angler's hatch chart: hatches down, months across. Bar height is how heavy the
 * hatch is that month, so each row reads as the hatch's season rising and falling.
 */
export function HatchChart({ hatches, caption, currentMonth }: HatchChartProps) {
  return (
    <div className={styles.chartWrap}>
      <StrengthKey
        labels={["Sparse", "Good", "Peak"]}
        extras={currentMonth !== undefined ? [<><span className={styles.nowSwatch} aria-hidden="true" />This month</>] : []}
      />
      <div className={styles.scroller}>
        <table className={styles.chart}>
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              <th scope="col" className={styles.corner}>
                <span className="visually-hidden">Hatch</span>
              </th>
              {MONTHS.map((m, i) => (
                <th key={m} scope="col" className={styles.month} data-current={i === currentMonth || undefined}>
                  <abbr title={MONTH_NAMES[i]}>{m}</abbr>
                </th>
              ))}
              <th scope="col" className={styles.hooks}>
                Hook
              </th>
            </tr>
          </thead>
          <tbody>
            {hatches.map((hatch) => (
              <tr key={hatch.id}>
                <th scope="row" className={styles.name}>
                  <Insect order={hatch.order} size={28} color="var(--color-action)" />
                  <span>{hatch.name}</span>
                </th>
                {hatch.months.map((intensity, col) => (
                  <td key={col} className={styles.cell} data-current={col === currentMonth || undefined}>
                    {intensity > 0 && <span className={styles.fill} data-intensity={intensity} />}
                    <span className="visually-hidden">{STRENGTH[intensity]}</span>
                  </td>
                ))}
                <td className={styles.hookSize}>#{hatch.hooks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
