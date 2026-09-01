# Implementation Prompt — Isolate Sanity Studio from the Clerk root layout

## Goal

Fix the runtime error shown at **`/studio`**:

> Clerk: `auth()` was called but Clerk can't detect usage of `clerkMiddleware()`.
> `app/layout.tsx (33:11) @ RootLayout` → `<SiteHeader />`

Stop the Studio route from rendering the Clerk‑dependent site chrome, without
weakening auth anywhere else and without changing any public URL.

## Why this happens (root cause)

- `proxy.ts` at the repo root **is** correct and **is** picked up — `@clerk/nextjs`
  `7.8.3` supports the Next 16 `proxy.ts` convention
  (`node_modules/@clerk/nextjs/dist/esm/server/fs/middleware-location.js`
  lists `["middleware", "proxy"]` for Next ≥ 16).
- `app/studio/[[...tool]]/page.tsx` sets `export const dynamic = 'force-static'`
  (the `next-sanity` template default).
- `force-static` makes Next prerender the **whole tree for that route**, including
  the root `app/layout.tsx`.
- The root layout renders `<SiteHeader />`, which uses Clerk's `<Show>` — a server
  component that calls `auth()`.
- In a forced‑static render there is no request decorated by `clerkMiddleware`, so
  `auth()` can't find the middleware marker header and throws the
  `auth-middleware` error (`app-router/server/auth.js` → `authAuthHeaderMissing`).

So the error is not a misplaced/missing proxy file — it's that a static route is
pulling in a layout that needs a live Clerk request. Every other route is dynamic
enough that `clerkMiddleware` has run, so they're fine.

## Skills / docs read

