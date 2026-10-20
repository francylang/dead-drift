import type { Order } from "@/lib/hatches";

/**
 * Side-profile silhouettes, one per order, drawn in a 40×32 box facing right.
 * Color comes from the matching --color-<order> token unless overridden.
 */
const SHAPES: Record<Order, React.ReactNode> = {
  // Upright sail wings, curved abdomen, two long tails.
  mayfly: (
    <>
      <path d="M17 22 L21 3 L26 21 Z" opacity="0.85" />
      <path d="M9 22 Q18 26 32 21 Q34 20 33 18 Q20 17 9 20 Z" />
      <path d="M9 21 L1 14 M9 22 L1 19" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  // Wings folded tent-style over the body, long antennae forward.
  caddis: (
    <>
      <path d="M5 24 Q16 10 30 18 L30 24 Z" opacity="0.85" />
      <path d="M8 24 Q20 27 32 23 L32 21 Q20 21 8 22 Z" />
      <path d="M31 20 Q36 12 40 9" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  // Long body, wings flat over the back, short tails and antennae.
  stonefly: (
    <>
      <path d="M4 21 Q20 15 36 20 L36 23 Q20 26 4 24 Z" />
      <path d="M8 20 Q22 16 34 19" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
      <path d="M4 22 L0 19 M4 23 L0 25 M36 21 L40 17" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  // Tiny slender body, two small raised wings.
  midge: (
    <>
      <path d="M14 21 Q20 23 27 20 L27 19 Q20 19 14 20 Z" />
      <path d="M19 20 Q17 12 22 10 Q22 15 21 20 Z" opacity="0.8" />
      <path d="M27 19 L31 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  // Curled shrimp: segmented arc, tail fan, long antennae.
  crustacean: (
    <>
      <path d="M8 14 Q10 26 24 26 Q32 26 34 20 L30 19 Q28 23 23 23 Q13 23 12 14 Z" />
      <path d="M8 14 L4 10 M8 14 L3 16 M8 14 L5 19" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M33 19 Q38 12 40 4 M32 19 Q36 14 36 6" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="31" cy="21" r="1.2" opacity="0.5" />
    </>
  ),
  // Chunky body, folded hind leg.
  terrestrial: (
    <>
      <path d="M6 20 Q8 14 22 15 Q33 15 35 20 Q33 24 20 24 Q8 24 6 20 Z" />
      <path d="M14 22 L20 12 L28 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M34 18 Q38 12 40 8" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
};

export interface InsectProps {
  order: Order;
  size?: number;
  /** Any CSS color. Defaults to the order's token. */
  color?: string;
  /** Accessible name. Omit when the insect is decorative. */
  title?: string;
}

export function Insect({ order, size = 40, color, title }: InsectProps) {
  return (
    <svg
      viewBox="0 0 40 32"
      width={size}
      height={(size * 32) / 40}
      fill="currentColor"
      style={{ color: color ?? `var(--color-${order})`, overflow: "visible" }}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {SHAPES[order]}
    </svg>
  );
}

/** The same shapes as raw SVG groups, for placing inside a larger SVG. */
export function InsectShape({ order }: { order: Order }) {
  return <>{SHAPES[order]}</>;
}
