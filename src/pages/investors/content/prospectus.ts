/**
 * Facts from Bestari Food Berhad's draft prospectus on the Securities Commission Malaysia's prospectus exposure page
 * (first posted 6 Jul 2026, updated 2 Oct 2026), and from press reports. The draft is unregistered: anything the
 * draft leaves as "RM[●]" stays a placeholder, and every figure must be checked against the registered prospectus
 * before launch.
 */

export const PROSPECTUS_SOURCE = 'Draft prospectus (SC prospectus exposure, updated 2 Oct 2026)'

export const SC_EXPOSURE_URL =
  'https://www.sc.com.my/resources/prospectus-exposure/prospectus-exposure-bestari-food-berhad'

/* People */

export type DirectorCategory = 'executive' | 'independent'

export interface Director {
  name: string
  designation: string
  category: DirectorCategory
  age: number
  gender: 'Male' | 'Female'
  nationality: string
  /** e.g. "27 Apr 2026". */
  appointed: string
  qualifications: readonly string[]
  /** Short profile lines from the prospectus. */
  notes: readonly string[]
  /** Committee chairs named in the prospectus. */
  committees: readonly string[]
}

export const DIRECTORS: readonly Director[] = [
  {
    name: 'Badrulnizam Bin Bahaman',
    designation: 'Independent Non-Executive Chairman',
    category: 'independent',
    age: 57,
    gender: 'Male',
    nationality: 'Malaysian',
    appointed: '27 Apr 2026',
    qualifications: [
      'BSc Business Administration, University of Hartford (1993)',
      'Master of Applied Finance, University of Melbourne (2001)',
    ],
    notes: [
      'Member of the Institute of Corporate Directors Malaysia and CPA Australia.',
      'Holds a Capital Markets Services Representative’s Licence from the SC.',
    ],
    committees: [],
  },
  {
    name: 'Lai Kok Siong',
    designation: 'Managing Director',
    category: 'executive',
    age: 65,
    gender: 'Male',
    nationality: 'Malaysian',
    appointed: '20 Feb 2025',
    qualifications: ['BEng Chemical Engineering and Fuel Technology, University of Sheffield (1984)'],
    notes: ['More than 37 years of experience in the industry.', 'Leads the Group’s strategy and growth.'],
    committees: [],
  },
  {
    name: 'Gabriel Lai Yung-Yao',
    designation: 'Executive Director / Head of Sales & Marketing',
    category: 'executive',
    age: 37,
    gender: 'Male',
    nationality: 'Malaysian',
    appointed: '20 Feb 2025',
    qualifications: ['Bachelor of Applied Finance, University of South Australia (2011)'],
    notes: ['Son of the Managing Director, Lai Kok Siong.'],
    committees: [],
  },
  {
    name: 'Ow Yin Yee',
    designation: 'Independent Non-Executive Director',
    category: 'independent',
    age: 58,
    gender: 'Female',
    nationality: 'Malaysian',
    appointed: '27 Apr 2026',
    qualifications: [
      'Bachelor of Economics, Monash University',
      'MBA, Universiti Malaya',
      'Fellow of CPA Australia; Chartered Accountant (MIA)',
    ],
    notes: [],
    committees: ['Chair, Audit and Risk Management Committee'],
  },
  {
    name: 'Zueraini Binti Ahmad Basri',
    designation: 'Independent Non-Executive Director',
    category: 'independent',
    age: 52,
    gender: 'Female',
    nationality: 'Malaysian',
    appointed: '27 Apr 2026',
    qualifications: ['BSc Business Administration, University of Missouri', 'Master of Finance, RMIT University'],
    notes: [],
    committees: [],
  },
  {
    name: 'Low Chin Ann @ Han Chin Ann',
    designation: 'Independent Non-Executive Director',
    category: 'independent',
    age: 46,
    gender: 'Male',
    nationality: 'Malaysian',
    appointed: '27 Apr 2026',
    qualifications: ['Fellow of ACCA; Chartered Accountant (MIA)'],
    notes: [],
    committees: ['Chair, Nomination and Remuneration Committee'],
  },
]

