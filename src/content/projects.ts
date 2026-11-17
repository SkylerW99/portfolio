// Derived views of the generated project index, shared by Home, Archive,
// the art pop-up and the case-study top bar.

import { projects } from './generated-index'
import type { ProjectFrontmatter } from './types'

export { projects }

/** Has a published case-study page at /work/:slug. */
export function isCaseStudy(p: ProjectFrontmatter) {
  return p.size === 'large' && p.status !== 'coming-soon'   // in-progress pages are live
}

/** Label for an unpublished case study's card ("Coming soon" / "In progress"). */
export function statusLabel(p: ProjectFrontmatter) {
  return p.status === 'in-progress' ? 'In progress' : 'Coming soon'
}

/** Card copy: the short summary if there is one, else the description. */
export function cardText(p: ProjectFrontmatter) {
  return p.summary ?? p.description
}

/** "#UX #Payments" */
export function tagLine(p: ProjectFrontmatter) {
  return p.categories.map((c) => '#' + c.replace(/[ /]/g, '')).join(' ')
}

export function yearOf(p: ProjectFrontmatter) {
  return p.year ?? new Date(p.date).getFullYear()
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

/** Home → Work: featured large projects, in curated order. */
export const workProjects = projects.filter((p) => p.featured && p.size === 'large')

/** Home → Art & tech strip. */
export const stripProjects = projects.filter((p) => p.strip)

/** "Case study 01 — Fast Launch" + "UX · Payments · 2025" for the case-study top bar. */
export function caseLabel(slug: string) {
  const i = workProjects.findIndex((p) => p.slug === slug)
  const p = workProjects[i] ?? projects.find((x) => x.slug === slug)
  if (!p) return null
  return {
    label: `Case study ${pad2(i >= 0 ? i + 1 : projects.indexOf(p) + 1)} — ${p.title}`,
    meta: [...p.categories, String(yearOf(p))].join(' · '),
  }
}
