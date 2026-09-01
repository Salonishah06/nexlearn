# Implementation Prompt — Sanity content model, Studio, and server-side data layer

## Goal

Stand up the **content foundation** for nexLearn:

1. The **Sanity schema** for the five content types — `course`, `module`
   (embedded object), `lesson`, `instructor`, `category` — plus the shared
   Portable Text and small object types they need.
2. A **curated Studio structure** so authors see a sensible desk.
3. The **server-only data layer** in the web app: a read client bound to the
   private-dataset token, a typed `sanityFetch` helper with Next.js cache tags,
   a GROQ query module, and **Sanity TypeGen** wired up.

Out of scope (later tasks, do **not** build): the `video` ingestion document, the
`agentContext` search-config document, the `progress` record, any pages/UI, the
search route, PostHog, and content seeding/migration.

## Skills / docs read

- `AGENTS.md` / `CLAUDE.md` — §5 (Studio vs web boundaries; **data access is a
  server-only Sanity client + fetch helper reading a private dataset with a
  token**; browser holds no token, never fetches content), §6 (`next-sanity`,
  `@sanity/image-url`, `@portabletext/react`; no public dataset, no client-side
  token, no embedded Studio), §7 (content is **Portable Text and typed fields,
  never markdown**; lessons link videos by URL; a lesson does not store its parent
  course), §8 (**the field-level spec for every type — treated as authoritative
  below**), §11 (search must match a PT field via its **plain-text projection**,
  not the PT array — informs `pt::text()` projections), §12 (private dataset, read
  token server-only, `.env.example` is the canonical env list; Context MCP needs a
  **deployed Studio app**, not just a schema), §13 (checks).
- `node_modules/next-sanity` — exports `createClient`, `defineQuery` (re-exported
  from `groq`), `defineLive`. `defineQuery` is what lets TypeGen infer per-query
  result types.
- `node_modules/@sanity/codegen` `6.1.2` — backs `sanity typegen generate`;
  `sanity schema extract` produces `schema.json` locally (no auth needed).
- `node_modules/next/…/server-only` — present; used to hard-fail any client-side
  import of the data layer.
- **`sanity-best-practices` skill (AGENTS.md §4) is NOT installed on this machine**
  (`~/.claude/skills/` and `.claude/skills/` only contain the three
  `*-sanity-context` skills). Falling back to the `sanity` / `next-sanity` package
  docs and the existing scaffold patterns, per AGENTS.md §4's closing line.

## Code inspected

- `sanity/schemaTypes/index.ts` — `schema.types` is currently `[]`. This is where
  new types register.
- `sanity/structure.ts` — default `S.documentTypeListItems()` catch-all.
- `sanity/env.ts` — exports `apiVersion` (`NEXT_PUBLIC_SANITY_API_VERSION` ||
  `2026-09-01`), `dataset`, `projectId`, all asserted. Has an `assertValue` helper
  to reuse.
- `sanity/lib/client.ts` — `createClient` from `next-sanity`, `useCdn: true`, no
  token, no `perspective`.
- `sanity/lib/live.ts` — scaffolded `defineLive({ client })`. **Unused** (no
  `<SanityLive/>` mounted). Left untouched by this task.
- `sanity/lib/image.ts` — `urlFor` builder. Fine as-is.
- `sanity.config.ts` — `basePath: '/studio'`, `structureTool` + `visionTool`,
  imports `./sanity/schemaTypes` and `./sanity/env`.
- `sanity.cli.ts` — `defineCliConfig` reading `NEXT_PUBLIC_SANITY_PROJECT_ID` /
  `NEXT_PUBLIC_SANITY_DATASET`.
- `.env.local` — **already has** `NEXT_PUBLIC_SANITY_PROJECT_ID` and
  `NEXT_PUBLIC_SANITY_DATASET`. **No `SANITY_API_READ_TOKEN` yet.**
- `.env.example` — lists only Clerk vars. **Missing every Sanity var** — must be
  brought up to canonical.
