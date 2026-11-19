// Embeds a PDF kept in public/ (e.g. SmartHQ's design-system booklet) in the browser's
// own PDF viewer, inside the same dark frame + top bar as HtmlEmbed's `framed` mode.
// The frame has a fixed height and scrolls inside. Mobile browsers often show only the
// first page of an embedded PDF, so the bar's "Open PDF" link is the reliable way in.

interface PdfEmbedProps {
  src: string
  title: string
  /** Any CSS length; defaults to most of the viewport. */
  height?: string
}

export function PdfEmbed({ src, title, height = 'min(85vh, 920px)' }: PdfEmbedProps) {
  return (
    <div className="html-embed">
      <div className="html-embed__frame html-embed__frame--dark">
        <div className="html-embed__bar" aria-hidden="true" />
        <a
          className="btn html-embed__open html-embed__open--bar"
          href={src}
          target="_blank"
          rel="noreferrer"
        >
          Open PDF ↗
        </a>
        <iframe src={`${src}#navpanes=0&view=FitH`} title={title} loading="lazy" style={{ height }} />
      </div>
    </div>
  )
}
