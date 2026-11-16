import { useRef, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useScrollReveal } from '../../components/motion'
import { useDocumentTitle } from '../../components/routing'
import { IR_BASE, findPage, findSection, type IrPageNav, type IrSectionNav } from '../../content/ir-nav'
import { IR_DISCLAIMER } from './data'
import { IrHero } from './Hero'
import { IrBand, IrPageTabs, IrPager, IrSectionMenu, TickerStrip, bandFor } from './IrMenus'
import './investors.css'

export interface IrLocation {
  /** Undefined for a path that is not an IR section. */
  section?: IrSectionNav
  page?: IrPageNav
  /** The path without a trailing slash. */
  path: string
}

/** Which IR section and sub-page a pathname points at, e.g. "/investor-relations/stock-info/price-ticker". */
export function parseIrPath(pathname: string): IrLocation {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const [sectionSlug, pageSlug] = path.slice(IR_BASE.length).split('/').filter(Boolean)
  const section = findSection(sectionSlug)
  return { section, page: section ? findPage(section, pageSlug) : undefined, path }
}

function documentTitle({ section, page }: IrLocation): string {
  if (page && section) return `${page.label} · ${section.label}`
  if (section?.slug) return `${section.label} · Investor Relations`
  return 'Investor Relations'
}

/**
 * The Investor Relations site: hero (IR Home) or title band, the price strip, the icon menu, the section's
 * sub-page tabs, the page itself, the previous / next pager and the legal disclaimer. The chrome stays mounted
 * across IR pages, so focus and the menus' scroll position survive navigation.
 */
export function IrLayout() {
  const location = parseIrPath(useLocation().pathname)
  const { section, page, path } = location
  const isHome = section?.slug === ''
  const band = bandFor(section, page)
  useDocumentTitle(documentTitle(location))

  return (
    <div className="ir">
      {isHome ? (
        <RevealScope>
          <IrHero />
        </RevealScope>
      ) : (
        <IrBand title={band.title} trail={band.trail} />
      )}
      <TickerStrip />
      <IrSectionMenu activeSlug={section?.slug} />
      {section && section.pages.length > 0 && <IrPageTabs section={section} activeSlug={page?.slug} />}
      <RevealScope key={path}>
        <Outlet />
      </RevealScope>
      {!isHome && <IrPager href={path} />}
      <p className="wrap wrap--wide disc" id="ir-disclaimer">
        {IR_DISCLAIMER}
      </p>
    </div>
  )
}

/** Runs the scroll reveal on what it wraps; the page's scope is keyed by path so each new page reveals too. */
function RevealScope({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null)
  useScrollReveal(scopeRef)
  return <div ref={scopeRef}>{children}</div>
}
