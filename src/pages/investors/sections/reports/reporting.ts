/**
 * Bestari's reporting calendar as a listed company: a 31 December financial year end, quarterly results, the
 * annual report and the AGM. The time limits are the general rules for Main Market companies (Bursa Malaysia
 * Main Market Listing Requirements, and the Companies Act 2016 for the AGM); dates follow from the year end.
 */

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

const MONTHS_PER_YEAR = 12

export const FINANCIAL_YEAR_END = '31 December'

/** December, as a 0-based month index. */
const YEAR_END_MONTH_INDEX = 11

/** Quarterly results are announced within two months of the quarter end. */
export const QUARTERLY_REPORT_MONTHS = 2
/** The annual report is issued within four months of the financial year end. */
export const ANNUAL_REPORT_MONTHS = 4
/** A public company holds its AGM within six months of the financial year end. */
export const AGM_MONTHS = 6

export type QuarterId = 'q1' | 'q2' | 'q3' | 'q4'

export interface Quarter {
  id: QuarterId
  label: string
  /** e.g. "31 Mar". */
  endsOn: string
  /** 0-based month index of the quarter end. */
  monthIndex: number
  /** Months from the start of the financial year to the quarter end (3, 6, 9, 12). */
  monthsToDate: number
}

/** The four quarters of a financial year ending 31 December. */
export const QUARTERS: readonly Quarter[] = [
  { id: 'q1', label: 'Q1', endsOn: '31 Mar', monthIndex: 2, monthsToDate: 3 },
  { id: 'q2', label: 'Q2', endsOn: '30 Jun', monthIndex: 5, monthsToDate: 6 },
  { id: 'q3', label: 'Q3', endsOn: '30 Sep', monthIndex: 8, monthsToDate: 9 },
  { id: 'q4', label: 'Q4', endsOn: '31 Dec', monthIndex: 11, monthsToDate: 12 },
]

export interface Deadline {
  /** The month by whose end the document is due, e.g. "May". */
  month: string
  /** True when that month is in the next calendar year. */
  isFollowingYear: boolean
}

/** The month `months` after a period ending in `monthIndex` (0-based). */
export function deadlineAfter(monthIndex: number, months: number): Deadline {
  const target = monthIndex + months
  return { month: MONTHS[target % MONTHS_PER_YEAR], isFollowingYear: target >= MONTHS_PER_YEAR }
}

/** Counted from the 31 December financial year end. */
export function deadlineAfterYearEnd(months: number): Deadline {
  return deadlineAfter(YEAR_END_MONTH_INDEX, months)
}

/** "End of May", or "End of February (following year)". */
export function formatDeadline({ month, isFollowingYear }: Deadline): string {
  return isFollowingYear ? `End of ${month} (following year)` : `End of ${month}`
}
