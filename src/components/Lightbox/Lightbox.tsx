// Full-screen image viewer for case-study images.
// ProjectDetail owns the open/closed state and passes the list of images in.

import { useEffect, useRef } from 'react'
import './Lightbox.css'

export type LightboxImage = { src: string; alt: string }

type Props = {
  images: LightboxImage[]
  index: number | null
  onChange: (index: number) => void
  onClose: () => void
}

export function Lightbox({ images, index, onChange, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null && images[index] !== undefined
  const count = images.length

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden' // keep the page from scrolling behind the viewer
    return () => {
      document.body.style.overflow = prevOverflow
      opener?.focus()
    }
  }, [open])

  useEffect(() => {
    if (index === null) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight' && count > 1) onChange((index! + 1) % count)
      else if (event.key === 'ArrowLeft' && count > 1) onChange((index! - 1 + count) % count)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [index, count, onChange, onClose])

  if (!open) return null
  const image = images[index]

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={onClose}>
      <button ref={closeRef} type="button" className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close">
        ×
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            className="lightbox__btn lightbox__nav lightbox__nav--prev"
            onClick={(e) => { e.stopPropagation(); onChange((index - 1 + count) % count) }}
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            type="button"
            className="lightbox__btn lightbox__nav lightbox__nav--next"
            onClick={(e) => { e.stopPropagation(); onChange((index + 1) % count) }}
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}

      <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
        <img key={image.src} className="lightbox__img" src={image.src} alt={image.alt} />
        <figcaption className="t-meta lightbox__caption">
          {image.alt && <span>{image.alt}</span>}
          {count > 1 && <span>{index + 1} / {count}</span>}
        </figcaption>
      </figure>
    </div>
  )
}
