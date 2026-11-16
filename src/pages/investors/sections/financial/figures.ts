/**
 * The prospectus figures the Financial Info pages share, with the ratios derived from them (see metrics.ts).
 * All amounts are RM'000 for the financial years ended 31 December.
 */
import { FINANCIAL_YEAR_LABELS, INCOME_STATEMENT, type IncomeLine } from '../../content/prospectus'
import { differenceSeries, marginSeries } from './metrics'

export type YearLabel = (typeof FINANCIAL_YEAR_LABELS)[number]

export const YEARS: readonly YearLabel[] = FINANCIAL_YEAR_LABELS
export const LATEST_INDEX = YEARS.length - 1
export const LATEST_YEAR: YearLabel = YEARS[LATEST_INDEX]
export const FIRST_YEAR: YearLabel = YEARS[0]
export const YEAR_RANGE = `${FIRST_YEAR}–${LATEST_YEAR}`

export const INCOME_LINES: readonly IncomeLine[] = ['revenue', 'grossProfit', 'ebitda', 'pbt', 'pat']

/** Tab and column labels. */
export const SHORT_LABELS: Readonly<Record<IncomeLine, string>> = {
  revenue: 'Revenue',
  grossProfit: 'Gross profit',
  ebitda: 'EBITDA',
  pbt: 'PBT',
  pat: 'PAT',
}

export type MarginLine = Exclude<IncomeLine, 'revenue'>

export const MARGIN_LINES: readonly MarginLine[] = ['grossProfit', 'ebitda', 'pbt', 'pat']

export const MARGIN_LABELS: Readonly<Record<MarginLine, string>> = {
  grossProfit: 'Gross profit margin',
  ebitda: 'EBITDA margin',
  pbt: 'PBT margin',
  pat: 'PAT margin',
}

/** A profit line as a % of revenue, year by year. */
export function marginsOf(line: MarginLine): number[] {
  return marginSeries(INCOME_STATEMENT[line], INCOME_STATEMENT.revenue)
}

/** Revenue less gross profit. */
export const COST_OF_SALES: readonly number[] = differenceSeries(INCOME_STATEMENT.revenue, INCOME_STATEMENT.grossProfit)

/** Profit before tax less profit after tax. */
export const TAXATION: readonly number[] = differenceSeries(INCOME_STATEMENT.pbt, INCOME_STATEMENT.pat)

/** Taxation as a % of profit before tax. */
export const EFFECTIVE_TAX_RATES: readonly number[] = marginSeries(TAXATION, INCOME_STATEMENT.pbt)

export const YEAR_OPTIONS: readonly { value: YearLabel; label: string }[] = YEARS.map((year) => ({
  value: year,
  label: year,
}))
