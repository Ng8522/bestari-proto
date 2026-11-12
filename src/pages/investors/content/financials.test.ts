import { describe, expect, it } from 'vitest'
import { FINANCIAL_YEARS } from '../data'
import { HIGHLIGHT_YEAR_LABELS, buildHighlightRows } from './financials'

describe('buildHighlightRows', () => {
  const rows = buildHighlightRows(FINANCIAL_YEARS, HIGHLIGHT_YEAR_LABELS)
  const row = (label: string) => rows.find((candidate) => candidate.label === label)

  it('covers FY2022 to FY2025, the years in the accountants’ report', () => {
    expect(HIGHLIGHT_YEAR_LABELS).toEqual(['FY2022', 'FY2023', 'FY2024', 'FY2025'])
  })

  it('fills revenue and net profit only for the years with published figures', () => {
    expect(row('Revenue')?.values).toEqual([null, null, '160.69', '175.32'])
    expect(row('Net profit')?.values).toEqual([null, null, '16.54', '31.03'])
  })

  it('derives the net profit margin from revenue and net profit', () => {
    expect(row('Net profit margin (%)')?.values).toEqual([null, null, '10.3', '17.7'])
  })

  it('leaves figures not yet confirmed from the prospectus empty', () => {
    expect(row('Gross profit')?.values).toEqual([null, null, null, null])
    expect(row('Profit before tax')?.values).toEqual([null, null, null, null])
  })
})
