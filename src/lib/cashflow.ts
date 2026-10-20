export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface SeasonInputs {
  /** Cash on hand on Jan 1, in dollars. */
  startingCash: number;
  /** Month the crop comes off the field (0 = Jan). */
  harvestMonth: MonthIndex;
  /** Yield as a fraction of a normal year (1 = normal). */
  yieldFactor: number;
  /** Size of the operating line of credit, in dollars. */
  creditLine: number;
}

export interface MonthRow {
  month: (typeof MONTHS)[number];
  income: number;
  spend: number;
  balance: number;
}

export interface Season {
  rows: MonthRow[];
  trough: { index: number; balance: number };
  /** True when the lowest balance stays above the negative credit line. */
  covered: boolean;
}

export const DEFAULT_INPUTS: SeasonInputs = {
  startingCash: 52_000,
  harvestMonth: 8,
  yieldFactor: 1,
  creditLine: 40_000,
};

/** Monthly spend for a small diversified grain operation. Front-loaded into spring. */
const BASE_SPEND = [
  4_000, 5_000, 16_000, 20_000, 16_000, 9_000,
  6_000, 5_000, 8_000, 7_000, 5_000, 4_000,
];

const NORMAL_CROP_VALUE = 132_000;

/** Crop sales land the month after harvest and the month after that, 60/40. */
function incomeFor(month: number, inputs: SeasonInputs): number {
  const value = NORMAL_CROP_VALUE * inputs.yieldFactor;
  if (month === inputs.harvestMonth + 1) return Math.round(value * 0.6);
  if (month === inputs.harvestMonth + 2) return Math.round(value * 0.4);
  return month === 1 ? 6_000 : 0; // winter: small custom-hire income
}

export function planSeason(inputs: SeasonInputs): Season {
  let balance = inputs.startingCash;
  const rows = MONTHS.map((month, i) => {
    const income = incomeFor(i, inputs);
    const spend = BASE_SPEND[i];
    balance += income - spend;
    return { month, income, spend, balance };
  });

  const trough = rows.reduce(
    (low, row, index) => (row.balance < low.balance ? { index, balance: row.balance } : low),
    { index: 0, balance: rows[0].balance },
  );

  return { rows, trough, covered: trough.balance >= -inputs.creditLine };
}

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  signDisplay: "auto",
});

export const formatDollars = (value: number) => dollars.format(value);
