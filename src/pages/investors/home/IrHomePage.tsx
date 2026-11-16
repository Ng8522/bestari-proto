import { Link, Navigate, useLocation } from 'react-router'
import { safeDecode } from '../../../components/routing'
import { Ph } from '../../../components/text'
import { COMPANY } from '../../../content/site'
import { LEGACY_IR_ANCHORS, irPath } from '../../../content/ir-nav'
import { PROSPECTUS_SOURCE } from '../content/prospectus'
import { IR_EMAIL_PLACEHOLDER, MD_QUOTE } from '../data'
import { Panel, StatGrid } from '../ui/PageParts'
import { SectionTabs, type SectionTab } from '../ui/SectionTabs'
import { HomeWidgets, SectionDirectory } from './HomeWidgets'
import { LATEST_YEAR_LABEL, latestYearStats } from './keyFigures'
import './home.css'

/** IR Home. Old one-page anchors (/investor-relations#ipo) are sent on to their new pages. */
export function IrHomePage() {
  const { hash } = useLocation()
  const legacyTarget = LEGACY_IR_ANCHORS[safeDecode(hash.slice(1))]
  if (legacyTarget) return <Navigate to={legacyTarget} replace />

  return (
    <div className="wrap wrap--wide ir-home">
      <h2 id={HOME_TABS_TITLE_ID} className="visually-hidden">
        Investor updates
      </h2>
      <SectionTabs labelledBy={HOME_TABS_TITLE_ID} tabs={HOME_TABS} />
      <AlertsAndContact />
    </div>
  )
}

function Directory() {
  return (
    <section aria-labelledby="ir-directory-title">
      <div className="home-head">
        <h2 id="ir-directory-title">Explore Investor Relations</h2>
        <p>Every section of our IR site, with its pages.</p>
      </div>
      <SectionDirectory />
    </section>
  )
}

function CompanySnapshot() {
  return (
    <section aria-labelledby="ir-snapshot-title">
      <div className="home-head">
        <h2 id="ir-snapshot-title">Company snapshot</h2>
        <p>Who we are, and how we performed in our latest financial year.</p>
      </div>
      <div className="grid-2">
        <Panel title={`${LATEST_YEAR_LABEL} at a glance`} sub={`Financial year ended 31 December. Source: ${PROSPECTUS_SOURCE}.`}>
          <StatGrid stats={latestYearStats()} label={`${LATEST_YEAR_LABEL} key figures`} />
          <Link className="widget-more" to={irPath('financial-info', 'highlights')}>
            Financial highlights <span aria-hidden="true">→</span>
          </Link>
        </Panel>
        <div className="ov-stack">
          <div className="card ov-text reveal">
            <p>
              <b>{COMPANY.name}</b> is an investment holding company. Through its subsidiaries, the Group makes and
              sells food premixes under the <b>Bestari</b> brand, supplies food ingredients and food processing
              equipment, and provides spare parts and maintenance services.
            </p>
            <p>Its flagship fried chicken coating mix has been sold since 2004.</p>
          </div>
          <figure className="card quote reveal">
            <blockquote>{MD_QUOTE.text}</blockquote>
            <figcaption>
              <b>{MD_QUOTE.name}</b>
              <span>{MD_QUOTE.title}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function AlertsAndContact() {
  return (
    <div className="home-cta">
      <section className="cta-card" aria-labelledby="ir-home-alerts">
        <h3 id="ir-home-alerts">News alerts</h3>
        <p>Subscribe to receive our latest announcements, results and news by email.</p>
        <Link className="btn btn-saffron" to={irPath('resources', 'news-alerts')}>
          Subscribe <span className="arr" aria-hidden="true">→</span>
        </Link>
      </section>
      <section className="cta-card cta-card--light" aria-labelledby="ir-home-contact">
        <h3 id="ir-home-contact">IR contact</h3>
        <p>Contact us for any matter relating to investor relations.</p>
        <p>
          <a href={COMPANY.phone.href}>{COMPANY.phone.label}</a> · <Ph>{IR_EMAIL_PLACEHOLDER}</Ph>
        </p>
        <Link className="btn btn-saffron" to={irPath('contact')}>
          Contact IR <span className="arr" aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  )
}

/** Names the home tabs for screen readers; the hero above already says what the page is. */
const HOME_TABS_TITLE_ID = 'ir-home-tabs-title'

type HomeTab = 'updates' | 'snapshot' | 'explore'

const HOME_TABS: readonly SectionTab<HomeTab>[] = [
  { id: 'updates', label: 'Latest updates', content: <HomeWidgets /> },
  { id: 'snapshot', label: 'Company snapshot', content: <CompanySnapshot /> },
  { id: 'explore', label: 'Explore IR', content: <Directory /> },
]
