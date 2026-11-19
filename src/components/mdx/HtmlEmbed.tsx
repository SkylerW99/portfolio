// Embeds a self-contained interactive HTML page (e.g. a coded data viz) that lives in
// public/. The file is same-origin, so the frame grows to the page's content height
// (no inner scrollbar) and keeps tracking it as the page resizes. `minHeight` is only the
// placeholder height before the page has loaded. Optional `intro` sits above the frame.
// "Open in new tab" floats over the frame's top-right corner; `hideOpenWhen` is a CSS
// selector inside the page (e.g. an open drawer) that hides it so it never covers the
// page's own controls. `zoom` scales the page like browser zoom (e.g. 0.6 = 60%);
// `zoomTarget` limits it to one element (e.g. the chart, not its drawer).
// `height` (any CSS length) switches to a fixed frame that scrolls inside — for full
// pages with sticky panels or bottom sheets, which break in an auto-height frame.
// `openAt="bottom"` moves the floating button to the bottom-left corner, for pages
// whose own controls sit in the top-right (e.g. an app header with a side nav).
// `raised` lifts the frame with a soft drop shadow, to set a live prototype apart from static images.
// `framed` sets the page in a dark surround with a top bar (like Fast Launch's demo video);
// the "Open in new tab" button then sits in that bar instead of over the page.

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface HtmlEmbedProps {
  src: string
  title: string
  minHeight?: number
  intro?: ReactNode
  hideOpenWhen?: string
  zoom?: number
  zoomTarget?: string
  height?: string
  openAt?: 'top' | 'bottom'
  raised?: boolean
  framed?: boolean
}

export function HtmlEmbed({ src, title, minHeight = 600, intro, hideOpenWhen, zoom, zoomTarget = 'body', height: fixedHeight, openAt = 'top', raised = false, framed = false }: HtmlEmbedProps) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(minHeight)
  const [covered, setCovered] = useState(false)

  useEffect(() => {
    const frame = ref.current
    if (!frame) return
    let ro: ResizeObserver | undefined
    let mo: MutationObserver | undefined

    const fit = () => {
      if (fixedHeight) return
      const doc = frame.contentDocument
      if (!doc?.body) return
      // Measure the body, not the document: documentElement.scrollHeight never drops
      // below the frame's own height, so the frame could grow but never shrink to fit.
      const h = Math.ceil(doc.body.getBoundingClientRect().height)
      if (h > 0) setHeight(h)
    }
    const onLoad = () => {
      const doc = frame.contentDocument
      if (doc?.body && zoom && zoom !== 1 && !doc.getElementById('html-embed-zoom')) {
        const st = doc.createElement('style')
        st.id = 'html-embed-zoom'
        st.textContent = `${zoomTarget} { zoom: ${zoom}; }`
        doc.head.appendChild(st)
      }
      fit()
      if (doc?.body) {
        ro?.disconnect()
        ro = new ResizeObserver(fit)
        ro.observe(doc.body)
        if (hideOpenWhen) {
          const check = () => setCovered(!!doc.querySelector(hideOpenWhen))
          mo?.disconnect()
          mo = new MutationObserver(check)
          mo.observe(doc.body, { subtree: true, attributes: true, attributeFilter: ['class'] })
          check()
        }
      }
    }

    frame.addEventListener('load', onLoad)
    if (frame.contentDocument?.readyState === 'complete') onLoad()
    return () => { frame.removeEventListener('load', onLoad); ro?.disconnect(); mo?.disconnect() }
  }, [minHeight, hideOpenWhen, zoom, zoomTarget, fixedHeight])

  return (
    <div className={`html-embed${raised ? ' html-embed--raised' : ''}`}>
      {intro && <div className="html-embed__intro">{intro}</div>}
      <div className={`html-embed__frame${framed ? ' html-embed__frame--dark' : ''}`}>
        {framed && <div className="html-embed__bar" aria-hidden="true" />}
        <iframe ref={ref} src={src} title={title} loading="lazy" style={{ height: fixedHeight ?? height }} />
        <a className={`btn html-embed__open${framed ? ' html-embed__open--bar' : openAt === 'bottom' ? ' html-embed__open--bottom' : ''}`} href={src} target="_blank" rel="noopener noreferrer" hidden={covered}>
          Open in new tab ↗
        </a>
      </div>
    </div>
  )
}