export interface Manager {
  name: string
  designation: string
  age: number
  /** When they joined or took the role, as stated in the prospectus. */
  since: string
  qualifications: readonly string[]
  notes: readonly string[]
}

export const KEY_MANAGEMENT: readonly Manager[] = [
  {
    name: 'Lai Kok Siong',
    designation: 'Managing Director',
    age: 65,
    since: 'Director since 20 Feb 2025',
    qualifications: ['BEng Chemical Engineering and Fuel Technology, University of Sheffield (1984)'],
    notes: ['More than 37 years of experience in the industry.'],
  },
  {
    name: 'Fong Zhoon Zhien',
    designation: 'Chief Financial Officer',
    age: 40,
    since: 'CFO since Jul 2025',
    qualifications: ['Chartered Accountant (MIA)', 'CPA Australia'],
    notes: [],
  },
  {
    name: 'Gabriel Lai Yung-Yao',
    designation: 'Executive Director / Head of Sales & Marketing',
    age: 37,
    since: 'Director since 20 Feb 2025',
    qualifications: ['Bachelor of Applied Finance, University of South Australia (2011)'],
    notes: [],
  },
  {
    name: 'Chang Kok Leong',
    designation: 'Head of Engineering',
    age: 48,
    since: 'With the Group since 2015',
    qualifications: ['BSc Food Technology, Universiti Sains Malaysia'],
    notes: [],
  },
  {
    name: 'Gary Lai Yung-Hui',
    designation: 'Head of Production',
    age: 35,
    since: 'Joined Jul 2025; Head of Production since Mar 2026',
    qualifications: ['MSc Computer Science, Georgia Institute of Technology'],
    notes: [],
  },
]

/* Corporate directory */

export interface DirectoryEntry {
  label: string
  lines: readonly string[]
  isPlaceholder?: boolean
}

export const CORPORATE_DIRECTORY: readonly DirectoryEntry[] = [
  { label: 'Registration no.', lines: ['202501007201 (1608615-T)'] },
  { label: 'Incorporated', lines: ['20 Feb 2025 in Malaysia; converted to a public company on 14 Apr 2026'] },
  { label: 'Company secretaries', lines: ['Lim Li Heong (MAICSA 7054716)', 'Wong Mee Kiat (MAICSA 7058813)'] },
  { label: 'Registered office', lines: ['Level 7, Mercu 3, No. 3 Jalan Bangsar, KL Eco City, 59200 Kuala Lumpur'] },
  {
    label: 'Head office',
    lines: ['Lot 29119, Jalan Rajawali, Batu 9, Kampung Kebun Baru, 42500 Telok Panglima Garang, Selangor'],
  },
  { label: 'Auditors & reporting accountants', lines: ['Baker Tilly Monteiro Heng PLT'] },
  { label: 'Share registrar', lines: ['Boardroom Share Registrars Sdn Bhd'] },
  { label: 'Issuing house', lines: ['Malaysian Issuing House Sdn Bhd'] },
  { label: 'Principal adviser, sole underwriter & sole placement agent', lines: ['RHB Investment Bank Berhad'] },
  { label: 'Solicitors', lines: ['Ong Eu Jin Partnership (Malaysian law)', 'Avant Law LLC (Singapore law)'] },
  { label: 'Independent market researcher', lines: ['Vital Factor Consulting Sdn Bhd'] },
  { label: 'Principal bankers', lines: ['Per registered prospectus'], isPlaceholder: true },
]

export interface Subsidiary {
  name: string
  country: 'Malaysia' | 'Singapore'
  activity: string
  /** Effective interest (%) once the pre-IPO acquisitions complete. */
  interest: number
}

