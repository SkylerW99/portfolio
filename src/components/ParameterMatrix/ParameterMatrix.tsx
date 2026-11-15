import { useState, type CSSProperties } from 'react'
import './ParameterMatrix.css'

// Precision Cooking case study — which food parameters each food category needs.
// Hover a category column or a parameter row to highlight it; click a category to pin it.

type CategoryKey = 'm' | 'v' | 'b' | 's' | 'c'

interface Category {
    key: CategoryKey
    name: string
    color: string
}

interface Parameter {
    label: string
    sub: string
    required: CategoryKey[]
    optional: CategoryKey[]
}

type DotKind = 'required' | 'optional' | 'none'

const CATEGORIES: Category[] = [
    { key: 'm', name: 'Meats', color: '#f47a6e' },
    { key: 'v', name: 'Veggies & Potatoes', color: '#a9e27a' },
    { key: 'b', name: 'Baked Goods', color: '#f5bb6b' },
    { key: 's', name: 'Seafood', color: '#8fa6f7' },
    { key: 'c', name: 'Cuisines', color: '#ec7ee2' },
]

const ALL: CategoryKey[] = ['m', 'v', 'b', 's', 'c']

// Ordered by importance, most important first.
const PARAMETERS: Parameter[] = [
    { label: 'Number', sub: '(racks, Filets)', required: ALL, optional: [] },
    { label: 'Size', sub: '(oz)', required: ALL, optional: [] },
    { label: 'Thickness', sub: '(Inch)', required: ['m', 'v', 's'], optional: [] },
    { label: 'Fresh / Frozen', sub: '', required: ['m', 'v', 'c'], optional: [] },
    { label: 'Doneness', sub: '', required: ['m', 's'], optional: [] },
    { label: 'Meat Probe', sub: '', required: ['m'], optional: [] },
    { label: 'Temp', sub: '', required: ['b'], optional: ['m', 'v', 's', 'c'] },
    { label: 'Cooking Time', sub: '', required: ['b'], optional: ['m', 'v', 's', 'c'] },
    { label: 'Cooking Tips', sub: '(Rack position & Cookware)', required: [], optional: ALL },
]

function kindOf(param: Parameter, key: CategoryKey): DotKind {
    if (param.required.includes(key)) return 'required'
    if (param.optional.includes(key)) return 'optional'
    return 'none'
}

function Dot({ kind, color, size, style }: { kind: DotKind, color: string, size: number, style?: CSSProperties }) {
    return (
        <span
            className={`param-matrix__dot param-matrix__dot--${kind}`}
            style={{ '--dot-color': color, '--dot-size': `${size}px`, ...style } as CSSProperties}
        />
    )
}

