/**
 * Corporate calendar rows, built from the IPO timetable (data.ts) and the shareholder calendar
 * (content/sections.ts). Dates still "TBA" render as placeholders; nothing is added that those sources lack.
 */
import { CALENDAR } from '../../content/sections'
import { IPO_TERMS } from '../../content/prospectus'
import { TIMETABLE, type MilestoneStatus } from '../../data'
import { DRAFT_UPDATED } from '../reports/content'
import {
  AGM_MONTHS,
  ANNUAL_REPORT_MONTHS,
  FINANCIAL_YEAR_END,
  QUARTERLY_REPORT_MONTHS,
  QUARTERS,
  deadlineAfter,
  deadlineAfterYearEnd,
} from '../reports/reporting'

export interface CalendarRow {
  event: string
  date: string
  isDatePlaceholder: boolean
  /** "2026", or undefined for a TBA or yearly date. */
  year?: string
  /** A date that comes round every year, e.g. the financial year end. */
  isRecurring: boolean
  details: string
  status: MilestoneStatus
}

/** Extra context per event; events without an entry show no details. */
const DETAILS: Readonly<Record<string, string>> = {
  'Draft prospectus lodged with SC': `Draft prospectus posted on the SC’s prospectus exposure page; updated ${DRAFT_UPDATED}.`,
  'SC approval & Shariah-compliant status': IPO_TERMS.approvalNote,
  'Prospectus launch & applications open': 'The registered prospectus is issued and applications for IPO shares open.',
  'Applications close & balloting': 'Applications close, followed by the ballot for the shares offered to the public.',
  'Listing on Bursa Malaysia Main Market': 'Our shares start trading and our stock code is assigned.',
  'First annual general meeting': 'The notice, proxy form and papers will be posted under Shareholders Meeting.',
  'Financial year end': `Our financial year ends on ${FINANCIAL_YEAR_END} every year.`,
}

const YEAR_PATTERN = /\b(\d{4})$/

function toRow(event: string, date: string, isDatePlaceholder: boolean, status: MilestoneStatus): CalendarRow {
  const year = isDatePlaceholder ? undefined : YEAR_PATTERN.exec(date)?.[1]
  return {
    event,
    date,
    isDatePlaceholder,
    year,
    isRecurring: !isDatePlaceholder && !year,
    details: DETAILS[event] ?? '',
    status,
  }
}

const TIMETABLE_EVENTS = new Set(TIMETABLE.map((milestone) => milestone.event))

/** The IPO timetable in order, then the calendar dates it does not cover (first AGM, financial year end). */
export const CALENDAR_ROWS: readonly CalendarRow[] = [
  ...TIMETABLE.map((milestone) =>
    toRow(milestone.event, milestone.date, Boolean(milestone.isDatePlaceholder), milestone.status),
  ),
  ...CALENDAR.filter((entry) => !TIMETABLE_EVENTS.has(entry.event)).map((entry) =>
    toRow(entry.event, entry.date, Boolean(entry.isDatePlaceholder), 'upcoming'),
  ),
]

export type YearFilter = 'all' | 'tba' | `${number}`
export type StatusFilter = 'all' | MilestoneStatus

const DATED_YEARS = [...new Set(CALENDAR_ROWS.flatMap((row) => (row.year ? [row.year] : [])))].sort()

export const YEAR_OPTIONS: readonly { value: YearFilter; label: string }[] = [
  { value: 'all', label: 'All years' },
  ...DATED_YEARS.map((year) => ({ value: year as YearFilter, label: year })),
  { value: 'tba', label: 'Date to be confirmed' },
]

export const STATUS_OPTIONS: readonly { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All events' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'done', label: 'Done' },
]

function matchesYear(row: CalendarRow, year: YearFilter): boolean {
  if (year === 'all') return true
  if (year === 'tba') return row.isDatePlaceholder
  return row.year === year || row.isRecurring
}

/** Rows in the chosen year (yearly dates appear in every year) and with the chosen status. */
export function filterCalendar(rows: readonly CalendarRow[], year: YearFilter, status: StatusFilter): readonly CalendarRow[] {
  return rows.filter((row) => matchesYear(row, year) && (status === 'all' || row.status === status))
}

export interface RecurringDate {
  event: string
  timing: string
  basis: string
}

const quarterlyDeadlines = QUARTERS.map((quarter) => deadlineAfter(quarter.monthIndex, QUARTERLY_REPORT_MONTHS).month)
const annualReportDue = deadlineAfterYearEnd(ANNUAL_REPORT_MONTHS).month
const agmDue = deadlineAfterYearEnd(AGM_MONTHS).month

/** The dates every Main Market company works to, counted from our 31 December year end. */
export const RECURRING_DATES: readonly RecurringDate[] = [
  { event: 'Financial year end', timing: FINANCIAL_YEAR_END, basis: 'Company' },
  {
    event: 'Quarterly results',
    timing: `Within ${QUARTERLY_REPORT_MONTHS} months of each quarter end: by the end of ${quarterlyDeadlines.join(', ')}`,
    basis: 'Bursa Malaysia Main Market Listing Requirements',
  },
  {
    event: 'Annual report',
    timing: `Within ${ANNUAL_REPORT_MONTHS} months of the financial year end: by the end of ${annualReportDue}`,
    basis: 'Bursa Malaysia Main Market Listing Requirements',
  },
  {
    event: 'Annual general meeting',
    timing: `Within ${AGM_MONTHS} months of the financial year end: by the end of ${agmDue}`,
    basis: 'Companies Act 2016',
  },
  { event: 'Dividend entitlement dates', timing: 'Announced with each dividend', basis: 'Bursa Malaysia announcements' },
]
