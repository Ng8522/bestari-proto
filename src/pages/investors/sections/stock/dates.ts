/** Date ranges for the price filters and charts (pure; all dates are YYYY-MM-DD). Also used by the News Centre. */

export type QuickRange = '1M' | '3M' | '6M' | '1Y'
export type ChartRange = QuickRange | 'YTD' | 'All'

const RANGE_MONTHS: Readonly<Record<QuickRange, number>> = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12 }

const pad = (value: number): string => String(value).padStart(2, '0')

/** Today's local date as YYYY-MM-DD. */
export function todayIso(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** The same day `months` earlier, clamped to that month's last day (31 Mar − 1 month → 28 or 29 Feb). */
export function monthsBefore(isoDate: string, months: number): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const target = new Date(Date.UTC(year, month - 1 - months, 1))
  const targetYear = target.getUTCFullYear()
  const targetMonth = target.getUTCMonth()
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate()
  return `${targetYear}-${pad(targetMonth + 1)}-${pad(Math.min(day, lastDay))}`
}

/** First day of a range ending today; '' (no lower bound) for All. */
export function rangeStart(range: ChartRange, today: string): string {
  if (range === 'All') return ''
  if (range === 'YTD') return `${today.slice(0, 4)}-01-01`
  return monthsBefore(today, RANGE_MONTHS[range])
}

/** An error message when the From date is after the To date. */
export function dateRangeError(from: string, to: string): string | undefined {
  return from && to && from > to ? 'The From date must be on or before the To date.' : undefined
}
