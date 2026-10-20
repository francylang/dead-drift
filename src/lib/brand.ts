/**
 * The product's name and URLs in one place. To rename the app, change `name` and `slug`,
 * then rename the `src/app/<slug>` folder to match. Everything else reads from here.
 */
export const BRAND = {
  name: "Dead Drift",
  slug: "dead-drift",
  tagline: "Know what’s coming off the water before you rig up.",
} as const;

export const ROUTES = {
  landing: `/${BRAND.slug}`,
  rivers: "/rivers",
  river: (slug: string) => `/rivers/${slug}`,
  plan: "/plan",
} as const;

/** "Gold Medal rivers — Dead Drift" */
export const pageTitle = (title?: string) => (title ? `${title} — ${BRAND.name}` : BRAND.name);
