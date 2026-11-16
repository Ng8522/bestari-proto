/**
 * Plain-language commentary for Financial Performance, written from the computed figures so it always matches the
 * tables. It describes movements only: the reasons for them are in the prospectus.
 */
import { INCOME_STATEMENT, SEGMENT_REVENUE } from '../../content/prospectus'
import { EFFECTIVE_TAX_RATES, LATEST_INDEX, YEARS, marginsOf } from './figures'
import {
  cagrPct,
  formatGrowth,
  formatPct,
  formatPoints,
  formatRmMillion,
  growthSeries,
  pointChange,
  segmentShares,
} from './metrics'

interface Verbs {
  up: string
  down: string
  flat: string
}

const AMOUNT_VERBS: Verbs = { up: 'grew', down: 'fell', flat: 'was unchanged' }
const MARGIN_VERBS: Verbs = { up: 'widened', down: 'narrowed', flat: 'held steady' }
const RATE_VERBS: Verbs = { up: 'rose', down: 'fell', flat: 'held steady' }

const verbFor = (change: number, verbs: Verbs): string => (change > 0 ? verbs.up : change < 0 ? verbs.down : verbs.flat)

/** e.g. "Revenue grew from RM137.9m in FY2023 to RM175.3m in FY2025, a compound annual growth rate of +12.8% …". */
export function describeAmount(label: string, values: readonly number[], years: readonly string[]): string {
  const first = values[0]
  const last = values[values.length - 1]
  const cagr = cagrPct(values)
  const growth = growthSeries(values)
  const yearOnYear = years
    .slice(1)
    .map((year, index) => `${formatGrowth(growth[index + 1])} in ${year}`)
    .join(' and ')
  const rate = cagr === null ? '' : `, a compound annual growth rate of ${formatGrowth(cagr)}`
  return `${label} ${verbFor(last - first, AMOUNT_VERBS)} from ${formatRmMillion(first)} in ${years[0]} to ${formatRmMillion(last)} in ${years[years.length - 1]}${rate}. Year on year, it changed by ${yearOnYear}.`
}

/** e.g. "Gross profit margin widened from 35.5% in FY2023 to 46.8% in FY2025 (+11.3 pts)." */
export function describeRatio(label: string, ratios: readonly number[], years: readonly string[], verbs = MARGIN_VERBS): string {
  const first = ratios[0]
  const last = ratios[ratios.length - 1]
  const change = pointChange(first, last)
  return `${label} ${verbFor(change, verbs)} from ${formatPct(first)} in ${years[0]} to ${formatPct(last)} in ${years[years.length - 1]} (${formatPoints(change)}).`
}

function describeLargestSegment(): string {
  const firstShares = segmentShares(SEGMENT_REVENUE, 0)
  const latestShares = segmentShares(SEGMENT_REVENUE, LATEST_INDEX)
  const largest = latestShares.reduce((top, share) => (share.percent > top.percent ? share : top))
  const earlier = firstShares.find((share) => share.name === largest.name)
  return `${largest.name} was the largest segment, at ${formatPct(earlier?.percent ?? null)} of revenue in ${YEARS[0]} and ${formatPct(largest.percent)} in ${YEARS[LATEST_INDEX]}.`
}

/** The commentary paragraphs, in reading order. */
export function buildCommentary(): string[] {
  return [
    describeAmount('Revenue', INCOME_STATEMENT.revenue, YEARS),
    describeRatio('Gross profit margin', marginsOf('grossProfit'), YEARS),
    describeRatio('EBITDA margin', marginsOf('ebitda'), YEARS),
    describeAmount('Profit after tax', INCOME_STATEMENT.pat, YEARS),
    describeRatio('PAT margin', marginsOf('pat'), YEARS),
    describeRatio('The effective tax rate', EFFECTIVE_TAX_RATES, YEARS, RATE_VERBS),
    describeLargestSegment(),
  ]
}
