import { useId, type ReactNode } from 'react'
import { Ph } from '../../../components/text'

/** Id of every IR sub-page's H2, so sections and landmarks can point at it. */
export const PAGE_TITLE_ID = 'ir-page-title'

interface PageHeaderProps {
  title: string
  intro?: ReactNode
}

/** The sub-page title (H2 under the section's H1 in the band) and its one-line intro. */
export function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <header className="pg-head">
      <h2 id={PAGE_TITLE_ID}>{title}</h2>
      {intro && <p className="pg-intro">{intro}</p>}
    </header>
  )
}

interface PanelProps {
  title?: string
  /** Small line under the title, e.g. the unit or the source. */
  sub?: ReactNode
  /** Controls on the right of the title (a year select, a toggle). */
  actions?: ReactNode
  className?: string
  children: ReactNode
}

/** A white card with an optional H3 title, subtitle and controls. */
export function Panel({ title, sub, actions, className, children }: PanelProps) {
  const titleId = useId()
  return (
    <section
      className={className ? `card panel ${className}` : 'card panel'}
      aria-labelledby={title ? titleId : undefined}
    >
      {(title || actions) && (
        <div className="panel-head">
          <div>
            {title && <h3 id={titleId}>{title}</h3>}
            {sub && <p className="card-sub">{sub}</p>}
          </div>
          {actions && <div className="panel-actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

type NoticeTone = 'info' | 'pending'

interface NoticeProps {
  tone?: NoticeTone
  title?: string
  children: ReactNode
}

/** A tinted callout, e.g. "Trading data starts on the listing date". */
export function Notice({ tone = 'info', title, children }: NoticeProps) {
  return (
    <div className={`notice notice--${tone}`} role="note">
      {title && <b className="notice-title">{title}</b>}
      <div>{children}</div>
    </div>
  )
}

export interface Stat {
  label: string
  value: string
  /** Small line under the value. */
  detail?: string
  isPlaceholder?: boolean
}

interface StatGridProps {
  stats: readonly Stat[]
  label: string
}

/** Key figures as a grid of tiles (label above a large value). */
export function StatGrid({ stats, label }: StatGridProps) {
  return (
    <dl className="stat-grid" aria-label={label}>
      {stats.map((stat) => (
        <div key={stat.label} className="stat">
          <dt>{stat.label}</dt>
          <dd>
            <b>{stat.isPlaceholder ? <Ph>{stat.value}</Ph> : stat.value}</b>
            {stat.detail && <small>{stat.detail}</small>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** Muted pill for a document or figure that is not published yet. */
export function Pending({ children = 'After listing' }: { children?: ReactNode }) {
  return <span className="pending">{children}</span>
}
