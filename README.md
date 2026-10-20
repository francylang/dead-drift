# Portfolio

Three pieces built around **Swath**, an invented cash-flow planner for small farms.

| Route | Piece |
| --- | --- |
| `/` | Index |
| `/swath` | Landing page — scroll-driven hero chart, responsive, reduced-motion fallback |
| `/storybook` | Component library — design tokens, components, interaction + a11y tests |
| `/swath/plan` | Season planner — interactive what-if with spring-animated bars |

Next.js (App Router) · TypeScript · CSS Modules · [Motion](https://motion.dev) · Storybook 10

## Run

```bash
npm install
npm run dev          # app on :3000
npm run storybook    # Storybook on :6006
npm test             # story play functions + a11y via Vitest (run `npx playwright install chromium` once)
```

`npm run build` builds Storybook into `public/storybook` first, then the Next app, so one Vercel deploy serves both.

## Structure

```
src/
  styles/tokens.css        primitives → semantic tokens; components use semantic only
  lib/cashflow.ts          season model: monthly spend, harvest-timed sales, trough
  components/<Name>/       Name.tsx · Name.module.css · Name.stories.tsx
  docs/Tokens.stories.tsx  token reference rendered from live CSS values
  app/swath/               landing page + Hero (scroll-linked)
  app/swath/plan/          planner
```

## Design decisions

- **Palette from the subject.** Ledger-paper green ground, spruce ink, canola yellow for cash above zero, soil brown below.
- **Type.** Zilla Slab for display (feed-store signage), Public Sans for body with tabular figures so amounts line up.
- **One orchestrated motion moment.** The hero's cash line draws as you scroll and calls out the low point when it gets there. Everything else on the page is still.
- **Motion responds to input in the planner.** Bars spring to new values when a control changes; `prefers-reduced-motion` turns springs into instant updates.
- **Charts are accessible.** SVGs are `aria-hidden`; each has a text equivalent (caption or visually hidden table), and the planner readout is an `aria-live` region.