export const SUBSIDIARIES: readonly Subsidiary[] = [
  { name: 'Bestari Sales', country: 'Malaysia', activity: 'Sale of food premixes', interest: 100 },
  { name: 'Bestari (S)', country: 'Singapore', activity: 'Sale of food premixes', interest: 100 },
  { name: 'Synerchem Food Processing', country: 'Malaysia', activity: 'Production of food premixes', interest: 100 },
  { name: 'Synerchem Ingredients', country: 'Malaysia', activity: 'Supply of food ingredients', interest: 100 },
  {
    name: 'Synerchem Engineering',
    country: 'Malaysia',
    activity: 'Supply of food processing equipment and spare parts, and maintenance services',
    interest: 100,
  },
  {
    name: 'Synerchem (S)',
    country: 'Singapore',
    activity: 'Supply of food ingredients, equipment and spare parts',
    interest: 100,
  },
  { name: 'Synerchem Services', country: 'Malaysia', activity: 'Management services', interest: 100 },
]

/* Financial information (financial years ended 31 December, RM'000; the draft covers FY2023 to FY2025) */

export const FINANCIAL_YEAR_LABELS = ['FY2023', 'FY2024', 'FY2025'] as const

export type IncomeLine = 'revenue' | 'grossProfit' | 'ebitda' | 'pbt' | 'pat'

/** RM'000, in FINANCIAL_YEAR_LABELS order. */
export const INCOME_STATEMENT: Readonly<Record<IncomeLine, readonly number[]>> = {
  revenue: [137_865, 160_691, 175_323],
  grossProfit: [48_914, 63_537, 81_986],
  ebitda: [15_449, 26_954, 49_592],
  pbt: [12_022, 22_253, 41_572],
  pat: [9_183, 16_544, 31_032],
}

export const INCOME_LINE_LABELS: Readonly<Record<IncomeLine, string>> = {
  revenue: 'Revenue',
  grossProfit: 'Gross profit',
  ebitda: 'EBITDA',
  pbt: 'Profit before tax',
  pat: 'Profit after tax',
}

/** Sen per share, on the enlarged 450.0 million shares. */
export const EPS_SEN: readonly number[] = [2.0, 3.7, 6.9]

export interface SegmentRevenue {
  name: string
  description: string
  /** RM'000, in FINANCIAL_YEAR_LABELS order. */
  values: readonly number[]
  /** A breakdown line inside the segment above it (not added to the total). */
  isSubLine?: boolean
}

export const SEGMENT_REVENUE: readonly SegmentRevenue[] = [
  { name: 'Food premixes', description: 'Production and sale of Bestari food premixes', values: [104_378, 126_971, 143_378] },
  {
    name: 'of which: fried chicken coating mix',
    description: 'The flagship product',
    values: [95_952, 114_277, 130_061],
    isSubLine: true,
  },
  { name: 'Food ingredients', description: 'Supply of food ingredients', values: [24_443, 27_235, 25_232] },
  { name: 'Equipment', description: 'Food processing and production equipment', values: [6_278, 3_688, 3_469] },
  {
    name: 'Other products & services',
    description: 'Spare parts, installation, repair and maintenance',
    values: [2_766, 2_797, 3_244],
  },
]

/** Share of revenue (%), in FINANCIAL_YEAR_LABELS order. */
export const GEOGRAPHIC_SPLIT = {
  domestic: [96.5, 97.3, 96.8],
  foreign: [3.5, 2.7, 3.2],
} as const

/* IPO */

export const IPO_TERMS = {
  publicIssue: '77,070,300 new shares',
  offerForSale: 'Up to 56,250,000 existing shares',
  enlargedShares: '450,000,000 shares',
  institutional: 'Up to 100,000,000 shares',
  retail: '33,320,300 shares (22.5m to the Malaysian public, about 10.8m to eligible persons)',
  sellingShareholder: 'Core Perpetual Sdn Bhd',
  approvalNote: 'The IPO must be completed within six months of the SC’s approval on 23 Oct 2026.',
} as const

