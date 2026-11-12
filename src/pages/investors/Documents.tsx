import { REPORT_TABS } from './content/sections'
import { headingId } from './data'
import { IrSection, SectionHead } from './Section'
import { DocList, Tabs } from './Tabs'

const TABS = REPORT_TABS.map((tab) => ({
  id: tab.id,
  label: tab.label,
  content: <DocList documents={tab.documents} emptyMessage={tab.emptyMessage} />,
}))

/** Reports & presentations: annual and quarterly reports, circulars, prospectus, analyst coverage, presentations. */
export function Documents() {
  return (
    <IrSection id="reports" className="sec--tinted">
      <SectionHead
        sectionId="reports"
        eyebrow="Reports & presentations"
        title="Reports & presentations."
        intro="Every report we publish, from the prospectus to quarterly results and investor presentations."
      />
      <div className="card reveal">
        <Tabs idPrefix="ir-reports" labelledBy={headingId('reports')} tabs={TABS} />
      </div>
    </IrSection>
  )
}
