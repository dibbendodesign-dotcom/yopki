# Yopki — trip planner prototype

A clickable prototype of Yopki's "plan a new trip" flow: Destination → Travelers → Dates → Preferences → a "Build my trip" animation. It's built with Next.js 16 and the Yopki design system (DS).

## Figma

All four frames are in the **FIgma-MCP** file (`t1a1U2C7R49BDCUvrZapiN`).

| Step | Route | Figma |
| --- | --- | --- |
| 1 · Destination | `/` (homepage) | [node 17:8649](https://www.figma.com/design/t1a1U2C7R49BDCUvrZapiN/FIgma-MCP?node-id=17-8649&m=dev) |
| 2 · Travelers (family panel) | `/trip/new/travelers` | [node 63:6751](https://www.figma.com/design/t1a1U2C7R49BDCUvrZapiN/FIgma-MCP?node-id=63-6751&m=dev) |
| 3 · Dates | `/trip/new/dates` | [node 66:6752](https://www.figma.com/design/t1a1U2C7R49BDCUvrZapiN/FIgma-MCP?node-id=66-6752&m=dev) |
| 4 · Preferences | `/trip/new/personalization` | [node 17:9403](https://www.figma.com/design/t1a1U2C7R49BDCUvrZapiN/FIgma-MCP?node-id=17-9403&m=dev) |

Some pieces have no Figma frame yet and were built from DS parts: the trip-type cards, the date-range calendar, the "add your own" chips and the build checklist. The gallery flags each of them.

## Run it

You need Node 20.9 or later.

```bash
npm install
npm run dev
```

| What | URL |
| --- | --- |
| The flow | <http://localhost:3000> (the old `/trip/new` link redirects here) |
| UI gallery | <http://localhost:3000/gallery> |

- **The flow** keeps your answers in `sessionStorage` (key `yopki:trip-draft`). To start over, close the tab or clear that key. "View my itinerary" doesn't link anywhere yet.
- **The gallery** shows every button, input and selection card used in the flow, as live components. Each one is tagged *From Figma*, *Changed* or *Needs review*. The checklist at the top links to each pattern that still needs a design decision. Search engines are told not to index this page.

Before you commit, run these checks:

```bash
npx tsc --noEmit -p .
npm run lint
```

## Approved design rules

**Design system**
- **Icons come only from the Yopki DS Figma library.** Export them from Figma into `public/trip/ds/`. Don't use lucide or any other icon pack, and don't draw icons by hand.
- **Use DS tokens from `app/globals.css`** instead of raw colours or sizes. The corner radii are 4, 6, 10, 12 and 20; there is no 16.

**Selection**
- **Selected items are sky, not orange.** Chips and cards show a pale sky border (`brand-blue/30`) and a light sky tint (`brand-blue-alpha-8`). This applies to city chips, trip-type cards, month cards and preference chips. Chips share their style through `CHOICE_CHIP_CLASS` in `components/trip/choiceChip.ts`.
- **Single-choice cards have no radio dot.** The whole card is the click target. Its text size matches the selected card.
- **The "+" add icons are sky.**

**Stepper (step progress at the top)**
- A finished step shows a filled sky circle with a white check.
- The steps are named **Destination, Travelers, Dates, Preferences**. Preferences uses the `list-settings-line` icon.

**Travelers**
- The adult and child counters sit inside the Family trip card, as part of the same option.
- The − and + icons are `icon/sub-600`. They switch to the disabled colour at the min or max.

**Dates**
- The selected tab is a rounded pill.
- You pick a date range in a single-month calendar.

**Preferences**
- Items you add yourself get their own icon: a star for must-dos, a "forbidden" sign for must-avoids.
- The "Build my trip" button has the sparkle icon on its left.

**Build my trip animation**
- All four answers sit in one box. Thin dividers between them stop short of the box edges, with the same gap on the left and right.
- Each row is one short line, for example "2 must-dos · 1 must-avoid".
- Each row's icon is a colour emoji, shown grey until the row is reached.
- A finished row gets a **green** check (`state-success-base`).
- A sky line runs around the box border as the build progresses and closes the loop at 100%. The sky progress bar underneath stays.
- The footer has no "All set" text.

Several of these rules are approved in the prototype but still need a DS decision. Examples: the sky progress bar, emoji licensing, and the 46px orange button. They are tracked under **Needs review** in the [gallery](http://localhost:3000/gallery).
