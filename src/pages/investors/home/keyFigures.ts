import type { Stat } from '../ui/PageParts'
import { EPS_SEN, FINANCIAL_YEAR_LABELS, INCOME_STATEMENT } from '../content/prospectus'

const THOUSANDS_PER_MILLION = 1000

/** RM'000 → "RM175.3m". */
export function formatRmMillion(thousands: number): string {
  return `RM${(thousands / THOUSANDS_PER_MILLION).toFixed(1)}m`
}

/** Percentage change from `previous` to `current`, one decimal place, e.g. 9.1. */
export function growthPct(current: number, previous: number): number {
  return Math.round(((current - previous) / previous) * 1000) / 10
}

/** `part` as a percentage of `whole`, one decimal place. */
export function sharePct(part: number, whole: number): number {
  return Math.round((part / whole) * 1000) / 10
}

/** The latest financial year's headline figures, each compared with the year before. */
export function latestYearStats(): Stat[] {
  const last = FINANCIAL_YEAR_LABELS.length - 1
  const prior = FINANCIAL_YEAR_LABELS[last - 1]
  const { revenue, grossProfit, pat } = INCOME_STATEMENT
  const versus = (values: readonly number[]) =>
    `${growthPct(values[last], values[last - 1]) >= 0 ? 'Up' : 'Down'} ${Math.abs(growthPct(values[last], values[last - 1]))}% on ${prior}`

  return [
    { label: 'Revenue', value: formatRmMillion(revenue[last]), detail: versus(revenue) },
    { label: 'Profit after tax', value: formatRmMillion(pat[last]), detail: versus(pat) },
    {
      label: 'Gross profit margin',
      value: `${sharePct(grossProfit[last], revenue[last])}%`,
      detail: `${sharePct(grossProfit[last - 1], revenue[last - 1])}% in ${prior}`,
    },
    { label: 'Earnings per share', value: `${EPS_SEN[last].toFixed(1)} sen`, detail: 'On 450.0m shares after the IPO' },
  ]
}

export const LATEST_YEAR_LABEL = FINANCIAL_YEAR_LABELS[FINANCIAL_YEAR_LABELS.length - 1]
