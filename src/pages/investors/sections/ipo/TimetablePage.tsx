import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { IPO_TERMS } from '../../content/prospectus'
import { MILESTONE_LABELS, TIMETABLE, type Milestone } from '../../data'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel, StatGrid, type Stat } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { IPO_STAGES } from './content'
import { SourceNote } from './parts'

function MilestoneDate({ milestone }: { milestone: Milestone }) {
  return milestone.isDatePlaceholder ? <Ph>{milestone.date}</Ph> : <>{milestone.date}</>
}

function StatusChip({ milestone }: { milestone: Milestone }) {
  const className = milestone.status === 'done' ? 'chip chip--done' : 'chip'
  return <span className={className}>{MILESTONE_LABELS[milestone.status]}</span>
}

const TIMETABLE_COLUMNS: readonly Column<Milestone>[] = [
  { key: 'event', header: 'Event', render: (milestone) => milestone.event, isRowHeader: true },
  { key: 'date', header: 'Date', render: (milestone) => <MilestoneDate milestone={milestone} /> },
  { key: 'status', header: 'Status', render: (milestone) => <StatusChip milestone={milestone} />, align: 'right' },
]

/** Progress tiles worked out from the timetable itself. */
function timetableStats(): Stat[] {
  const done = TIMETABLE.filter((milestone) => milestone.status === 'done')
  const listing = TIMETABLE[TIMETABLE.length - 1]
  const latest = done[done.length - 1]
  return [
    { label: 'Milestones completed', value: `${done.length} of ${TIMETABLE.length}` },
    ...(latest ? [{ label: 'Latest milestone', value: latest.date, detail: latest.event }] : []),
    { label: 'Listing date', value: listing.date, isPlaceholder: listing.isDatePlaceholder, detail: listing.event },
  ]
}

type TimetableTab = 'timetable' | 'stages'

/** IPO Timetable: every milestone with its date and status, and what happens at each stage. */
export function IpoTimetablePage() {
  return <SectionTabs tabs={TIMETABLE_TABS} />
}

function IndicativeTimetable() {
  return (
    <>
      <Panel title="Indicative timetable" sub="Dates still to be confirmed are marked TBA">
        <StatGrid stats={timetableStats()} label="IPO progress" />
        <DataTable
          caption="Indicative IPO timetable"
          columns={TIMETABLE_COLUMNS}
          rows={TIMETABLE}
          rowKey={(milestone) => milestone.event}
          minWidth={480}
        />
        <SourceNote>Press reports of the SC approval, 23 Oct 2026.</SourceNote>
      </Panel>
      <Notice title="Six-month approval window" tone="pending">
        <p>
          {IPO_TERMS.approvalNote} The final dates for the application period, balloting and listing will be set out in
          the registered prospectus.
        </p>
      </Notice>
    </>
  )
}

function Stages() {
  return (
    <Panel title="What happens at each stage" sub="How a Main Market IPO generally runs in Malaysia">
      <ol className="ipo-steps">
        {IPO_STAGES.map((stage) => (
          <li key={stage.title}>
            <b>{stage.title}</b>
            <p>{stage.description}</p>
          </li>
        ))}
      </ol>
      <p className="note">
        The registered prospectus sets out the exact steps and dates. See{' '}
        <Link to={irPath('ipo-centre', 'how-to-apply')}>How to Apply</Link> for the ways to apply.
      </p>
    </Panel>
  )
}

const TIMETABLE_TABS: readonly SectionTab<TimetableTab>[] = [
  { id: 'timetable', label: 'Timetable', content: <IndicativeTimetable /> },
  { id: 'stages', label: 'Stages', content: <Stages /> },
]
