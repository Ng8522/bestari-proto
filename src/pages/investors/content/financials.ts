/**
 * Financial Info sub-sections beyond the revenue chart: the multi-year highlights table, segmental analysis and
 * financial statements. Only FY2024 and FY2025 revenue and net profit are confirmed; every other cell is `null`
 * and renders as a placeholder until the registered prospectus figures are added.
 */
import type { FinancialYear, IrDocument } from '../data'

/** The accountants’ report in the prospectus covers FY2022 to FY2025. */
export const HIGHLIGHT_YEAR_LABELS = ['FY2022', 'FY2023', 'FY2024', 'FY2025'] as const

export interface HighlightRow {
  label: string
  /** One value per year in RM million (or %), `null` while unconfirmed. */
  values: readonly (string | null)[]
}

const MARGIN_DECIMALS = 1

/** Rows for the highlights table, filled from the confirmed chart data and left empty everywhere else. */
export function buildHighlightRows(years: readonly FinancialYear[], labels: readonly string[]): HighlightRow[] {
  const yearFor = (label: string) => years.find((year) => year.label === label)
  const amounts = (key: 'revenue' | 'netProfit') =>
    labels.map((label) => yearFor(label)?.values[key].amount.toFixed(2) ?? null)
  const margins = labels.map((label) => {
    const year = yearFor(label)
    if (!year) return null
    return ((year.values.netProfit.amount / year.values.revenue.amount) * 100).toFixed(MARGIN_DECIMALS)
  })
  const empty = labels.map(() => null)

  return [
    { label: 'Revenue', values: amounts('revenue') },
    { label: 'Gross profit', values: empty },
    { label: 'Profit before tax', values: empty },
    { label: 'Net profit', values: amounts('netProfit') },
    { label: 'Net profit margin (%)', values: margins },
  ]
}

export interface Segment {
  name: string
  description: string
}

/** The Group’s business activities (company overview); revenue shares come from the prospectus. */
export const SEGMENTS: readonly Segment[] = [
  { name: 'Food premixes', description: 'Bestari-brand retail and commercial packs' },
  { name: 'Food ingredients', description: 'Supply of food ingredients' },
  { name: 'Food processing & production equipment', description: 'Equipment for food manufacturers' },
  { name: 'Spare parts & maintenance services', description: 'After-sales support for equipment' },
]

export const SEGMENT_SHARE_PLACEHOLDER = '% of FY2025 revenue'

export const FINANCIAL_STATEMENTS: readonly IrDocument[] = [
  { title: 'Accountants’ report FY2022–FY2025', meta: 'In prospectus', format: 'PDF' },
  { title: 'Quarterly results', meta: 'After listing', format: '—' },
  { title: 'Audited financial statements', meta: 'In the annual report, after listing', format: '—' },
]
