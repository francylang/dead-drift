import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent } from "storybook/test";
import { buildOutlook } from "@/lib/outlook";
import { RIVER_BY_SLUG, riverHatches } from "@/lib/rivers";
import type { HourWeather } from "@/lib/weather";
import { HatchTimeline } from "./HatchTimeline";

const NOW = "2026-10-20T10:00:00-06:00";

/** Two days of made-up hourly weather: gray today, bright and breezy tomorrow. */
function weather(): HourWeather[] {
  return [20, 21].flatMap((day) =>
    Array.from({ length: 15 }, (_, i) => {
      const hour = 6 + i;
      return {
        start: `2026-10-${day}T${String(hour).padStart(2, "0")}:00:00-06:00`,
        airF: 42 + Math.round(14 * Math.sin(((hour - 6) / 14) * Math.PI)),
        windMph: day === 20 ? 6 : 18,
        precipPct: day === 20 ? 30 : 0,
        sky: day === 20 ? 0.85 : 0.1,
        summary: day === 20 ? "Mostly Cloudy" : "Sunny",
      };
    }),
  );
}

const days = (slug: string, month: number, waterF: number) => {
  const river = RIVER_BY_SLUG[slug];
  return buildOutlook(
    { hatches: riverHatches(river), month, waterF, tempSource: "gauge", kind: river.kind, weather: weather() },
    NOW,
  );
};

const meta = {
  title: "Components/HatchTimeline",
  component: HatchTimeline,
  parameters: { layout: "padded" },
  args: { days: days("south-platte-deckers", 9, 48), currentHour: 10 },
} satisfies Meta<typeof HatchTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OctoberOnThePlatte: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("table")).toBeInTheDocument();
    await expect(canvas.getByRole("rowheader", { name: /Blue-winged olive/ })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("radio", { name: "Tomorrow" }));
    await expect(canvas.getByRole("radio", { name: "Tomorrow" })).toBeChecked();
  },
};

export const FryingpanInAugust: Story = { args: { days: days("fryingpan", 7, 52), currentHour: undefined } };

export const GunnisonSalmonflies: Story = { args: { days: days("gunnison-black-canyon", 4, 52), currentHour: undefined } };

export const NothingHatching: Story = { args: { days: days("north-platte", 0, 30) } };
