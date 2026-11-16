import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router'
import { Ph } from '../../components/text'
import { COMPANY, ROUTES } from '../../content/site'
import { IR_BASE, IR_NAV, irPath, neighbours, sectionHref, type IrPageNav, type IrSectionNav } from '../../content/ir-nav'
import { IrIcon } from './icons'

/** On phones the menus scroll sideways: keep the current item in view without moving the page vertically. */
function useCentredActiveItem(activeKey: string) {
  const listRef = useRef<HTMLUListElement>(null)
  useLayoutEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLElement>('[aria-current]')
    if (!list || !active) return
    list.scrollLeft = active.offsetLeft - (list.clientWidth - active.clientWidth) / 2
  }, [activeKey])
  return listRef
}

export interface Crumb {
  label: string
  /** Omitted for the current page (the last crumb). */
  href?: string
}

/** The band's H1 and the breadcrumb after "Home / Investor Relations", for a section page or a missing page. */
export function bandFor(section: IrSectionNav | undefined, page: IrPageNav | undefined): { title: string; trail: Crumb[] } {
  if (!section) return { title: 'Investor Relations', trail: [{ label: 'Page not found' }] }
  if (!page) return { title: section.label, trail: [{ label: section.label }] }
  return { title: section.label, trail: [{ label: section.label, href: sectionHref(section) }, { label: page.label }] }
}

interface BandProps {
  title: string
  trail: readonly Crumb[]
}

/** Green title band for every IR page but IR Home: breadcrumb, then the section name as the H1. */
export function IrBand({ title, trail }: BandProps) {
  return (
    <section className="ir-band" aria-labelledby="ir-band-title">
      <div className="wrap wrap--wide">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to={ROUTES.home}>Home</Link>
            </li>
            <li>
              <Link to={IR_BASE}>Investor Relations</Link>
            </li>
            {trail.map((crumb) => (
              <li key={crumb.label} aria-current={crumb.href ? undefined : 'page'}>
                {crumb.href ? <Link to={crumb.href}>{crumb.label}</Link> : crumb.label}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow">Investor Relations</p>
        <h1 id="ir-band-title">{title}</h1>
      </div>
    </section>
  )
}

const TICKER_FIELDS = [
  { label: 'Last price', value: 'RM —' },
  { label: 'Change', value: '—' },
  { label: 'Volume', value: '—' },
] as const

/** The Bursa price strip. Bestari is pre-listing, so it shows the listing status instead of live prices. */
export function TickerStrip() {
  return (
    <section className="ir-ticker" aria-label="Share price summary">
      <div className="wrap wrap--wide ir-ticker-row">
        <b className="ir-ticker-name">{COMPANY.name}</b>
        <span>
          Stock name &amp; code <Ph>At listing</Ph>
        </span>
        <span className="ir-ticker-board">Main Market · Shariah-compliant</span>
        {TICKER_FIELDS.map((field) => (
          <span key={field.label} className="ir-ticker-field">
            {field.label} <b>{field.value}</b>
          </span>
        ))}
        <span className="ir-ticker-status">Pre-listing · SC approved 23 Oct 2026</span>
      </div>
    </section>
  )
}

/** The IR icon menu: IR Home, the eight sections and IR Contact. No item is current on a missing page. */
export function IrSectionMenu({ activeSlug }: { activeSlug?: string }) {
  const listRef = useCentredActiveItem(activeSlug ?? '')
  return (
    <nav className="ir-menu" aria-label="Investor Relations">
      <ul className="wrap wrap--wide ir-menu-list" ref={listRef}>
        {IR_NAV.map((section) => (
          <li key={section.slug || 'home'}>
            <Link
              to={sectionHref(section)}
              aria-current={section.slug === activeSlug ? 'true' : undefined}
              className="ir-menu-item"
            >
              <IrIcon name={section.icon} />
              <span>{section.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

interface PageTabsProps {
  section: IrSectionNav
  activeSlug?: string
}

/** The current section's sub-pages, as tabs under the icon menu. */
export function IrPageTabs({ section, activeSlug }: PageTabsProps) {
  const listRef = useCentredActiveItem(activeSlug ?? '')
  return (
    <nav className="ir-tabs" aria-label={`${section.label} pages`}>
      <ul className="wrap wrap--wide ir-tabs-list" ref={listRef}>
        {section.pages.map((page) => (
          <li key={page.slug}>
            <Link to={irPath(section.slug, page.slug)} aria-current={page.slug === activeSlug ? 'page' : undefined}>
              {page.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Previous / next page across the whole IR site, at the foot of every IR page. */
export function IrPager({ href }: { href: string }) {
  const { previous, next } = neighbours(href)
  if (!previous && !next) return null
  return (
    <nav className="wrap wrap--wide ir-pager" aria-label="Previous and next IR pages">
      {previous ? (
        <Link to={previous.href} className="ir-pager-link" rel="prev">
          <small>
            <span aria-hidden="true">←</span> Previous
          </small>
          <b>{previous.label}</b>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={next.href} className="ir-pager-link ir-pager-link--next" rel="next">
          <small>
            Next <span aria-hidden="true">→</span>
          </small>
          <b>{next.label}</b>
        </Link>
      )}
    </nav>
  )
}
