import { Ph } from '../../components/text'
import { COMPANY } from '../../content/site'
import { BUSINESS_ACTIVITIES, GENERAL_INFO, STATEMENTS_NOTE, SUBSIDIARIES_PLACEHOLDER } from './content/sections'
import { headingId } from './data'
import { IrSection, SectionHead } from './Section'
import { EmptyState, InfoList, Tabs, type TabItem } from './Tabs'

type CorporateTabId = 'general' | 'structure' | 'statements'

const CORPORATE_TABS: readonly TabItem<CorporateTabId>[] = [
  { id: 'general', label: 'General information', content: <InfoList entries={GENERAL_INFO} className="info--grid" /> },
  { id: 'structure', label: 'Corporate structure', content: <CorporateStructure /> },
  {
    id: 'statements',
    label: 'Chairman’s statement & MD&A',
    content: (
      <EmptyState>
        {STATEMENTS_NOTE} <a href="#reports">Go to reports</a>
      </EmptyState>
    ),
  },
]

/** Corporate information: general details and advisers, group structure, and the annual report statements. */
export function Corporate() {
  return (
    <IrSection id="corporate" className="sec--tinted">
      <SectionHead
        sectionId="corporate"
        eyebrow="Corporate info"
        title="Corporate information."
        intro="Who we are, who advises us, and how the Group is organised."
      />
      <div className="card reveal">
        <Tabs idPrefix="ir-corp" labelledBy={headingId('corporate')} tabs={CORPORATE_TABS} />
      </div>
    </IrSection>
  )
}

function CorporateStructure() {
  return (
    <div className="org">
      <div className="org-root">
        <b>{COMPANY.name}</b>
        <span>Investment holding company</span>
      </div>
      <p className="org-sub">
        <Ph>{SUBSIDIARIES_PLACEHOLDER}</Ph>
      </p>
      <p className="org-caption">Through its subsidiaries, the Group is in:</p>
      <ul className="org-list">
        {BUSINESS_ACTIVITIES.map((activity) => (
          <li key={activity}>{activity}</li>
        ))}
      </ul>
    </div>
  )
}
