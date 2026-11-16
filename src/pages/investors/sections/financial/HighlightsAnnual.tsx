import { EPS_SEN, INCOME_LINE_LABELS, INCOME_STATEMENT, type IncomeLine } from '../../content/prospectus'
import { Tabs, type TabItem } from '../../Tabs'
import { BarChart } from '../../ui/BarChart'
import { DataTable, type Column } from '../../ui/DataTable'
import { Panel, StatGrid, type Stat } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { SourceNote } from '../ipo/parts'
import { INCOME_LINES, LATEST_INDEX, LATEST_YEAR, MARGIN_LABELS, MARGIN_LINES, SHORT_LABELS, YEARS, YEAR_RANGE, marginsOf } from './figures'
import { cagrPct, formatGrowth, formatPct, formatRmMillion, formatThousands, growthPct, toMillions } from './metrics'

const CHARTS_TITLE_ID = 'fin-highlights-charts-title'

type HighlightsTab = 'key-figures' | 'summary' | 'latest'

/** Annual highlights: a chart per metric, the three-year table and the latest year's key figures. */
export function AnnualHighlights() {
  return <SectionTabs tabs={HIGHLIGHT_TABS} />
}

function KeyFigures() {
  return (
    <section className="card panel" aria-labelledby={CHARTS_TITLE_ID}>
      <div className="panel-head">
        <div>
          <h3 id={CHARTS_TITLE_ID}>Key figures by year</h3>
          <p className="card-sub">RM million, financial years ended 31 December</p>
        </div>
      </div>
      <Tabs idPrefix="fin-highlights" labelledBy={CHARTS_TITLE_ID} tabs={METRIC_TABS} />
      <SourceNote />
    </section>
  )
}

function ThreeYearSummary() {
  return (
    <Panel title={`Three-year summary, ${YEAR_RANGE}`} sub="RM’000 unless stated">
      <DataTable
        caption={`Financial highlights, ${YEAR_RANGE}`}
        columns={SUMMARY_COLUMNS}
        rows={SUMMARY_ROWS}
        rowKey={(row) => row.label}
        minWidth={520}
      />
      <SourceNote>Margins are worked out from the figures above; earnings per share is on the enlarged 450.0 million shares.</SourceNote>
    </Panel>
  )
}

function LatestYear() {
  return (
    <Panel title={`${LATEST_YEAR} at a glance`} sub={`Compared with ${YEARS[LATEST_INDEX - 1]}`}>
      <StatGrid stats={latestYearStats()} label={`${LATEST_YEAR} key figures`} />
    </Panel>
  )
}

interface MetricChartProps {
  line: IncomeLine
}

function MetricChart({ line }: MetricChartProps) {
  const values = INCOME_STATEMENT[line]
  const latestGrowth = growthPct(values[LATEST_INDEX], values[LATEST_INDEX - 1])
  return (
    <>
      <BarChart
        title={`${INCOME_LINE_LABELS[line]} (RM million)`}
        data={YEARS.map((year, index) => ({ label: year, value: toMillions(values[index]) }))}
        formatValue={(value) => value.toFixed(1)}
      />
      <p className="fin-chart-note">
        {LATEST_YEAR}: <b>{formatRmMillion(values[LATEST_INDEX])}</b>, {formatGrowth(latestGrowth)} on{' '}
        {YEARS[LATEST_INDEX - 1]}. Compound annual growth {YEAR_RANGE}: {formatGrowth(cagrPct(values))}.
      </p>
    </>
  )
}

const METRIC_TABS: readonly TabItem<IncomeLine>[] = INCOME_LINES.map((line) => ({
  id: line,
  label: SHORT_LABELS[line],
  content: <MetricChart line={line} />,
}))

interface SummaryRow {
  label: string
  values: readonly string[]
}

const SUMMARY_ROWS: readonly SummaryRow[] = [
  ...INCOME_LINES.map((line) => ({ label: INCOME_LINE_LABELS[line], values: INCOME_STATEMENT[line].map(formatThousands) })),
  ...MARGIN_LINES.map((line) => ({ label: `${MARGIN_LABELS[line]} (%)`, values: marginsOf(line).map((value) => value.toFixed(1)) })),
  { label: 'Earnings per share (sen)', values: EPS_SEN.map((value) => value.toFixed(1)) },
]

const SUMMARY_COLUMNS: readonly Column<SummaryRow>[] = [
  { key: 'label', header: 'Item', render: (row) => row.label, isRowHeader: true },
  ...YEARS.map((year, index) => ({
    key: year,
    header: year,
    render: (row: SummaryRow) => row.values[index],
    align: 'right' as const,
  })),
]

function latestYearStats(): Stat[] {
  const prior = LATEST_INDEX - 1
  const amountStat = (line: IncomeLine): Stat => {
    const values = INCOME_STATEMENT[line]
    return {
      label: INCOME_LINE_LABELS[line],
      value: formatRmMillion(values[LATEST_INDEX]),
      detail: `${formatGrowth(growthPct(values[LATEST_INDEX], values[prior]))} on ${YEARS[prior]}`,
    }
  }
  const marginStat = (line: 'grossProfit' | 'pat'): Stat => ({
    label: MARGIN_LABELS[line],
    value: formatPct(marginsOf(line)[LATEST_INDEX]),
    detail: `${formatPct(marginsOf(line)[prior])} in ${YEARS[prior]}`,
  })
  return [
    ...INCOME_LINES.map(amountStat),
    marginStat('grossProfit'),
    marginStat('pat'),
    { label: 'Earnings per share', value: `${EPS_SEN[LATEST_INDEX].toFixed(1)} sen`, detail: `${EPS_SEN[prior].toFixed(1)} sen in ${YEARS[prior]}` },
  ]
}

const HIGHLIGHT_TABS: readonly SectionTab<HighlightsTab>[] = [
  { id: 'key-figures', label: 'Key figures', content: <KeyFigures /> },
  { id: 'summary', label: 'Three-year summary', content: <ThreeYearSummary /> },
  { id: 'latest', label: 'Latest year', content: <LatestYear /> },
]
