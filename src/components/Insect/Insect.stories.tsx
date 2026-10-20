import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Order } from "@/lib/hatches";
import { Insect } from "./Insect";

const ORDERS: Order[] = ["mayfly", "caddis", "stonefly", "midge", "terrestrial"];

const meta = {
  title: "Components/Insect",
  component: Insect,
  args: { order: "mayfly", size: 96, title: "Mayfly" },
  argTypes: { order: { control: "inline-radio", options: ORDERS } },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-water)", padding: 32, borderRadius: "var(--radius-md)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Insect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const AllOrders: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "end" }}>
      {ORDERS.map((order) => (
        <figure key={order} style={{ margin: 0, textAlign: "center", color: "var(--color-on-water)" }}>
          <Insect order={order} size={72} />
          <figcaption style={{ fontSize: "var(--text-sm)", marginTop: 8 }}>{order}</figcaption>
        </figure>
      ))}
    </div>
  ),
};
