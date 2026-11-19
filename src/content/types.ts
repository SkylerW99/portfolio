export type ProjectSize = 'large' | 'small'

export interface ProjectImage {
  src: string
  alt: string
  fit?: 'cover' | 'contain'
}

export interface ProjectFrontmatter {
  title: string
  id?: string
  slug: string
  /** Used on the case-study page itself (ProjectOverview). */
  description: string
  /** Shorter card copy for Work / Archive / pop-ups; falls back to `description`. */
  summary?: string
  /** Doubles as the project's tags (#UX #Payments) and the Archive filters. */
  categories: string[]
  /** May be "" — cards then show a striped placeholder. */
  thumbnail: string
  date: string
  year?: number
  /** Position in Work / Archive lists (ascending). Projects without it sort after, newest first. */
  order?: number
  featured: boolean
  size: ProjectSize
  /** "coming-soon": no page yet — card says "Coming soon" and isn't linked.
   *  "in-progress": page is live but the work is ongoing — card links and says "In progress".
   *  Case-insensitive in frontmatter ("In-Progress" is fine); build-index normalises it. */
  status?: 'coming-soon' | 'in-progress'
  /** SHA-256 hex of a password; the case-study page shows a password screen until it's entered.
   *  Client-side only — keeps casual visitors out, not a real security boundary. */
  passwordHash?: string
  /** Excluded from the generated index entirely (e.g. sample/template files). */
  draft?: boolean
  /** Set on small projects shown in the home Art & Tech strip; the value is the strip caption. */
  strip?: string
  /** Extra fields for the art pop-up. */
  format?: string
  images?: ProjectImage[]
  paras?: { k: string; t: string }[]
  links?: { label: string; href: string }[]
}
