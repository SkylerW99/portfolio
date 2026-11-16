---
name: site-architecture
description: Reference for this portfolio site's architecture — stack, MDX content pipeline, routing, filtering, and the reasoning behind each choice. Read this at the start of any session working in this repo, before making changes to vite.config.ts, routing, content structure, or the build-index script. Update this file immediately after any architecture change (new dependency affecting the content pipeline, routing scheme change, new page type, etc.) so it never drifts from the real code. Triggers — "site architecture", "how is this structured", "why is this built this way", "MDX pipeline", "routing", "how does filtering work", "how does the modal work", "project structure".
---

# Portfolio Site Architecture

Personal portfolio built around a **site shell**: a sticky left panel (slime-mold warp, SW logo, scrambling role, Now/Prev, nav, contact) that stays put while the right side swaps between the Home feed (Work grid + Art & tech strip) and the Archive (filterable grid). About is a pop-up over Home. Case studies (large projects) are full pages at `/work/:slug`; everything else opens in the art pop-up. Layout source: `Home.dc.html` + `design-system.css` in the user's claude.ai design project. Hand-coded by the user in React + TypeScript; Claude assists but the user writes/owns the code.

## Stack

**Vite + React Router + TypeScript.** Plain client-side SPA — no SSR, no server, no CMS.

