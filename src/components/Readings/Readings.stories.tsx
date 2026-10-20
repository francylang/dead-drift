import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Readings } from "./Readings";

const meta = {
  title: "Components/Readings",
  component: Readings,
  parameters: { layout: "padded" },
  args: {
    items: [
      { label: "Flow", value: "182 cfs", detail: "Falling over 24 hours" },
      { label: "Compared with normal", value: "128%", detail: "Of the Oct 20 median, 57 years" },
      { label: "Water", value: "47°F", detail: "From the gauge" },
      { label: "Weather now", value: "Mostly cloudy", detail: "52°F, wind 8 mph" },
    ],
  },
} satisfies Meta<typeof Readings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RiverConditions: Story = {};

export const GaugeOffline: Story = {
  args: {
    items: [
      { label: "Flow", value: "Unavailable", detail: "The gauge didn’t respond" },
      { label: "Water", value: "45°F", detail: "Estimated for the season" },
    ],
  },
};
