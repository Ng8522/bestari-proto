import { Ph } from '../../components/text'
import {
  ALLOCATION,
  ALLOCATION_TOTAL,
  MILESTONE_LABELS,
  PROCEEDS,
  PROCEEDS_BREAKDOWN_PLACEHOLDER,
  PROCEEDS_SOURCE,
  TIMETABLE,
  type Milestone,
} from './data'
import { ABBREVIATIONS, ADVANTAGES_PLACEHOLDER, COMPETITIVE_ADVANTAGES } from './content/sections'
import { IrSection, SectionHead } from './Section'
import { InfoList } from './Tabs'

const ADVANTAGES_HEADING_ID = 'ir-advantages-title'

/** IPO centre: share allocation, timetable, use of proceeds, competitive advantages and abbreviations. */
export function IpoSection() {
  return (
    <IrSection id="ipo">
      <SectionHead
        sectionId="ipo"
        eyebrow="IPO Centre"
        title="Structure & use of proceeds."
        intro="Up to 29.6% of our enlarged issued share capital of 450.0 million shares will be offered to investors."
      />
      <div className="struct">
        <div className="card reveal">
          <AllocationBreakdown />
          <h3 className="tt-title">Indicative timetable</h3>
          <ul className="tt">
            {TIMETABLE.map((milestone) => (
              <TimetableRow key={milestone.event} milestone={milestone} />
            ))}
          </ul>
        </div>
        <ProceedsCard />
      </div>
      <div className="ipo-more">
        <div className="card reveal">
          <h3 id={ADVANTAGES_HEADING_ID}>Competitive advantages</h3>
          <ol className="adv" aria-labelledby={ADVANTAGES_HEADING_ID}>
            {COMPETITIVE_ADVANTAGES.map((advantage) => (
              <li key={advantage.title}>
                <b>{advantage.title}</b>
                <p>{advantage.description}</p>
              </li>
            ))}
          </ol>
          <p className="note">
            A summary of our strengths: <Ph>{ADVANTAGES_PLACEHOLDER}</Ph>
          </p>
        </div>
        <div className="card reveal">
          <h3>Disclaimer & abbreviations</h3>
          <InfoList entries={ABBREVIATIONS} className="info--abbr" />
          <p className="note">
            <a href="#ir-disclaimer">Read the full disclaimer</a> before making any investment decision.
          </p>
        </div>
      </div>
    </IrSection>
  )
}

const ALLOCATION_SUMMARY = `Share allocation: ${ALLOCATION.map((tranche) => `${tranche.barLabel} ${tranche.amount}`).join(', ')}`

function AllocationBreakdown() {
  return (
    <>
      <h3>Share allocation</h3>
      <p className="card-sub">{ALLOCATION_TOTAL}</p>
      <div className="alloc-bar" role="img" aria-label={ALLOCATION_SUMMARY}>
        {ALLOCATION.map((tranche) => (
          <div
            key={tranche.id}
            style={{ flex: tranche.weight, background: tranche.color, color: tranche.textColor }}
          >
            {tranche.barLabel}
          </div>
        ))}
      </div>
      <ul className="legend">
        {ALLOCATION.map((tranche) => (
          <li key={tranche.id}>
            <span className="swatch" style={{ background: tranche.color }} aria-hidden="true" />
            {tranche.description}
            <b>{tranche.amount}</b>
          </li>
        ))}
      </ul>
    </>
  )
}

interface TimetableRowProps {
  milestone: Milestone
}

function TimetableRow({ milestone }: TimetableRowProps) {
  const chipClass = milestone.status === 'done' ? 'chip chip--done' : 'chip'
  return (
    <li>
      <span className="tt-date">{milestone.isDatePlaceholder ? <Ph>{milestone.date}</Ph> : milestone.date}</span>
      <span>{milestone.event}</span>
      <span className={chipClass}>{MILESTONE_LABELS[milestone.status]}</span>
    </li>
  )
}

function ProceedsCard() {
  return (
    <div className="card reveal">
      <h3>Use of proceeds</h3>
      <p className="card-sub">{PROCEEDS_SOURCE}</p>
      <ul className="uses">
        {PROCEEDS.map((use) => (
          <li key={use.number} className="use">
            <span className="use-num">{use.number}</span>
            <h4>{use.title}</h4>
            <p>{use.description}</p>
          </li>
        ))}
      </ul>
      <p className="note">
        The new facility will support a planned move into ingredient processing and a wider product range. The RM
        breakdown is in the prospectus: <Ph>{PROCEEDS_BREAKDOWN_PLACEHOLDER}</Ph>
      </p>
    </div>
  )
}
