/**
 * Investor Relations content from the design handoff ("Bestari Investors.html", README "Content: verified vs placeholder").
 * Anything flagged `isPlaceholder` is a dashed .ph placeholder in the handoff: it renders with <Ph> and must be
 * replaced from the registered prospectus before launch. Never fill those in by guesswork.
 */
import { COMPANY } from '../../content/site'

export interface SectionLink {
  id: string
  label: string
}

/** In-page sections, in page order (sub-nav and scroll spy). */
export const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'ipo', label: 'IPO' },
  { id: 'financials', label: 'Financials' },
  { id: 'shareholding', label: 'Shareholding' },
  { id: 'board', label: 'Board & Management' },
  { id: 'documents', label: 'Documents' },
  { id: 'contact', label: 'IR Contact' },
] as const satisfies readonly SectionLink[]

export type SectionId = (typeof SECTIONS)[number]['id']

export const SECTION_IDS: readonly SectionId[] = SECTIONS.map((section) => section.id)

/** Id of the heading that names a section (used for aria-labelledby). */
export function headingId(id: SectionId | 'hero' | 'glance'): string {
  return `ir-${id}-title`
}

/* Hero */

export interface Badge {
  label: string
  isHighlighted?: boolean
}

export const HERO_BADGES: readonly Badge[] = [
  { label: 'Main Market · Bursa Malaysia', isHighlighted: true },
  { label: 'Shariah-compliant' },
  { label: 'SC approved · 23 Oct 2026' },
]

export interface Figure {
  label: string
  value: string
  isPlaceholder?: boolean
}

export const IPO_GLANCE: readonly Figure[] = [
  { label: 'Total IPO shares', value: 'Up to 133.32m' },
  { label: 'Enlarged share capital', value: '450.0m shares' },
  { label: 'Public issue (new)', value: '77.07m shares' },
  { label: 'Offer for sale', value: 'Up to 56.25m shares' },
  { label: 'Retail price', value: 'RM 0.00 · TBA', isPlaceholder: true },
  { label: 'Listing date', value: 'TBA', isPlaceholder: true },
]

/* Overview */

export interface Quote {
  text: string
  name: string
  title: string
}

export const MD_QUOTE: Quote = {
  text: '“The listing will provide us with a stronger platform to support our next phase of growth while enhancing our brand visibility and market awareness of our food premix products.”',
  name: 'Lai Kok Siong',
  title: 'Managing Director, Bestari Food Berhad',
}

/* IPO structure */

export interface AllocationTranche {
  id: string
  /** Short label inside the allocation bar. */
  barLabel: string
  description: string
  amount: string
  /** Relative size in the bar (millions of shares). */
  weight: number
  color: string
  textColor?: string
}

export const ALLOCATION_TOTAL = 'Up to 133,320,300 IPO shares'

export const ALLOCATION: readonly AllocationTranche[] = [
  {
    id: 'institutional',
    barLabel: 'Institutional',
    description: 'Institutional & selected investors, incl. Bumiputera investors approved by MITI',
    amount: 'up to 100.0m',
    weight: 100,
    color: 'var(--brand-deep)',
  },
  {
    id: 'public',
    barLabel: 'Public',
    description: 'Retail offering: Malaysian public',
    amount: '22.5m',
    weight: 22.5,
    color: 'var(--brand)',
  },
  {
    id: 'pink',
    barLabel: 'Pink',
    description: 'Eligible directors, employees & contributors',
    amount: '~10.8m',
    weight: 10.8,
    color: 'var(--saffron)',
    textColor: 'var(--ink)',
  },
]

export type MilestoneStatus = 'done' | 'upcoming'

export interface Milestone {
  date: string
  isDatePlaceholder?: boolean
  event: string
  status: MilestoneStatus
}

export const TIMETABLE: readonly Milestone[] = [
  { date: '6 Jul 2026', event: 'Draft prospectus lodged with SC', status: 'done' },
  { date: '23 Oct 2026', event: 'SC approval & Shariah-compliant status', status: 'done' },
  { date: 'TBA', isDatePlaceholder: true, event: 'Prospectus launch & applications open', status: 'upcoming' },
  { date: 'TBA', isDatePlaceholder: true, event: 'Applications close & balloting', status: 'upcoming' },
  { date: 'TBA', isDatePlaceholder: true, event: 'Listing on Bursa Malaysia Main Market', status: 'upcoming' },
]

