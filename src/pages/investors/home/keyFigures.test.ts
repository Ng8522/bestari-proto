import { describe, expect, it } from 'vitest'
import { formatRmMillion, growthPct, latestYearStats, sharePct } from './keyFigures'

describe('key figures', () => {
  it('formats RM thousands as millions', () => {
    expect(formatRmMillion(175_323)).toBe('RM175.3m')
  })

  it('computes growth and shares to one decimal place', () => {
    expect(growthPct(175_323, 160_691)).toBe(9.1)
    expect(growthPct(90, 100)).toBe(-10)
    expect(sharePct(81_986, 175_323)).toBe(46.8)
  })

  it('compares the latest year with the one before', () => {
    const stats = latestYearStats()
    expect(stats.map((stat) => stat.value)).toEqual(['RM175.3m', 'RM31.0m', '46.8%', '6.9 sen'])
    expect(stats[0].detail).toBe('Up 9.1% on FY2024')
    expect(stats[2].detail).toBe('39.5% in FY2024')
  })
})
