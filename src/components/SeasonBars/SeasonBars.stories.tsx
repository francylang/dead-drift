import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DEFAULT_INPUTS, planSeason } from "@/lib/cashflow";
import { SeasonBars } from "./SeasonBars";

const meta = {
  title: "Charts/SeasonBars",
  component: SeasonBars,
  parameters: { layout: "padded" },
  args: { season: planSeason(DEFAULT_INPUTS), creditLine: DEFAULT_INPUTS.creditLine },
} satisfies Meta<typeof SeasonBars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NormalYear: Story = {};

export const ShortOfCredit: Story = {
  args: { season: planSeason({ ...DEFAULT_INPUTS, harvestMonth: 10 }) },
};
