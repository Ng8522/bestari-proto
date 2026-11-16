import { useState } from 'react'
import { Ph } from '../../../../components/text'
import { MILESTONE_LABELS } from '../../data'
import { DataTable, type Column } from '../../ui/DataTable'
import { FilterBar, SelectField } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import { FINANCIAL_YEAR_END } from '../reports/reporting'
import {
  CALENDAR_ROWS,
  RECURRING_DATES,
  STATUS_OPTIONS,
  YEAR_OPTIONS,
  filterCalendar,
  type CalendarRow,
  type RecurringDate,
  type StatusFilter,
  type YearFilter,
} from './calendar'

function DateCell({ row }: { row: CalendarRow }) {
  if (row.isDatePlaceholder) return <Ph>{row.date}</Ph>
  return <span className="cal-date">{row.isRecurring ? `${row.date}, yearly` : row.date}</span>
}

const EVENT_COLUMNS: readonly Column<CalendarRow>[] = [
  { key: 'date', header: 'Date', render: (row) => <DateCell row={row} /> },
  { key: 'event', header: 'Event', render: (row) => row.event, isRowHeader: true },
  { key: 'details', header: 'Details', render: (row) => row.details || '—' },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (row) => (
      <span className={row.status === 'done' ? 'chip chip--done' : 'chip'}>{MILESTONE_LABELS[row.status]}</span>
    ),
  },
]

const RECURRING_COLUMNS: readonly Column<RecurringDate>[] = [
  { key: 'event', header: 'Event', render: (row) => row.event, isRowHeader: true },
  { key: 'timing', header: 'When', render: (row) => row.timing },
  { key: 'basis', header: 'Set by', render: (row) => row.basis },
]

/** Investor Resources › Corporate Calendar: IPO milestones and shareholder dates, by year and status. */
export function CorporateCalendarPage() {
  const [year, setYear] = useState<YearFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const rows = filterCalendar(CALENDAR_ROWS, year, status)

  function reset(): void {
    setYear('all')
    setStatus('all')
  }

  return (
    <>
      <Panel title="Key dates" sub="IPO milestones and shareholder dates. Dates shown as TBA are confirmed in the registered prospectus or announced to Bursa Malaysia.">
        <FilterBar label="Filter the corporate calendar" onReset={reset}>
          <SelectField id="ir-calendar-year" label="Year" value={year} options={YEAR_OPTIONS} onChange={setYear} />
          <SelectField id="ir-calendar-status" label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
        </FilterBar>
        <p className="result-count" role="status">
          {rows.length} {rows.length === 1 ? 'event' : 'events'}
        </p>
        <DataTable
          caption="Corporate calendar"
          columns={EVENT_COLUMNS}
          rows={rows}
          rowKey={(row) => row.event}
          emptyMessage="No events match these filters."
          minWidth={680}
        />
      </Panel>
      <Panel title="Regular dates after listing" sub={`The time limits every Main Market company works to, counted from our ${FINANCIAL_YEAR_END} year end.`}>
        <DataTable caption="Regular reporting dates" columns={RECURRING_COLUMNS} rows={RECURRING_DATES} rowKey={(row) => row.event} minWidth={620} />
      </Panel>
      <Notice tone="pending" title="More dates after listing">
        Once we are listed, this calendar will add each results announcement, general meeting and entitlement date
        as we announce it to Bursa Malaysia.
      </Notice>
    </>
  )
}
