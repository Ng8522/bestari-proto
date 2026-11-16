/**
 * Investor Relations content from the design handoff ("Bestari Investors.html", README "Content: verified vs placeholder").
 * Anything flagged `isPlaceholder` is a dashed .ph placeholder in the handoff: it renders with <Ph> and must be
 * replaced from the registered prospectus before launch. Never fill those in by guesswork.
 */
/** Id of the heading that names a hero block (used for aria-labelledby). */
export function headingId(id: 'hero' | 'glance'): string {
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

/* Key figures (financial years ended 31 December; source: draft prospectus) */

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

export const POST_IPO_SHARES = '450.0m'

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

/* Documents */

export interface IrDocument {
  title: string
  meta: string
  format: string
  /** No files are published yet; add the URL when the document is available. */
  href?: string
}

/* IR contact */

/** Placeholder: the IR mailbox is not confirmed yet. */
export const IR_EMAIL_PLACEHOLDER = 'ir@bestarifood.com'

export const IR_THANK_YOU = 'Thank you. Our IR team will be in touch.'

export const IR_DISCLAIMER =
  'This website is for information only. It does not constitute an offer or invitation to subscribe for or purchase securities of Bestari Food Berhad. Investors should read the prospectus registered with the Securities Commission Malaysia before making any investment decision. Figures are taken from public filings and press reports and may be revised in the final prospectus.'
