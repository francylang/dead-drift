import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { RIVER_BY_SLUG, riverHatches } from "@/lib/rivers";
import { HatchChart } from "./HatchChart";

const meta = {
  title: "Components/HatchChart",
  component: HatchChart,
  parameters: { layout: "padded" },
  args: {
    hatches: riverHatches(RIVER_BY_SLUG["south-platte-deckers"]),
    currentMonth: 9,
    caption: "South Platte hatch chart",
  },
  decorators: [
    // Room above and below so the scroll-linked reveal can be scrubbed in the canvas.
    (Story) => (
      <div style={{ padding: "60vh 0" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HatchChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SouthPlatte: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("table", { name: "South Platte hatch chart" })).toBeInTheDocument();
    await expect(canvas.getByRole("rowheader", { name: /Trico/ })).toBeInTheDocument();
  },
};

export const Fryingpan: Story = {
  args: { hatches: riverHatches(RIVER_BY_SLUG.fryingpan), caption: "Fryingpan hatch chart", currentMonth: 7 },
};
