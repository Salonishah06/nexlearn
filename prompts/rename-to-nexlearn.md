# Implementation Prompt — Rename app "Vertex" → "nexLearn"

## Goal
Rename the product from **Vertex** to **nexLearn** across the whole repo (code, comments, copy, docs, prompt files), then open a PR.

## Skills read
None required — mechanical rename. Followed AGENTS.md working loop.

## Code inspected
`grep -i vertex` over the repo (excluding `node_modules`) — 11 files:
- `app/components/logo.tsx` — exports `VertexMark` (SVG "V" mark), header comment.
- `app/components/site-header.tsx` — imports `VertexMark`, renders it + `Vertex` wordmark.
- `app/components/navigation.tsx` — imports `VertexMark`, renders it + `Vertex` wordmark.
- `app/components/icons.tsx` — `Vertex icon set` comment.
- `app/design-system/page.tsx` — imports `VertexMark`, uses it, `Vertex` masthead + body copy + footer.
- `app/layout.tsx` — `metadata.title` / `metadata.description`.
- `app/page.tsx` — hero sub-copy "Vertex understands…".
- `app/globals.css` — design-tokens header comment.
- `AGENTS.md` — product name in prose.
- `prompts/clerk-auth.md`, `prompts/vertex-home.md` — product name in prose.

`package.json` `name` is already `nexlearn`. `README.md` is the stock create-next-app readme (no "Vertex"). `design/*.png` are binary reference images — left untouched.

## Decisions / assumptions
- Display/brand string is **`nexLearn`** (camelCase, as the user wrote it).
- React identifier `VertexMark` → `NexLearnMark` (and its import sites).
- The logo SVG shape is **unchanged** — renaming only, no UI redesign (AGENTS.md §3). Comment updated to "nexLearn mark".
- `prompts/vertex-home.md` → renamed to `prompts/nexlearn-home.md`, contents updated. Historical `# Implementation Prompt` heading updated too.
- `design/vertex-home.png` / `design/vertext-designsystem.png` keep their filenames; prompt references to those paths stay as-is.
- AGENTS.md prose updated to say nexLearn. The `next dev` auto-block is not touched.

## Files to touch
- `app/components/logo.tsx`
- `app/components/site-header.tsx`
- `app/components/navigation.tsx`
- `app/components/icons.tsx`
- `app/design-system/page.tsx`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `AGENTS.md`
- `prompts/clerk-auth.md`
- `prompts/vertex-home.md` → `prompts/nexlearn-home.md` (git mv + edit)
- (new) `prompts/rename-to-nexlearn.md` — this file

## Requirements
- No occurrence of "Vertex"/"vertex" as the product name remains in tracked files (except inside `node_modules`).
- `NexLearnMark` compiles; all import sites updated.
- No visual/layout change beyond the wordmark text.

## Security considerations
None — no secrets, routes, auth, or data access touched.

## Acceptance criteria
- `grep -ri vertex` (excl. `node_modules`) returns nothing.
- Type check + lint pass.
- Home page and design-system page render with "nexLearn" wordmark.

## Checks to run (web workspace)
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` (layout/metadata + component changes)

## Manual test steps
1. `npm run dev`, open `http://localhost:3000` — header shows the mark + `nexLearn`; hero sub-copy reads "nexLearn understands…".
2. Browser tab title reads "nexLearn — Search your learning in plain English".
3. Open `/design-system` — masthead, body copy, and footer say "nexLearn".
4. Resize below 400px — wordmark hides, mark stays (unchanged behavior).

## PR
Branch is already `feat/home-and-clerk-auth`. Commit the rename and open a PR against `main`.
