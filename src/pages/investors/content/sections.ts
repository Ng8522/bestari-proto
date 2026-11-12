/**
 * Content for the IR sections that mirror a full Bursa Malaysia IR site (corporate info, IPO centre extras,
 * governance, stock info, news, reports and investor resources). Bestari is not listed yet, so trading data,
 * announcements and post-listing reports show empty states, and anything unconfirmed is `isPlaceholder`.
 */
import { COMPANY } from '../../../content/site'
import { SHARES_PER_LOT } from '../calculator'
import { KPIS, POST_IPO_SHARES, TIMETABLE, type IrDocument } from '../data'
import { SEGMENTS } from './financials'

export interface InfoEntry {
  label: string
  value: string
  isPlaceholder?: boolean
}

/** A document list with a message for when nothing is published yet. */
export interface DocumentGroup<T extends string> {
  id: T
  label: string
  documents: readonly IrDocument[]
  emptyMessage?: string
}

/* Corporate info */

export const GENERAL_INFO: readonly InfoEntry[] = [
  { label: 'Company', value: COMPANY.name },
  { label: 'Stock name / code', value: 'Assigned at listing', isPlaceholder: true },
  { label: 'Listing sought', value: 'Main Market, Bursa Malaysia Securities Berhad' },
  { label: 'Sector', value: 'Per Bursa classification', isPlaceholder: true },
  { label: 'Shariah status', value: 'Shariah-compliant (SC Shariah Advisory Council)' },
  { label: 'Principal adviser, sole underwriter & sole placement agent', value: 'RHB Investment Bank Berhad' },
  { label: 'Share registrar', value: 'Boardroom Share Registrars Sdn Bhd' },
  { label: 'Company secretary', value: 'Name per prospectus', isPlaceholder: true },
  { label: 'Auditors', value: 'Firm per prospectus', isPlaceholder: true },
  { label: 'Registered office', value: 'Address per prospectus', isPlaceholder: true },
  { label: 'Headquarters', value: COMPANY.addressLines.join(' ') },
]

export const BUSINESS_ACTIVITIES: readonly string[] = SEGMENTS.map((segment) => segment.name)

export const SUBSIDIARIES_PLACEHOLDER = 'Subsidiaries & effective interest per prospectus'

export const STATEMENTS_NOTE =
  'The Chairman’s statement and the management discussion & analysis will be published in our first annual report after listing.'

/* IPO centre */

export interface Advantage {
  title: string
  description: string
}

/** Summarised from the company overview; check the wording against the prospectus before launch. */
export const COMPETITIVE_ADVANTAGES: readonly Advantage[] = [
  { title: 'Category-leading flagship', description: 'Our Crispy Fried Chicken Coating Mix, sold since 2004, leads its category in Malaysia.' },
  { title: 'An established brand', description: 'Products sell mainly under the Bestari brand, in retail and commercial packs.' },
  { title: 'Two routes to market', description: 'Supermarkets and retail, plus food manufacturers, hotels, restaurants, cafés and caterers.' },
  { title: 'An integrated offering', description: 'Premixes, ingredients, processing equipment, spare parts and maintenance from one group.' },
  { title: 'Room to grow', description: 'A new facility in Banting will support ingredient processing and a wider range.' },
]

export const ADVANTAGES_PLACEHOLDER = 'check against prospectus wording'

export const ABBREVIATIONS: readonly InfoEntry[] = [
  { label: 'SC', value: 'Securities Commission Malaysia' },
  { label: 'Bursa Securities', value: 'Bursa Malaysia Securities Berhad' },
  { label: 'IPO', value: 'Initial public offering' },
  { label: 'MITI', value: 'Ministry of Investment, Trade and Industry' },
  { label: 'FY', value: 'Financial year ended 31 December' },
  { label: 'RM / sen', value: 'Ringgit Malaysia and sen' },
]

/* Governance & meetings */

const pending = (title: string): IrDocument => ({ title, meta: 'TBA', format: 'PDF' })

export const POLICIES: readonly IrDocument[] = [
  'Constitution',
  'Board Charter',
  'Terms of Reference: Audit & Risk Committee',
  'Code of Conduct & Business Ethics',
  'Anti-Bribery & Corruption Policy',
  'Whistleblowing Policy',
  'Conflict of Interest Policy',
  'Directors’ Fit & Proper Policy',
  'Directors’ & Senior Management Remuneration Policy',
  'Diversity Policy',
].map(pending)

export const MEETING_DOCUMENTS: readonly string[] = [
  'Notice of meeting',
  'Form of proxy',
  'Administrative guide',
  'Minutes',
  'Poll results',
]

export const MEETINGS_NOTE =
  'Our first annual general meeting will be held after listing. Each meeting’s papers will be posted here.'

/* Stock info */

export const TICKER: readonly InfoEntry[] = [
  { label: 'Stock name / code', value: 'Assigned at listing', isPlaceholder: true },
  { label: 'Board', value: 'Main Market' },
  { label: 'Shariah compliance', value: 'Yes' },
  { label: 'Price (RM)', value: '—' },
  { label: 'Change (RM / %)', value: '—' },
  { label: 'Volume traded', value: '—' },
  { label: '52-week high / low (RM)', value: '—' },
  { label: 'Market capitalisation (RM)', value: '—' },
  { label: 'Shares on listing', value: POST_IPO_SHARES },
  { label: 'Shares per lot', value: String(SHARES_PER_LOT) },
]