/** Shareholding after the IPO (%). */
export const POST_IPO_HOLDINGS: readonly { label: string; percent: number }[] = [
  { label: 'Core Perpetual Sdn Bhd', percent: 70.4 },
  { label: 'Institutional investors', percent: 22.2 },
  { label: 'Retail investors', percent: 7.4 },
]

export interface ProceedsTimeframe {
  title: string
  timeframe: string
}

/** RM amounts and % are blank ("RM[●]") in the draft. */
export const PROCEEDS_TIMEFRAMES: readonly ProceedsTimeframe[] = [
  { title: 'New production facility', timeframe: 'Within 36 months' },
  { title: 'Machinery & equipment', timeframe: 'Within 36 months' },
  { title: 'Marketing & promotion', timeframe: 'Within 6 months' },
  { title: 'Listing expenses', timeframe: 'Within 1 month' },
]

/* Media coverage, newest first */

export interface MediaArticle {
  /** YYYY-MM-DD, for sorting and filtering. */
  isoDate: string
  date: string
  title: string
  source: string
  href: string
  language: 'English' | 'Malay' | 'Chinese'
}

export const MEDIA_ARTICLES: readonly MediaArticle[] = [
  {
    isoDate: '2026-10-23',
    date: '23 Oct 2026',
    title: 'Bestari Food gets regulator’s nod, shariah status for Main Market listing',
    source: 'The Edge Malaysia',
    href: 'https://theedgemalaysia.com/node/822976',
    language: 'English',
  },
  {
    isoDate: '2026-10-23',
    date: '23 Oct 2026',
    title: 'Bestari Food secures SC approval for Main Market listing',
    source: 'The Star',
    href: 'https://www.thestar.com.my/business/business-news/2026/10/23/bestari-food-secures-sc-approval-for-main-market-listing',
    language: 'English',
  },
  {
    isoDate: '2026-10-23',
    date: '23 Oct 2026',
    title: 'Bestari Food receives Securities Commission’s approval for Main Market listing',
    source: 'The Sun',
    href: 'https://thesun.my/business/bestari-food-receives-securities-commissions-approval-for-main-market-listing/',
    language: 'English',
  },
  {
    isoDate: '2026-10-23',
    date: '23 Oct 2026',
    title: 'Bestari Food dapat kelulusan SC untuk penyenaraian di Pasaran Utama',
    source: 'DagangNews',
    href: 'https://newswav.com/article/bestari-food-dapat-kelulusan-sc-untuk-penyenaraian-di-pasaran-utama-A2610_6r3PAv',
    language: 'Malay',
  },
  {
    isoDate: '2026-10-23',
    date: '23 Oct 2026',
    title: 'Bestari Food Bhd获SC批准上市BURSA主板',
    source: '9shares.my',
    href: 'https://9shares.my/bestari-food-bhd%E8%8E%B7sc%E6%89%B9%E5%87%86%E4%B8%8A%E5%B8%82bursa%E4%B8%BB%E6%9D%BF/',
    language: 'Chinese',
  },
  {
    isoDate: '2026-07-07',
    date: '7 Jul 2026',
    title: 'Bestari Food rancang IPO di Pasaran Utama, mahu bina kilang baharu tingkatkan kapasiti pengeluaran',
    source: 'DagangNews',
    href: 'https://www.dagangnews.com/article/terkini/bestari-food-rancang-ipo-di-pasaran-utama-mahu-bina-kilang-baharu-tingkatkan-kapasiti-pengeluaran-71185',
    language: 'Malay',
  },
  {
    isoDate: '2026-07-06',
    date: '6 Jul 2026',
    title: 'Bestari Food files draft prospectus for IPO, plans new production facility',
    source: 'The Edge Malaysia',
    href: 'https://theedgemalaysia.com/node/809602',
    language: 'English',
  },
]
