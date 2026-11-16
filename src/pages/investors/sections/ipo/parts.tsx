import type { ReactNode } from 'react'
import { PROSPECTUS_SOURCE } from '../../content/prospectus'

interface SourceNoteProps {
  /** Extra text after the source, e.g. "RM'000." */
  children?: ReactNode
}

/** The source line under a set of figures. */
export function SourceNote({ children }: SourceNoteProps) {
  return (
    <p className="note source-note">
      Source: {PROSPECTUS_SOURCE}.{children && <> {children}</>}
    </p>
  )
}

interface ExternalLinkProps {
  href: string
  children: ReactNode
  className?: string
}

/** A link that opens another site in a new tab, and says so to screen readers. */
export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}
