import { MEETINGS_NOTE, MEETING_DOCUMENTS, POLICIES } from './content/sections'
import { IrSection, SectionHead } from './Section'
import { DocList, EmptyState } from './Tabs'

/** Governance & meetings: policy disclosures beside the shareholder meetings archive. */
export function Governance() {
  return (
    <IrSection id="governance" className="sec--tinted">
      <SectionHead
        sectionId="governance"
        eyebrow="Governance & meetings"
        title="Governance & meetings."
        intro="Our board policies, and the papers for every general meeting, in one place."
      />
      <div className="gov">
        <div className="card reveal">
          <h3>Policy disclosures</h3>
          <p className="card-sub">Each policy is published here once adopted.</p>
          <DocList documents={POLICIES} label="Policy disclosures" />
        </div>
        <div className="card reveal">
          <h3>Shareholder meetings</h3>
          <EmptyState>{MEETINGS_NOTE}</EmptyState>
          <ul className="pills" aria-label="Papers for each meeting">
            {MEETING_DOCUMENTS.map((document) => (
              <li key={document}>{document}</li>
            ))}
          </ul>
        </div>
      </div>
    </IrSection>
  )
}
