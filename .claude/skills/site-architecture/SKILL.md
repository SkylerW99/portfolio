---
name: site-architecture
description: Reference for this portfolio site's architecture — stack, MDX content pipeline, routing, filtering, and the reasoning behind each choice. Read this at the start of any session working in this repo, before making changes to vite.config.ts, routing, content structure, or the build-index script. Update this file immediately after any architecture change (new dependency affecting the content pipeline, routing scheme change, new page type, etc.) so it never drifts from the real code. Triggers — "site architecture", "how is this structured", "why is this built this way", "MDX pipeline", "routing", "how does filtering work", "how does the modal work", "project structure".
---

# Portfolio Site Architecture

Personal portfolio: landing page (intro + featured work), archive page (all work, filterable), about page. Some projects get a full case-study detail page, others open in a modal. Hand-coded by the user in React + TypeScript; Claude assists but the user writes/owns the code.

## Stack

**Vite + React Router + TypeScript.** Plain client-side SPA — no SSR, no server, no CMS.

Chosen over Next.js because the only SEO/link-preview need is the **main site URL** looking good when pasted into texts/LinkedIn (like the user's previous site, ziyijpg.com) — not per-project-page previews. A single static `index.html` with hardcoded OG meta tags covers that without any server rendering, so the simpler client-only stack was preferred. See "Accepted tradeoff" below.

## Content pipeline (the core design decision)

Each project is an `.mdx` file in `content/projects/*.mdx` — YAML frontmatter (metadata) + MDX body (rich content, can embed custom React components like iframes/video/interactive demos via normal ESM imports inside the `.mdx` file).

**Two-tier access, because `@mdx-js/rollup` compiles frontmatter + body into one JS module — there's no free way to load just the metadata:**

1. **Cheap tier — `scripts/build-index.mjs`**: a prebuild Node script, runs via `predev`/`prebuild` npm hooks (automatic, never run by hand). Uses `gray-matter` to read *only* the YAML frontmatter block from every `.mdx` file (no MDX compilation) and writes `src/content/generated-index.ts` — a plain typed array of `ProjectFrontmatter` objects, sorted newest-first. Validates required fields and that `frontmatter.slug` matches the filename, failing loudly at build time on mistakes. This generated file is **gitignored** (see `.gitignore`) since it's 100% derived — the `.mdx` files are the source of truth.
   - Used by: Archive page (list + filter), Landing page (featured list), ProjectModal (condensed content).
2. **Expensive tier — lazy MDX import**: `src/pages/ProjectDetail.tsx` uses `import.meta.glob('/content/projects/*.mdx')` (non-eager) to get a map of `() => import(...)` loaders, one per file. Only the specific project being viewed at `/work/:slug` actually gets fetched/compiled/rendered — confirmed in production builds where each project's body is its own separate JS chunk (e.g. `sample-large-*.js`, a few hundred bytes, isolated from the ~285kB main bundle).
   - Used by: `/work/:slug` route only. The modal (small projects) never touches this — it only ever uses frontmatter from the cheap-tier index.

**vite.config.ts**: `@mdx-js/rollup` (official Vite MDX integration, not the unmaintained `vite-plugin-mdx`) with `remark-frontmatter` + `remark-mdx-frontmatter`, `enforce: 'pre'` so MDX compiles before the React plugin sees the output. `react({ include: /\.(jsx|tsx|mdx)$/ })` so fast-refresh also covers compiled MDX.

Dev mode also includes a small custom plugin (`rebuild-index-on-mdx-change`) that listens for `content/projects/*.mdx` add/change/delete events, reruns `node scripts/build-index.mjs`, then triggers a full browser reload. This keeps list/filter/modal data (which read from `generated-index.ts`) in sync instantly while `npm run dev` is running, without needing to restart the dev server.

**Known gotcha (already hit and fixed) — `src/mdx.d.ts`**: this file types `.mdx` imports (`declare module '*.mdx'`). A **top-level `import` statement** in a `.d.ts` file containing a wildcard `declare module` turns the file into a "module," and TypeScript's wildcard ambient module matching silently stops applying — you get `Cannot find module '*.mdx'` errors even though the declaration looks correct. Fix: keep the file a global script by using TypeScript's **inline `import(...)` type syntax** instead of a top-level import:
```ts
declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const frontmatter: import('./content/types').ProjectFrontmatter
  const MDXComponent: ComponentType
  export default MDXComponent
}
```
If `.mdx` imports ever start showing `TS2307` again, check this file first before assuming the Vite config is wrong.

## Routing (`src/router.tsx`)

| Route | Component | Notes |
|---|---|---|
| `/` | `pages/Landing.tsx` | `Component` named export (React Router `lazy`/data-router convention) |
| `/archive` | `pages/Archive.tsx` | Same |
| `/about` | `pages/About.tsx` | Same, fully static |
| `/work/:slug` | `pages/ProjectDetail.tsx` | Loaded via `lazy: () => import(...)` — the page itself is code-split, and internally it lazy-loads the matching MDX module (see content pipeline above) |

All pages export `Component` (not `default`) to match React Router's lazy-route convention consistently, even the non-lazy ones.

## Filtering and modal state — both live in the URL, not local state

`src/content/filters.ts` centralizes the two query param names so nothing typos them across files:
- `category` — active Archive filter (`?category=web`)
- `project` — which small project's modal is open (`?project=slug`)

Why URL state instead of `useState`: shareable/bookmarkable filtered views and modal links, and the browser back button closes the modal / clears the filter for free. No state management library used anywhere — `useSearchParams` + plain `Array.filter` + `useMemo` is sufficient at this content scale.

`useOpenProjectModal()` (in `filters.ts`) is a shared hook used by both `Landing.tsx` and `Archive.tsx` — both pages render `ProjectCard` + `ProjectModal` and need identical "set `?project=`" behavior; this hook exists to avoid duplicating that logic.

`ProjectCard.tsx` is the branch point: `size: "large"` → real `<Link to="/work/:slug">` (a genuine route). `size: "small"` → `<button onClick={() => onOpenModal(slug)}>` (no route, just sets the URL param). `ProjectModal.tsx` reads `?project=` itself via `useSearchParams`, looks the slug up in `generated-index.ts` (frontmatter only — never lazy-loads the MDX body), and renders `null` when nothing's open. Closes on backdrop click, × button, or Escape key.

## Accepted tradeoff: link previews

`index.html`'s OG/meta tags are static and identical for every route (no SSR/prerendering to vary them per page). Real users get correct browser-tab titles via the app; but link-preview bots (iMessage, LinkedIn, Slack) don't execute JS, so sharing a `/work/:slug` link directly will always show the *homepage's* preview card, not that project's own. This was an explicit, confirmed tradeoff — only the main site link needed a good preview. If per-project previews are wanted later: add a prerendering step (e.g. a Puppeteer snapshot script) or migrate to Next.js/Astro for that specific need.

## File map

```
content/projects/*.mdx          — the actual content, source of truth
scripts/build-index.mjs         — generates src/content/generated-index.ts
src/
  content/
    types.ts                    — ProjectFrontmatter type (single source of truth for shape)
    generated-index.ts          — GENERATED, gitignored, do not hand-edit
    filters.ts                  — URL param names + useOpenProjectModal hook
  pages/
    Landing.tsx, Archive.tsx, About.tsx, ProjectDetail.tsx
  components/
    ProjectCard.tsx, FilterBar.tsx, ProjectModal.tsx
  router.tsx                    — route table
  mdx.d.ts                      — .mdx import typing (see gotcha above)
  main.tsx                      — RouterProvider mount
vite.config.ts                  — MDX plugin wiring
index.html                      — static OG/meta tags (homepage-only preview)
```

Not yet built (mentioned in original scaffold discussion, not part of the executed build order): `src/components/mdx/*` custom embed components (VideoEmbed, IframeEmbed, InteractiveDemo) referenced from within `.mdx` bodies via direct ESM imports.

## Maintenance instruction

**Whenever an architecture change is made** (new dependency that affects the content/build pipeline, a routing scheme change, a new page type, a change to how filtering/modal state works, a change to the MDX pipeline or `vite.config.ts`) — **update this file in the same session**, in the relevant section above, before considering the change done.
