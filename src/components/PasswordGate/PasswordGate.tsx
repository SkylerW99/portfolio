import { useRef, useState, type FormEvent } from 'react'
import { Popup } from '../Popup/Popup'
import { markUnlocked, sha256 } from '../../content/unlock'
import './PasswordGate.css'

// Password pop-up for case studies with `passwordHash` in their frontmatter,
// rendered by SiteShell over the current page when ?unlock=slug is set.
// Helpers + how to set a password: src/content/unlock.ts

const FORM_ID = 'pw-gate-form'

export function PasswordGate({
  slug,
  title,
  hash,
  onUnlock,
  onClose,
}: {
  slug: string
  title: string
  hash: string
  onUnlock: () => void
  onClose: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!value || checking) return
    setChecking(true)
    const ok = (await sha256(value)) === hash.toLowerCase()
    setChecking(false)
    if (!ok) {
      setError(true)
      inputRef.current?.select()
      return
    }
    markUnlocked(slug)
    onUnlock()
  }

  return (
    <Popup
      open
      onClose={onClose}
      label={`Password required — ${title}`}
      heading="Protected case study"
      className="pw-gate"
      initialFocus={inputRef}
      footer={
        <>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" form={FORM_ID} className="is-filled" disabled={checking}>
            Enter <span>→</span>
          </button>
        </>
      }
    >
      <form id={FORM_ID} className="pw-gate__form" onSubmit={submit}>
        <h2 className="t-section pw-gate__title">{title}</h2>
        <p className="t-body pw-gate__copy">
          This project includes confidential work. Enter the password to view it.
        </p>
        <label className="t-label pw-gate__label" htmlFor="pw-gate-input">Password</label>
        <input
          ref={inputRef}
          id="pw-gate-input"
          className="pw-gate__input"
          type="password"
          autoComplete="current-password"
          value={value}
          aria-invalid={error}
          aria-describedby={error ? 'pw-gate-error' : undefined}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
        />
        <p id="pw-gate-error" className="t-meta pw-gate__error" role="alert">
          {error ? 'Incorrect password — try again.' : ' '}
        </p>
      </form>
    </Popup>
  )
}
