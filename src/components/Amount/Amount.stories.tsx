import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Amount } from "./Amount";

const meta = {
  title: "Components/Amount",
  component: Amount,
  args: { value: 31_000 },
} satisfies Meta<typeof Amount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {};
export const Negative: Story = { args: { value: -31_000 } };
export const Large: Story = { args: { value: -31_000, size: "lg" } };
export const Neutral: Story = { args: { value: -31_000, tone: "neutral" } };
