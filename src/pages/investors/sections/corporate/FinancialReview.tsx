import type { ReactElement } from 'react'
import { FINANCIAL_YEAR_LABELS, PROSPECTUS_SOURCE } from '../../content/prospectus'
import { DataTable, type Column } from '../../ui/DataTable'
import { Panel, StatGrid } from '../../ui/PageParts'
import {
  FIRST_YEAR,
  LATEST_YEAR,
  amountRange,
  financialReviewRows,
  marginRange,
  reviewStats,
  type ReviewRow,
} from './finance'

/** A metric column, then one right-aligned column per financial year. */
export function yearColumns(firstHeader: string): Column<ReviewRow>[] {
  return [
    { key: 'label', header: firstHeader, render: (row) => row.label, isRowHeader: true },
    ...FINANCIAL_YEAR_LABELS.map(
      (label, index): Column<ReviewRow> => ({
        key: label,
        header: label,
        render: (row) => row.cells[index],
        align: 'right',
      }),
    ),
  ]
}

/** MD&A financial review: growth and margin tiles, a short commentary and the three-year table. */
export function FinancialReview(): ReactElement {
  const revenue = amountRange('revenue')
  const pat = amountRange('pat')
  const grossMargin = marginRange('grossProfit')
  const patMargin = marginRange('pat')
  return (
    <Panel title="Financial review" sub={`Financial years ended 31 December. Source: ${PROSPECTUS_SOURCE}.`}>
      <StatGrid stats={reviewStats()} label={`${LATEST_YEAR} growth and margins`} />
      <div className="corp-prose">
        <p>
          Revenue {revenue.isUp ? 'grew' : 'fell'} from {revenue.first} in {FIRST_YEAR} to {revenue.latest} in{' '}
          {LATEST_YEAR}, a compound annual growth rate of {revenue.cagr}. Profit after tax {pat.isUp ? 'rose' : 'fell'}{' '}
          from {pat.first} to {pat.latest} over the same period ({pat.cagr} a year).
        </p>
        <p>
          The gross profit margin {grossMargin.isUp ? 'widened' : 'narrowed'} from {grossMargin.first} to{' '}
          {grossMargin.latest}, and the profit after tax margin from {patMargin.first} to {patMargin.latest}. The draft
          prospectus explains the reasons for these movements.
        </p>
      </div>
      <DataTable
        caption="Income statement highlights, growth and margins by financial year"
        columns={yearColumns('Financial year ended 31 December')}
        rows={financialReviewRows()}
        rowKey={(row) => row.label}
        minWidth={600}
      />
    </Panel>
  )
}
