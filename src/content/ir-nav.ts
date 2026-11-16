/**
 * Investor Relations site map, modelled on a full Bursa Malaysia IR site: IR Home, eight sections with their own
 * sub-pages, and IR Contact. One source for the IR routes, the header dropdown, the IR icon menu, the sub-page tabs,
 * the breadcrumb and the previous / next pager.
 */

export type IrIconName =
  | 'home'
  | 'building'
  | 'rocket'
  | 'gavel'
  | 'chart'
  | 'ticker'
  | 'news'
  | 'report'
  | 'toolbox'
  | 'mail'

export interface IrPageNav {
  slug: string
  label: string
  /** One sentence under the page title. */
  intro: string
}

export interface IrSectionNav {
  /** URL segment under /investor-relations; '' is IR Home. */
  slug: string
  label: string
  icon: IrIconName
  pages: readonly IrPageNav[]
}

export const IR_BASE = '/investor-relations'

const page = (slug: string, label: string, intro: string): IrPageNav => ({ slug, label, intro })

export const IR_NAV = [
  { slug: '', label: 'IR Home', icon: 'home', pages: [] },
  {
    slug: 'corporate-info',
    label: 'Corporate Info',
    icon: 'building',
    pages: [
      page('general-information', 'General Information', 'Our listing details, registered office, company secretary, registrar, auditors and advisers.'),
      page('directors-profile', 'Directors’ Profile', 'The members of our Board of Directors and their roles.'),
      page('key-management', 'Key Management Team', 'The senior managers who run the Group day to day.'),
      page('corporate-structure', 'Corporate Structure', 'How the Group is organised, from the listed holding company to its operating subsidiaries.'),
      page('chairmans-statement', 'Chairman’s Statement', 'The Chairman’s message to shareholders, published with each annual report.'),
      page('management-discussion', 'Management Discussion & Analysis', 'Management’s review of the Group’s business, financial performance and outlook.'),
    ],
  },
  {
    slug: 'ipo-centre',
    label: 'IPO Centre',
    icon: 'rocket',
    pages: [
      page('overview', 'IPO Overview', 'The key terms of our initial public offering on the Main Market of Bursa Malaysia.'),
      page('timetable', 'IPO Timetable', 'The indicative dates from prospectus launch to listing.'),
      page('use-of-proceeds', 'Utilisation of Proceeds', 'How we plan to use the money raised from the public issue.'),
      page('shareholding', 'Shareholding Structure', 'Who will own Bestari Food Berhad after the IPO.'),
      page('competitive-strengths', 'Competitive Strengths', 'What sets the Group apart, and where we plan to grow.'),
      page('how-to-apply', 'How to Apply', 'Ways to apply for IPO shares, and answers to common questions.'),
    ],
  },
  {
    slug: 'governance',
    label: 'Governance & Meetings',
    icon: 'gavel',
    pages: [
      page('policy-disclosures', 'Policy Disclosures', 'Our constitution, board charter, codes and governance policies.'),
      page('board-committees', 'Board Committees', 'The committees of the Board, their members and terms of reference.'),
      page('shareholders-meeting', 'Shareholders Meeting', 'Notices, proxy forms, minutes and poll results for every general meeting.'),
    ],
  },
  {
    slug: 'financial-info',
    label: 'Financial Info',
    icon: 'chart',
    pages: [
      page('highlights', 'Financial Highlights', 'Our key figures over the years, as charts and a table.'),
      page('performance', 'Financial Performance', 'Year-on-year growth in revenue and profit, with margins.'),
      page('statements', 'Financial Statements', 'Income statement, financial position and cash flow figures.'),
      page('segmental-analysis', 'Segmental Analysis', 'Revenue by business activity and by market.'),
    ],
  },
  {
    slug: 'stock-info',
    label: 'Stock Info',
    icon: 'ticker',
    pages: [
      page('price-ticker', 'Price Ticker', 'Our latest share price and trading summary on Bursa Malaysia.'),
      page('price-volume', 'Price & Volume', 'Daily open, high, low, close and volume, for any date range.'),
      page('stock-charts', 'Interactive Stock Charts', 'Our share price and volume over time.'),
      page('shareholdings-distribution', 'Distribution of Shareholdings', 'How our shares are spread across holders, by size of holding.'),
      page('top-30-shareholders', 'Top 30 Shareholders', 'Our thirty largest shareholders, from the latest record of depositors.'),
      page('entitlements', 'Entitlements', 'Dividends and other entitlements, with their key dates.'),
    ],
  },
  {
    slug: 'news',
    label: 'News Centre',
    icon: 'news',
    pages: [
      page('bursa-announcements', 'Bursa Announcements', 'Every announcement we make to Bursa Malaysia, searchable by category and date.'),
      page('press-releases', 'Press Releases', 'News from Bestari Food Berhad.'),
      page('media-news', 'Media News', 'What the press is saying about us.'),
    ],
  },
  {
    slug: 'reports',
    label: 'Reports & Presentations',
    icon: 'report',
    pages: [
      page('annual-reports', 'Annual Reports', 'Annual reports with audited financial statements, governance and sustainability reports.'),
      page('quarterly-reports', 'Quarterly Reports', 'Our quarterly financial results, by financial year.'),
      page('circulars', 'Circulars', 'Circulars and statements to shareholders.'),
      page('prospectus', 'Prospectus', 'Our IPO prospectus and related documents.'),
      page('analyst-coverage', 'Analyst Coverage', 'Research houses that cover Bestari Food Berhad, and their latest calls.'),
      page('presentations', 'Corporate Presentations', 'Slides from our investor briefings and results presentations.'),
    ],
  },
  {
    slug: 'resources',
    label: 'Investor Resources',
    icon: 'toolbox',
    pages: [
      page('corporate-calendar', 'Corporate Calendar', 'Key dates for shareholders: results, meetings, entitlements and the financial year end.'),
      page('news-alerts', 'News Alerts', 'Get our announcements and news by email.'),
      page('investment-calculator', 'Investment Calculator', 'Work out the return on a holding of our shares.'),
      page('faq', 'Investor FAQ', 'Answers to questions investors often ask us.'),
      page('terms-of-use', 'IR Website Terms of Use', 'The terms that apply when you use this Investor Relations website.'),
    ],
  },
  { slug: 'contact', label: 'IR Contact', icon: 'mail', pages: [] },
] as const satisfies readonly IrSectionNav[]

