// "SW" wordmark: outlined JetBrains Mono letters that fill with ink from the
// bottom when the link is hovered or focused (see .logo in SiteShell.css).

import { Link } from 'react-router-dom'

type Props = {
  size: number
  vertical?: boolean
  onClick?: () => void
}

export function Logo({ size, vertical = false, onClick }: Props) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Skylar Wang — home"
      className={`logo${vertical ? ' logo--vertical' : ''}`}
      style={{ fontSize: size }}
    >
      <span className="logo__fill" aria-hidden="true">
        <span className="logo__s">S</span><span className="logo__w">W</span>
      </span>
    </Link>
  )
}
