# Implementation Prompt — nexLearn Home Page

## Goal

Replace the current design-system specimen at `app/page.tsx` with the real **nexLearn home page**, reproducing `design/vertex-home.png` exactly on desktop and adapting sensibly down to mobile. Presentational only: no Sanity, Clerk, PostHog, or search wiring in this task (none of it is set up yet). Course data is hardcoded placeholder, matching how the rest of the repo currently ships placeholder content.

## Skills / docs read

- `AGENTS.md` / `CLAUDE.md` — scope, boundaries, workflow, "reproduce the reference exactly", reuse existing components/Tailwind patterns.
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — App Router page/layout conventions for Next 16.3.3 (`LayoutProps`/`PageProps` helpers, root layout owns `<html>`/`<body>`).
- Package docs: Tailwind v4 `@theme` tokens already defined in `app/globals.css`.

## Code inspected

- `app/layout.tsx` — root layout, loads Inter + Playfair via `next/font/google`, `body` is `min-h-full flex flex-col font-sans`.
- `app/globals.css` — full design-token set: `--color-primary-*`, `--color-neutral-*`, semantic aliases (`background #fdfaf8`, `surface`, `border`, `ring`), `font-display`/`font-sans`, `text-display-1/2`, `text-heading-1..3`, `text-body-lg/body/small`, `radius-*`, `shadow-*`.
- `app/page.tsx` — current content is the design-system specimen (matches `design/vertext-designsystem.png`).
- `app/components/*` — `Button` (variants primary/secondary/tertiary/text, `iconRight`), `SearchInput` (h-11, search icon + `⌘ K` kbd), `Badge`, `CourseCard`/`LessonVideoCard`/`LessonCard`/`ResourceCard`, `NavBar`/`Breadcrumbs`/`Pagination`, `NexLearnMark`, `icons.tsx` (outline + solid sets), `StatusIndicator`, `ProgressBar`.
- `icons.tsx` has no straight right-arrow, no star, no ascending-level-bars icon.

## Decisions & assumptions

