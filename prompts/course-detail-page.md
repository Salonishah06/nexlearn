# Implementation Prompt — Course Detail Page (`/courses/[slug]`)

## Goal

Build the **course detail page** at `app/(site)/courses/[slug]/page.tsx`, reproducing
`design/vertex-course.png` exactly on desktop and adapting sensibly down to mobile.
The page is **read-only** and wired to **Sanity** via the existing server-only data
layer (`sanityFetch` + `COURSE_QUERY`). No Clerk gating, no progress backend, no
PostHog in this task — those are separate, not-yet-wired concerns.

## Skills / docs read

- `AGENTS.md` / `CLAUDE.md` — scope, boundaries, workflow, "reproduce the reference
  exactly", reuse existing components/Tailwind, keep pages read-only & server-side,
  keep the read token server-only, derive module/lesson numbers from order.
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` —
  App Router dynamic segments, `PageProps<'/courses/[slug]'>` global helper, `params`
  is a Promise, `<Link>` for navigation.
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` — `next/image`
  remote images need `images.remotePatterns` in `next.config.ts`.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`
  — `generateStaticParams`, `notFound()` for unknown slugs.

## Code inspected

- `sanity/lib/queries.ts` — `COURSE_QUERY` already returns almost everything this
  page needs (title, summary, coverImage, level, price, popular, studentCount,
  `learningOutcomes[]{icon,title,description}`, instructor, category, derived
  `durationSeconds` / `lessonCount`, `modules[]{_key,title,summary,lessons[]->...}`).
  `COURSE_SLUGS_QUERY` exists for `generateStaticParams`. The comment on `LESSON_QUERY`
  fixes the lesson route as `/courses/[slug]/[lesson]`.
- `sanity/lib/sanity.types.ts` — `COURSE_QUERY_RESULT` (TypeGen output, committed).
- `sanity/lib/{fetch,client,token,image}.ts` — `sanityFetch({query,params,tags})`
  is `server-only`; `urlFor(source)` builds image URLs.
- Live dataset check: **10 courses, 120 lessons**, content is real. Findings that
  shape the build:
  - Every course has 4 modules × 3 lessons (`lessonCount` 12), a real `coverImage`
    (1600×900 jpg), a real instructor `photo` (128×128).
  - **`lesson.durationSeconds` is `null` for every lesson right now** (video
    ingestion is a later task) → `math::sum(...)` yields `0`. Durations must be
    treated as optional and hidden when absent/zero.
  - **`course.level` is stored lowercase** (`"intermediate"`) despite the schema
    list — display must capitalize it.
  - `learningOutcome.icon` keys in use across the dataset: `code`, `gauge`,
    `layers`, `puzzle`, `rocket`, `shield`, `sparkles`, `workflow` (8 total).
- `app/(site)/layout.tsx` — wraps routes in `ClerkProvider` + `<SiteHeader />`.
- `app/(site)/page.tsx` — home links courses as `/courses/<slug>`; header links
  `/courses`, `/my-learning` (neither route exists yet — acceptable, pre-existing).
- `app/components/*` — `Button` (variants primary/secondary/tertiary/text, `iconLeft`/
  `iconRight`, `h-11`, `size` md/lg), `Badge` (`popular` variant = outlined pill),
  `Breadcrumbs` from `navigation.tsx` (renders plain `<a href="#">` — **not**
  reusable as-is for real links; see decisions), `icons.tsx` (24×24, 2px stroke
  `Svg` wrapper + `SolidSvg`; has `ChevronDownIcon`, `ChevronRightIcon`,
  `ArrowRightIcon`, `BookmarkIcon`, `LevelIcon`, `ClockIcon`, `FileTextIcon`,
  `UserIcon`, `LockIcon`, `PlayCircleSolid` — **no** icons for the 8 outcome keys).
- `app/globals.css` — `@theme` tokens: `primary-100..500`, `neutral-50..900`,
  `surface`/`background`/`border`/`ring`, `font-display` (Playfair) / `font-sans`
  (Inter), `text-display-1/2`, `text-heading-1..3`, `text-body-lg/body/small`,
  `radius-xs..xl`, `shadow-sm..xl`.
- `next.config.ts` — empty; no `images` config yet. No `next/image` usage anywhere
  in the repo yet.
- No `middleware.ts` — Clerk middleware not set up (out of scope here).

## Decisions & assumptions

1. **Route**: `app/(site)/courses/[slug]/page.tsx` — Server Component, `async`,
   `props: PageProps<'/courses/[slug]'>`, `const { slug } = await props.params`.
   - `generateStaticParams()` maps `COURSE_SLUGS_QUERY` → `[{ slug }]`.
   - Data via `sanityFetch({ query: COURSE_QUERY, params: { slug }, tags:
     ['course', \`course:${slug}\`] })`. If `null` → `notFound()`.
   - `generateMetadata({ params })` sets `title` = course title, `description` =
     summary (own small fetch of a trimmed query is overkill — reuse `COURSE_QUERY`;
     Next dedupes the request within the render).
2. **Progress UI is omitted** (per user decision). No sticky bottom progress bar,
   no "35% complete", nothing faked. The design's sticky footer + its duplicate
   "Continue Learning" button are **not** built. Primary CTA reads **"Start
   Learning"** and links to the first lesson
   (`/courses/<slug>/<firstModule.lessons[0].slug>`). When the course has no
   lessons at all, the CTA is omitted. Resume/percentage affordances arrive with
   the dedicated progress task.
3. **`next-app.dev` layout** (hero, two-column): reproduce the reference —
   - Left: square cover, `~380px`, `rounded-xl`, `overflow-hidden`, dark bg
     fallback. Rendered with `next/image` (`fill`, `sizes`, `object-cover`) from
     `urlFor(coverImage).width(760).height(760).url()`; `alt` = `coverImage.alt`
     || `\`${title} cover\``. If `coverImage` is missing, show a
     `bg-neutral-900` tile with the course's first initial in Playfair (mirrors
     the brand-tile pattern in `brand-marks.tsx`).
   - Right: `POPULAR` badge (`<Badge variant="popular">` — only when
     `course.popular`), then `<h1>` title in `font-display` (~`text-[40px]
     sm:text-[52px]`), summary (`text-body-lg text-neutral-500 max-w-[46ch]`),
     the meta row, then the button row.
4. **Meta row** (icon + label, `text-small text-neutral-500`, `gap-x-6 gap-y-2
   flex-wrap`, matches the home card meta pattern):
   - `LevelIcon` → capitalized `level` (helper `capitalize()`), omitted if no level.
   - `ClockIcon` → formatted total duration, **only when `durationSeconds > 0`**
     (`formatDuration` → `"18h 24m"` / `"45m"`).
   - `FileTextIcon` → `\`${moduleCount} modules\`` (`moduleCount` =
     `modules?.length ?? 0`).
   - `UserIcon` → `\`${formatCount(studentCount)} students\`` (`formatCount` →
     `"18.2k"`), only when `studentCount` is set.
   - The reference also shows a lessons/duration figure; with real data duration
     is absent, so the row degrades to `Level · N modules · N students`. This is
     the intended graceful fallback, not a design change.
5. **Instructor byline** — AGENTS.md §7 requires the instructor be surfaced on the
   course page; the reference image does not show one. Resolve in favour of the
   explicit requirement with the lightest possible touch: a single line under the
   summary — `Taught by <Link href="/instructors/<slug>">Name</Link>` in
   `text-body text-neutral-500`, instructor name `text-neutral-900 font-medium
   hover:text-primary-500`. No avatar. Flagged in "Needs your attention" as a
   deliberate deviation the user can pull if they want a pixel-exact match.
   (`/instructors/<slug>` route does not exist yet — consistent with the existing
   `/courses`, `/my-learning` dead links.)
6. **Button row**: `<Button variant="primary" iconRight={<ArrowRightIcon />}>Start
   Learning</Button>` wrapped in `<Link>` (asChild-style: render `<Link>` with the
   button classes, or wrap — use a `<Link>` that contains the `<Button>` is
   invalid HTML? No: `Button` renders a `<button>`; nesting a `<button>` in an
   `<a>` is invalid. Instead render an `<a>`/`<Link>` styled with the shared button
   class strings.) → **Add an optional `as`/`href` path**: simplest is a small
   `ButtonLink` in `app/components/button.tsx` that reuses the same `base/sizes/
   variants` maps and renders `<Link>`. Add it alongside `Button`.
   - Secondary **"Bookmark"** → `ButtonLink` is wrong (no destination);
     render `<Button variant="secondary" iconLeft={<BookmarkIcon />}>Bookmark</Button>`
     as a presentational control (`type="button"`, `aria-label="Bookmark this
     course"`), consistent with the non-functional notifications bell in
     `site-header.tsx`. No bookmark backend in scope.
7. **"What you'll learn"** — one `rounded-lg border border-neutral-200 bg-surface`
   card, `p-6 sm:p-8`. `<h2>` "What you'll learn" in `font-display text-[24px]
   sm:text-[28px]`. Inside: `grid gap-x-8 gap-y-6 sm:grid-cols-2`. Each outcome:
   orange icon (`size={28}`, `text-primary-500`, top-aligned) + `div` with title
   (`text-body-lg font-semibold text-neutral-900`) and description
   (`text-body text-neutral-500`). Render nothing if `learningOutcomes` empty.
   - **New component** `app/components/learning-outcome-icon.tsx`: `LearningOutcomeIcon`
     `({ name, ...props })` maps the 8 known keys to icon components, falls back to
     a generic (`StarIcon` / `TargetIcon`) for unknown keys.
   - **New icons in `app/components/icons.tsx`** (same 24×24 / 2px `Svg` wrapper):
     `LayersIcon`, `WorkflowIcon`, `GaugeIcon`, `RocketIcon`, `PuzzleIcon`,
     `ShieldIcon`, `SparklesIcon`, `CodeIcon`. Keep them simple and consistent
     with the existing set (outline, rounded caps).
8. **"Course Content"** — section header row: `<h2>` "Course Content"
   (`font-display text-[24px] sm:text-[28px]`) on the left, right-aligned meta
   `\`${moduleCount} modules\`` + `· ${lessonCount} lessons` (duration appended
   only when `> 0`), `text-small text-neutral-500`.
   - **New client component** `app/(site)/courses/[slug]/course-content.tsx`
     (`"use client"`) — the accordion. Props: `modules` (already shaped by
     `COURSE_QUERY`), `courseSlug`.
     - Renders a vertical list. Each **module row**: left rail with the 1-based
       index in a `size-8 rounded-full border` circle + a connecting vertical
       line between rows (`before:`/pseudo or an absolutely-positioned
       `bg-neutral-200` line; hidden for the last row). Main: module `title`
       (`text-body-lg font-semibold text-neutral-900`), `summary`
       (`text-body text-neutral-500`). Right: module duration (only when `> 0`)
       + `ChevronDownIcon` that rotates 180° when open.
     - The whole row header is a `<button aria-expanded aria-controls>` toggling
       an panel that lists the module's lessons: `\`${m}.${l}\`` label +
       lesson title as `<Link href={\`/courses/${courseSlug}/${lesson.slug}\`}>`,
       a `LockIcon` when `!lesson.freePreview` else a `PlayCircleSolid`, and
       `formatDuration(lesson.durationSeconds)` when set. `freePreview` lessons
       get a small `Free` tag (`text-primary-500`).
     - **"Show all N modules" toggle**: when `modules.length > 6`, collapse to the
       first 6 and render a centered `<button>` ("Show all N modules" ⌄ /
       "Show fewer" ⌃) using the `tertiary` button look. With the current data
       (4 modules) the toggle never shows — correct, and it will start working
       once courses have more modules. Default all rows **collapsed**.
   - Accordion state is local `useState` (a `Set<number>` of open indices, or
     `openIndex` single-open — use **multi-open** `Set`, closer to the chevrons in
     the reference). No URL state, no persistence.
9. **`next.config.ts`**: add
   ```ts
   images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io',
     pathname: '/images/**' }] }
   ```
   so `next/image` can load Sanity assets. Nothing else.
10. **Page shell / spacing**: `mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-10 py-10
    sm:py-12` on a `<main>`. Breadcrumb at top (`All Courses` → `/courses`,
    current course title as plain text). Reuse the visual of `Breadcrumbs` but
    render inline in the page with real `<Link>`s + `ChevronRightIcon` separators
    (the shared `Breadcrumbs` component hard-codes `href="#"` and is unfit).
    Sections stacked with `space-y-12 sm:space-y-16`.
11. **Responsive**: hero two-column `lg:grid-cols-[380px_1fr] gap-8 lg:gap-12`,
    stacks below `lg` (cover first, capped `max-w-[420px]`). "What you'll learn"
    grid `sm:grid-cols-2` → 1 col on mobile. Course-content left rail narrows,
    duration/chevron stay on the right, lesson links wrap. No horizontal scroll
    at 320px. Button row `flex-col sm:flex-row` full-width buttons on mobile.
12. **`level` list-value drift** (`"intermediate"` vs schema `"Intermediate"`) is
    pre-existing seed data; this task only capitalizes for display, does not
    "fix" content or the schema.

## Files to touch

- `app/(site)/courses/[slug]/page.tsx` — **new**. Server Component: fetch, guard,
  hero, "What you'll learn", "Course Content", `generateStaticParams`,
  `generateMetadata`. Local helpers `capitalize`, `formatDuration`, `formatCount`
  (inline or a tiny `app/lib/format.ts` — prefer `app/lib/format.ts` so the lesson
  page can reuse them later).
- `app/(site)/courses/[slug]/course-content.tsx` — **new**. `"use client"`
  accordion + show-all toggle.
- `app/lib/format.ts` — **new**. `capitalize`, `formatDuration(seconds)`,
  `formatCount(n)`.
- `app/components/learning-outcome-icon.tsx` — **new**. Icon-key → component map.
- `app/components/icons.tsx` — **add** `LayersIcon`, `WorkflowIcon`, `GaugeIcon`,
  `RocketIcon`, `PuzzleIcon`, `ShieldIcon`, `SparklesIcon`, `CodeIcon`.
- `app/components/button.tsx` — **add** `ButtonLink` (same variant/size maps,
  renders `next/link`).
- `sanity/lib/queries.ts` — **edit** `COURSE_QUERY`: add per-module
  `"durationSeconds": math::sum(lessons[]->durationSeconds)` and keep lesson
  projection (`_id, title, "slug": slug.current, durationSeconds, freePreview`).
  Also add `"moduleCount": count(modules)` for parity with `COURSES_QUERY`.
- `sanity/lib/sanity.types.ts` — **regenerated** by `npm run typegen` (do not edit
  by hand).
- `next.config.ts` — **edit**: add `images.remotePatterns` for `cdn.sanity.io`.

No new dependencies. No env, middleware, or route-handler changes. No Clerk/PostHog.

## Requirements

- `/courses/<slug>` renders the course from Sanity for all 10 seeded slugs;
  unknown slug → 404 via `notFound()`.
- Desktop matches `design/vertex-course.png`: breadcrumb, square cover left,
  POPULAR pill + serif title + summary + meta + Start Learning / Bookmark right,
  bordered "What you'll learn" 2×2 card, "Course Content" header with right-aligned
  count, numbered timeline accordion rows with chevrons, centered show-all toggle
  (when > 6 modules).
- Progress UI (sticky footer, % bar) intentionally absent.
- Durations render only when present (`> 0`); with current data they are hidden
  and the meta/section lines degrade cleanly.
- `level` displayed capitalized. `studentCount` shown as `18.2k` style, omitted
  when unset.
- Instructor surfaced as a one-line byline linking to `/instructors/<slug>`.
- Accordion: rows collapse/expand, `aria-expanded` / `aria-controls` correct,
  chevron rotates, lesson links point to `/courses/<slug>/<lessonSlug>`,
  non-preview lessons show a lock affordance (label only — not access control).
- Server Component page; the only `"use client"` module is `course-content.tsx`.
  No token or Sanity client reaches the browser (data is passed as already-shaped
  serializable props).
- Responsive mobile→desktop, no horizontal scroll at 320px.
- Reuse `Button`/`ButtonLink`, `Badge`, existing icons, `@theme` tokens. No new
  Tailwind config beyond `next.config` images.
- Semantics: one `<h1>`, `<section>` landmarks with headings, `alt` on the cover,
  `aria-label` on icon-only / no-op controls, breadcrumb in `<nav aria-label>`.

## Security considerations

- All Sanity reads go through `sanityFetch` (`server-only`, token-bound) inside the
  Server Component. `course-content.tsx` receives only plain serializable data —
  no client-side Sanity client, no token, no GROQ in the browser (AGENTS.md §5/§12).
- `next/image` `remotePatterns` scoped to `https://cdn.sanity.io/images/**` only.
- No user input handled, no writes, no new routes/handlers. Bookmark button and
  breadcrumb "All Courses" link are inert/forward-only. `freePreview` is a label,
  never gates content (AGENTS.md §7).
- No secrets added; `.env.example` unchanged.

## Acceptance criteria

- `npx tsc --noEmit` clean.
- `npm run lint` clean (no `no-img-element`, no `react/no-unescaped-entities`,
  no unused vars).
- `npm run typegen` produces a `COURSE_QUERY_RESULT` with `modules[].durationSeconds`
  and `moduleCount`; committed.
- `npm run build` succeeds (new route) — **stop `next dev` first** (Windows build
  lock, see memory `windows-build-needs-dev-server-stopped`).
- `npm run dev`: `/courses/nextjs-app-router-in-depth` renders with no console
  errors; a bogus slug renders the 404.

## Checks to run

```
npm run typegen
npx tsc --noEmit
npm run lint
# stop dev server, then:
npm run build
npm run dev   # visual pass on 2–3 course slugs + a 404
```

## Manual test steps

1. `npm run dev`, open `/courses/nextjs-app-router-in-depth`.
2. Header/breadcrumb: `All Courses ▸ Next.js App Router in Depth`; "All Courses"
   links to `/courses`.
3. Hero: cover image on the left; `POPULAR` pill (this course has `popular: true`),
   serif title, summary, `Taught by Mira Kovac` line, meta row
   `Intermediate · 4 modules · 18.2k students` (no duration — data has none),
   `Start Learning →` (goes to the first lesson) + `Bookmark` button.
4. Open a course with `popular: false` (e.g. one from the catalog list) — no pill.
5. "What you'll learn": bordered card, 2×2 on desktop, four outcomes each with an
   orange icon matching its key (`layers`, `workflow`, `gauge`, `rocket`).
6. "Course Content": right-aligned `4 modules · 12 lessons`. Four numbered rows
   with connecting line. Click a row → expands to 3 lessons labelled `1.1`–`1.3`,
   each linking to `/courses/<slug>/<lessonSlug>`; non-preview lessons show a lock,
   the `freePreview` lesson shows `Free`. Chevron rotates. Collapse again.
7. No "Show all" toggle appears (only 4 modules). No sticky progress bar anywhere.
8. Visit `/courses/does-not-exist` → 404 page.
9. Resize to ~768px (hero stacks, outcomes still 2-up or 1-up) and 320px
   (everything 1 column, no horizontal scroll, accordion usable).
10. Tab through: focus rings on breadcrumb link, both buttons, every accordion
    header, every lesson link.
11. View source / DevTools: no Sanity token, no `SANITY_API_READ_TOKEN`, no raw
    GROQ in the client bundle.
