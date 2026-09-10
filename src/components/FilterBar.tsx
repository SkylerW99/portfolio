interface FilterBarProps {
  categories: string[]
  active: string | null
  onSelect: (category: string | null) => void
}

export function FilterBar({ categories, active, onSelect }: FilterBarProps) {
  return (
    <div className="flex-horizontal gap-8">
      <button
        className = "btn"
        type="button"
        aria-pressed={active === null}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          className = "btn"
          key={category}
          type="button"
          aria-pressed={active === category}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
