import type { ReactNode } from 'react'
import { headingId, type SectionId } from './data'

interface IrSectionProps {
  id: SectionId
  /** Extra modifiers, e.g. 'sec--tinted' (cream-2 background) or 'sec--flush' (no top padding). */
  className?: string
  children: ReactNode
}

/** A page section: 90px vertical padding, scroll-margin for the sticky header + sub-nav, named by its heading. */
export function IrSection({ id, className, children }: IrSectionProps) {
  return (
    <section id={id} className={className ? `sec ${className}` : 'sec'} aria-labelledby={headingId(id)}>
      <div className="wrap wrap--wide">{children}</div>
    </section>
  )
}

interface SectionHeadProps {
  sectionId: SectionId
  eyebrow: string
  title: string
  intro?: string
}

/** Eyebrow + maroon H2 on the left, optional intro paragraph on the right (the handoff's .sh). */
export function SectionHead({ sectionId, eyebrow, title, intro }: SectionHeadProps) {
  return (
    <div className="sec-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={headingId(sectionId)}>{title}</h2>
      </div>
      {intro && <p className="sec-intro">{intro}</p>}
    </div>
  )
}
