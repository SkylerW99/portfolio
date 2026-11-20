export type ProjectSize = 'large' | 'small'

export interface ProjectImage {
  /** The image itself — or, for a video, its poster (used as the thumbnail). */
  src: string
  alt: string
  fit?: 'cover' | 'contain'
  /** Embed URL (Vimeo / YouTube player). The item then plays in the art pop-up's media pane. */
  video?: string
  /** Short line shown under the media in the art pop-up. */
  caption?: string
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
  /** Archive filter groups this project appears under (keys from ARCHIVE_FILTERS in filters.ts). */
  filters?: string[]
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
  /** Art pop-up meta row, e.g. "Developer + visual artist (team of 3)". */
  role?: string
  /** Art pop-up meta rows: collaborators (e.g. "Frida Moreno Cabrera (service design)") and where it was shown. */
  collaborators?: string
  /** "Team" meta row after Role, e.g. "2 designers + 4 developers". */
  team?: string
  exhibition?: string
  /** Award meta row, shown first (e.g. "ShapeXR Design Jam 3rd Place"). */
  award?: string
  /** "Type" meta row, shown just above Year (e.g. "Commission Work @School for social research"). */
  projectType?: string
  /** false hides the pop-up's Discipline row (categories still drive the Archive filters). */
  showDiscipline?: boolean
  /** Dark button right under the pop-up's summary line, e.g. a live demo link. */
  cta?: { label: string; href: string } | { label: string; href: string }[]
  /** Short line shown above the cta buttons, e.g. "Try the brush effects in the app". */
  ctaNote?: string
  /** "outline" uses the site's standard outlined button instead of the dark filled one. */
  ctaStyle?: 'outline'
  images?: ProjectImage[]
  /** `link` puts a button under that paragraph (e.g. a video or data-viz link). */
  paras?: { k: string; t: string; link?: { label: string; href: string } }[]
  links?: { label: string; href: string }[]
}
