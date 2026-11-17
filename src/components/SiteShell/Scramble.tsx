// Cycles PRODUCT DESIGNER → CREATIVE TECHNOLOGIST, scrambling through glyphs between words.
// Writes straight to the DOM node on an interval so it never re-renders React.
// `paused` stops the cycle on the current word (mid-scramble snaps to the target word).

import { useEffect, useRef } from 'react'

const WORDS = ['PRODUCT DESIGNER', 'CREATIVE TECHNOLOGIST']
const GLYPHS = '#%&*+/<>=?@[]{}01'

export function Scramble({ paused = false }: { paused?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let w = 0, frame = 0, from = WORDS[0], to = WORDS[0], hold = 30
    const id = window.setInterval(() => {
      const el = ref.current
      if (!el) return
      if (pausedRef.current) {
        if (el.textContent !== to) { el.textContent = to; hold = 30 }
        return
      }
      if (hold > 0) {
        hold--
        if (hold === 0) { from = WORDS[w]; w = (w + 1) % WORDS.length; to = WORDS[w]; frame = 0 }
        return
      }
      frame++
      const len = Math.max(from.length, to.length)
      let out = ''
      for (let k = 0; k < len; k++) out += frame >= k * 2 + 6 ? (to[k] || '') : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      el.textContent = out
      if (frame >= len * 2 + 6) { el.textContent = to; hold = 30 }
    }, 50)
    return () => window.clearInterval(id)
  }, [])

  // The invisible longest word sits in the same grid cell, so the box (and the
  // brackets around it) keeps one width whichever word is showing.
  const longest = WORDS.reduce((a, b) => (b.length > a.length ? b : a))
  return (
    <span className="scramble">
      <span className="scramble__sizer" aria-hidden="true">{longest}</span>
      <span ref={ref} className="scramble__word">{WORDS[0]}</span>
    </span>
  )
}
