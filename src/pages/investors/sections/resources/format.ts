/** Number formats for the investment calculator and its worked example (Malaysian English). */

const LOCALE = 'en-MY'
const MONEY = { minimumFractionDigits: 2, maximumFractionDigits: 2 } as const
/** Share prices can go to the half sen (RM0.005). */
const PRICE = { minimumFractionDigits: 2, maximumFractionDigits: 3 } as const

/** "RM1,000.00", or "−RM50.00" for a loss. */
export function formatRinggit(amount: number): string {
  const sign = amount < 0 ? '−' : ''
  return `${sign}RM${Math.abs(amount).toLocaleString(LOCALE, MONEY)}`
}

/** A price per share: "RM1.10", "RM0.875". */
export function formatPrice(price: number): string {
  return `RM${price.toLocaleString(LOCALE, PRICE)}`
}

/** "1,000". */
export function formatCount(count: number): string {
  return count.toLocaleString(LOCALE)
}

/** "13.00%". */
export function formatPercent(percent: number): string {
  return `${percent.toFixed(2)}%`
}