- `package.json` — deps already include `sanity` `^5.31.2`, `next-sanity`
  `^13.3.3`, `@sanity/image-url`, `@sanity/vision`, `styled-components`. Scripts:
  `dev`/`build`/`start`/`lint` only — **no `typegen`**. `@portabletext/react` is
  only transitive (via `next-sanity`); **not added** here (no PT rendering in this
  task).
- `app/(site)/page.tsx`, `app/components/course-summary-card.tsx`,
  `app/components/card.tsx` — placeholder catalog/lesson UI. Fields the UI already
  implies: course `level` (Beginner/Intermediate/…), a duration string, module
  count, "Lesson 5.1" / "Module 5" labels (derived from order), lesson `duration`
  shown as `mm:ss`, `Video`/`Lesson` badges, resources with a `type` + size.
- `app/(site)/layout.tsx` — Clerk lives here, **not** in the root layout (recent
  fix). No change needed; the data layer never touches auth.

## Decisions & assumptions

### Schema

1. **File layout** (flat, `defineType`/`defineField`/`defineArrayMember`
   throughout for TypeGen accuracy), all registered in
   `sanity/schemaTypes/index.ts`:
   - `blockContentType.ts` — shared Portable Text: standard block styles (normal,
     h2–h4, blockquote), bullet/number lists, `strong`/`em`/`code` decorators,
     link annotation (`url`, validated), and an inline `image` with `alt`. Used by
     `lesson.notes` and `instructor.bio`.
   - `categoryType.ts` — document: `title`, `slug` (source `title`),
     `description` (text).
   - `instructorType.ts` — document: `name`, `slug`, `photo` (image, `hotspot`,
     `alt`), `expertise` (array of `string`), `bio` (`blockContent`).
   - `lessonType.ts` — document:
     `title`, `slug`, `videoUrl` (`url`, rule: `https`, providers noted in
     description — YouTube/Vimeo/Bunny), `poster` (image, hotspot, alt),
     `durationSeconds` (number, positive int — UI formats to `mm:ss`; seconds
     chosen over a string so search "clip length" and future video-seek math work
     off one field), `freePreview` (boolean, default false — **label only, not
     access control**, per §7), `studentCount` (number, display-only),
     `notes` (`blockContent`), `keyPoints` (array of `string` — "in this lesson
     you will"), `proTip` (text, optional), `resources` (array of
     `resource` objects). **No parent-course field** (§7/§8 — derived by reverse
     reference).
   - `resourceType.ts` — object: `type` (string, list: `pdf`/`link`/`code`/
     `video`/`other`), `title`, `description` (text), `url` (`url`).
   - `learningOutcomeType.ts` — object: `icon` (string — a key the UI maps to a
     Lucide-style icon; kept as string, not image, matching the icon-component
     pattern in `design-system`), `title`, `description` (text). Powers the
     "What you'll learn" section.
   - `moduleType.ts` — **object, not a document** (§8): `title`, `summary`
     (text), `lessons` (array of `reference` → `lesson`). "Module 5" / "Lesson
     5.1" are **not stored** — derived from array order later.
   - `courseType.ts` — document:
     `title`, `slug`, `summary` (text), `coverImage` (image, hotspot, alt),
     `level` (string, list: `Beginner`/`Intermediate`/`Advanced`),
     `price` (number, ≥ 0), `popular` (boolean, optional/default false),
     `studentCount` (number, display-only), `learningOutcomes` (array of
     `learningOutcome`), `instructor` (`reference` → `instructor`, required),
     `category` (`reference` → `category`, required), `modules` (array of
     `module`, ordered).
2. **Course total duration is derived, not stored** — summed from
   `modules[].lessons[]->durationSeconds` at query time. Keeps authors from
   hand-maintaining a number and avoids drift.
3. Every document type gets a `preview` (title + a useful subtitle/media) and,
   where an ordered list matters, sensible `orderings`. Slugs use
   `validation: Rule.required()` and `slugify` defaults.
4. Required-field validation only where a downstream page would break without it
   (title, slug, course.instructor, course.category, lesson.videoUrl). Everything
   else optional to keep authoring unblocked.

