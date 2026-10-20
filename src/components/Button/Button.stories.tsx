import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Plan a season", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Plan a season" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Quiet: Story = { args: { variant: "quiet", children: "See how it works" } };

export const AsLink: Story = {
  args: { href: "/lab", children: "Open the planner" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Open the planner" })).toHaveAttribute("href", "/lab");
  },
};

export const Disabled: Story = { args: { disabled: true } };
