// Contact modal — opened from the side panel's "Contact me" button and the About pop-up.
// Reuses the backdrop/panel/close styles from ProjectModal.css.

import { useEffect, useRef } from 'react'
import '../ProjectModal/ProjectModal.css'
import './ContactModal.css'
import { ArrowUp } from '../icons/ArrowUp'
import { EMAIL, LINKEDIN_URL, RESUME_URL } from '../../content/contact'

type Props = {
  open: boolean
  onClose: () => void
}

export function ContactModal({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      opener?.focus() // return focus to whatever opened the modal
    }
  }, [open, onClose])

  if (!open) return null

  const linkedinHandle = LINKEDIN_URL.replace(/^https?:\/\/(www\.)?linkedin\.com/, '').replace(/\/$/, '')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3 id="contact-modal-title" className="contact-modal__title">Contact me</h3>

        <ul className="contact-modal__list">
          <li>
            <a className="contact-modal__row" href={`mailto:${EMAIL}`}>
              <span className="contact-modal__label">Email</span>
              <span className="t-meta contact-modal__value">{EMAIL}</span>
            </a>
          </li>
          <li>
            <a className="contact-modal__row" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <span className="contact-modal__label">LinkedIn</span>
              <span className="t-meta contact-modal__value">{linkedinHandle}<ArrowUp width="12" height="12" /></span>
            </a>
          </li>
          <li>
            <a className="contact-modal__row" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
              <span className="contact-modal__label">Résumé</span>
              <span className="t-meta contact-modal__value">PDF<ArrowUp width="12" height="12" /></span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
