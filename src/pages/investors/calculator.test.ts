import { describe, expect, it } from 'vitest'
import { calculateInvestment, parseCalculatorInput, type CalculatorFields } from './calculator'

const FIELDS: CalculatorFields = { lots: '10', buyPrice: '0.80', sellPrice: '1.00', dividendSen: '2' }

describe('parseCalculatorInput', () => {
  it('parses valid fields into numbers', () => {
    expect(parseCalculatorInput(FIELDS)).toEqual({ lots: 10, buyPrice: 0.8, sellPrice: 1, dividendSen: 2 })
  })

  it('treats a blank dividend as zero', () => {
    expect(parseCalculatorInput({ ...FIELDS, dividendSen: '  ' })).toMatchObject({ dividendSen: 0 })
  })

  it('returns null when lots are not a whole number above zero', () => {
    expect(parseCalculatorInput({ ...FIELDS, lots: '0' })).toBeNull()
    expect(parseCalculatorInput({ ...FIELDS, lots: '2.5' })).toBeNull()
    expect(parseCalculatorInput({ ...FIELDS, lots: '' })).toBeNull()
  })

  it('returns null for missing, negative or non-numeric prices', () => {
    expect(parseCalculatorInput({ ...FIELDS, buyPrice: '' })).toBeNull()
    expect(parseCalculatorInput({ ...FIELDS, sellPrice: '-1' })).toBeNull()
    expect(parseCalculatorInput({ ...FIELDS, buyPrice: 'abc' })).toBeNull()
    expect(parseCalculatorInput({ ...FIELDS, dividendSen: '-3' })).toBeNull()
  })
})

describe('calculateInvestment', () => {
  it('works out cost, value, dividends, gain and return for whole lots of 100 shares', () => {
    const result = calculateInvestment({ lots: 10, buyPrice: 0.8, sellPrice: 1, dividendSen: 2 })
    expect(result.shares).toBe(1000)
    expect(result.cost).toBeCloseTo(800)
    expect(result.value).toBeCloseTo(1000)
    expect(result.dividends).toBeCloseTo(20)
    expect(result.gain).toBeCloseTo(220)
    expect(result.returnPct).toBeCloseTo(27.5)
  })

  it('reports a loss as a negative gain and return', () => {
    const result = calculateInvestment({ lots: 1, buyPrice: 2, sellPrice: 1.5, dividendSen: 0 })
    expect(result.gain).toBeCloseTo(-50)
    expect(result.returnPct).toBeCloseTo(-25)
  })
})