- `AGENTS.md` / `CLAUDE.md` — §5 (Studio must not be embedded in Next.js; auth is
  Clerk via middleware, gate only what's marked private), §7 (browsing public),
  §12 (protect in middleware, not client), §13 (checks).
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
  — Next 16 Middleware → Proxy; `proxy.ts` at project root; matcher semantics.
- `node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js`,
  `.../app-router/server/auth.js`,
  `.../server/fs/middleware-location.js` — how `auth()` detects the middleware and
  which error it throws when it can't.

## Code inspected

- `app/layout.tsx` — root layout owns `<html>`/`<body>`; `<body>` renders
  `<ClerkProvider>` wrapping `<SiteHeader />` + `{children}`.
- `app/components/site-header.tsx` — server component; uses `Show`, `SignInButton`,
  `SignUpButton`, `UserButton` from `@clerk/nextjs`. This is the only `auth()`
  caller in the shared tree.
- `app/studio/[[...tool]]/page.tsx` — `NextStudio` + `dynamic = 'force-static'`,
  re‑exports `metadata`/`viewport` from `next-sanity/studio`.
- `proxy.ts` — `clerkMiddleware()` default export + matcher (Next default 3‑part
  pattern incl. `/__clerk/:path*`). `/studio` matches the first matcher entry.
- Current routes: `app/page.tsx`, `app/design-system/page.tsx`,
  `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx`,
  `app/studio/[[...tool]]/page.tsx`. No `src/` dir. `sanity.config.ts` has
  `basePath: '/studio'`.

## Decision & approach

**Use a route group so only the site pages get the Clerk + header chrome; Studio
renders bare.** Route groups (`(name)`) don't affect URLs, so every path is
unchanged.

1. **Slim `app/layout.tsx` to a true root shell** — `<html>`/`<body>` + fonts +
   `globals.css` only. Remove `ClerkProvider` and `<SiteHeader />` from it.
2. **New `app/(site)/layout.tsx`** — a nested layout that renders
   `<ClerkProvider>` → `<SiteHeader />` → `{children}`. Move the Clerk import and
   header here. Type it with `{ children }: { children: React.ReactNode }` (route
   groups don't get a distinct generated `LayoutProps` key; keep it simple).
3. **Move the site pages under `app/(site)/`**:
   - `app/page.tsx` → `app/(site)/page.tsx`
   - `app/design-system/` → `app/(site)/design-system/`
   - `app/sign-in/` → `app/(site)/sign-in/`
   - `app/sign-up/` → `app/(site)/sign-up/`
4. **Leave `app/studio/` where it is** — now a direct child of the slim root
   layout, with no Clerk wrapper. Keep `dynamic = 'force-static'` (the Studio is a
   client app; static shell is what `next-sanity` wants).
5. `globals.css` stays imported once, in the root layout.
6. No change to `proxy.ts`. `clerkMiddleware` stays permissive; `/studio` still
   passes through it harmlessly (no `auth()` call in that subtree anymore).

### Why not the alternatives

- **Drop `force-static` from the Studio page** — would make `auth()` work, but the
  full marketing `SiteHeader` (nav + auth buttons) would still render stacked
  above the Studio UI. Wrong UX and still couples Studio to Clerk.
- **`dynamic = 'force-dynamic'` on the root layout** — makes every page dynamic,
  loses static optimization repo‑wide to paper over one route.
- **Conditionally render `SiteHeader`** by reading the pathname — not available in
  a server layout without extra plumbing; route groups are the idiomatic fix.

## Files expected to touch

- `app/layout.tsx` — slimmed to root shell (remove Clerk + header).
- `app/(site)/layout.tsx` — **new**, holds `ClerkProvider` + `SiteHeader`.
- `app/(site)/page.tsx` — moved from `app/page.tsx`.
- `app/(site)/design-system/page.tsx` — moved.
- `app/(site)/sign-in/[[...sign-in]]/page.tsx` — moved.
- `app/(site)/sign-up/[[...sign-up]]/page.tsx` — moved.
- `app/studio/[[...tool]]/page.tsx` — unchanged (verify only).
- Import paths inside moved files — fix relative `../` depth if any break
  (`site-header` import moves into the new layout; page files import from
  `app/components/*` which is still reachable — recheck each).

## Requirements

- `/studio` loads with no Clerk error and no marketing header — just the Sanity
  Studio full‑screen.
- `/`, `/design-system`, `/sign-in`, `/sign-up` render exactly as before, with the
  `SiteHeader` and working Clerk controls (signed‑out and signed‑in states).
- All URLs unchanged (route group is transparent).
- `ClerkProvider` still inside `<body>`.
- `proxy.ts` unchanged; no route protection added or removed.
- No secret/token handling changes.

## Security considerations

- No change to the server/client boundary, tokens, or route protection. `proxy.ts`
  still runs `clerkMiddleware` on all non‑asset routes including `/studio`.
- Studio auth is Sanity's own (unchanged) — this only stops Clerk's `auth()` from
  being invoked during Studio's static render.
- No env, key, or `.env.example` changes.

## Acceptance criteria

- Visiting `/studio` shows the Sanity Studio with no red error overlay and no
  `SiteHeader`.
- Visiting `/` shows the header; Sign in / Sign up modals work; after sign‑in the
  `UserButton` shows and persists on reload.
- `git grep` shows `ClerkProvider` only in `app/(site)/layout.tsx`.
- `npx tsc --noEmit` clean, `npm run lint` clean, `npm run build` succeeds
  (routes moved → build required).

## Checks to run

```
npx tsc --noEmit
npm run lint
npm run build
npm run dev     # check /studio and / by hand
```

## Manual test steps

1. `npm run dev`.
2. Open `/studio` → Sanity Studio renders full‑screen, **no** error overlay,
   **no** nexLearn header bar. Navigate within Studio (e.g. Vision) — still fine.
3. Open `/` → nexLearn header present; click **Sign up**, complete the modal →
   header shows `UserButton`; reload → still signed in.
4. Open `/design-system`, `/sign-in`, `/sign-up` → render as before, header
   present, no errors.
5. Hard refresh `/studio` once more (production‑like) → still clean.
6. `npm run build` → succeeds; `/studio` listed as static, `(site)` routes as
   before.
