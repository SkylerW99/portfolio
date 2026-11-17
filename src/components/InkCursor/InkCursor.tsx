// Site-wide "ink dot" cursor (design option 4b, ported from Portfolio.dc.html `inkCursor`).
// Replaces the native pointer with a small ink dot that grows and turns rust over
// anything clickable, and squashes on press. Mouse/trackpad only — touch devices
// and keyboard users are unaffected.

import { useEffect, useRef } from 'react'
import './InkCursor.css'

// Elements that count as clickable ("hot"). Add data-hot to opt anything else in.
const HOT = 'a[href], button, label, input, select, textarea, summary, [role="button"], [data-hot]'
// Surfaces dark enough that the ink dot should flip to cream.
const DARK = '.lightbox, .popup__media'

export function InkCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current, dot = dotRef.current
    if (!outer || !dot) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const root = document.documentElement
    root.classList.add('ink-cursor-on')

    let hot = false, dark = false
    // Iframes (e.g. the Figma embed) swallow pointer events, so the dot would freeze at
    // their edge. Hide it whenever the pointer is over / heading into one, or the page
    // loses focus to it; the iframe shows its own cursor and the next move outside
    // brings the dot back.
    const isFrame = (el: EventTarget | null) => (el as Element | null)?.tagName === 'IFRAME'
    const hide = () => { outer.style.opacity = '0' }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (isFrame(e.target)) return hide()
      outer.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      outer.style.opacity = '1'
      const target = e.target as Element | null
      const h = !!target?.closest?.(HOT)
      const d = !!target?.closest?.(DARK)
      if (h !== hot) { hot = h; dot.classList.toggle('is-hot', hot) }
      if (d !== dark) { dark = d; dot.classList.toggle('is-dark', dark) }
    }
    const onOver = (e: PointerEvent) => { if (isFrame(e.target)) hide() }
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget || isFrame(e.relatedTarget)) hide() } // left the window / into an iframe
    const onDown = () => dot.classList.add('is-down')
    const onUp = () => dot.classList.remove('is-down')

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    window.addEventListener('blur', hide)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', onUp)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      window.removeEventListener('blur', hide)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      root.classList.remove('ink-cursor-on')
    }
  }, [])

  return (
    <div ref={outerRef} className="ink-cursor" aria-hidden="true">
      <div ref={dotRef} className="ink-cursor__dot" />
    </div>
  )
}
