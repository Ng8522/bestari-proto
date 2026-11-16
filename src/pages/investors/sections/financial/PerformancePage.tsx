import { useState } from 'react'
import { INCOME_LINE_LABELS, INCOME_STATEMENT, type IncomeLine } from '../../content/prospectus'
import { BarChart } from '../../ui/BarChart'
import { DataTable, type Column } from '../../ui/DataTable'
import { SelectField, type Option } from '../../ui/Filters'
import { Panel } from '../../ui/PageParts'
import { SourceNote } from '../ipo/parts'
import { buildCommentary } from './commentary'
import {
  EFFECTIVE_TAX_RATES,
  INCOME_LINES,
  MARGIN_LABELS,
  MARGIN_LINES,
  YEARS,
  YEAR_RANGE,
  marginsOf,
  type MarginLine,
} from './figures'
import { cagrPct, formatGrowth, formatPct, formatPoints, growthSeries, pointChange } from './metrics'

/** Financial Performance: growth, margins and a commentary, all computed from the prospectus figures. */
export function FinancialPerformancePage() {
  return (
    <div className="fin-page">
      <Panel title="Year-on-year growth" sub="Change in each line from the year before">
        <DataTable
          caption={`Year-on-year growth, ${YEAR_RANGE}`}
          columns={GROWTH_COLUMNS}
          rows={INCOME_LINES}
          rowKey={(line) => line}
          minWidth={560}
        />
        <SourceNote>Growth rates are worked out from the RM’000 figures.</SourceNote>
      </Panel>
      <MarginTrendPanel />
      <Panel title="Commentary" sub="What the figures show">
        <div className="fin-commentary">
          {buildCommentary().map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="note">
          This commentary describes the figures only. The reasons for the movements are discussed in the management’s
          discussion and analysis in the prospectus.
        </p>
      </Panel>
    </div>
  )
}

const GROWTH_COLUMNS: readonly Column<IncomeLine>[] = [
  { key: 'line', header: 'Item', render: (line) => INCOME_LINE_LABELS[line], isRowHeader: true },
  ...YEARS.slice(1).map((year, index) => ({
    key: year,
    header: `${year} vs ${YEARS[index]}`,
    render: (line: IncomeLine) => formatGrowth(growthSeries(INCOME_STATEMENT[line])[index + 1]),
    align: 'right' as const,
  })),
  {
    key: 'cagr',
    header: `CAGR ${YEAR_RANGE}`,
    render: (line) => formatGrowth(cagrPct(INCOME_STATEMENT[line])),
    align: 'right',
  },
]

interface RatioRow {
  label: string
  values: readonly number[]
}

const RATIO_ROWS: readonly RatioRow[] = [
  ...MARGIN_LINES.map((line) => ({ label: MARGIN_LABELS[line], values: marginsOf(line) })),
  { label: 'Effective tax rate', values: EFFECTIVE_TAX_RATES },
]

const RATIO_COLUMNS: readonly Column<RatioRow>[] = [
  { key: 'label', header: 'Ratio (%)', render: (row) => row.label, isRowHeader: true },
  ...YEARS.map((year, index) => ({
    key: year,
    header: year,
    render: (row: RatioRow) => formatPct(row.values[index]),
    align: 'right' as const,
  })),
  {
    key: 'change',
    header: `Change ${YEAR_RANGE}`,
    render: (row) => formatPoints(pointChange(row.values[0], row.values[row.values.length - 1])),
    align: 'right',
  },
]

const MARGIN_OPTIONS: readonly Option<MarginLine>[] = MARGIN_LINES.map((line) => ({
  value: line,
  label: MARGIN_LABELS[line],
}))

function MarginTrendPanel() {
  const [margin, setMargin] = useState<MarginLine>('grossProfit')
  return (
    <Panel
      title="Margin trend"
      sub="Each profit line as a percentage of revenue"
      actions={<SelectField id="fin-margin" label="Margin" value={margin} options={MARGIN_OPTIONS} onChange={setMargin} />}
    >
      <BarChart
        title={`${MARGIN_LABELS[margin]} (%)`}
        data={YEARS.map((year, index) => ({ label: year, value: marginsOf(margin)[index] }))}
        color="var(--saffron)"
        formatValue={(value) => `${value.toFixed(1)}%`}
      />
      <DataTable
        caption={`Margins and effective tax rate, ${YEAR_RANGE}`}
        columns={RATIO_COLUMNS}
        rows={RATIO_ROWS}
        rowKey={(row) => row.label}
        minWidth={560}
      />
      <SourceNote>Effective tax rate is profit before tax less profit after tax, over profit before tax.</SourceNote>
    </Panel>
  )
}