### Studio structure

5. `sanity/structure.ts` — explicit curated list: **Courses**, **Lessons**,
   **Instructors**, **Categories** (each `S.documentTypeList(...)`), with a
   divider. No auto catch-all (so the later `video` / `agentContext` docs don't
   leak in unstyled). `module`/`resource`/`learningOutcome`/`blockContent` are
   objects and never appear as document lists.

### Data layer (server-only)

6. **Home:** the app read layer stays in `sanity/lib/` — the established
   `next-sanity` scaffold location — rather than a new web-root `lib/`. Less
   churn, matches the files already there. The server/client and token invariants
   (below) are what AGENTS.md actually requires, and they're all enforced here.
7. `sanity/lib/client.ts` — reconfigure the existing client: `useCdn: false`
   (private dataset; we want fresh reads + tag revalidation), `perspective:
   'published'`, `stega: false`. **Still no token** — this base client is safe to
   reference anywhere.
8. `sanity/lib/token.ts` — **new**. `import 'server-only'`;
   `export const readToken = assertValue(process.env.SANITY_API_READ_TOKEN,
   'Missing environment variable: SANITY_API_READ_TOKEN')` (reuse `env.ts`'s
   helper or inline an equivalent). Never `NEXT_PUBLIC_`.
9. `sanity/lib/fetch.ts` — **new**. `import 'server-only'`. Builds the authed
   client once: `const serverClient = client.withConfig({ token: readToken })`.
   Exports:
   ```ts
   export async function sanityFetch<const Q extends string>({
     query, params = {}, tags = [], revalidate = 3600,
   }: { query: Q; params?: Record<string, unknown>; tags?: string[]; revalidate?: number | false }):
     Promise<...>            // return type via next-sanity's ClientReturn / query-typed
   ```
   passing `{ next: { revalidate, tags } }` to `serverClient.fetch`. Default
   revalidate 1h; callers pass tags like `['course', 'course:'+slug]` for
   on-demand revalidation later.
10. `sanity/lib/queries.ts` — **new**. All wrapped in `defineQuery` so TypeGen
    emits result types. Minimal-but-complete set for the known content surfaces:
    - `COURSES_QUERY` — catalog grid: all courses `order(popular desc, title asc)`
      with `instructor->{name,slug}`, `category->{title,slug}`, `coverImage`,
      `level`, `price`, `popular`, `studentCount`, `"moduleCount": count(modules)`,
      `"lessonCount": count(modules[].lessons[])`,
      `"durationSeconds": math::sum(modules[].lessons[]->durationSeconds)`.
    - `COURSE_QUERY($slug)` — detail: scalar fields + `learningOutcomes`,
      `instructor->{name,slug,photo,expertise}`, `category->{title,slug}`,
      `modules[]{title, summary, lessons[]->{ _id, title, "slug": slug.current,
      durationSeconds, freePreview }}`.
    - `LESSON_QUERY($slug)` — lesson page: scalar fields, `notes`, `keyPoints`,
      `proTip`, `resources`, `poster`, `videoUrl`, `durationSeconds`,
      `freePreview`, `"plainNotes": pt::text(notes)` (search/plain use), plus the
      **derived parent course** via reverse ref:
      `"course": *[_type=="course" && references(^._id)][0]{ title,
      "slug": slug.current, instructor->{name,slug},
      "moduleIndex": …, "lessonIndex": … }` — module/lesson index computed from
      array position so the page can render "Lesson 5.1".
    - `INSTRUCTOR_QUERY($slug)` — instructor + `"courses": *[_type=="course" &&
      references(^._id)]{title,"slug":slug.current,coverImage,level}`.
    - `INSTRUCTORS_QUERY`, `CATEGORIES_QUERY` — simple ordered lists.
    - `COURSE_SLUGS_QUERY`, `LESSON_SLUGS_QUERY` — `{ "slug": slug.current }` for
      `generateStaticParams` later.
    Each query gets a one-line comment naming its consumer page.
