import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";
import { RIVERS } from "@/lib/rivers";
import { SelectField } from "./SelectField";

const OPTIONS = RIVERS.map((r) => ({ value: r.slug, label: `${r.name}, ${r.reach}`, group: r.region }));

function RiverPicker() {
  const [value, setValue] = useState(RIVERS[0].slug);
  return <SelectField label="River" value={value} options={OPTIONS} onChange={setValue} />;
}

const meta = {
  title: "Components/SelectField",
  component: RiverPicker,
} satisfies Meta<typeof RiverPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GroupedByRegion: Story = {
  play: async ({ canvas }) => {
    const select = canvas.getByRole("combobox", { name: "River" });
    await userEvent.selectOptions(select, "fryingpan");
    await expect(select).toHaveValue("fryingpan");
  },
};
