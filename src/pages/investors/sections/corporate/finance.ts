/**
 * Management Discussion & Analysis figures, all computed from the draft prospectus income statement and revenue
 * breakdowns (content/prospectus.ts, RM'000, financial years ended 31 December). Nothing here is typed in by hand.
 */
import {
  EPS_SEN,
  FINANCIAL_YEAR_LABELS,
  GEOGRAPHIC_SPLIT,
  INCOME_STATEMENT,
  SEGMENT_REVENUE,
  type IncomeLine,
} from '../../content/prospectus'
import { formatRmMillion, growthPct, sharePct } from '../../home/keyFigures'
import type { Stat } from '../../ui/PageParts'

const LAST = FINANCIAL_YEAR_LABELS.length - 1
export const FIRST_YEAR: string = FINANCIAL_YEAR_LABELS[0]
export const LATEST_YEAR: string = FINANCIAL_YEAR_LABELS[LAST]
export const PRIOR_YEAR: string = FINANCIAL_YEAR_LABELS[LAST - 1]

const THOUSANDS = new Intl.NumberFormat('en-MY')
const PERCENT_DECIMALS = 1
const EPS_DECIMALS = 1
const NOT_APPLICABLE = '—'

/** 137865 → "137,865". */
export function formatThousands(value: number): string {
  return THOUSANDS.format(value)
}

/** 9.1 → "9.1%". */
export function formatPct(value: number): string {
  return `${value.toFixed(PERCENT_DECIMALS)}%`
}

/** An income line as a percentage of revenue, for each year. */
export function marginsOf(line: IncomeLine): number[] {
  return INCOME_STATEMENT[line].map((value, index) => sharePct(value, INCOME_STATEMENT.revenue[index]))
}

/** Year-on-year growth (%) for each year; null for the first year, which has nothing to compare with. */
export function growthOf(values: readonly number[]): (number | null)[] {
  return values.map((value, index) => (index === 0 ? null : growthPct(value, values[index - 1])))
}

/** Compound annual growth rate (%) over `periods` years, one decimal place. */
export function cagrPct(first: number, last: number, periods: number): number {
  return Math.round(((last / first) ** (1 / periods) - 1) * 1000) / 10
}

export interface ReviewRow {
  label: string
  /** One cell per year, in FINANCIAL_YEAR_LABELS order. */
  cells: readonly string[]
}

const amounts = (line: IncomeLine): string[] => INCOME_STATEMENT[line].map(formatThousands)
const percents = (values: readonly (number | null)[]): string[] =>
  values.map((value) => (value === null ? NOT_APPLICABLE : formatPct(value)))

/** The financial review table: amounts, growth and margins by year. */
export function financialReviewRows(): ReviewRow[] {
  return [
    { label: 'Revenue (RM’000)', cells: amounts('revenue') },
    { label: 'Revenue growth', cells: percents(growthOf(INCOME_STATEMENT.revenue)) },
    { label: 'Gross profit (RM’000)', cells: amounts('grossProfit') },
    { label: 'Gross profit margin', cells: percents(marginsOf('grossProfit')) },
    { label: 'EBITDA (RM’000)', cells: amounts('ebitda') },
    { label: 'EBITDA margin', cells: percents(marginsOf('ebitda')) },
    { label: 'Profit before tax (RM’000)', cells: amounts('pbt') },
    { label: 'Profit before tax margin', cells: percents(marginsOf('pbt')) },
    { label: 'Profit after tax (RM’000)', cells: amounts('pat') },
    { label: 'Profit after tax margin', cells: percents(marginsOf('pat')) },
    { label: 'Profit after tax growth', cells: percents(growthOf(INCOME_STATEMENT.pat)) },
    { label: 'Earnings per share (sen)', cells: EPS_SEN.map((value) => value.toFixed(EPS_DECIMALS)) },
  ]
}

