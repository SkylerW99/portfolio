// Cycles DESIGNER → BUILDER → ARTIST, scrambling through glyphs between words.
// Writes straight to the DOM node on an interval so it never re-renders React.

import { useEffect, useRef } from 'react'

const WORDS = ['DESIGNER', 'BUILDER', 'ARTIST']
const GLYPHS = '#%&*+/<>=?@[]{}01'

export function Scramble() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let w = 0, frame = 0, from = WORDS[0], to = WORDS[0], hold = 30
    const id = window.setInterval(() => {
      const el = ref.current
      if (!el) return
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

  return <span ref={ref}>{WORDS[0]}</span>
}
