/** Filtering and totals for the Stock Info tables (pure, unit-tested). */
import { isWithinRange } from '../../ui/Filters'
import type { DistributionRow, Entitlement, EntitlementType, PriceRow } from './content'

/** Trading days inside an optional From / To range (inclusive). */
export function filterPriceRows(rows: readonly PriceRow[], from: string, to: string): readonly PriceRow[] {
  return rows.filter((row) => isWithinRange(row.isoDate, from, to))
}

export const ALL = 'all'

export interface EntitlementCriteria {
  /** 'all' or a year ("2027"), matched against the announcement date. */
  year: string
  type: EntitlementType | typeof ALL
}

export function filterEntitlements(
  rows: readonly Entitlement[],
  { year, type }: EntitlementCriteria,
): readonly Entitlement[] {
  return rows.filter(
    (row) => (year === ALL || row.announced.slice(0, 4) === year) && (type === ALL || row.type === type),
  )
}

/** Years for the year filter: every year with an entitlement, plus the current year, newest first. */
export function entitlementYears(rows: readonly Entitlement[], currentYear: string): readonly string[] {
  const years = new Set([currentYear, ...rows.map((row) => row.announced.slice(0, 4))])
  return [...years].sort((a, b) => b.localeCompare(a))
}

/** Sum of a column, or null while any value is unpublished. */
function totalOf(values: readonly (number | null)[]): number | null {
  if (values.length === 0 || values.some((value) => value === null)) return null
  return values.reduce<number>((sum, value) => sum + (value ?? 0), 0)
}

/** The total row of the size-of-holdings table. */
export function distributionTotal(rows: readonly DistributionRow[]): DistributionRow {
  return {
    band: 'Total',
    holders: totalOf(rows.map((row) => row.holders)),
    holdersPct: totalOf(rows.map((row) => row.holdersPct)),
    shares: totalOf(rows.map((row) => row.shares)),
    sharesPct: totalOf(rows.map((row) => row.sharesPct)),
  }
}
