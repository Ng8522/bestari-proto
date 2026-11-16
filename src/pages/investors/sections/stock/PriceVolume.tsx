import { useState, type ReactElement } from 'react'
import { DataTable, type Column } from '../../ui/DataTable'
import { FilterBar, InputField, Segmented } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import { Pagination, usePagination } from '../../ui/Pagination'
import { filterPriceRows } from './calc'
import { PRICE_ROWS, QUICK_RANGES, type PriceRow } from './content'
import { dateRangeError, rangeStart, todayIso, type QuickRange } from './dates'
import { describeRange, formatCount, formatIsoDate, formatPercent, formatPrice, formatSigned } from './format'

const PAGE_SIZE = 20
const DEFAULT_RANGE: QuickRange = '1M'

/** A quick range, or 'custom' once a date is typed in (then no quick-range button is pressed). */
type RangeChoice = QuickRange | 'custom'

interface PriceRange {
  from: string
  to: string
  choice: RangeChoice
}

function quickRange(choice: QuickRange, today: string): PriceRange {
  return { from: rangeStart(choice, today), to: today, choice }
}

const PRICE_COLUMNS: readonly Column<PriceRow>[] = [
  { key: 'date', header: 'Date', render: (row) => formatIsoDate(row.isoDate), isRowHeader: true },
  { key: 'open', header: 'Open', render: (row) => formatPrice(row.open), align: 'right' },
  { key: 'high', header: 'High', render: (row) => formatPrice(row.high), align: 'right' },
  { key: 'low', header: 'Low', render: (row) => formatPrice(row.low), align: 'right' },
  { key: 'close', header: 'Close', render: (row) => formatPrice(row.close), align: 'right' },
  { key: 'change', header: 'Change', render: (row) => formatSigned(row.change, 3), align: 'right' },
  { key: 'changePct', header: '% Change', render: (row) => formatPercent(row.changePct), align: 'right' },
  { key: 'volume', header: 'Volume', render: (row) => formatCount(row.volume), align: 'right' },
]

/** Stock Info › Price & Volume: daily prices for a date range, newest first. */
export function PriceVolume(): ReactElement {
  const [today] = useState(todayIso)
  const [range, setRange] = useState<PriceRange>(() => quickRange(DEFAULT_RANGE, today))
  const error = dateRangeError(range.from, range.to)
  const rows = error ? [] : filterPriceRows(PRICE_ROWS, range.from, range.to)
  const { page, pageCount, pageItems, setPage } = usePagination(rows, PAGE_SIZE)

  const update = (next: PriceRange): void => {
    setRange(next)
    setPage(1)
  }

  return (
    <>
      <Notice tone="pending" title="Price history starts on the first trading day">
        Bestari Food Berhad is not listed yet. One row per trading day is added here from the listing date.
      </Notice>
      <Panel title="Historical prices" sub="Prices in RM, newest first">
        <PriceFilters range={range} today={today} onChange={update} />
        {error ? (
          <p className="range-error" role="alert">
            {error}
          </p>
        ) : (
          <p className="result-count" aria-live="polite">
            {rows.length} trading {rows.length === 1 ? 'day' : 'days'} · {describeRange(range.from, range.to)}
          </p>
        )}
        <DataTable
          caption="Daily share price and volume"
          columns={PRICE_COLUMNS}
          rows={pageItems}
          rowKey={(row) => row.isoDate}
          emptyMessage={PRICE_ROWS.length === 0 ? 'Daily prices start on the first trading day.' : 'No trading days in this range.'}
          minWidth={720}
        />
        <Pagination page={page} pageCount={pageCount} onChange={setPage} label="Price history pages" />
      </Panel>
    </>
  )
}

interface PriceFiltersProps {
  range: PriceRange
  today: string
  onChange: (next: PriceRange) => void
}

function PriceFilters({ range, today, onChange }: PriceFiltersProps): ReactElement {
  return (
    <FilterBar label="Filter price history" onReset={() => onChange(quickRange(DEFAULT_RANGE, today))}>
      <InputField
        id="pv-from"
        label="From"
        type="date"
        value={range.from}
        onChange={(from) => onChange({ ...range, from, choice: 'custom' })}
      />
      <InputField
        id="pv-to"
        label="To"
        type="date"
        value={range.to}
        onChange={(to) => onChange({ ...range, to, choice: 'custom' })}
      />
      <div className="filter-field filter-field--switch">
        <span className="filter-label" aria-hidden="true">
          Quick range
        </span>
        <Segmented<RangeChoice>
          label="Quick range"
          options={QUICK_RANGES}
          value={range.choice}
          onChange={(choice) => {
            if (choice !== 'custom') onChange(quickRange(choice, today))
          }}
        />
      </div>
    </FilterBar>
  )
}
