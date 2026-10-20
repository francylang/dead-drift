"use client";

import { useMemo, useState } from "react";
import { Amount } from "@/components/Amount/Amount";
import { RangeField } from "@/components/RangeField/RangeField";
import { SeasonBars } from "@/components/SeasonBars/SeasonBars";
import { DEFAULT_INPUTS, formatDollars, MONTHS, planSeason, type MonthIndex } from "@/lib/cashflow";
import styles from "./plan.module.css";

export function Planner() {
  const [harvestMonth, setHarvestMonth] = useState<MonthIndex>(DEFAULT_INPUTS.harvestMonth);
  const [yieldPct, setYieldPct] = useState(100);
  const [creditLine, setCreditLine] = useState(DEFAULT_INPUTS.creditLine);

  const season = useMemo(
    () => planSeason({ ...DEFAULT_INPUTS, harvestMonth, yieldFactor: yieldPct / 100, creditLine }),
    [harvestMonth, yieldPct, creditLine],
  );
  const { trough, covered } = season;
  const shortBy = -trough.balance - creditLine;

  return (
    <div className={styles.layout}>
      <div className={styles.controls}>
        <RangeField
          label="Harvest month"
          value={harvestMonth}
          min={7}
          max={10}
          format={(i) => MONTHS[i]}
          onChange={(v) => setHarvestMonth(v as MonthIndex)}
        />
        <RangeField
          label="Yield vs. a normal year"
          value={yieldPct}
          min={50}
          max={130}
          step={5}
          format={(v) => `${v}%`}
          onChange={setYieldPct}
        />
        <RangeField
          label="Operating line of credit"
          value={creditLine}
          min={0}
          max={80_000}
          step={5_000}
          format={formatDollars}
          onChange={setCreditLine}
        />
      </div>

      <div className={styles.readout} aria-live="polite">
        <p className={styles.readoutLabel}>Lowest balance, in {MONTHS[trough.index]}</p>
        <Amount value={trough.balance} size="lg" />
        <p className={covered ? styles.ok : styles.short}>
          {covered
            ? "Your line of credit covers it."
            : `Your line of credit comes up ${formatDollars(shortBy)} short.`}
        </p>
      </div>

      <div className={styles.chart}>
        <SeasonBars season={season} creditLine={creditLine} />
        <p className={styles.key}>
          Bars show cash at the end of each month. The dashed line is how far your credit line reaches.
        </p>
      </div>
    </div>
  );
}
