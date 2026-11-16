/**
 * Stock Info content. Bestari Food Berhad is not trading yet, so every price is a dash and every post-listing table
 * is an empty, typed array; the structure (fields, columns, bands, filters) is final and fills in after listing.
 * Facts come from the draft prospectus (content/prospectus.ts) and data.ts; nothing here is a guess.
 */
import { SHARES_PER_LOT } from '../../calculator'
import type { InfoEntry } from '../../content/sections'
import { IPO_TERMS, POST_IPO_HOLDINGS } from '../../content/prospectus'
import type { Stat } from '../../ui/PageParts'
import type { Option } from '../../ui/Filters'
import type { ChartRange, QuickRange } from './dates'
import { formatCount } from './format'

/** Shown for any trading figure until the first day of trading. */
export const NO_TRADE = '—'

/** Shares in issue on listing (the enlarged share capital), parsed from the prospectus terms. */
export const SHARES_IN_ISSUE: number = Number(IPO_TERMS.enlargedShares.replace(/\D/g, ''))

export const TRADING_STARTS = 'Trading starts on listing'

/* Price ticker */

export const TRADING_SUMMARY: readonly Stat[] = [
  { label: 'Open (RM)', value: NO_TRADE },
  { label: 'High (RM)', value: NO_TRADE },
  { label: 'Low (RM)', value: NO_TRADE },
  { label: 'Previous close (RM)', value: NO_TRADE },
  { label: 'Volume', value: NO_TRADE },
  { label: 'Value traded (RM)', value: NO_TRADE },
  { label: 'Best bid / ask (RM)', value: `${NO_TRADE} / ${NO_TRADE}` },
  { label: '52-week high / low (RM)', value: `${NO_TRADE} / ${NO_TRADE}` },
  {
    label: 'Market capitalisation (RM)',
    value: NO_TRADE,
    detail: `Last done × ${formatCount(SHARES_IN_ISSUE)} shares`,
  },
]

export const COUNTER_INFO: readonly InfoEntry[] = [
  { label: 'Stock code', value: 'Assigned at listing', isPlaceholder: true },
  { label: 'ISIN', value: 'Assigned at listing', isPlaceholder: true },
  { label: 'Board', value: 'Main Market' },
  { label: 'Sector', value: 'Per Bursa classification', isPlaceholder: true },
  { label: 'Shariah-compliant', value: 'Yes' },
  { label: 'Shares in issue on listing', value: formatCount(SHARES_IN_ISSUE) },
  { label: 'Board lot', value: `${SHARES_PER_LOT} shares` },
]

/* Price & volume */

export interface PriceRow {
  /** Trading day, YYYY-MM-DD. */
  isoDate: string
  open: number
  high: number
  low: number
  close: number
  /** RM, against the previous close. */
  change: number
  /** %, against the previous close. */
  changePct: number
  volume: number
}

/** Daily prices, newest first. Empty until the first trading day. */
export const PRICE_ROWS: readonly PriceRow[] = []

export const QUICK_RANGES: readonly Option<QuickRange>[] = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
]

/* Stock charts */

export const CHART_RANGES: readonly Option<ChartRange>[] = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: 'YTD', label: 'YTD' },
  { value: '1Y', label: '1Y' },
  { value: 'All', label: 'All' },
]

export type ChartView = 'price' | 'volume'

export const CHART_VIEWS: readonly Option<ChartView>[] = [
  { value: 'price', label: 'Price' },
  { value: 'volume', label: 'Volume' },
]

export const CHART_TITLES: Readonly<Record<ChartView, string>> = {
  price: 'Closing price (RM)',
  volume: 'Daily volume traded',
}

export const EMPTY_CHART = 'Chart starts on the first trading day'

/* Distribution of shareholdings */

export interface DistributionRow {
  band: string
  holders: number | null
  holdersPct: number | null
  shares: number | null
  sharesPct: number | null
}

/** 5% of the shares in issue: where the top two Bursa size-of-holdings bands split. */
export const FIVE_PERCENT_SHARES: number = SHARES_IN_ISSUE * 0.05

/** The standard Bursa Malaysia size-of-holdings bands used in annual reports. */
export const HOLDING_BANDS: readonly string[] = [
  'Less than 100',
  '100 – 1,000',
  '1,001 – 10,000',
  '10,001 – 100,000',
  '100,001 to less than 5% of issued shares',
  '5% and above of issued shares',
]

/** Empty until the first record of depositors after listing. */
export const DISTRIBUTION: readonly DistributionRow[] = HOLDING_BANDS.map((band) => ({
  band,
  holders: null,
  holdersPct: null,
  shares: null,
  sharesPct: null,
}))

export const FIRST_RECORD = 'First record of depositors after listing'

/* Top 30 shareholders */

export interface TopHolder {
  rank: number
  name: string
  shares: number
  /** % of issued shares. */
  percent: number
}

/** From the record of depositors; empty until listing. */
export const TOP_HOLDERS: readonly TopHolder[] = []

/** Named holders of 5% or more on listing (the other POST_IPO_HOLDINGS lines are investor groups). */
export const SUBSTANTIAL_ON_LISTING: readonly { label: string; percent: number }[] = POST_IPO_HOLDINGS.filter(
  (holding) => holding.label === IPO_TERMS.sellingShareholder && holding.percent >= 5,
)

/* Entitlements */

export type EntitlementType = 'dividend' | 'bonus' | 'rights' | 'split'

export const ENTITLEMENT_TYPE_LABELS: Readonly<Record<EntitlementType, string>> = {
  dividend: 'Dividend',
  bonus: 'Bonus issue',
  rights: 'Rights issue',
  split: 'Share split',
}

export interface Entitlement {
  id: string
  /** All dates YYYY-MM-DD. */
  announced: string
  exDate: string
  entitlementDate: string
  paymentDate: string
  type: EntitlementType
  /** e.g. "First interim single-tier dividend for FY2027". */
  details: string
  /** e.g. "1.5 sen per share" or "1 for 10". */
  rate: string
}

/** Declared entitlements, newest first. Empty until the first one is announced. */
export const ENTITLEMENTS: readonly Entitlement[] = []

export interface KeyDate {
  term: string
  meaning: string
}

/** General Bursa Malaysia meanings; the dates for each entitlement are in its announcement. */
export const KEY_DATES: readonly KeyDate[] = [
  {
    term: 'Ex-date',
    meaning:
      'Shares bought on or after this date trade without the entitlement. Under T+2 settlement it is usually one market day before the entitlement date.',
  },
  {
    term: 'Entitlement date',
    meaning: 'Shareholders on the record of depositors at 5.00 pm on this date receive the entitlement.',
  },
  { term: 'Payment date', meaning: 'The date the dividend is paid or the new securities are credited.' },
]
