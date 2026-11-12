import { NEWS_TABS, type NewsTab } from './content/sections'
import { headingId } from './data'
import { IrSection, SectionHead } from './Section'
import { EmptyState, Tabs } from './Tabs'

const TABS = NEWS_TABS.map((tab) => ({ id: tab.id, label: tab.label, content: <NewsList tab={tab} /> }))

/** News centre: Bursa announcements, press releases and media news. */
export function NewsCentre() {
  return (
    <IrSection id="news">
      <SectionHead
        sectionId="news"
        eyebrow="News centre"
        title="Announcements & news."
        intro="Our Bursa filings, press releases and media coverage."
      />
      <div className="card reveal">
        <Tabs idPrefix="ir-news" labelledBy={headingId('news')} tabs={TABS} />
      </div>
    </IrSection>
  )
}

function NewsList({ tab }: { tab: NewsTab }) {
  if (tab.items.length === 0) return <EmptyState>{tab.emptyMessage}</EmptyState>
  return (
    <ul className="news-list">
      {tab.items.map((item) => (
        <li key={`${item.date}-${item.title}`} className="news-item">
          <span className="news-date">{item.date}</span>
          <div>
            <b>{item.href ? <a href={item.href}>{item.title}</a> : item.title}</b>
            <small>{item.source}</small>
          </div>
        </li>
      ))}
    </ul>
  )
}
