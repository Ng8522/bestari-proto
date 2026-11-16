import { useState } from 'react'
import { DataTable, type Column } from '../../ui/DataTable'
import { Segmented, type Option } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import { NO_QUARTERLY_RESULTS, QUARTERLY_NOTICE, QUARTERS } from './content'
import { AnnualHighlights } from './HighlightsAnnual'

type Period = 'annual' | 'quarterly'

const PERIOD_OPTIONS: readonly Option<Period>[] = [
  { value: 'annual', label: 'Annual' },
  { value: 'quarterly', label: 'Quarterly' },
]

/** Financial Highlights: annual figures from the prospectus, and the quarterly view that fills in after listing. */
export function FinancialHighlightsPage() {
  const [period, setPeriod] = useState<Period>('annual')
  return (
    <div className="fin-page">
      <div className="fin-switch">
        <Segmented label="Reporting period" options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
      </div>
      {period === 'annual' ? <AnnualHighlights /> : <QuarterlyHighlights />}
    </div>
  )
}

interface QuarterRow {
  label: string
}

const QUARTER_COLUMNS: readonly Column<QuarterRow>[] = [
  { key: 'label', header: 'Item (RM’000)', render: (row) => row.label, isRowHeader: true },
  ...QUARTERS.map((quarter) => ({ key: quarter, header: quarter, render: () => '—', align: 'right' as const })),
]

function QuarterlyHighlights() {
  return (
    <>
      <Notice tone="pending" title="Quarterly results start after listing">
        <p>{QUARTERLY_NOTICE}</p>
      </Notice>
      <Panel title="Quarterly results" sub="RM’000, by quarter of the financial year ending 31 December">
        <DataTable
          caption="Quarterly results"
          columns={QUARTER_COLUMNS}
          rows={[]}
          rowKey={(row) => row.label}
          emptyMessage={NO_QUARTERLY_RESULTS}
          minWidth={520}
        />
      </Panel>
    </>
  )
}
