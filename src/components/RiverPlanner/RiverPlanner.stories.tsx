import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent } from "storybook/test";
import { RIVERS, riverHatches } from "@/lib/rivers";
import { RiverPlanner, type PlannerRiver } from "./RiverPlanner";

const rivers: PlannerRiver[] = RIVERS.map((r) => ({
  slug: r.slug,
  name: r.name,
  reach: r.reach,
  region: r.region,
  hatches: riverHatches(r),
  today: { month: 9, waterF: r.kind === "tailwater" ? 49 : 45, time: "afternoon" },
}));

const meta = {
  title: "Scenes/RiverPlanner",
  component: RiverPlanner,
  parameters: { layout: "padded" },
  args: { rivers, initial: "south-platte-deckers" },
} satisfies Meta<typeof RiverPlanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllRivers: Story = {
  play: async ({ canvas }) => {
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "River" }), "fryingpan");
    await expect(canvas.getByRole("heading", { name: /on the Fryingpan/ })).toBeInTheDocument();
  },
};

export const OneRiver: Story = {
  args: { rivers: [{ ...rivers.find((r) => r.slug === "fryingpan")!, today: { month: 7, waterF: 52, time: "afternoon" } }] },
};
