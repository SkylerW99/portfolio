// Shared pop-up frame for the redesign's dialogs (About, art projects):
// dimmed overlay, bordered box, mono header bar with a ✕, Esc / backdrop to close,
// focus moved in on open and restored on close, page scroll locked while open.

import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import './Popup.css'

type Props = {
  open: boolean
  onClose: () => void
  /** Accessible name for the dialog. */
  label: string
  /** Mono text in the header bar. */
  heading: ReactNode
  className?: string
  /** Media column (left). Omit for a single-column pop-up. */
  media?: ReactNode
  /** Sticky footer row (e.g. prev / next, résumé / contact). */
  footer?: ReactNode
  /** Element to focus on open instead of the ✕ (e.g. a form field). */
  initialFocus?: RefObject<HTMLElement | null>
  children: ReactNode
}

export function Popup({ open, onClose, label, heading, className = '', media, footer, initialFocus, children }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    ;(initialFocus?.current ?? closeRef.current)?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      opener?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="popup" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`popup__box${media ? '' : ' popup__box--single'} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {media && <div className="popup__media">{media}</div>}
        <div className="popup__col">
          <div className="t-nav popup__head">
            <span>{heading}</span>
            <button ref={closeRef} type="button" className="btn btn--icon" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <div className="popup__body">{children}</div>
          {footer && <div className="t-nav popup__foot">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