11. `sanity/lib/index.ts` — **new**, barrel re-exporting `client`, `urlFor`,
    `sanityFetch`, and `* from './queries'` for tidy page imports.

### TypeGen

12. **`sanity-typegen.json`** at repo root:
    ```json
    { "path": "./sanity/**/*.{ts,tsx}", "schema": "./schema.json",
      "generates": "./sanity/lib/sanity.types.ts" }
    ```
13. **`package.json` script**: `"typegen": "sanity schema extract && sanity
    typegen generate"`.
14. `schema.json` → **gitignored** (build artifact). `sanity/lib/sanity.types.ts`
    → **committed** (so CI/other devs get types without running Sanity), and added
    to the ESLint ignore list + a `// @ts-nocheck`-free generated header comment
    is kept as-emitted.
15. Run `npm run typegen` as part of this task and commit the generated file.
    `sanity schema extract` runs offline against `sanity.config.ts`.

### Env

16. Rewrite `.env.example` to be the **canonical list** (§12): keep the Clerk
    block, add a **Sanity** block —
    `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
    `NEXT_PUBLIC_SANITY_API_VERSION` (browser-safe: project id/dataset/api version
    are public identifiers), and `SANITY_API_READ_TOKEN` (**server-only**, Viewer
    role, comment: never `NEXT_PUBLIC_`, read access to the private dataset).
    Force-add since `.env*` is gitignored.
17. The real `SANITY_API_READ_TOKEN` value must be created by the user in
    sanity.io/manage (Viewer token) and pasted into `.env.local` — **Needs your
    attention**. `npm run typegen`, type-check, and lint all pass without it;
    only actually fetching data at runtime needs it.

### Things explicitly not done

18. No Studio deploy, no schema deploy, no dataset content — those need the
    user's Sanity login. Commands provided in the report. Pages will render empty
    until content exists (no pages in this task anyway).
19. `live.ts` left as-is (unused scaffold; removing it is out of scope).
20. No `progress`, `video`, `agentContext` types. No `@portabletext/react` dep.

## Files expected to touch

**New**
- `sanity/schemaTypes/blockContentType.ts`
- `sanity/schemaTypes/categoryType.ts`
- `sanity/schemaTypes/instructorType.ts`
- `sanity/schemaTypes/lessonType.ts`
- `sanity/schemaTypes/resourceType.ts`
- `sanity/schemaTypes/learningOutcomeType.ts`
- `sanity/schemaTypes/moduleType.ts`
- `sanity/schemaTypes/courseType.ts`
- `sanity/lib/token.ts`
- `sanity/lib/fetch.ts`
- `sanity/lib/queries.ts`
- `sanity/lib/index.ts`
- `sanity/lib/sanity.types.ts` (generated, committed)
- `sanity-typegen.json`

**Edited**
- `sanity/schemaTypes/index.ts` — register the 8 types.
- `sanity/structure.ts` — curated desk.
- `sanity/lib/client.ts` — `useCdn:false`, `perspective:'published'`, `stega:false`.
- `package.json` — `typegen` script.
- `.env.example` — canonical Sanity + Clerk list.
- `.gitignore` — add `schema.json`.
- `eslint.config.*` — ignore `sanity/lib/sanity.types.ts` (if lint flags it).

## Requirements

- Schema matches AGENTS.md §8 relationships and named fields exactly; `module` is
  an embedded object, `lesson` has no parent-course field, derived numbers are not
  stored.
- All schema uses `defineType`/`defineField`/`defineArrayMember`.
- `sanity/lib/token.ts` and `sanity/lib/fetch.ts` both start with
  `import 'server-only'`; the token is read only from `SANITY_API_READ_TOKEN`
  (no `NEXT_PUBLIC_`); the browser bundle never includes the token or a
  token-bound client.
- `client.ts` has no token and `useCdn:false`.
- Every GROQ query is a `defineQuery` export; PT fields are matched/consumed via
  `pt::text()` projections where a plain string is needed.
- `npm run typegen` regenerates `sanity/lib/sanity.types.ts` with no error;
  the committed copy is up to date.
- `.env.example` lists every var the app reads, with server-only ones marked.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.

## Security considerations

- **Private dataset stays private**: the only token is `SANITY_API_READ_TOKEN`,
  read from a non-public env var, imported only through `server-only` modules,
  attached to a client created inside `fetch.ts` (server). `client.ts` (tokenless)
  is the only Sanity client safe to import from shared code.
- No write token anywhere (progress writes are a later task with their own server
  route).
- `defineLive`/`<SanityLive>` intentionally **not** wired — it would stream a
  browser token; deferred until a feature needs live content.
- `.env*` remains gitignored; only `.env.example` (placeholders) is committed.
- Existing `next.config.ts` `images` config not touched here; when pages render
  Sanity images later they'll need `cdn.sanity.io` in `remotePatterns` — noted,
  not done now.
- No secrets printed or committed; will not read `.env.local` values.

## Acceptance criteria

- `npm run typegen` runs clean; `git diff` on `sanity/lib/sanity.types.ts` after a
  fresh run is empty.
- `npx tsc --noEmit` clean, `npm run lint` clean, `npm run build` succeeds.
- `npm run dev` → `/studio` loads; the desk shows **Courses / Lessons /
  Instructors / Categories**; opening "Create" on each renders all fields with no
  schema console errors; `module` appears only as an array item inside a course,
  never as its own document type.
- A grep shows `SANITY_API_READ_TOKEN` referenced only in `sanity/lib/token.ts`,
  and `server-only` imported at the top of `token.ts` and `fetch.ts`.
- `sanity/lib/queries.ts` exports `COURSES_QUERY`, `COURSE_QUERY`,
  `LESSON_QUERY`, `INSTRUCTOR_QUERY`, `INSTRUCTORS_QUERY`, `CATEGORIES_QUERY`,
  `COURSE_SLUGS_QUERY`, `LESSON_SLUGS_QUERY`, each `defineQuery`.
- `.env.example` contains the four Sanity vars with `SANITY_API_READ_TOKEN`
  marked server-only; `schema.json` is gitignored.

## Checks to run

```
npm run typegen
npx tsc --noEmit
npm run lint
npm run build
npm run dev        # open /studio, exercise each document form
```

## Manual test steps

1. `npm run typegen` → completes; `sanity/lib/sanity.types.ts` (re)generated;
   re-run → `git status` shows it unchanged.
2. `npm run dev`, open `http://localhost:3000/studio`.
3. Desk left rail shows exactly **Courses, Lessons, Instructors, Categories**
   (plus a divider). No "Module", "Resource", "Block Content" entries.
