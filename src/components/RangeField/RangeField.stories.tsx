import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";
import { MONTHS } from "@/lib/hatches";
import { RangeField, type RangeFieldProps } from "./RangeField";

function Controlled(props: Omit<RangeFieldProps, "onChange">) {
  const [value, setValue] = useState(props.value);
  return <RangeField {...props} value={value} onChange={setValue} />;
}

const meta = {
  title: "Components/RangeField",
  component: Controlled,
  args: {
    label: "Month",
    value: 9,
    min: 0,
    max: 11,
    format: (i: number): string => MONTHS[i],
  },
} satisfies Meta<typeof Controlled>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Month: Story = {
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider", { name: "Month" });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuetext", "Nov");
  },
};

export const WaterTemperature: Story = {
  args: {
    label: "Water temperature",
    value: 48,
    min: 34,
    max: 68,
    format: (v: number) => `${v}°F`,
  },
};
