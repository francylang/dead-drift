import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";
import { MONTHS } from "@/lib/cashflow";
import { RangeField, type RangeFieldProps } from "./RangeField";

function Controlled(props: Omit<RangeFieldProps, "onChange">) {
  const [value, setValue] = useState(props.value);
  return <RangeField {...props} value={value} onChange={setValue} />;
}

const meta = {
  title: "Components/RangeField",
  component: Controlled,
  args: {
    label: "Harvest month",
    value: 8,
    min: 7,
    max: 10,
    format: (i: number): string => MONTHS[i],
  },
} satisfies Meta<typeof Controlled>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HarvestMonth: Story = {
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider", { name: "Harvest month" });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuetext", "Oct");
  },
};

export const Yield: Story = {
  args: {
    label: "Yield vs. a normal year",
    value: 100,
    min: 50,
    max: 130,
    step: 5,
    format: (v: number) => `${v}%`,
  },
};