4. **Categories** → Create → fill title; `slug` auto-generates from title; save.
5. **Instructors** → Create → name, upload a photo (hotspot works), add two
   `expertise` tags, write a `bio` with a heading + a link; save.
6. **Lessons** → Create → title, slug, a `https` YouTube URL (a non-https URL is
   rejected), `durationSeconds` (e.g. 765), toggle `freePreview`, add a
   `keyPoints` entry, add one `resource` (type = pdf, title, url), write `notes`
   with formatting; save.
7. **Courses** → Create → title, slug, summary, cover image, `level` picker
   (three options), price, `popular` toggle, one `learningOutcome`
   (icon key + title + description), pick the instructor and category
   (required — save is blocked until both set), add a `module` with a title,
   summary, and a reference to the lesson from step 6; save.
8. In **Vision** (Studio), run
   `*[_type=="course"]{title, "lessons": count(modules[].lessons[]),
   "dur": math::sum(modules[].lessons[]->durationSeconds)}` → returns the course
   with counts derived, confirming the catalog projection shape.
9. In Vision run `*[_type=="lesson"][0]{ "course": *[_type=="course" &&
   references(^._id)][0].title }` → resolves the parent course by reverse ref.
10. Confirm `.next` client chunks contain no `SANITY_API_READ_TOKEN`
    (`npm run build` then grep the client bundle) — server-only import guarantees
    the build fails if the data layer is pulled client-side.