Chosen over Next.js because the only SEO/link-preview need is the **main site URL** looking good when pasted into texts/LinkedIn (like the user's previous site, ziyijpg.com) — not per-project-page previews. A single static `index.html` with hardcoded OG meta tags covers that without any server rendering, so the simpler client-only stack was preferred. See "Accepted tradeoff" below.

## Content pipeline (the core design decision)

Each project is an `.mdx` file in `content/projects/*.mdx` — YAML frontmatter (metadata) + MDX body (rich content, can embed custom React components like iframes/video/interactive demos via normal ESM imports inside the `.mdx` file).

**Two-tier access, because `@mdx-js/rollup` compiles frontmatter + body into one JS module — there's no free way to load just the metadata:**

1. **Cheap tier — `scripts/build-index.mjs`**: a prebuild Node script, runs via `predev`/`prebuild` npm hooks (automatic, never run by hand). Uses `gray-matter` to read *only* the YAML frontmatter block from every `.mdx` file (no MDX compilation) and writes `src/content/generated-index.ts` — a plain typed array of `ProjectFrontmatter` objects. Files with `draft: true` are dropped; the rest are sorted by `order` ascending (curated Work/Archive order), then newest-first for anything without `order`. Validates required fields and that `frontmatter.slug` matches the filename, failing loudly at build time on mistakes. This generated file is **gitignored** (see `.gitignore`) since it's 100% derived — the `.mdx` files are the source of truth.
   - Used by: Archive page (list + filter), Landing page (featured list), ProjectModal (condensed content).
2. **Expensive tier — lazy MDX import**: `src/pages/ProjectDetail.tsx` uses `import.meta.glob('/content/projects/*.mdx')` (non-eager) to get a map of `() => import(...)` loaders, one per file. Only the specific project being viewed at `/work/:slug` actually gets fetched/compiled/rendered — confirmed in production builds where each project's body is its own separate JS chunk (e.g. `sample-large-*.js`, a few hundred bytes, isolated from the ~285kB main bundle).
   - Used by: `/work/:slug` route only. The modal (small projects) never touches this — it only ever uses frontmatter from the cheap-tier index.

**Frontmatter fields** (`src/content/types.ts`): required `title, slug, description, categories, thumbnail, date, featured, size`; optional `summary` (card copy — `description` stays the case-study page's own intro, so card copy can change without touching case-study content), `year`, `order`, `status: "coming-soon"` (large project shown on Work but not linked), `draft`, `strip` (puts a small project in the Home Art & tech strip; value is its caption), and art pop-up extras `format`, `images[] {src, alt, fit}`, `paras[] {k, t}`, `links[] {label, href}`. `thumbnail: ""` is allowed — cards render a striped placeholder. `categories` double as the card hashtags and the Archive filters.

`src/content/projects.ts` holds the derived views everyone shares: `isCaseStudy` (large and not coming-soon → has a page), `workProjects` (featured large), `stripProjects`, `cardText`, `tagLine`, `caseLabel(slug)` ("Case study 01 — Fast Launch" for the case-study top bar).

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
| *(layout)* | `components/SiteShell/SiteShell.tsx` | Pathless layout route: left panel + `<Outlet />` + site footer. Owns panel collapse (persisted in `localStorage`), Home scroll-spy for the Work/Art nav state, the About and Contact pop-ups |
| `/` | `pages/landing/Landing.tsx` | Home feed. `/#art` scrolls to the Art & tech strip on arrival |
| `/archive` | `pages/Archive.tsx` | Archive view inside the shell |
| `/about` | `pages/landing/Landing.tsx` | Same Home feed; SiteShell opens `AboutModal` for this path, closing navigates to `/` |
| `/work/:slug` | `pages/ProjectDetail.tsx` | Outside the shell. Lazy-loaded; renders a sticky `CaseStudyBar` (label + ✕ home) above the MDX body |

All pages export `Component` (not `default`) to match React Router's lazy-route convention consistently, even the non-lazy ones.

## Filtering and modal state — both live in the URL, not local state

`src/content/filters.ts` centralizes the two query param names so nothing typos them across files:
- `category` — active Archive filter (`?category=web`)
- `project` — which small project's modal is open (`?project=slug`)

Why URL state instead of `useState`: shareable/bookmarkable filtered views and modal links, and the browser back button closes the modal / clears the filter for free. No state management library used anywhere — `useSearchParams` + plain `Array.filter` + `useMemo` is sufficient at this content scale.

`useOpenProjectModal()` (in `filters.ts`) is a shared hook used by both `Landing.tsx` and `Archive.tsx` — both pages render `ProjectCard` + `ProjectModal` and need identical "set `?project=`" behavior; this hook exists to avoid duplicating that logic.

`ProjectCard.tsx` (`WorkCard`, `ArtCard`, `ArchiveCard`) is the branch point: `isCaseStudy(p)` → real `<Link to="/work/:slug">`; otherwise a `<button>` that sets `?project=` (WorkCard renders a non-interactive "Coming soon" card instead). `ProjectModal.tsx` (the art pop-up) reads `?project=` itself, looks the slug up in the index (frontmatter only — never lazy-loads the MDX body), and takes a `list` prop for prev/next and ←/→ — the strip on Home, the filtered non-case items on Archive. Prev/next replace the history entry rather than pushing one.

`components/Popup/Popup.tsx` is the shared dialog frame for About and the art pop-up (overlay, mono header + ✕, optional media column and footer row, Esc/backdrop close, focus in/out, scroll lock). `ContactModal` still uses the older `.modal-*` styles in `ProjectModal.css`.

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
    projects.ts                 — derived lists/helpers (workProjects, stripProjects, isCaseStudy, caseLabel…)
    filters.ts                  — URL param names + useOpenProjectModal hook
    about.ts, contact.ts        — About pop-up copy; email/LinkedIn/GitHub/résumé links
  pages/
    landing/Landing.tsx (+ Landing.css, also used by Archive), Archive.tsx, ProjectDetail.tsx
    ProjectDetail.css           — shared case-study layout classes (cs-*) + .case-bar
  components/
    SiteShell/                  — layout route, Logo, Scramble, useHeroWarp (panel slime warp)
    Popup/, AboutModal/, ContactModal/, Lightbox/, InkCursor/
    ProjectCard/, FilterBar.tsx, ProjectModal/
    mdx/VideoEmbed.tsx          — embeds used inside MDX bodies
    ParameterMatrix/            — Precision Cooking interactive matrix
  router.tsx                    — route table
  mdx.d.ts                      — .mdx import typing (see gotcha above)
  main.tsx                      — RouterProvider mount + global <InkCursor /> (components/InkCursor: custom dot cursor, fine pointers only; opt elements into the hover state with data-hot)
vite.config.ts                  — MDX plugin wiring
index.html                      — static OG/meta tags (homepage-only preview)
```

## Case-study pages (MDX body conventions)

Large-project MDX bodies are built from shared components plus layout classes, not per-project CSS:
- `src/pages/ProjectDetail.css` — imported by `ProjectDetail.tsx`, so it applies to every `/work/:slug` page. Holds case-study layout primitives only (typography stays in `designsystem.css`): `.case-study` page padding, rhythm (`.cs-section` before a numbered header, `.cs-lead` first block after one, `.cs-block` between blocks), `.cs-intro`/`.cs-prose`/`.cs-kicker` text, `.cs-media` images, `.cs-grid-2`/`.cs-grid-3`/`.cs-split` grids (collapse to one column ≤900px), `.cs-card`/`.cs-card--icon`/`.cs-card--icon-dark` (light icon in a dark `.cs-card__icon` strip + `.cs-card__body`), `.cs-link-card`, `.cs-pill`, plus (added for Fast Launch) `.cs-caption`, `.cs-scroll-x`/`.cs-scroll-y` (oversized media scrolls inside its frame), `.cs-placeholder` (grey stand-in for a visual not made yet), `.cs-split--wide-left`, `.cs-card--stretch`, `.cs-logo`, `.cs-steps` (numbered workflow), `.cs-checklist` (icon pros/cons), `.cs-list`, `.cs-chips`, `.cs-metric`. `[id]` anchors get `scroll-margin-top` so in-page links clear the sticky nav.
- `src/components/mdx/VideoEmbed.tsx` — iframe embed, 16:9 by default (`ratio` prop for embeds with their own chrome, e.g. LinkedIn posts `"504 / 399"`).
- `src/components/mdx/HScroll.tsx` — titled horizontal scroll strip with ← → buttons (same pattern as the Home Art & tech strip); children are `.cs-feature` cards (480px, snap).
- **Image lightbox** — `ProjectDetail.tsx` scans the rendered MDX body for `.cs-media img` (after the lazy module loads), makes each one focusable, and opens `src/components/Lightbox/Lightbox.tsx` via one delegated click/Enter listener on the `<article>`. No per-image wiring in MDX: wrapping an image in `.cs-media` is what opts it in (icons in `.cs-card__icon` are excluded by not being in `.cs-media`). Lightbox state is local `useState`, not a URL param. Prev/next arrows + ←/→ keys cycle through all images on the page; Esc/backdrop closes.
- `SectionHeader` (numbered section title, optional `subtitle`) and `ProjectOverview` (hero + meta row; `myRole` optional).
- Project-specific interactive pieces get their own component folder, e.g. `src/components/ParameterMatrix/` (Precision Cooking's hoverable food-parameter matrix).
- Project images live in `public/images/<slug>/` and are referenced by absolute path. `precision-cooking.mdx` shows the pattern of small `export const` helpers (`img()`, `vimeo()`) at the top of an MDX file to keep repeated paths short.
- Design source: case-study layouts are drafted in the user's claude.ai design project (e.g. `Precision Cooking.dc.html`) and ported here by hand — read with the Artifact tool (`action: "read"`, `path: project/<page>`). Site-level layouts live in `Home.dc.html` (with `L About` / `L Archive` / `L Case Study` wrappers) and tokens in `project/design-system.css` — these pages aren't in the project's `compat.json` page list, so list files with `scope: "files"` to find them.

**Known gotcha — import path casing**: the folder is `src/components/projectOverview/` (lowercase p). Some MDX files import `.../ProjectOverview/ProjectOverview`, which works on macOS's case-insensitive disk but will fail on a case-sensitive CI/host (Linux) and makes TS flag a casing conflict. Use the lowercase path.

Not yet built: other `src/components/mdx/*` embeds (IframeEmbed, generic InteractiveDemo).

## Maintenance instruction

**Whenever an architecture change is made** (new dependency that affects the content/build pipeline, a routing scheme change, a new page type, a change to how filtering/modal state works, a change to the MDX pipeline or `vite.config.ts`) — **update this file in the same session**, in the relevant section above, before considering the change done.
