import { describe, expect, it } from 'vitest'
import { INCOME_STATEMENT, SEGMENT_REVENUE } from '../../content/prospectus'
import { buildCommentary, describeAmount, describeRatio } from './commentary'
import { COST_OF_SALES, EFFECTIVE_TAX_RATES, TAXATION, YEARS, marginsOf } from './figures'
import {
  cagrPct,
  differenceSeries,
  formatGrowth,
  formatPct,
  formatPoints,
  formatRmMillion,
  formatThousands,
  growthPct,
  growthSeries,
  mainSegments,
  marginSeries,
  percentOf,
  pointChange,
  segmentShares,
  segmentTotal,
  toMillions,
} from './metrics'

const FY2023 = 0
const FY2025 = 2

describe('growth', () => {
  it('works out year-on-year growth to one decimal place', () => {
    expect(growthPct(175_323, 160_691)).toBe(9.1)
    expect(growthPct(80, 100)).toBe(-20)
  })

  it('returns null when there is no positive base year', () => {
    expect(growthPct(10, 0)).toBeNull()
    expect(growthPct(10, -5)).toBeNull()
  })

  it('leaves the first year of a series without growth', () => {
    expect(growthSeries(INCOME_STATEMENT.revenue)).toEqual([null, 16.6, 9.1])
    expect(growthSeries(INCOME_STATEMENT.pat)).toEqual([null, 80.2, 87.6])
  })

  it('works out the compound annual growth rate over the whole series', () => {
    expect(cagrPct([100, 110, 121])).toBe(10)
    expect(cagrPct(INCOME_STATEMENT.revenue)).toBe(12.8)
    expect(cagrPct(INCOME_STATEMENT.pat)).toBe(83.8)
  })

  it('has no compound growth rate for a single year or a non-positive start', () => {
    expect(cagrPct([5])).toBeNull()
    expect(cagrPct([0, 10])).toBeNull()
    expect(cagrPct([10, -1])).toBeNull()
  })
})

describe('margins and differences', () => {
  it('works out a part as a percentage of a whole', () => {
    expect(percentOf(81_986, 175_323)).toBe(46.8)
    expect(percentOf(1, 0)).toBe(0)
  })

  it('works out margins year by year', () => {
    expect(marginSeries(INCOME_STATEMENT.pat, INCOME_STATEMENT.revenue)).toEqual([6.7, 10.3, 17.7])
    expect(marginsOf('grossProfit')).toEqual([35.5, 39.5, 46.8])
    expect(marginsOf('ebitda')).toEqual([11.2, 16.8, 28.3])
  })

  it('works out cost of sales, taxation and the effective tax rate', () => {
    expect(differenceSeries([10, 20], [3, 5])).toEqual([7, 15])
    expect(COST_OF_SALES).toEqual([88_951, 97_154, 93_337])
    expect(TAXATION).toEqual([2_839, 5_709, 10_540])
    expect(EFFECTIVE_TAX_RATES).toEqual([23.6, 25.7, 25.4])
  })

  it('works out percentage-point changes without floating-point noise', () => {
    expect(pointChange(35.5, 46.8)).toBe(11.3)
    expect(pointChange(20, 15)).toBe(-5)
  })
})

describe('segment shares', () => {
  it('leaves out the breakdown lines inside a segment', () => {
    const names = mainSegments(SEGMENT_REVENUE).map((segment) => segment.name)
    expect(names).toEqual(['Food premixes', 'Food ingredients', 'Equipment', 'Other products & services'])
  })

  it('adds the segments up to the revenue in the income statement', () => {
    expect(YEARS.map((_, index) => segmentTotal(SEGMENT_REVENUE, index))).toEqual(INCOME_STATEMENT.revenue)
  })

  it('works out each segment’s share of the year’s revenue', () => {
    expect(segmentShares(SEGMENT_REVENUE, FY2025).map((share) => share.percent)).toEqual([81.8, 14.4, 2, 1.9])
    expect(segmentShares(SEGMENT_REVENUE, FY2023).map((share) => share.percent)).toEqual([75.7, 17.7, 4.6, 2])
  })

  it('gives shares that add up to 100% within rounding', () => {
    const sum = segmentShares(SEGMENT_REVENUE, FY2025).reduce((total, share) => total + share.percent, 0)
    expect(Math.abs(sum - 100)).toBeLessThanOrEqual(0.2)
  })
})

describe('formatting', () => {
  it('formats RM’000 amounts with separators and brackets for negatives', () => {
    expect(formatThousands(137_865)).toBe('137,865')
    expect(formatThousands(-88_951)).toBe('(88,951)')
  })

  it('formats RM million', () => {
    expect(toMillions(175_323)).toBe(175.323)
    expect(formatRmMillion(175_323)).toBe('RM175.3m')
  })

  it('formats percentages, growth and point changes with their signs', () => {
    expect(formatPct(46.8)).toBe('46.8%')
    expect(formatPct(null)).toBe('—')
    expect(formatGrowth(9.1)).toBe('+9.1%')
    expect(formatGrowth(-3)).toBe('−3.0%')
    expect(formatGrowth(0)).toBe('0.0%')
    expect(formatGrowth(null)).toBe('—')
    expect(formatPoints(11.3)).toBe('+11.3 pts')
  })
})

describe('commentary', () => {
  const years = ['FY1', 'FY2', 'FY3']

  it('describes growth in an amount from the numbers', () => {
    expect(describeAmount('Revenue', [100_000, 110_000, 121_000], years)).toBe(
      'Revenue grew from RM100.0m in FY1 to RM121.0m in FY3, a compound annual growth rate of +10.0%. Year on year, it changed by +10.0% in FY2 and +10.0% in FY3.',
    )
    expect(describeAmount('Profit', [200_000, 150_000], ['FY1', 'FY2'])).toContain('Profit fell from RM200.0m')
  })

  it('describes a ratio widening or narrowing', () => {
    expect(describeRatio('Margin', [20, 15], ['FY1', 'FY2'])).toBe('Margin narrowed from 20.0% in FY1 to 15.0% in FY2 (−5.0 pts).')
    expect(describeRatio('Margin', [15, 20], ['FY1', 'FY2'])).toContain('widened')
  })

  it('builds the commentary from the prospectus figures', () => {
    const commentary = buildCommentary()
    expect(commentary[0]).toContain('Revenue grew from RM137.9m in FY2023 to RM175.3m in FY2025')
    expect(commentary[0]).toContain('+12.8%')
    expect(commentary).toContain('Gross profit margin widened from 35.5% in FY2023 to 46.8% in FY2025 (+11.3 pts).')
    expect(commentary).toContain('The effective tax rate rose from 23.6% in FY2023 to 25.4% in FY2025 (+1.8 pts).')
    expect(commentary).toContain('Food premixes was the largest segment, at 75.7% of revenue in FY2023 and 81.8% in FY2025.')
  })
})
