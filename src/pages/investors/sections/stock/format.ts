/** Number and date formatting for the Stock Info tables (pure). Also used by the News Centre. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const COUNT_FORMAT = new Intl.NumberFormat('en-MY')

/** "2026-11-16" → "16 Nov 2026"; anything that is not an ISO date is returned unchanged. */
export function formatIsoDate(isoDate: string): string {
  if (!ISO_DATE.test(isoDate)) return isoDate
  const [year, month, day] = isoDate.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

/** "16 Aug 2026 to 16 Nov 2026", "From 1 Jan 2026", "Up to 16 Nov 2026" or "All dates". */
export function describeRange(from: string, to: string): string {
  if (from && to) return `${formatIsoDate(from)} to ${formatIsoDate(to)}`
  if (from) return `From ${formatIsoDate(from)}`
  if (to) return `Up to ${formatIsoDate(to)}`
  return 'All dates'
}

/** 450000000 → "450,000,000". */
export function formatCount(value: number): string {
  return COUNT_FORMAT.format(value)
}

/** Bursa prices are quoted to three decimals: 0.5 → "0.500". */
export function formatPrice(value: number): string {
  return value.toFixed(3)
}

/** A change with its sign: 0.015 → "+0.015", -1.2 → "-1.20" (with 2 digits). */
export function formatSigned(value: number, digits: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}`
}

/** 2.5 → "2.50%". */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

/** A figure, or a dash while it is not published. */
export function orDash(value: number | null, format: (value: number) => string): string {
  return value === null ? '—' : format(value)
}
