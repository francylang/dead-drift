import type { Meta, StoryObj } from "@storybook/nextjs-vite";

// Keep in sync with src/styles/tokens.css. Only semantic tokens are documented;
// primitives are an implementation detail.
const COLORS = [
  "--color-bg",
  "--color-surface",
  "--color-text",
  "--color-text-muted",
  "--color-rule",
  "--color-action",
  "--color-action-hover",
  "--color-focus",
  "--color-water-deep",
  "--color-water",
  "--color-water-surface",
  "--color-water-glint",
  "--color-mayfly",
  "--color-caddis",
  "--color-stonefly",
  "--color-midge",
  "--color-terrestrial",
  "--color-crustacean",
  "--color-hatch",
];
const TYPE = ["--text-4xl", "--text-3xl", "--text-2xl", "--text-xl", "--text-lg", "--text-md", "--text-sm"];
const SPACE = ["--space-1", "--space-2", "--space-3", "--space-4", "--space-6", "--space-8", "--space-12", "--space-16", "--space-24"];

// Storybook renders client-side only, so reading the resolved value during render is safe.
const tokenValue = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function Row({ name, children }: { name: string; children: React.ReactNode }) {
  const value = tokenValue(name);
  return (
    <tr>
      <td style={{ padding: "8px 16px 8px 0" }}>{children}</td>
      <td style={{ padding: "8px 16px 8px 0" }}>
        <code>{name}</code>
      </td>
      <td style={{ color: "var(--color-text-muted)" }}>
        <code>{value}</code>
      </td>
    </tr>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <table style={{ borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
      <tbody>{children}</tbody>
    </table>
  );
}

const meta = { title: "Foundations/Tokens", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Color: Story = {
  render: () => (
    <Table>
      {COLORS.map((name) => (
        <Row key={name} name={name}>
          <div
            style={{
              width: 56,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: `var(${name})`,
              border: "1px solid var(--color-rule)",
            }}
          />
        </Row>
      ))}
    </Table>
  ),
};

export const Type: Story = {
  render: () => (
    <Table>
      {TYPE.map((name) => (
        <Row key={name} name={name}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: `var(${name})`, lineHeight: 1.1 }}>
            Hatch
          </span>
        </Row>
      ))}
    </Table>
  ),
};

export const Space: Story = {
  render: () => (
    <Table>
      {SPACE.map((name) => (
        <Row key={name} name={name}>
          <div style={{ width: `var(${name})`, height: 12, background: "var(--color-action)" }} />
        </Row>
      ))}
    </Table>
  ),
};