export const TRADING_NOTE = 'Prices are in RM and start updating on the first day of trading.'

export const PRICE_HISTORY_NOTE = 'Daily price and volume data will be available from the first day of trading.'

export const STOCK_CHARTS_NOTE = 'Interactive price charts will be available from the first day of trading.'

export const HOLDINGS_NOTE =
  'The distribution of shareholdings and the top 30 shareholders are published in each annual report after listing.'

const dividendKpi = KPIS.find((kpi) => kpi.label === 'Dividend policy')

export const DIVIDEND_POLICY = dividendKpi ? `${dividendKpi.value} ${dividendKpi.detail.toLowerCase()}.` : ''

export const ENTITLEMENT_COLUMNS: readonly string[] = [
  'Announced',
  'Entitlement date',
  'Ex-date',
  'Payment date',
  'Subject',
  'Net (sen)',
]

export const NO_ENTITLEMENTS = 'No entitlements declared yet.'

/* News centre */

export interface NewsItem {
  date: string
  title: string
  source: string
  href?: string
}

export type NewsTabId = 'bursa' | 'press' | 'media'

export interface NewsTab {
  id: NewsTabId
  label: string
  items: readonly NewsItem[]
  emptyMessage: string
}

/** Completed IPO milestones, newest first. */
const MILESTONE_NEWS: readonly NewsItem[] = TIMETABLE.filter((milestone) => milestone.status === 'done')
  .map((milestone) => ({ date: milestone.date, title: milestone.event, source: COMPANY.name }))
  .reverse()

export const NEWS_TABS: readonly NewsTab[] = [
  {
    id: 'bursa',
    label: 'Bursa announcements',
    items: [],
    emptyMessage: 'Our announcements to Bursa Malaysia will appear here from the listing date.',
  },
  { id: 'press', label: 'Press releases', items: MILESTONE_NEWS, emptyMessage: 'No press releases yet.' },
  { id: 'media', label: 'Media news', items: [], emptyMessage: 'Media coverage of Bestari Food Berhad will be collected here.' },
]

/* Reports & presentations */

export type ReportTabId = 'annual' | 'quarterly' | 'circulars' | 'prospectus' | 'analyst' | 'presentations'

export const REPORT_TABS: readonly DocumentGroup<ReportTabId>[] = [
  {
    id: 'annual',
    label: 'Annual reports',
    documents: [
      { title: 'Annual report', meta: 'After listing', format: '—' },
      { title: 'Corporate governance report', meta: 'After listing', format: '—' },
    ],
  },
  { id: 'quarterly', label: 'Quarterly reports', documents: [{ title: 'Quarterly results', meta: 'After listing', format: '—' }] },
  { id: 'circulars', label: 'Circulars', documents: [], emptyMessage: 'Circulars to shareholders will be posted here when issued.' },
  {
    id: 'prospectus',
    label: 'Prospectus',
    documents: [
      { title: 'Prospectus: Initial Public Offering', meta: '6 Jul 2026 (exposure, updated 2 Oct 2026)', format: 'PDF' },
      { title: 'SC approval announcement', meta: '23 Oct 2026', format: 'PDF' },
    ],
  },
  {
    id: 'analyst',
    label: 'Analyst coverage',
    documents: [],
    emptyMessage: 'Research reports will be listed here once analysts start covering Bestari Food Berhad.',
  },
  { id: 'presentations', label: 'Presentations', documents: [{ title: 'Investor presentation', meta: 'TBA', format: 'PDF' }] },
]

/* Investor resources */

export interface CalendarEvent {
  date: string
  isDatePlaceholder?: boolean
  event: string
}

export const CALENDAR: readonly CalendarEvent[] = [
  ...TIMETABLE.filter((milestone) => milestone.status === 'upcoming').map((milestone) => ({
    date: milestone.date,
    isDatePlaceholder: milestone.isDatePlaceholder,
    event: milestone.event,
  })),
  { date: 'TBA', isDatePlaceholder: true, event: 'First annual general meeting' },
  { date: '31 Dec', event: 'Financial year end' },
]

export const LEGAL_DOCUMENTS: readonly IrDocument[] = [pending('IR website terms of use'), pending('IR privacy notice')]

export const ALERTS_THANK_YOU = 'You’re on the list. We’ll email you our latest announcements.'

export const CALCULATOR_NOTE = 'Illustration only. Excludes brokerage, clearing fees and stamp duty.'

/* IR home highlights (Overview) */

export interface Highlight {
  label: string
  title: string
  meta: string
  isMetaPlaceholder?: boolean
  href: string
  cta: string
}

const latestNews = MILESTONE_NEWS[0]
const nextEvent = CALENDAR[0]

export const HIGHLIGHTS: readonly Highlight[] = [
  { label: 'Latest news', title: latestNews.title, meta: latestNews.date, href: '#news', cta: 'News centre' },
  {
    label: 'Next on the calendar',
    title: nextEvent.event,
    meta: nextEvent.date,
    isMetaPlaceholder: nextEvent.isDatePlaceholder,
    href: '#resources',
    cta: 'Corporate calendar',
  },
  { label: 'News alerts', title: 'Get our announcements by email', meta: 'Free sign-up', href: '#ir-alerts', cta: 'Subscribe' },
]