export const MILESTONE_LABELS: Record<MilestoneStatus, string> = { done: 'Done', upcoming: 'Upcoming' }

export interface ProceedsUse {
  number: string
  title: string
  description: string
}

export const PROCEEDS_SOURCE = 'From the public issue of 77.07 million new shares'

export const PROCEEDS: readonly ProceedsUse[] = [
  {
    number: '01',
    title: 'New production facility',
    description: 'Buy about 10 acres of industrial land in Bandar Industrial Zone, Banting, and build a new facility.',
  },
  {
    number: '02',
    title: 'Machinery & equipment',
    description: 'Integrated mixing and packaging lines, silo systems, and automated packaging and palletising.',
  },
  {
    number: '03',
    title: 'Marketing & promotion',
    description: 'Expand marketing and promotional activities to grow the Bestari brand.',
  },
  { number: '04', title: 'Listing expenses', description: 'Pay the estimated costs of the IPO and listing exercise.' },
]

/** Placeholder until the prospectus RM and % breakdown is confirmed. */
export const PROCEEDS_BREAKDOWN_PLACEHOLDER = 'add amounts & %'

/* Financials (RM million, financial years ended 31 December; source: draft prospectus) */

export type SeriesKey = 'revenue' | 'netProfit'

export interface ChartSeries {
  key: SeriesKey
  label: string
  color: string
}

export const FINANCIAL_SERIES: readonly ChartSeries[] = [
  { key: 'revenue', label: 'Revenue', color: 'var(--saffron)' },
  { key: 'netProfit', label: 'Net profit', color: 'var(--brand)' },
]

export interface ChartValue {
  /** RM million. */
  amount: number
  /** Bar height as a % of the chart, copied from the handoff's data-h. */
  heightPct: number
}

export interface FinancialYear {
  label: string
  values: Record<SeriesKey, ChartValue>
}

export const FINANCIAL_YEARS: readonly FinancialYear[] = [
  {
    label: 'FY2024',
    values: { revenue: { amount: 160.69, heightPct: 91.6 }, netProfit: { amount: 16.54, heightPct: 9.4 } },
  },
  {
    label: 'FY2025',
    values: { revenue: { amount: 175.32, heightPct: 100 }, netProfit: { amount: 31.03, heightPct: 17.7 } },
  },
]

export type KpiTone = 'deep' | 'brand' | 'saffron'

export interface Kpi {
  label: string
  value: string
  detail: string
  tone: KpiTone
}

export const KPIS: readonly Kpi[] = [
  { label: 'FY2025 revenue', value: 'RM175.3m', detail: 'Up 9.1% from RM160.7m in FY2024', tone: 'deep' },
  { label: 'FY2025 net profit', value: 'RM31.0m', detail: 'Up 87.6% from RM16.5m in FY2024', tone: 'brand' },
  {
    label: 'Dividend policy',
    value: 'Up to 30%',
    detail: 'Of annual audited profit after tax attributable to shareholders',
    tone: 'saffron',
  },
]

/* Shareholding after the IPO */

export interface Holder {
  name: string
  percent: number
  /** Donut segment colour. */
  chartColor: string
  /** Colour of the percentage in the heading (darker than the chart colour where needed for contrast). */
  textColor: string
}

export const POST_IPO_SHARES = '450.0m'

export const HOLDERS: readonly Holder[] = [
  { name: 'Core Perpetual Sdn Bhd', percent: 70.4, chartColor: 'var(--brand)', textColor: 'var(--brand)' },
  { name: 'Public investors', percent: 29.6, chartColor: 'var(--saffron)', textColor: '#C8861A' },
]

export interface Owner {
  name: string
  percent: number
}

/** Owners of the selling shareholder, Core Perpetual Sdn Bhd. */
export const CORE_PERPETUAL_OWNERS: readonly Owner[] = [
  { name: 'Lai Kok Siong', percent: 40 },
  { name: 'Lew Tai @ Kong Lew Tai', percent: 30 },
  { name: 'Gabriel Lai Yung-Yao', percent: 10 },
  { name: 'Gary Lai Yung-Hui', percent: 10 },
  { name: 'Lai Jia Maine', percent: 10 },
]

