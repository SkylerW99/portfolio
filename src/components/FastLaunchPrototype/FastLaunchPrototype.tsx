// Fast Launch final design: the live Figma prototype (page "FL ONLY"), embedded.
// The step buttons reload the embed at a flow's starting frame; Restart goes back to FL 0.
// The Figma file must be shared "Anyone with the link can view" for visitors to see it.

import { useEffect, useRef, useState } from 'react'
import './FastLaunchPrototype.css'

const FILE = 'EUIIJkHfaRd3avkqqII5vo'
const PAGE = '54607:23920'

// Flow starting points on the "FL ONLY" page.
const STAGES = [
  { label: 'Login', node: '54607:23973' },
  { label: 'Pre-approval', node: '54607:24053' },
  { label: 'Document upload', node: '54607:25037' },
  { label: 'Full approval', node: '54607:25053' },
  { label: 'Device tracking', node: '54607:24633' },
  { label: 'Payment credentials', node: '54607:24704' },
]

function embedUrl(node: string) {
  const q = new URLSearchParams({
    'page-id': PAGE,
    'node-id': node,
    'starting-point-node-id': node,
    scaling: 'scale-down',
    'content-scaling': 'fixed',
    'hide-ui': '1',
    footer: 'false',
    'embed-host': 'portfolio',
  })
  return `https://embed.figma.com/proto/${FILE}/Fast-Launch?${q}`
}

export function FastLaunchPrototype() {
  const [stage, setStage] = useState(0)
  const [nonce, setNonce] = useState(0) // bump to reload the embed, even on the same stage

  const frameRef = useRef<HTMLDivElement>(null)
  const [full, setFull] = useState(false)

  function goTo(i: number) {
    setStage(i)
    setNonce((n) => n + 1)
  }

  // Full screen = the frame element (iframe + exit button), so Figma rescales to the screen.
  useEffect(() => {
    const sync = () => setFull(document.fullscreenElement === frameRef.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen()
    else frameRef.current?.requestFullscreen?.().catch(() => { /* blocked / unsupported */ })
  }

  return (
    <div className="flp">
      <div className="flp__bar">
        <ol className="flp__steps" aria-label="Jump to a stage of the journey">
          {STAGES.map((st, i) => (
            <li key={st.node}>
              <button type="button" className="flp__step" aria-current={stage === i ? 'step' : undefined} onClick={() => goTo(i)}>
                <span className="flp__step-n">{i}.</span> {st.label}
              </button>
            </li>
          ))}
        </ol>
        <div className="flp__actions">
          <button type="button" className="flp__act flp__act--restart" onClick={() => goTo(0)}>
            <span aria-hidden="true">↺</span> Restart
          </button>
          <button type="button" className="flp__act" onClick={toggleFull} aria-pressed={full}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M1 4.5V1h3.5M11 4.5V1H7.5M1 7.5V11h3.5M11 7.5V11H7.5" />
            </svg>
            Full screen
          </button>
        </div>
      </div>

      <div ref={frameRef} className="flp__frame">
        <iframe
          key={`${stage}-${nonce}`}
          className="flp__embed"
          src={embedUrl(STAGES[stage].node)}
          title={`Fast Launch prototype — ${STAGES[stage].label}`}
          loading="lazy"
          allowFullScreen
        />
        {full && (
          <button type="button" className="flp__act flp__exit" onClick={toggleFull}>
            Exit full screen <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>
    </div>
  )
}
