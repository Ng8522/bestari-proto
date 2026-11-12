/** Investment calculator maths (the Investor Resources tool). Bursa Malaysia trades in board lots of 100 shares. */
export const SHARES_PER_LOT = 100

const SEN_PER_RINGGIT = 100

/** Raw form values, as typed. */
export interface CalculatorFields {
  lots: string
  buyPrice: string
  sellPrice: string
  dividendSen: string
}

export interface InvestmentInput {
  lots: number
  /** RM per share. */
  buyPrice: number
  /** RM per share. */
  sellPrice: number
  /** Total dividends received per share, in sen. */
  dividendSen: number
}

export interface InvestmentResult {
  shares: number
  cost: number
  value: number
  dividends: number
  gain: number
  returnPct: number
}

function toNumber(raw: string): number | null {
  const value = raw.trim()
  if (value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/** Numbers from the form, or null while any field is missing or invalid. A blank dividend counts as zero. */
export function parseCalculatorInput(fields: CalculatorFields): InvestmentInput | null {
  const lots = toNumber(fields.lots)
  const buyPrice = toNumber(fields.buyPrice)
  const sellPrice = toNumber(fields.sellPrice)
  const dividendSen = fields.dividendSen.trim() === '' ? 0 : toNumber(fields.dividendSen)

  if (lots === null || !Number.isInteger(lots) || lots <= 0) return null
  if (buyPrice === null || buyPrice <= 0) return null
  if (sellPrice === null || sellPrice < 0) return null
  if (dividendSen === null || dividendSen < 0) return null
  return { lots, buyPrice, sellPrice, dividendSen }
}

/** Gross figures in RM: excludes brokerage, clearing fees and stamp duty. */
export function calculateInvestment(input: InvestmentInput): InvestmentResult {
  const shares = input.lots * SHARES_PER_LOT
  const cost = shares * input.buyPrice
  const value = shares * input.sellPrice
  const dividends = (shares * input.dividendSen) / SEN_PER_RINGGIT
  const gain = value + dividends - cost
  return { shares, cost, value, dividends, gain, returnPct: (gain / cost) * 100 }
}
