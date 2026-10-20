import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { activeHatches } from "@/lib/hatches";
import { HatchList } from "./HatchList";

const meta = {
  title: "Components/HatchList",
  component: HatchList,
  parameters: { layout: "padded" },
  args: { hatches: activeHatches({ month: 9, waterF: 48, time: "afternoon" }) },
} satisfies Meta<typeof HatchList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OctoberAfternoon: Story = {};

export const JulyMorning: Story = {
  args: { hatches: activeHatches({ month: 6, waterF: 58, time: "morning" }) },
};

export const Empty: Story = { args: { hatches: [] } };
