import { useState, type ReactElement } from 'react'
import { FINANCIAL_YEAR_LABELS, PROSPECTUS_SOURCE } from '../../content/prospectus'
import { DataTable, type Column } from '../../ui/DataTable'
import { Segmented, type Option } from '../../ui/Filters'
import { Panel } from '../../ui/PageParts'
import { LATEST_YEAR, PRIOR_YEAR, geographicRows, segmentHighlights, segmentRows, type SegmentRow, type SegmentView } from './finance'
import { yearColumns } from './FinancialReview'

const VIEW_OPTIONS: readonly Option<SegmentView>[] = [
  { value: 'amount', label: 'RM’000' },
  { value: 'share', label: '% of revenue' },
]

const VIEW_CAPTIONS: Readonly<Record<SegmentView, string>> = {
  amount: 'Revenue by business activity (RM’000)',
  share: 'Revenue by business activity (% of each year’s revenue)',
}

function SegmentName({ row }: { row: SegmentRow }) {
  if (row.isTotal) return <strong>{row.name}</strong>
  return row.isSubLine ? <span className="corp-subline">{row.name}</span> : <>{row.name}</>
}

const SEGMENT_COLUMNS: readonly Column<SegmentRow>[] = [
  { key: 'name', header: 'Business activity', render: (row) => <SegmentName row={row} />, isRowHeader: true },
  ...FINANCIAL_YEAR_LABELS.map(
    (label, index): Column<SegmentRow> => ({
      key: label,
      header: label,
      render: (row) => (row.isTotal ? <strong>{row.cells[index]}</strong> : row.cells[index]),
      align: 'right',
    }),
  ),
  { key: 'change', header: `Change, ${LATEST_YEAR} vs ${PRIOR_YEAR}`, render: (row) => row.change, align: 'right' },
]

/** MD&A segment and market highlights, with an RM'000 / % of revenue switch for the segment table. */
export function SegmentReview(): ReactElement {
  const [view, setView] = useState<SegmentView>('amount')
  return (
    <Panel
      title="Segment and market highlights"
      sub={`Source: ${PROSPECTUS_SOURCE}.`}
      actions={<Segmented label="Show segment revenue as" options={VIEW_OPTIONS} value={view} onChange={setView} />}
    >
      <Highlights />
      <DataTable
        caption={VIEW_CAPTIONS[view]}
        isCaptionVisible
        columns={SEGMENT_COLUMNS}
        rows={segmentRows(view)}
        rowKey={(row) => row.name}
        minWidth={680}
      />
      <DataTable
        caption="Revenue by market (% of each year’s revenue)"
        isCaptionVisible
        columns={yearColumns('Market')}
        rows={geographicRows()}
        rowKey={(row) => row.label}
        minWidth={480}
      />
      <p className="note">“Of which” lines are part of the segment above and are not added again in the total.</p>
    </Panel>
  )
}

function Highlights() {
  const highlights = segmentHighlights()
  return (
    <ul className="corp-bullets">
      <li>
        Food premixes made up {highlights.premixShare}% of {LATEST_YEAR} revenue, against{' '}
        {highlights.premixShareFirst}% in {FINANCIAL_YEAR_LABELS[0]}.
      </li>
      <li>
        The {highlights.flagshipName} alone made up {highlights.flagshipShare}% of {LATEST_YEAR} revenue.
      </li>
      <li>
        Domestic sales made up {highlights.domesticShare}% of {LATEST_YEAR} revenue, and foreign sales{' '}
        {highlights.foreignShare}%.
      </li>
    </ul>
  )
}