/** "/investor-relations", "/investor-relations/contact" or "/investor-relations/stock-info/price-ticker". */
export function irPath(sectionSlug: string, pageSlug?: string): string {
  return [IR_BASE, sectionSlug, pageSlug].filter((part) => part).join('/')
}

/** Where a section link goes: its first sub-page, or the section itself when it has none. */
export function sectionHref(section: IrSectionNav): string {
  return irPath(section.slug, section.pages[0]?.slug)
}

export function findSection(slug: string | undefined): IrSectionNav | undefined {
  return (IR_NAV as readonly IrSectionNav[]).find((section) => section.slug === (slug ?? ''))
}

export function findPage(section: IrSectionNav, slug: string | undefined): IrPageNav | undefined {
  return section.pages.find((entry) => entry.slug === slug)
}

export interface IrPageRef {
  section: IrSectionNav
  page?: IrPageNav
  href: string
  label: string
}

/** Every IR page in reading order (IR Home, each section's sub-pages, IR Contact), for the previous / next pager. */
export const IR_PAGE_ORDER: readonly IrPageRef[] = (IR_NAV as readonly IrSectionNav[]).flatMap((section) =>
  section.pages.length === 0
    ? [{ section, href: irPath(section.slug), label: section.label }]
    : section.pages.map((entry) => ({ section, page: entry, href: irPath(section.slug, entry.slug), label: entry.label })),
)

/** The pages either side of `href` in IR_PAGE_ORDER. */
export function neighbours(href: string): { previous?: IrPageRef; next?: IrPageRef } {
  const index = IR_PAGE_ORDER.findIndex((ref) => ref.href === href)
  if (index === -1) return {}
  return { previous: IR_PAGE_ORDER[index - 1], next: IR_PAGE_ORDER[index + 1] }
}

/**
 * Old one-page anchors (/investor-relations#ipo) and where they live now, so links shared before the IR site
 * was split into pages still land in the right place.
 */
export const LEGACY_IR_ANCHORS: Readonly<Record<string, string>> = {
  corporate: irPath('corporate-info', 'general-information'),
  board: irPath('corporate-info', 'directors-profile'),
  ipo: irPath('ipo-centre', 'overview'),
  governance: irPath('governance', 'policy-disclosures'),
  financials: irPath('financial-info', 'highlights'),
  stock: irPath('stock-info', 'price-ticker'),
  shareholding: irPath('ipo-centre', 'shareholding'),
  news: irPath('news', 'bursa-announcements'),
  reports: irPath('reports', 'annual-reports'),
  resources: irPath('resources', 'corporate-calendar'),
  'ir-alerts': irPath('resources', 'news-alerts'),
  contact: irPath('contact'),
}
