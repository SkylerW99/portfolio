// "Jelly warp" background for the side panel: cursor speed drives an SVG
// displacement filter, and a soft elliptical mask follows the cursor (or drifts
// on its own when idle). Ported from the design's `slimeWarp()`.

import { useEffect, type RefObject } from 'react'

export function useHeroWarp(
  hostRef: RefObject<HTMLElement | null>,
  imgRef: RefObject<HTMLImageElement | null>,
  turbRef: RefObject<SVGFETurbulenceElement | null>,
  dispRef: RefObject<SVGFEDisplacementMapElement | null>,
) {
  useEffect(() => {
    const host = hostRef.current, img = imgRef.current
    const turb = turbRef.current, disp = dispRef.current
    if (!host || !img || !turb || !disp) return

    const setMask = (rx: number, ry: number, x: number, y: number) => {
      const mk = `radial-gradient(ellipse ${rx}% ${ry}% at ${x}px ${y}px, #000 30%, rgba(0,0,0,.25) 70%, rgba(0,0,0,.08) 100%)`
      img.style.maskImage = mk
      img.style.webkitMaskImage = mk
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMask(60, 40, host.offsetWidth * .54, host.offsetHeight * .49)
      return
    }

    const m = { x: 0, y: 0, vx: 0, vy: 0, inside: false }
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      if (m.inside) { m.vx = x - m.x; m.vy = y - m.y }
      m.x = x; m.y = y; m.inside = true
    }
    const onLeave = () => { m.inside = false }
    host.addEventListener('mousemove', onMove)
    host.addEventListener('mouseleave', onLeave)

    let sc = 8, t = 0, cx = 0, cy = 0, px = 0, py = 0, id = 0
    const step = () => {
      id = requestAnimationFrame(step)
      const W = host.offsetWidth, H = host.offsetHeight
      if (!W) return
      const r = host.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      if (!cx) { cx = W * .5; cy = H * .45 }
      t += .01

      const sp = m.inside ? Math.hypot(m.vx, m.vy) : 0
      m.vx *= .8; m.vy *= .8
      sc += (8 + Math.min(90, sp * 3) - sc) * .12
      disp.setAttribute('scale', sc.toFixed(1))
      turb.setAttribute('baseFrequency', (0.006 + Math.sin(t) * .0015).toFixed(4))

      const tx = m.inside ? m.x : W * (.5 + .2 * Math.sin(t * .8))
      const ty = m.inside ? m.y : H * (.45 + .2 * Math.cos(t * .6))
      cx += (tx - cx) * .08; cy += (ty - cy) * .08
      px += (((cx / W) - .5) * -30 - px) * .1
      py += (((cy / H) - .5) * -20 - py) * .1
      img.style.transform = `translate(${px}px,${py}px)`

      const rx = 60 + 6 * Math.sin(t * 2.3), ry = 40 + 4 * Math.cos(t * 1.7)
      setMask(rx, ry, cx - px + W * .04, cy - py + H * .04)
    }
    id = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(id)
      host.removeEventListener('mousemove', onMove)
      host.removeEventListener('mouseleave', onLeave)
    }
  }, [hostRef, imgRef, turbRef, dispRef])
}
