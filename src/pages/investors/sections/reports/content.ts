/**
 * Reports & Presentations content. Bestari is not listed yet: no annual report, quarterly result, circular,
 * research report or results briefing exists, so each page shows its full structure with Pending / empty rows.
 * Dates and documents below come from data.ts and content/prospectus.ts; nothing here is invented.
 */
import { irPath } from '../../../../content/ir-nav'
import { MEDIA_ARTICLES, SC_EXPOSURE_URL } from '../../content/prospectus'
import { TIMETABLE, type IrDocument } from '../../data'

/* Annual reports */

export interface ReportDocument extends IrDocument {
  description: string
}

const annualDocument = (title: string, description: string): ReportDocument => ({
  title,
  description,
  meta: 'After listing',
  format: 'PDF',
})

/** The documents published with every annual report. */
export const ANNUAL_REPORT_DOCUMENTS: readonly ReportDocument[] = [
  annualDocument(
    'Annual Report',
    'The year in review, with the Chairman’s statement and the management discussion & analysis.',
  ),
  annualDocument(
    'Audited Financial Statements',
    'The Group’s financial statements for the year, with the independent auditors’ report.',
  ),
  annualDocument(
    'Corporate Governance Report',
    'How we applied the practices of the Malaysian Code on Corporate Governance during the year.',
  ),
  annualDocument(
    'Sustainability Statement',
    'How we manage our material economic, environmental and social risks and opportunities.',
  ),
]

export interface AnnualReportYear {
  id: string
  /** e.g. "FY2026". Undefined while the financial year of the first report is not known. */
  yearLabel?: string
  documents: readonly ReportDocument[]
}

/** Newest first. Only the structure of the first report after listing exists so far. */
export const ANNUAL_REPORT_YEARS: readonly AnnualReportYear[] = [
  { id: 'first', documents: ANNUAL_REPORT_DOCUMENTS },
]

/* Quarterly reports */

/** One option until the listing date fixes the first financial year we report. */
export const QUARTERLY_YEAR_OPTIONS = [{ value: 'first', label: 'First financial year after listing' }] as const

export type QuarterlyView = 'individual' | 'cumulative'

/** Bursa quarterly reports show both: each quarter on its own, and the year to date. Short labels fit a phone. */
export const QUARTERLY_VIEWS: readonly { value: QuarterlyView; label: string; caption: string }[] = [
  { value: 'individual', label: 'Individual', caption: 'individual quarters' },
  { value: 'cumulative', label: 'Cumulative', caption: 'cumulative, year to date' },
]

/* Circulars */

export type CircularCategory = 'all' | 'circular' | 'statement'

export const CIRCULAR_CATEGORIES: readonly { value: CircularCategory; label: string }[] = [
  { value: 'all', label: 'All documents' },
  { value: 'circular', label: 'Circulars to shareholders' },
  { value: 'statement', label: 'Statements to shareholders' },
]

export interface CircularDocument extends IrDocument {
  category: Exclude<CircularCategory, 'all'>
}

/** None issued yet. */
export const CIRCULARS: readonly CircularDocument[] = []

/** What a listed company typically sends a circular or statement about (general, not Bestari-specific). */
export const CIRCULAR_TOPICS: readonly { label: string; value: string }[] = [
  {
    label: 'Shareholders’ mandates',
    value: 'Approval for recurrent related party transactions of a revenue or trading nature.',
  },
  { label: 'Share buy-backs', value: 'Authority for the company to buy back its own shares, with a share buy-back statement.' },
  { label: 'New shares', value: 'Proposals to issue new shares, such as a general mandate or a share scheme for employees.' },
  { label: 'Corporate proposals', value: 'Major acquisitions, disposals and other transactions that need shareholders’ approval.' },
]

/* Prospectus */

function timetableDate(eventStart: string): string {
  return TIMETABLE.find((milestone) => milestone.event.startsWith(eventStart))?.date ?? '—'
}

export const DRAFT_POSTED = timetableDate('Draft prospectus')
export const DRAFT_UPDATED = '2 Oct 2026'
export const SC_APPROVAL_DATE = timetableDate('SC approval')

/** Outlets that reported the SC approval, from the media coverage list. */
export const APPROVAL_COVERAGE: readonly string[] = [
  ...new Set(MEDIA_ARTICLES.filter((article) => article.date === SC_APPROVAL_DATE).map((article) => article.source)),
]

export type ProspectusAction =
  | { kind: 'external'; href: string; label: string }
  | { kind: 'internal'; to: string; label: string }
  | { kind: 'pending'; label: string }

export interface ProspectusRow {
  title: string
  description: string
  date: string
  isDatePlaceholder?: boolean
  source: string
  action: ProspectusAction
}

export const PROSPECTUS_ROWS: readonly ProspectusRow[] = [
  {
    title: 'Registered prospectus',
    description: 'The final prospectus registered with the SC, issued when applications open.',
    date: 'TBA',
    isDatePlaceholder: true,
    source: 'PDF',
    action: { kind: 'pending', label: 'At launch' },
  },
  {
    title: 'SC approval & Shariah-compliant status',
    description: `Reported by ${APPROVAL_COVERAGE.join(', ')}.`,
    date: SC_APPROVAL_DATE,
    source: 'Press coverage',
    action: { kind: 'internal', to: irPath('news', 'media-news'), label: 'Press coverage' },
  },
  {
    title: 'Draft prospectus (exposure draft)',
    description: 'The unregistered draft on the SC’s prospectus exposure page. It is incomplete and may change.',
    date: `${DRAFT_POSTED} (updated ${DRAFT_UPDATED})`,
    source: 'SC website',
    action: { kind: 'external', href: SC_EXPOSURE_URL, label: 'View on SC website' },
  },
]

/* Analyst coverage */

export type Recommendation = 'all' | 'buy' | 'hold' | 'sell'

export const RECOMMENDATION_OPTIONS: readonly { value: Recommendation; label: string }[] = [
  { value: 'all', label: 'All recommendations' },
  { value: 'buy', label: 'Buy / Outperform' },
  { value: 'hold', label: 'Hold / Neutral' },
  { value: 'sell', label: 'Sell / Underperform' },
]

export interface AnalystReport {
  house: string
  analyst: string
  date: string
  recommendation: Exclude<Recommendation, 'all'>
  targetPrice: string
  href?: string
}

/** No research house covers Bestari yet. */
export const ANALYST_REPORTS: readonly AnalystReport[] = []

/* Presentations */

export const INVESTOR_PRESENTATIONS: readonly IrDocument[] = [{ title: 'Investor presentation', meta: 'TBA', format: 'PDF' }]

/** None held yet. */
export const RESULTS_BRIEFINGS: readonly IrDocument[] = []
