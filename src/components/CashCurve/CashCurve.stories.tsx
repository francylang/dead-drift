import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { motionValue } from "motion/react";
import { DEFAULT_INPUTS, planSeason } from "@/lib/cashflow";
import { CashCurve } from "./CashCurve";

const meta = {
  title: "Charts/CashCurve",
  component: CashCurve,
  parameters: { layout: "padded" },
  args: { season: planSeason(DEFAULT_INPUTS) },
} satisfies Meta<typeof CashCurve>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullyDrawn: Story = {};

export const BeforeTrough: Story = { args: { progress: motionValue(0.45) } };

export const LateHarvest: Story = {
  args: { season: planSeason({ ...DEFAULT_INPUTS, harvestMonth: 10, yieldFactor: 0.8 }) },
};
