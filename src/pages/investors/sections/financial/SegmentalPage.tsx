import { useState } from 'react'
import { GEOGRAPHIC_SPLIT, SEGMENT_REVENUE } from '../../content/prospectus'
import { DataTable, type Column } from '../../ui/DataTable'
import { Donut, type DonutSlice } from '../../ui/Donut'
import { SelectField } from '../../ui/Filters'
import { Panel } from '../../ui/PageParts'
import { SourceNote } from '../ipo/parts'
import { LATEST_YEAR, YEARS, YEAR_OPTIONS, YEAR_RANGE, type YearLabel } from './figures'
import { formatPct, formatRmMillion, formatThousands, percentOf, segmentShares, segmentTotal } from './metrics'

const SEGMENT_COLOURS: readonly string[] = ['var(--brand)', 'var(--saffron)', 'var(--ink-2)', 'var(--saffron-soft)']

/** Segmental Analysis: revenue by business segment (with a year picker) and by market. */
export function SegmentalAnalysisPage() {
  const [year, setYear] = useState<YearLabel>(LATEST_YEAR)
  return (
    <div className="fin-page">
      <SegmentMixPanel year={year} onYearChange={setYear} />
      <Panel title={`Segment revenue, ${YEAR_RANGE}`} sub="RM’000, and each segment’s share of revenue">
        <div className="fin-total-last">
          <DataTable
            caption={`Revenue by business segment, ${YEAR_RANGE}`}
            columns={SEGMENT_COLUMNS}
            rows={SEGMENT_ROWS}
            rowKey={(row) => row.name}
            minWidth={760}
          />
        </div>
        <SourceNote>Shares are worked out from the RM’000 figures. Breakdown lines are already inside their segment.</SourceNote>
      </Panel>
      <Panel title="Revenue by market" sub="Share of revenue (%)">
        <DataTable
          caption={`Revenue by market, ${YEAR_RANGE}`}
          columns={MARKET_COLUMNS}
          rows={MARKET_ROWS}
          rowKey={(row) => row.market}
          minWidth={480}
        />
        <SourceNote />
      </Panel>
    </div>
  )
}

interface SegmentMixPanelProps {
  year: YearLabel
  onYearChange: (year: YearLabel) => void
}

function SegmentMixPanel({ year, onYearChange }: SegmentMixPanelProps) {
  const yearIndex = YEARS.indexOf(year)
  const total = segmentTotal(SEGMENT_REVENUE, yearIndex)
  const slices: DonutSlice[] = segmentShares(SEGMENT_REVENUE, yearIndex).map((share, index) => ({
    label: share.name,
    percent: share.percent,
    color: SEGMENT_COLOURS[index % SEGMENT_COLOURS.length],
  }))
  const subLines = SEGMENT_REVENUE.filter((segment) => segment.isSubLine)
  return (
    <Panel
      title="Revenue mix"
      sub={`Share of ${year} revenue by business segment`}
      actions={<SelectField id="fin-segment-year" label="Financial year" value={year} options={YEAR_OPTIONS} onChange={onYearChange} />}
    >
      <Donut
        label={`Revenue by business segment, ${year}`}
        slices={slices}
        formatPercent={(percent) => `${percent.toFixed(1)}%`}
        centre={
          <span>
            <b>{formatRmMillion(total)}</b>revenue
          </span>
        }
      />
      {subLines.map((segment) => (
        <p key={segment.name} className="fin-chart-note">
          {capitalise(segment.name)}: <b>{formatRmMillion(segment.values[yearIndex])}</b>, or{' '}
          {formatPct(percentOf(segment.values[yearIndex], total))} of {year} revenue.
        </p>
      ))}
    </Panel>
  )
}

const capitalise = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)

interface SegmentRow {
  name: string
  description: string
  values: readonly number[]
  isSubLine?: boolean
}

const SEGMENT_ROWS: readonly SegmentRow[] = [
  ...SEGMENT_REVENUE,
  { name: 'Total revenue', description: '', values: YEARS.map((_, index) => segmentTotal(SEGMENT_REVENUE, index)) },
]

function SegmentName({ row }: { row: SegmentRow }) {
  return (
    <span className={row.isSubLine ? 'fin-segment fin-segment--sub' : 'fin-segment'}>
      {row.name}
      {row.description && <small>{row.description}</small>}
    </span>
  )
}

const shareOf = (row: SegmentRow, index: number): string =>
  formatPct(percentOf(row.values[index], segmentTotal(SEGMENT_REVENUE, index)))

const SEGMENT_COLUMNS: readonly Column<SegmentRow>[] = [
  { key: 'name', header: 'Segment', render: (row) => <SegmentName row={row} />, isRowHeader: true },
  ...YEARS.flatMap((year, index) => [
    { key: `${year}-rm`, header: `${year} RM’000`, render: (row: SegmentRow) => formatThousands(row.values[index]), align: 'right' as const },
    { key: `${year}-pct`, header: `${year} %`, render: (row: SegmentRow) => shareOf(row, index), align: 'right' as const },
  ]),
]

interface MarketRow {
  market: string
  shares: readonly number[]
}

const MARKET_ROWS: readonly MarketRow[] = [
  { market: 'Domestic', shares: GEOGRAPHIC_SPLIT.domestic },
  { market: 'Foreign', shares: GEOGRAPHIC_SPLIT.foreign },
]

const MARKET_COLUMNS: readonly Column<MarketRow>[] = [
  { key: 'market', header: 'Market', render: (row) => row.market, isRowHeader: true },
  ...YEARS.map((year, index) => ({
    key: year,
    header: year,
    render: (row: MarketRow) => formatPct(row.shares[index]),
    align: 'right' as const,
  })),
]

