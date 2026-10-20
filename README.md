# Portfolio

Three pieces built around **Hatch**, an invented app that tells fly anglers what's hatching on the South Platte and what to tie on.

| Route | Piece |
| --- | --- |
| `/` | Index |
| `/hatch` | Landing page. Scrolling moves a pinned river through the year; live flow from a USGS gauge. |
| `/storybook` | Component library. Design tokens, insect glyphs, form controls, interaction + a11y tests. |
| `/hatch/river` | Read the river. Month, water temperature, and time of day drive an animated hatch and the fly list. |

Next.js 16 (App Router, Cache Components) · TypeScript · CSS Modules · [Motion](https://motion.dev) · Storybook 10

## Run

```bash
npm install
npm run dev          # app on :3000
npm run storybook    # Storybook on :6006
npm run typecheck
npm test             # story play functions + a11y via Vitest (run `npx playwright install chromium` once)
```

`npm run build` builds Storybook into `public/storybook` first, then the Next app, so one Vercel deploy serves both.

## Data

- **Hatches** (`src/lib/hatches.ts`): timing and hook sizes from [The Fly Fishing Place's South Platte hatch chart](https://theflyfishingplace.com/pages/south-platte-river-colorado-hatch-chart). Water-temperature windows are approximate working ranges.
- **Conditions** (`src/lib/conditions.ts`): the [USGS Instantaneous Values service](https://waterservices.usgs.gov/) for gauge [06701900](https://waterdata.usgs.gov/monitoring-location/USGS-06701900/) (South Platte at Deckers). No API key. Cached with `"use cache"` for 15 minutes. This gauge reports flow but not temperature, so temperature falls back to a monthly typical value and the UI labels it as estimated. Pointing `GAUGE` at a site that reports parameter `00010` switches to measured temperature with no other changes.

## Structure

```
src/
  styles/tokens.css        primitives → semantic tokens; components use semantic only
  lib/hatches.ts           hatch dataset + activeHatches(month, waterF, time)
  lib/conditions.ts        USGS fetch, cached, never throws
  components/<Name>/       Name.tsx · Name.module.css · Name.stories.tsx
  docs/Tokens.stories.tsx  token reference rendered from live CSS values
  app/hatch/               landing page + Hero (scroll-linked)
  app/hatch/river/         interactive planner
```

## Design decisions

- **Palette from the subject.** Field-book yellow paper and graphite for the page; a tailwater at dusk for the river; each insect order has its own color against the water.
- **Type.** Young Serif for display, Atkinson Hyperlegible Next for body. Italic is reserved for Latin names.
- **One orchestrated motion moment.** On the landing page, scroll drives the month and the river's insects change with it. The rest of the page is still.
- **Motion answers input in the planner.** Insects fade in and out by species, list rows reorder with layout animation, the segmented control's pill slides. `prefers-reduced-motion` freezes insects in place and makes every transition instant.
- **Accessible by construction.** The segmented control is a native radio group. The river SVG is decorative; the hatch list and live regions carry the same information as text.