1. **Preserve the specimen**: move current `app/page.tsx` verbatim to `app/design-system/page.tsx` (route `/design-system`) so the design-system reference stays viewable. Only the default export wrapper stays the same.
2. **Shared header in the root layout**: add `<SiteHeader />` to `app/layout.tsx` above `{children}`. The header is shared across all future pages (catalog, course, lesson) per AGENTS.md §5. New component `app/components/site-header.tsx`.
   - Not reusing the specimen `NavBar` (it is a boxed swatch: bordered card, primary-colored active link, no bell/avatar). The real header is full-bleed, bottom-bordered, sticky, with bell + avatar.
   - Nav links `Courses` → `/courses`, `My Learning` → `/my-learning` (routes don't exist yet; links are correct for later). Both neutral-700, not primary (matches image).
   - Avatar: the reference shows a photo we don't have — use a neutral placeholder circle (`UserSolid` in a `bg-neutral-200` circle with `ring-1 ring-neutral-200`). Bell is a non-functional `<button>` with `aria-label`.
3. **Hero**: built inline in `page.tsx`.
   - Pill: `INTELLIGENT LEARNING`, 12px uppercase tracked, `text-primary-500`, `bg-surface`, `border border-neutral-200`, `rounded-full`, `shadow-sm`.
   - Headline: `font-display` bold, `text-[40px] leading-[1.1] sm:text-[52px] lg:text-[60px]` — the reference headline is visibly larger than the `display-1` (48px) token; the reference image is the source of truth for visuals (AGENTS.md §3), tokens still drive everything else.
   - Sub-copy: `text-body-lg text-neutral-500`, `max-w-[520px]`, centered.
   - CTA: existing `<Button variant="primary">` with `iconRight={<ArrowRightIcon size={18} />}`, sized up via `className="h-12 px-6"`.
   - Search: reuse `<SearchInput>` with `placeholder="Ask anything about your learning…"`, `shortcut="⌘ K"`, `className` to grow it to the reference (`h-16 rounded-lg pl-14 pr-20 text-body-lg`, `max-w-[760px]`). Presentational (no `onChange`); it's inside a plain `<form>` that does nothing yet.
   - Hero block `max-w-[640px] mx-auto text-center`; the whole hero section is full-width with a `border-b border-neutral-200` divider under it (matches the full-bleed rule in the image).
4. **All Courses section**:
   - Header row: `All Courses` in `font-display text-[28px] font-bold`; right-aligned `View all courses` link → `/courses`, `text-primary-500 text-body-lg font-medium` with `ArrowRightIcon size={16}`.
   - 3-up responsive grid: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` (image shows 3 columns on desktop; 2 then 1 as it narrows).
   - New component `app/components/course-summary-card.tsx` exporting `CourseSummaryCard`. The existing `CourseCard` in `card.tsx` is a different pattern (icon beside title, no fixed height, bookmark meta icon) — the reference catalog card is vertical: brand tile on top, serif title, description, then a top-bordered meta row pinned to the card bottom (`mt-auto`, cards `h-full` in a stretch grid). Meta: level (`LevelIcon`), duration (`ClockIcon`), modules (`FileTextIcon`), all `size={14}` `text-neutral-500`.
   - Brand tiles: new `app/components/brand-marks.tsx` with `NextMark` (black `bg-neutral-900` rounded tile, white "N"), `TypeScriptMark` (`#3178C6` tile, white "TS"), `DockerMark` (blue simplified Docker whale SVG on light tile). Tiles are `h-14 w-14 rounded-xl`.
5. **Footer strip** (inside `page.tsx`, below the courses section):
   - Centered `StarIcon` (primary-500) + `New courses and lessons added every week.` in `text-neutral-700`, flanked by short `h-px w-12 bg-neutral-200` rules.
   - Decorative equalizer: a full-width `overflow-hidden` band of vertical bars, `bg-gradient-to-t from-primary-400/70 to-transparent`, `[mask-image:linear-gradient(to_top,black,transparent)]`, `aria-hidden`. Two clusters, static heights. Purely decorative.
6. **Icons added to `icons.tsx`**: `ArrowRightIcon` (`M5 12h14M13 6l6 6-6 6`), `StarIcon` (outline star), `LevelIcon` (three ascending bars `M5 20v-4M12 20v-9M19 20v-15`). Match the existing 24×24 / 2px-stroke `Svg` wrapper.
7. **`app/layout.tsx` metadata**: update `title` to `nexLearn — Search your learning in plain English` and `description` to the hero sub-copy. Keep the font setup untouched.
8. Container width: `mx-auto max-w-[1440px] px-6 lg:px-10` for header, courses, and footer content — the reference is a 1440px frame; logo ↔ avatar ↔ card-grid edges stay aligned. Hero text/search stay narrow and centered (`max-w-[640px]` / `max-w-[760px]`).

## Files to touch

- `app/page.tsx` — rewritten: hero + All Courses + footer strip (Server Component, no `"use client"`).
- `app/design-system/page.tsx` — **new**: current specimen moved here unchanged.
- `app/layout.tsx` — add `<SiteHeader />`, update `metadata`.
- `app/components/site-header.tsx` — **new**.
- `app/components/course-summary-card.tsx` — **new**.
- `app/components/brand-marks.tsx` — **new**.
- `app/components/icons.tsx` — add `ArrowRightIcon`, `StarIcon`, `LevelIcon`.

No dependencies added. No env, config, middleware, or route-handler changes.

## Requirements

- Desktop layout matches `design/vertex-home.png`: spacing, type, color, alignment, the pill, the oversized serif headline, the pill-to-CTA-to-search vertical rhythm, the full-width divider, the 3-card grid with bottom-aligned meta, the star line, and the equalizer graphic.
- Responsive (mobile → desktop, no horizontal scroll at 320px):
  - Header: single row throughout. `px-4`→`sm:px-6`→`lg:px-10`, gaps tighten, the `nexLearn` wordmark is hidden below 400px (icon-only mark), nav links stay visible and `shrink-0`, bell + avatar cluster `shrink-0`.
  - Hero: headline `text-[32px]` → `sm:text-[52px]` → `lg:text-[60px]`; sub-copy `text-body` → `sm:text-body-lg`; search field `h-14` → `sm:h-16` with tighter padding on mobile; block stays centered.
  - All Courses: header stacks (`flex-col`) below `sm`, row above; heading `text-[24px]` → `sm:text-[28px]`; grid 1 → 2 (`sm`) → 3 (`lg`).
  - Equalizer: `h-28`/`w-4` bars on mobile → `sm:h-40`/`sm:w-10`; `overflow-hidden` clips the decorative band, never scrolls.
- Server Component only. All placeholder data in a local `const courses = [...]` array.
- Reuse `Button`, `SearchInput`, `NexLearnMark`, existing icons and tokens. No new Tailwind config; use `@theme` tokens and utilities already available.
- Semantics: one `<h1>` (headline), `<header>`/`<main>`/`<section>` landmarks, `aria-label` on icon-only controls, `aria-hidden` on decorative art.

## Security considerations

- No tokens, secrets, env, or network calls introduced. No client components, no user input handled. `SearchInput`/`<form>` are inert. Nothing crosses the server/client boundary. Consistent with AGENTS.md §5 (pages are read-only presentational).

## Acceptance criteria

- `/` renders the new home page; `/design-system` still renders the full specimen.
- Visual diff against the reference is faithful on desktop (~1280px) and degrades cleanly to 320px.
- `npx tsc --noEmit` clean; `npm run lint` clean.
- `npm run build` succeeds (routes changed).
- No console errors in `npm run dev`.

## Checks to run

```
npx tsc --noEmit
npm run lint
npm run build
npm run dev   # visual check of / and /design-system
```

## Manual test steps

1. `npm run dev`, open `/`.
2. Confirm header: nexLearn mark + wordmark left, `Courses` / `My Learning` next to it, bell + avatar far right, bottom border, stays on scroll.
3. Hero: `INTELLIGENT LEARNING` pill, two-line serif headline, sub-copy, orange `Explore Courses` button with right arrow, wide search field with `⌘ K`. Full-width divider below.
4. All Courses: heading left, `View all courses →` right; three cards (Next.js / Docker / TypeScript) with correct titles, descriptions, and `level · duration · modules` meta on a top border at the card bottom.
5. Star line + equalizer graphic render at the page bottom.
6. Resize to ~768px (cards 2-up) and 320px (1-up, no horizontal scroll, header intact).
7. Open `/design-system` — the original specimen is intact.
8. Tab through the page: focus rings visible on links, button, search, bell.
