import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StrengthKey } from "./StrengthKey";

const meta = {
  title: "Components/StrengthKey",
  component: StrengthKey,
  args: { labels: ["Sparse", "Good", "Peak"] },
} satisfies Meta<typeof StrengthKey>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthlyChart: Story = {};
export const HourlyOutlook: Story = { args: { labels: ["Slight", "Possible", "Likely"], extras: ["Air in °F, wind in mph"] } };
