// Horizontal scroll strip for case-study MDX (same pattern as the Home "Art & tech"
// strip): a heading row with ← → buttons, and children laid out in one snapping row.

import { useRef, type ReactNode } from 'react'

interface HScrollProps {
    title: string
    children: ReactNode
}

export function HScroll({ title, children }: HScrollProps) {
    const trackRef = useRef<HTMLDivElement>(null)
    // Step by roughly one card (track's first child width + gap)
    const step = (dir: 1 | -1) => {
        const track = trackRef.current
        if (!track) return
        const card = track.firstElementChild as HTMLElement | null
        track.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 20), behavior: 'smooth' })
    }

    return (
        <div className="cs-hscroll">
            <div className="cs-hscroll__head">
                <h4>{title}</h4>
                <div className="cs-hscroll__nav">
                    <button type="button" className="btn btn--icon" onClick={() => step(-1)} aria-label="Scroll left">←</button>
                    <button type="button" className="btn btn--icon btn--filled" onClick={() => step(1)} aria-label="Scroll right">→</button>
                </div>
            </div>
            <div ref={trackRef} className="cs-hscroll__track">{children}</div>
        </div>
    )
}