export function ParameterMatrix() {
    const [hoveredCategory, setHoveredCategory] = useState<CategoryKey | null>(null)
    const [pinnedCategory, setPinnedCategory] = useState<CategoryKey | null>(null)
    const [hoveredRow, setHoveredRow] = useState<number | null>(null)

    const activeCategory = pinnedCategory ?? hoveredCategory

    function togglePin(key: CategoryKey) {
        setPinnedCategory((current) => (current === key ? null : key))
    }

    return (
        <div className="param-matrix">
            <div className="param-matrix__table">
                <div className="param-matrix__header">
                    <h4>All Food Parameters</h4>
                    <p className="t-meta param-matrix__muted">Importance ↓</p>
                </div>

                <div className="param-matrix__row param-matrix__row--head">
                    <span />
                    <span />
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            type="button"
                            className="param-matrix__cat"
                            data-active={activeCategory === cat.key}
                            data-dim={activeCategory !== null && activeCategory !== cat.key}
                            aria-pressed={pinnedCategory === cat.key}
                            onMouseEnter={() => setHoveredCategory(cat.key)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            onClick={() => togglePin(cat.key)}
                        >
                            <span
                                className="param-matrix__chip"
                                style={{
                                    background: cat.color,
                                    boxShadow: pinnedCategory === cat.key ? `0 0 0 4px ${cat.color}44` : 'none',
                                }}
                            />
                            {cat.name}
                        </button>
                    ))}
                </div>

                {PARAMETERS.map((param, rowIndex) => {
                    const inCategory = activeCategory === null || kindOf(param, activeCategory) !== 'none'
                    const rowDim = (hoveredRow !== null && hoveredRow !== rowIndex) || !inCategory

                    return (
                        <div
                            key={param.label}
                            className="param-matrix__row"
                            data-dim={rowDim}
                            onMouseEnter={() => setHoveredRow(rowIndex)}
                            onMouseLeave={() => setHoveredRow(null)}
                        >
                            <span className="param-matrix__num">{String(rowIndex + 1).padStart(2, '0')}</span>
                            <span className="param-matrix__label">
                                {param.label} <span className="param-matrix__muted">{param.sub}</span>
                            </span>
                            {CATEGORIES.map((cat) => {
                                const kind = kindOf(param, cat.key)
                                const lit =
                                    (activeCategory === cat.key && (hoveredRow === null || hoveredRow === rowIndex)) ||
                                    (hoveredRow === rowIndex && (activeCategory === null || activeCategory === cat.key))
                                const dim =
                                    (activeCategory !== null && activeCategory !== cat.key) ||
                                    (hoveredRow !== null && hoveredRow !== rowIndex)

                                let glow = 'none'
                                if (lit && kind === 'required') glow = `0 0 0 6px ${cat.color}26, 0 0 22px ${cat.color}99`
                                if (lit && kind === 'optional') glow = `0 0 16px ${cat.color}66`

                                return (
                                    <span key={cat.key} className="param-matrix__cell" data-active={activeCategory === cat.key}>
                                        <Dot
                                            kind={kind}
                                            color={cat.color}
                                            size={22}
                                            style={{
                                                opacity: dim ? (kind === 'none' ? 0.35 : 0.14) : 1,
                                                transform: lit && kind !== 'none' ? 'scale(1.18)' : 'scale(1)',
                                                boxShadow: glow,
                                            }}
                                        />
                                    </span>
                                )
                            })}
                        </div>
                    )
                })}
            </div>

            <aside className="param-matrix__side">
                <div>
                    <p className="t-meta param-matrix__muted">Action required?</p>
                    <div className="param-matrix__legend">
                        <span><Dot kind="required" color="#e7e9ea" size={20} />Yes</span>
                        <span><Dot kind="optional" color="#e7e9ea" size={20} />Optional / No</span>
                    </div>
                </div>
                <Readout activeCategory={activeCategory} hoveredRow={hoveredRow} />
            </aside>
        </div>
    )
}

function Readout({ activeCategory, hoveredRow }: { activeCategory: CategoryKey | null, hoveredRow: number | null }) {
    let title = 'Hover to explore'
    let color = '#e7e9ea'
    let line = 'A category or a parameter'
    let items: { label: string, kind: DotKind, color: string }[] = []

    if (activeCategory !== null) {
        const cat = CATEGORIES.find((c) => c.key === activeCategory)!
        items = PARAMETERS
            .map((param) => ({ label: param.label, kind: kindOf(param, cat.key), color: cat.color }))
            .filter((item) => item.kind !== 'none')
        const requiredCount = items.filter((item) => item.kind === 'required').length
        title = cat.name
        color = cat.color
        line = `${requiredCount} required · ${items.length - requiredCount} optional`
    } else if (hoveredRow !== null) {
        const param = PARAMETERS[hoveredRow]
        items = CATEGORIES
            .map((cat) => ({ label: cat.name, kind: kindOf(param, cat.key), color: cat.color }))
            .filter((item) => item.kind !== 'none')
        title = param.label
        line = `Required for ${param.required.length} of 5 categories`
    }

    return (
        <div className="param-matrix__readout" aria-live="polite">
            <h4 style={{ color }}>{title}</h4>
            <p className="t-meta param-matrix__muted">{line}</p>
            <ul>
                {items.map((item) => (
                    <li key={item.label}>
                        <Dot kind={item.kind} color={item.color} size={14} />
                        <span>{item.label}</span>
                        <span className="param-matrix__muted">{item.kind === 'required' ? 'Yes' : 'Optional'}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
