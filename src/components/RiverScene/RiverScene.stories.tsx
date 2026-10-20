import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { activeHatches, seasonalHatches } from "@/lib/hatches";
import { RiverScene } from "./RiverScene";

const meta = {
  title: "Scenes/RiverScene",
  component: RiverScene,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ height: "70vh" }}>
        <Story />
      </div>
    ),
  ],
  args: { hatches: seasonalHatches(9) },
} satisfies Meta<typeof RiverScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const October: Story = {};

export const JulyMorningTricos: Story = {
  args: { hatches: activeHatches({ month: 6, waterF: 58, time: "morning" }) },
};

export const MidwinterMidges: Story = { args: { hatches: seasonalHatches(0) } };

export const Empty: Story = { args: { hatches: [] } };

export const Heavy: Story = { args: { hatches: seasonalHatches(4), density: 2 } };
