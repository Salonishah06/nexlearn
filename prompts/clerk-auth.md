# Implementation Prompt — Clerk Authentication

## Goal

Add **Clerk authentication** to the nexLearn web app using the **Clerk CLI**
(`clerk init`), wired through Next.js 16 **proxy** middleware. Browsing stays
fully public; nothing is gated yet (no feature is marked protected). Add clear
sign-in / sign-up / signed-in controls to the existing `SiteHeader` so the user
can create and recognize their first account. This is the auth foundation only —
no progress writes, no protected routes, no server route handlers in this task.

## Skills / docs read

- `AGENTS.md` / `CLAUDE.md` — §5 (auth is Clerk, wired through Next.js
  middleware, gates only what a feature marks private, secret key server-only,
  only publishable key to the browser), §6 (`@clerk/nextjs`), §7 (Clerk, not
  Sanity auth or roll-your-own; browsing public), §12 (keys in env, committed
  `.env.example` as canonical list; Clerk secret key server-only; protect
  private routes in middleware, not client code), §13 (checks).
- **"Add Clerk Authentication" setup skill** (the task instructions) — CLI
  install, `clerk auth login`, `clerk init --app app_3IgAhVZHR5xCBPggizxhNVQxQ2x`,
  Next.js matcher verification (`/__clerk/:path*` after `/(api|trpc)(.*)`),
  `clerk doctor`, header controls, critical rules (async `auth()`,
  `ClerkProvider` inside `<body>`, never expose `CLERK_SECRET_KEY`).
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` — Next 16
  renamed Middleware → **Proxy**; file is `proxy.ts` at project root (same level
  as `app`), exports a `proxy` function (default or named) + `config.matcher`.

## Code inspected

- `package.json` — Next `16.3.3`, React `19.2.8`, npm (`package-lock.json`),
  no `src/` dir, app at repo root. Scripts: `dev`/`build`/`start`/`lint`.
  No test runner. No Clerk deps yet.
- `app/layout.tsx` — root layout owns `<html>`/`<body>`; `<body>` renders
  `<SiteHeader />` then `{children}`. Fonts via `next/font/google`.
- `app/components/site-header.tsx` — server component. Right cluster currently:
  a non-functional bell `<button>` + a **placeholder avatar** (`<span>` with
  `UserSolid` in a `bg-neutral-200` ring circle). This placeholder is what the
  real Clerk controls replace.
- `.gitignore` — `.env*` is ignored (opt-in to commit noted). No `.env*` files
  exist yet. No `proxy.ts` / `middleware.ts`. No `components.json` (shadcn
  step N/A).
- Single-workspace repo today: the "web workspace" of AGENTS.md §5 is the repo
  root. No Sanity Studio yet. Clerk installs at the root.

## Decisions & assumptions

1. **Use the Clerk CLI, not manual wiring.** Install globally with npm
   (`npm install -g clerk` — no existing preference), `clerk auth login`
   (interactive browser step — will pause for the user), then
   `clerk init --app app_3IgAhVZHR5xCBPggizxhNVQxQ2x` so the project links to the
   pre-created Clerk app. No `--framework` / `--pm` flags — let the CLI detect
   Next.js + npm.
2. **Proxy, not middleware.** Next 16 uses `proxy.ts`. Expect `clerk init` to
   scaffold it with `clerkMiddleware()` from `@clerk/nextjs/server`. After init,
   verify `config.matcher` and ensure it contains, once, right after the
   `/(api|trpc)(.*)` entry:
   ```ts
   '/(api|trpc)(.*)',
   '/__clerk/:path*',
   ```
   Add `'/__clerk/:path*'` if the CLI didn't. If the CLI writes `middleware.ts`
   instead (older SDK), rename to `proxy.ts` and rename the export to `proxy`
   per the Next 16 proxy doc, keeping `clerkMiddleware` as the handler.
3. **`clerkMiddleware` stays permissive.** No `createRouteMatcher` /
   `auth.protect()` calls — browsing is public per AGENTS.md §7. Gating is added
   later by whichever feature needs it.
4. **`ClerkProvider` inside `<body>`, wrapping everything.** Wrap both
   `<SiteHeader />` and `{children}` in `app/layout.tsx` (the header renders
   Clerk components, so it must be inside the provider). `<html>`/`<body>` stay
   as-is. If `clerk init` edits the layout itself, reconcile to this shape.
5. **Header auth controls replace the placeholder avatar.** In
   `app/components/site-header.tsx`, keep the bell button; replace the
   placeholder `<span>` avatar with, per the setup skill:
   ```tsx
   <Show when="signed-out">
     <SignInButton />
     <SignUpButton />
   </Show>
   <Show when="signed-in">
     <UserButton />
   </Show>
   ```
   imported from `@clerk/nextjs`. Style to match the header: `SignInButton` as a
   text/tertiary-style trigger (neutral-700 → neutral-900), `SignUpButton` as a
   filled `primary-500` pill (`h-9 px-4 rounded-md text-body font-medium`), both
   using `mode="modal"` so auth happens on-site. `UserButton` sized to the
   existing `h-9 w-9` avatar slot via `appearance={{ elements: { avatarBox:
   "h-9 w-9" } }}`. If the installed `@clerk/nextjs` lacks `Show`, fall back to
   `SignedIn` / `SignedOut` from the same package (same structure). The file can
   stay a server component (all four are server-safe wrappers).
6. **Env / `.env.example`.** `clerk init` writes
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to `.env.local`
   (gitignored — correct; secret key never reaches the browser). Add a committed
   **`.env.example`** as the canonical list (AGENTS.md §12) with empty values
   and a comment noting the publishable key is browser-safe and the secret key
   is server-only. Do not print or commit real key values. Force-add with
   `git add -f .env.example` since `.env*` is gitignored.
7. **Do not remove** the `next dev` agent-files block in `AGENTS.md`; if a
   `dev`-touched file shows the block re-added, commit it with the work.
8. **shadcn step skipped** — no `components.json`.
9. **Keep the generated block-scope small** — accept the CLI's provider/proxy
   scaffold, adjust only to the decisions above, don't restyle anything else.

## Files expected to touch

- `package.json` / `package-lock.json` — `@clerk/nextjs` added by `clerk init`.
- `proxy.ts` — **new** (CLI-scaffolded `clerkMiddleware` + matcher; matcher
  verified/patched).
- `app/layout.tsx` — `ClerkProvider` wrapping `<SiteHeader />` + `{children}`
  inside `<body>`.
- `app/components/site-header.tsx` — Clerk auth controls replace the placeholder
  avatar; bell kept.
- `.env.local` — **new**, CLI-written, gitignored (not committed).
- `.env.example` — **new**, committed, canonical env var list, placeholder
  values only.
- Possibly a `.clerk/` cache dir (CLI) — leave gitignored if the CLI adds it to
  `.gitignore`.

## Requirements

- Clerk SDK is `@clerk/nextjs` (not `@clerk/clerk-react`).
- `proxy.ts` at repo root, `clerkMiddleware` handler, matcher includes the
  Next default two-part pattern **plus** `'/__clerk/:path*'` after
  `'/(api|trpc)(.*)'`.
- `ClerkProvider` is inside `<body>`, never wrapping `<html>`.
- `CLERK_SECRET_KEY` only in `.env.local` / server; never referenced in a
  client component or with a `NEXT_PUBLIC_` prefix.
- Header shows Sign in + Sign up when signed out, `UserButton` when signed in;
  auth flows run on-site (`mode="modal"`), matching the existing header styling
  and staying responsive (controls `shrink-0`, cluster stays single-row down to
  320px).
- Public browsing unchanged — every current route still renders signed-out.
- `.env.example` committed and complete; no real secrets committed.

## Security considerations

- Publishable key (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) is browser-safe by
  design; secret key (`CLERK_SECRET_KEY`) is server-only, lives only in
  `.env.local`, and is never imported into client code — AGENTS.md §5/§12.
- Route protection, when added later, goes in `proxy.ts` (middleware), not
  client components — AGENTS.md §12.
- No progress/content writes introduced; no server route handlers; no tokens
  beyond Clerk's own. Browser still holds no Sanity token.
- `.env*` stays gitignored; only `.env.example` with empty values is
  force-added.
- Will not read or echo existing env files or real key values.

## Acceptance criteria

- `clerk doctor` reports no blocking issues.
- App builds and runs; `/` and all existing routes render for a signed-out
  visitor exactly as before, plus Sign in / Sign up in the header.
- Signing up via the header modal creates a user; header then shows
  `UserButton`; reload keeps the session.
- `proxy.ts` matcher contains `'/__clerk/:path*'` exactly once, after
  `'/(api|trpc)(.*)'`.
- `ClerkProvider` is inside `<body>` in `app/layout.tsx`.
- `.env.example` is committed with both Clerk vars and no real values;
  `.env.local` is not committed.
- `npx tsc --noEmit` clean; `npm run lint` clean; `npm run build` succeeds.

## Checks to run

```
clerk doctor
npx tsc --noEmit
npm run lint
npm run build
npm run dev     # verify header controls + sign-up flow
```

## Manual test steps

1. `npm run dev`, open `/`.
2. Header right side shows **Sign in** and **Sign up** (no placeholder avatar);
   bell still present.
3. Click **Sign up** — Clerk modal opens on-site (no redirect to clerk.com).
   Complete sign-up with a test email.
4. After sign-up, header shows the **`UserButton`** avatar in the `h-9 w-9`
   slot. Open it — account menu + Sign out work.
5. Reload `/` — still signed in.
6. Visit `/courses`, `/design-system`, `/my-learning` (may 404 if the route
   doesn't exist yet) — no auth wall, page/404 renders normally.
7. Sign out — header returns to Sign in / Sign up.
8. Resize to 320px — header stays one row, controls don't overflow or wrap.
9. Confirm `.next` build has no `CLERK_SECRET_KEY` in client bundles
   (`clerk doctor` + build output); `git status` shows `.env.example` staged,
   `.env.local` untracked/ignored.
```
