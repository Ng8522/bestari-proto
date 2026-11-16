import { useState } from 'react'
import { Link } from 'react-router'
import { irPath } from '../../../../content/ir-nav'
import { FINANCIAL_YEAR_LABELS } from '../../content/prospectus'
import { DataTable, type Column } from '../../ui/DataTable'
import { SelectField, Segmented } from '../../ui/Filters'
import { Notice, Panel, Pending } from '../../ui/PageParts'
import { QUARTERLY_VIEWS, QUARTERLY_YEAR_OPTIONS, type QuarterlyView } from './content'
import {
  FINANCIAL_YEAR_END,
  QUARTERLY_REPORT_MONTHS,
  QUARTERS,
  deadlineAfter,
  formatDeadline,
  type Quarter,
} from './reporting'

type QuarterlyYear = (typeof QUARTERLY_YEAR_OPTIONS)[number]['value']

const NO_VALUE = '—'
const MONTHS_PER_QUARTER = 3

function periodLabel(quarter: Quarter, view: QuarterlyView): string {
  const months = view === 'cumulative' ? quarter.monthsToDate : MONTHS_PER_QUARTER
  return `${quarter.endsOn} (${months} months)`
}

function resultColumns(view: QuarterlyView): readonly Column<Quarter>[] {
  return [
    { key: 'quarter', header: 'Quarter', render: (quarter) => quarter.label, isRowHeader: true },
    { key: 'period', header: 'Period ended', render: (quarter) => periodLabel(quarter, view) },
    { key: 'announced', header: 'Date announced', render: () => NO_VALUE },
    { key: 'revenue', header: 'Revenue (RM’000)', render: () => NO_VALUE, align: 'right' },
    { key: 'pat', header: 'Profit after tax (RM’000)', render: () => NO_VALUE, align: 'right' },
    { key: 'eps', header: 'EPS (sen)', render: () => NO_VALUE, align: 'right' },
    { key: 'report', header: 'Report', render: () => <Pending />, align: 'right' },
  ]
}

const DEADLINE_COLUMNS: readonly Column<Quarter>[] = [
  { key: 'quarter', header: 'Quarter', render: (quarter) => quarter.label, isRowHeader: true },
  { key: 'ends', header: 'Quarter ends', render: (quarter) => quarter.endsOn },
  {
    key: 'due',
    header: 'Results announced by',
    render: (quarter) => formatDeadline(deadlineAfter(quarter.monthIndex, QUARTERLY_REPORT_MONTHS)),
  },
]

/** Reports & Presentations › Quarterly Reports: results by financial year, per quarter or year to date. */
export function QuarterlyReportsPage() {
  const [year, setYear] = useState<QuarterlyYear>(QUARTERLY_YEAR_OPTIONS[0].value)
  const [view, setView] = useState<QuarterlyView>('individual')
  const yearLabel = QUARTERLY_YEAR_OPTIONS.find((option) => option.value === year)?.label ?? ''
  const viewCaption = QUARTERLY_VIEWS.find((option) => option.value === view)?.caption ?? ''

  return (
    <>
      <Notice tone="pending" title="Results are published after listing">
        We will announce each quarter’s unaudited results to Bursa Malaysia, and post the report here, within{' '}
        {QUARTERLY_REPORT_MONTHS} months of the quarter end. The first financial year we report depends on the
        listing date.
      </Notice>
      <Panel
        title="Quarterly results"
        sub="Revenue and profit after tax in RM’000; earnings per share (EPS) in sen."
        actions={
          <>
            <SelectField id="ir-quarterly-year" label="Financial year" value={year} options={QUARTERLY_YEAR_OPTIONS} onChange={setYear} />
            <Segmented label="Results period" options={QUARTERLY_VIEWS} value={view} onChange={setView} />
          </>
        }
      >
        <DataTable
          caption={`Quarterly results: ${yearLabel}, ${viewCaption}`}
          columns={resultColumns(view)}
          rows={QUARTERS}
          rowKey={(quarter) => quarter.id}
          minWidth={760}
        />
        <p className="note rp-note">
          {view === 'cumulative'
            ? 'Cumulative figures add up the quarters from the start of the financial year to the period end.'
            : 'Individual-quarter figures cover the three months to each quarter end.'}{' '}
          Audited figures for {FINANCIAL_YEAR_LABELS[0]} to {FINANCIAL_YEAR_LABELS[FINANCIAL_YEAR_LABELS.length - 1]}{' '}
          are under <Link to={irPath('financial-info', 'statements')}>Financial Statements</Link>.
        </p>
      </Panel>
      <Panel
        title="When results are announced"
        sub={`Our financial year ends on ${FINANCIAL_YEAR_END}. Deadlines under the Bursa Malaysia Main Market Listing Requirements.`}
      >
        <DataTable caption="Quarterly results announcement deadlines" columns={DEADLINE_COLUMNS} rows={QUARTERS} rowKey={(quarter) => quarter.id} minWidth={420} />
      </Panel>
    </>
  )
}
