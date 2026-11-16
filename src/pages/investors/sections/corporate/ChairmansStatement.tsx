import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { irPath } from '../../../../content/ir-nav'
import { MD_QUOTE } from '../../data'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { directorProfile, findChairman } from './content'
import { PersonCard } from './PersonCard'

/** A published Chairman's statement; none yet, as the first comes with the first annual report. */
interface StatementRecord {
  financialYear: string
  published: string
  href: string
}

const STATEMENTS: readonly StatementRecord[] = []

const STATEMENT_COLUMNS: readonly Column<StatementRecord>[] = [
  { key: 'year', header: 'Financial year', render: (record) => record.financialYear, isRowHeader: true },
  { key: 'published', header: 'Published', render: (record) => record.published },
  {
    key: 'document',
    header: 'Statement',
    align: 'right',
    render: (record) => (
      <a href={record.href} target="_blank" rel="noopener noreferrer">
        View
      </a>
    ),
  },
]

/** What a Chairman's statement usually covers, in general terms. */
const STATEMENT_TOPICS: readonly string[] = [
  'The year in review and the Group’s performance',
  'Dividends declared or proposed for the year',
  'Corporate governance and changes to the Board',
  'Sustainability and the Group’s people',
  'The outlook and priorities for the year ahead',
]

/** Corporate Info › Chairman's Statement: the Chairman, when the first statement comes, and the MD's IPO message. */
export function ChairmansStatement(): ReactElement {
  return (
    <>
      <Notice tone="pending" title="First statement after listing">
        Our Chairman’s first statement to shareholders will be published with our first annual report after listing.{' '}
        <Link to={irPath('reports', 'annual-reports')}>Go to annual reports</Link>
      </Notice>
      <SectionTabs tabs={STATEMENT_TABS} />
    </>
  )
}

type StatementTab = 'chairman' | 'md' | 'archive'

function ChairmanAndTopics() {
  const chairman = findChairman()
  return (
    <div className="grid-2">
      {chairman && <PersonCard profile={directorProfile(chairman)} />}
      <Panel title="What the statement covers" sub="Each year’s statement typically reviews:">
        <ul className="corp-bullets">
          {STATEMENT_TOPICS.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

function FromTheMd() {
  return (
    <Panel title="From the Managing Director" sub="On the planned listing. This is not the Chairman’s statement.">
      <figure className="card quote corp-quote">
        <blockquote>{MD_QUOTE.text}</blockquote>
        <figcaption>
          <b>{MD_QUOTE.name}</b>
          <span>{MD_QUOTE.title}</span>
        </figcaption>
      </figure>
    </Panel>
  )
}

function StatementArchive() {
  return (
    <Panel title="Statement archive">
      <DataTable
        caption="Chairman’s statements by financial year"
        columns={STATEMENT_COLUMNS}
        rows={STATEMENTS}
        rowKey={(record) => record.financialYear}
        emptyMessage="No statements yet. The first will appear here with our first annual report after listing."
      />
    </Panel>
  )
}

const STATEMENT_TABS: readonly SectionTab<StatementTab>[] = [
  { id: 'chairman', label: 'The Chairman', content: <ChairmanAndTopics /> },
  { id: 'md', label: 'From the MD', content: <FromTheMd /> },
  { id: 'archive', label: 'Statement archive', content: <StatementArchive /> },
]
