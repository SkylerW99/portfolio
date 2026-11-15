// Archive filter chips: "All", "Featured", then #Hashtag categories.
// `null` = All; FEATURED_FILTER is a pseudo-category for featured projects.

export const FEATURED_FILTER = 'Featured'

interface FilterBarProps {
  categories: string[]
  active: string | null
  onSelect: (category: string | null) => void
}

const label = (c: string) => (c === FEATURED_FILTER ? c : '#' + c.replace(/[ /]/g, ''))

export function FilterBar({ categories, active, onSelect }: FilterBarProps) {
  return (
    <div role="group" aria-label="Filter projects" className="filters">
      <button className="btn btn--sm" type="button" aria-pressed={active === null} onClick={() => onSelect(null)}>All</button>
      {[FEATURED_FILTER, ...categories].map((category) => (
        <button className="btn btn--sm" key={category} type="button" aria-pressed={active === category} onClick={() => onSelect(category)}>
          {label(category)}
        </button>
      ))}
    </div>
  )
}
