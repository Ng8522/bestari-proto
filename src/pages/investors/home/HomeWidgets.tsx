import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Ph } from '../../../components/text'
import { IR_NAV, irPath, sectionHref } from '../../../content/ir-nav'
import { CALENDAR } from '../content/sections'
import { MEDIA_ARTICLES } from '../content/prospectus'
import { IrIcon } from '../icons'

/** How many items each IR Home widget lists before "View more". */
const WIDGET_ITEMS = 5

interface WidgetProps {
  title: string
  moreHref: string
  children: ReactNode
}

function Widget({ title, moreHref, children }: WidgetProps) {
  return (
    <section className="card widget reveal" aria-label={title}>
      <h3>{title}</h3>
      {children}
      <Link className="widget-more" to={moreHref}>
        View more <span aria-hidden="true">→</span>
      </Link>
    </section>
  )
}

/** Bursa announcements, media news and the corporate calendar, side by side (the Bursa IR home layout). */
export function HomeWidgets() {
  const upcoming = CALENDAR.slice(0, WIDGET_ITEMS)
  return (
    <div className="widgets">
      <Widget title="Bursa Announcements" moreHref={irPath('news', 'bursa-announcements')}>
        <p className="widget-empty">Our announcements to Bursa Malaysia will appear here from the listing date.</p>
      </Widget>
      <Widget title="Media News" moreHref={irPath('news', 'media-news')}>
        <ul className="widget-list">
          {MEDIA_ARTICLES.slice(0, WIDGET_ITEMS).map((article) => (
            <li key={article.href}>
              <time dateTime={article.isoDate}>{article.date}</time>
              <a href={article.href} target="_blank" rel="noopener noreferrer">
                {article.title}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
              <small>{article.source}</small>
            </li>
          ))}
        </ul>
      </Widget>
      <Widget title="Corporate Calendar" moreHref={irPath('resources', 'corporate-calendar')}>
        <ul className="widget-list">
          {upcoming.map((item) => (
            <li key={item.event}>
              <span className="widget-date">{item.isDatePlaceholder ? <Ph>{item.date}</Ph> : item.date}</span>
              <span>{item.event}</span>
            </li>
          ))}
        </ul>
      </Widget>
    </div>
  )
}

/** Every IR section with its sub-pages: the whole IR site at a glance. */
export function SectionDirectory() {
  const sections = IR_NAV.filter((section) => section.pages.length > 0)
  return (
    <ul className="directory" aria-label="Investor Relations sections">
      {sections.map((section) => (
        <li key={section.slug} className="card directory-card reveal">
          <Link to={sectionHref(section)} className="directory-head">
            <IrIcon name={section.icon} />
            <b>{section.label}</b>
          </Link>
          <ul className="directory-pages">
            {section.pages.map((page) => (
              <li key={page.slug}>
                <Link to={irPath(section.slug, page.slug)}>{page.label}</Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