/* Board & key senior management */

export interface BoardLead {
  title: string
  name: string
  summary: string
}

export const BOARD_LEAD: BoardLead = {
  title: 'Managing Director',
  name: 'Lai Kok Siong',
  summary: 'Leads the Group’s strategy and its growth in food premixes.',
}

export interface BoardMember {
  name: string
  role: string
  /** Which line is still a placeholder to be filled from the registered prospectus. */
  placeholder?: 'name' | 'role'
}

export const BOARD_MEMBERS: readonly BoardMember[] = [
  { name: 'Gabriel Lai Yung-Yao', role: 'Head of Sales & Marketing' },
  { name: 'Gary Lai Yung-Hui', role: 'Head of Production' },
  { name: 'Fong Zhoon Zhien', role: 'Title per prospectus', placeholder: 'role' },
  { name: 'Chang Kok Leong', role: 'Title per prospectus', placeholder: 'role' },
  { name: 'Independent Director', role: 'Name per prospectus', placeholder: 'name' },
  { name: 'Independent Director', role: 'Name per prospectus', placeholder: 'name' },
]

export const BOARD_NOTE =
  'The full board, with independent non-executive directors and committee composition, will be updated from the registered prospectus.'

/* Documents & corporate directory */

export interface IrDocument {
  title: string
  meta: string
  format: string
  /** No files are published yet; add the URL when the document is available. */
  href?: string
}

export type DocumentTabId = 'ipo' | 'financials' | 'governance'

export interface DocumentTab {
  id: DocumentTabId
  label: string
  documents: readonly IrDocument[]
}

export const DOCUMENT_TABS: readonly DocumentTab[] = [
  {
    id: 'ipo',
    label: 'IPO',
    documents: [
      { title: 'Prospectus: Initial Public Offering', meta: '6 Jul 2026 (exposure, updated 2 Oct 2026)', format: 'PDF' },
      { title: 'SC approval announcement', meta: '23 Oct 2026', format: 'PDF' },
      { title: 'Investor presentation', meta: 'TBA', format: 'PDF' },
    ],
  },
  {
    id: 'financials',
    label: 'Financials',
    documents: [
      { title: 'Accountants’ report FY2022–FY2025', meta: 'In prospectus', format: 'PDF' },
      { title: 'Quarterly results', meta: 'After listing', format: '—' },
      { title: 'Annual report', meta: 'After listing', format: '—' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    documents: [
      { title: 'Board Charter', meta: 'TBA', format: 'PDF' },
      { title: 'Terms of Reference: Audit & Risk Committee', meta: 'TBA', format: 'PDF' },
      { title: 'Anti-Bribery & Corruption Policy', meta: 'TBA', format: 'PDF' },
      { title: 'Whistleblowing Policy', meta: 'TBA', format: 'PDF' },
    ],
  },
]

export interface DirectoryEntry {
  label: string
  value: string
}

export const DIRECTORY: readonly DirectoryEntry[] = [
  { label: 'Principal adviser, sole underwriter & sole placement agent', value: 'RHB Investment Bank Berhad' },
  { label: 'Share registrar', value: 'Boardroom Share Registrars Sdn Bhd' },
  { label: 'Listing sought', value: 'Main Market, Bursa Malaysia Securities Berhad' },
  { label: 'Shariah status', value: 'Shariah-compliant (SC Shariah Advisory Council)' },
  { label: 'Headquarters', value: COMPANY.addressLines.join(' ') },
]

/* IR contact */

/** Placeholder: the IR mailbox is not confirmed yet. */
export const IR_EMAIL_PLACEHOLDER = 'ir@bestarifood.com'

export const IR_THANK_YOU = 'Thank you. Our IR team will be in touch.'

export const IR_DISCLAIMER =
  'This website is for information only. It does not constitute an offer or invitation to subscribe for or purchase securities of Bestari Food Berhad. Investors should read the prospectus registered with the Securities Commission Malaysia before making any investment decision. Figures are taken from public filings and press reports and may be revised in the final prospectus.'