/** The latest year's growth and margins, as key-figure tiles. */
export function reviewStats(): Stat[] {
  const { revenue, pat } = INCOME_STATEMENT
  const latestMargin = (line: IncomeLine): string => formatPct(marginsOf(line)[LAST])
  const priorMargin = (line: IncomeLine): string => `${formatPct(marginsOf(line)[LAST - 1])} in ${PRIOR_YEAR}`
  return [
    {
      label: `Revenue growth, ${LATEST_YEAR}`,
      value: formatPct(growthPct(revenue[LAST], revenue[LAST - 1])),
      detail: `${formatRmMillion(revenue[LAST - 1])} to ${formatRmMillion(revenue[LAST])}`,
    },
    {
      label: `Revenue CAGR, ${FIRST_YEAR}–${LATEST_YEAR}`,
      value: formatPct(cagrPct(revenue[0], revenue[LAST], LAST)),
      detail: `${formatRmMillion(revenue[0])} to ${formatRmMillion(revenue[LAST])}`,
    },
    { label: 'Gross profit margin', value: latestMargin('grossProfit'), detail: priorMargin('grossProfit') },
    { label: 'Profit before tax margin', value: latestMargin('pbt'), detail: priorMargin('pbt') },
    { label: 'Profit after tax margin', value: latestMargin('pat'), detail: priorMargin('pat') },
    {
      label: `Profit after tax growth, ${LATEST_YEAR}`,
      value: formatPct(growthPct(pat[LAST], pat[LAST - 1])),
      detail: `${formatRmMillion(pat[LAST - 1])} to ${formatRmMillion(pat[LAST])}`,
    },
  ]
}

/* Segments and markets */

export type SegmentView = 'amount' | 'share'

export interface SegmentRow {
  name: string
  isSubLine: boolean
  isTotal: boolean
  /** RM'000 or % of that year's revenue, one per year. */
  cells: readonly string[]
  /** Change in the latest year against the year before. */
  change: string
}

const mainSegments = SEGMENT_REVENUE.filter((segment) => !segment.isSubLine)

/** Sum of the segments (excluding "of which" lines), per year; matches reported revenue. */
export function segmentTotals(): number[] {
  return FINANCIAL_YEAR_LABELS.map((_label, index) =>
    mainSegments.reduce((sum, segment) => sum + segment.values[index], 0),
  )
}

function toRow(name: string, values: readonly number[], view: SegmentView, isSubLine: boolean, isTotal: boolean): SegmentRow {
  const cells = values.map((value, index) =>
    view === 'amount' ? formatThousands(value) : formatPct(sharePct(value, INCOME_STATEMENT.revenue[index])),
  )
  return { name, isSubLine, isTotal, cells, change: formatPct(growthPct(values[LAST], values[LAST - 1])) }
}

/** Revenue by business activity, with a total row, as amounts or as shares of revenue. */
export function segmentRows(view: SegmentView): SegmentRow[] {
  const rows = SEGMENT_REVENUE.map((segment) => toRow(segment.name, segment.values, view, Boolean(segment.isSubLine), false))
  return [...rows, toRow('Total revenue', segmentTotals(), view, false, true)]
}

/** Share of revenue (%) by market, per year. */
export function geographicRows(): ReviewRow[] {
  return [
    { label: 'Domestic (Malaysia)', cells: GEOGRAPHIC_SPLIT.domestic.map(formatPct) },
    { label: 'Foreign', cells: GEOGRAPHIC_SPLIT.foreign.map(formatPct) },
  ]
}

export interface SegmentHighlights {
  premixShare: number
  premixShareFirst: number
  flagshipShare: number
  flagshipName: string
  domesticShare: number
  foreignShare: number
}

/** The headline shares quoted in the segment commentary, for the latest year. */
export function segmentHighlights(): SegmentHighlights {
  const premixes = SEGMENT_REVENUE.find((segment) => /premix/i.test(segment.name) && !segment.isSubLine)
  const flagship = SEGMENT_REVENUE.find((segment) => segment.isSubLine)
  const { revenue } = INCOME_STATEMENT
  return {
    premixShare: premixes ? sharePct(premixes.values[LAST], revenue[LAST]) : 0,
    premixShareFirst: premixes ? sharePct(premixes.values[0], revenue[0]) : 0,
    flagshipShare: flagship ? sharePct(flagship.values[LAST], revenue[LAST]) : 0,
    flagshipName: flagship ? flagship.name.replace(/^of which:\s*/i, '') : '',
    domesticShare: GEOGRAPHIC_SPLIT.domestic[LAST],
    foreignShare: GEOGRAPHIC_SPLIT.foreign[LAST],
  }
}

export interface Range {
  first: string
  latest: string
  /** True when the latest year is above the first. */
  isUp: boolean
}

/** An income line in the first and latest year (RM million), with its compound annual growth rate. */
export function amountRange(line: IncomeLine): Range & { cagr: string } {
  const values = INCOME_STATEMENT[line]
  return {
    first: formatRmMillion(values[0]),
    latest: formatRmMillion(values[LAST]),
    isUp: values[LAST] > values[0],
    cagr: formatPct(cagrPct(values[0], values[LAST], LAST)),
  }
}

/** An income line's margin in the first and latest year. */
export function marginRange(line: IncomeLine): Range {
  const margins = marginsOf(line)
  return { first: formatPct(margins[0]), latest: formatPct(margins[LAST]), isUp: margins[LAST] > margins[0] }
}
