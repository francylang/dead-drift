import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";
import { activityByMonth } from "@/lib/hatches";
import { RIVER_BY_SLUG, riverHatches } from "@/lib/rivers";
import { MonthRibbon, type MonthRibbonProps } from "./MonthRibbon";

function Controlled(props: Omit<MonthRibbonProps, "value" | "onChange">) {
  const [month, setMonth] = useState(props.currentMonth ?? 0);
  return (
    <div style={{ width: "min(40rem, 90vw)" }}>
      <MonthRibbon {...props} value={month} onChange={setMonth} />
    </div>
  );
}

const meta = {
  title: "Components/MonthRibbon",
  component: Controlled,
  args: {
    label: "Pick a month",
    activity: activityByMonth(),
    currentMonth: 9,
  },
} satisfies Meta<typeof Controlled>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SouthPlatte: Story = {
  play: async ({ canvas }) => {
    const october = canvas.getByRole("radio", { name: "October, this month" });
    await expect(october).toBeChecked();
    october.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "November" })).toBeChecked();
  },
};

export const Fryingpan: Story = {
  args: { activity: activityByMonth(riverHatches(RIVER_BY_SLUG.fryingpan)), currentMonth: 7 },
};

export const OnWater: Story = {
  args: { tone: "water" },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-water-deep)", padding: 24, borderRadius: "var(--radius-md)" }}>
        <Story />
      </div>
    ),
  ],
};
