# Portfolio

Three pieces built around **Hatch**, an app that tells fly anglers what's hatching on Colorado's Gold Medal rivers and what to tie on.

| Route | Piece |
| --- | --- |
| `/` | Index |
| `/hatch` | Landing page. Scrolling moves a pinned river through the year; live conditions at Deckers. |
| `/rivers` | Colorado Gold Medal rivers: live flow, trend, flow vs. normal for the date, water temp, today’s best hatch. |
| `/rivers/[slug]` | One river: conditions, hour-by-hour hatch outlook for today and tomorrow, what’s in season. |
| `/hatch/river` | Read the river. Month, water temperature, and time of day drive an animated hatch and the fly list. |
| `/storybook` | Component library. Design tokens, insect glyphs, hatch timeline, form controls, interaction + a11y tests. |

Next.js 16 (App Router, Cache Components) · TypeScript · CSS Modules · [Motion](https://motion.dev) · Storybook 10

## Run

```bash
npm install
npm run dev          # app on :3000
npm run storybook    # Storybook on :6006
npm run typecheck
npm run test:unit    # data parsing + outlook model, in Node
npm test             # story play functions + a11y via Vitest (run `npx playwright install chromium` once)
```

`npm run build` builds Storybook into `public/storybook` first, then the Next app, so one Vercel deploy serves both.

## Data

All sources are free and keyless. Every fetch is cached with `"use cache"` and falls back cleanly when a source is down.

| Data | Source | Cache |
| --- | --- | --- |
| Flow and water temp, last 24h | [USGS Instantaneous Values](https://waterservices.usgs.gov/) — one request for all gauges | 15 min |
| Daily flow percentiles (flow vs. normal) | USGS Statistics service, RDB format | 1 week |
| Hourly forecast: air temp, wind, rain chance, sky | [NWS API](https://www.weather.gov/documentation/services-web-API) (`/points` → `forecastHourly`) | 1 hour |
| Hatch timing and hook sizes | Curated in `src/lib/hatches.ts` and `src/lib/rivers.ts` | — |

- **Rivers** (`src/lib/rivers.ts`): Gold Medal reaches with a USGS gauge. The Dream Stream and the Middle Fork of the South Platte only have Colorado DWR telemetry and are next.
- **Water temperature**: measured when the gauge reports it, otherwise a monthly typical for tailwaters or freestones, always labeled “estimated.”
- **Hatch outlook** (`src/lib/outlook.ts`): each hatch’s monthly intensity for that river, gated by water-temperature window and time of day, then adjusted by the forecast. Overcast boosts olives and midges, wind suppresses big mayflies, a warm breeze boosts hoppers.
- **NWS User-Agent**: NWS asks every client to identify itself. Set `NWS_USER_AGENT` in Vercel (e.g. `Hatch (you@example.com)`) to include a contact.
- **Sources for timing**: South Platte from [The Fly Fishing Place’s chart](https://theflyfishingplace.com/pages/south-platte-river-colorado-hatch-chart); Gunnison from [their Gunnison chart](https://theflyfishingplace.com/pages/gunnison-river-colorado-hatch-chart); Fryingpan, Arkansas, and others from shop reports. Treat it as a starting point.

## Structure

```
src/
  styles/tokens.css          primitives → semantic tokens; components use semantic only
  lib/rivers.ts              Gold Medal reaches, gauges, per-river hatch timing
  lib/hatches.ts             hatch library
  lib/usgs.ts, weather.ts    data fetching (cached, never throw)
  lib/conditions.ts          one snapshot of every river: flow, trend, vs. normal, temp
  lib/outlook.ts             hourly hatch model
  lib/data.test.ts           unit tests for parsing and the model
  components/<Name>/         Name.tsx · Name.module.css · Name.stories.tsx
  app/hatch/                 landing page + scroll-linked hero
  app/rivers/                index + [slug] river pages
  app/hatch/river/           interactive planner
```

## Design decisions

- **Palette from the subject.** Field-book yellow paper and graphite for the page; a tailwater at dusk for the river; each insect order has its own color against the water.
- **Type.** Young Serif for display, Atkinson Hyperlegible Next for body. Italic is reserved for Latin names.
- **One orchestrated motion moment.** On the landing page, scroll drives the month and the river's insects change with it. The rest of the page is still.
- **Motion answers input in the planner.** Insects fade in and out by species, list rows reorder with layout animation, the segmented control's pill slides. `prefers-reduced-motion` freezes insects in place and makes every transition instant.
- **Accessible by construction.** The segmented control is a native radio group. The river SVG is decorative; the hatch list and live regions carry the same information as text.
