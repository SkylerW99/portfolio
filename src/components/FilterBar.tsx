// Archive filter chips: "All", then the curated groups in ARCHIVE_FILTERS.
// `null` = All.

interface FilterBarProps {
  options: readonly { key: string; label: string }[]
  active: string | null
  onSelect: (key: string | null) => void
}

export function FilterBar({ options, active, onSelect }: FilterBarProps) {
  return (
    <div role="group" aria-label="Filter projects" className="filters">
      <button className="btn btn--sm" type="button" aria-pressed={active === null} onClick={() => onSelect(null)}>All</button>
      {options.map((o) => (
        <button className="btn btn--sm" key={o.key} type="button" aria-pressed={active === o.key} onClick={() => onSelect(o.key)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
