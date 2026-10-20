import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";
import type { TimeOfDay as Time } from "@/lib/hatches";
import { SegmentedControl } from "./SegmentedControl";

const OPTIONS: { value: Time; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

function TimeOfDayControl() {
  const [value, setValue] = useState<Time>("afternoon");
  return <SegmentedControl label="Time of day" options={OPTIONS} value={value} onChange={setValue} />;
}

const meta = {
  title: "Components/SegmentedControl",
  component: TimeOfDayControl,
} satisfies Meta<typeof TimeOfDayControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TimeOfDay: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Morning" }));
    await expect(canvas.getByRole("radio", { name: "Morning" })).toBeChecked();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "Afternoon" })).toBeChecked();
  },
};
