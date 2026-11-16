import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../../../App'
import { irPath } from '../../../../content/ir-nav'
import { DIVIDEND_POLICY } from '../../content/sections'
import { CORE_PERPETUAL_OWNERS } from '../../data'
import { distributionTotal, entitlementYears, filterEntitlements, filterPriceRows } from './calc'
import {
  COUNTER_INFO,
  FIVE_PERCENT_SHARES,
  HOLDING_BANDS,
  KEY_DATES,
  SHARES_IN_ISSUE,
  TRADING_SUMMARY,
  type DistributionRow,
  type Entitlement,
  type PriceRow,
} from './content'
import { dateRangeError, monthsBefore, rangeStart, todayIso } from './dates'
import { describeRange, formatIsoDate, formatPrice, formatSigned, orDash } from './format'

function renderPage(page: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[irPath('stock-info', page)]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user, main: within(screen.getByRole('article')) }
}

const columnNames = (table: HTMLElement): string[] =>
  within(table)
    .getAllByRole('columnheader')
    .map((header) => header.textContent ?? '')

describe('Stock Info › Price Ticker', () => {
  it('shows the full ticker card with dashes until trading starts', () => {
    const { main } = renderPage('price-ticker')

    expect(main.getByRole('heading', { level: 2, name: 'Price Ticker' })).toBeInTheDocument()
    expect(main.getByRole('heading', { level: 3, name: 'Bestari Food Berhad' })).toBeInTheDocument()
    expect(main.getByText('Last done (RM)')).toBeInTheDocument()
    expect(main.getByText('Change (RM / %)')).toBeInTheDocument()
    TRADING_SUMMARY.forEach((stat) => expect(main.getByText(stat.label)).toBeInTheDocument())
    expect(main.getByText(/trading starts on listing/)).toBeInTheDocument()
    expect(main.getByRole('note')).toHaveTextContent('Not trading yet')
  })

  it('lists the counter details, with unconfirmed codes as placeholders', () => {
    const { main } = renderPage('price-ticker')

    COUNTER_INFO.forEach((entry) => expect(main.getByText(entry.label)).toBeInTheDocument())
    expect(main.getByText('450,000,000')).toBeInTheDocument()
    expect(main.getByText('100 shares')).toBeInTheDocument()
    expect(main.getByText('Main Market')).toBeInTheDocument()
    const placeholders = main.getAllByText('Assigned at listing')
    expect(placeholders).toHaveLength(2)
    placeholders.forEach((node) => expect(node).toHaveClass('ph'))
  })
})

describe('Stock Info › Price & Volume', () => {
  it('shows the last month by default, with the full column set and an empty-state row', () => {
    const { main } = renderPage('price-volume')
    const today = todayIso()

    expect(main.getByRole('heading', { level: 2, name: 'Price & Volume' })).toBeInTheDocument()
    expect(main.getByLabelText('From')).toHaveValue(rangeStart('1M', today))
    expect(main.getByLabelText('To')).toHaveValue(today)
    expect(main.getByRole('button', { name: '1M' })).toHaveAttribute('aria-pressed', 'true')
    const table = main.getByRole('table', { name: 'Daily share price and volume' })
    expect(columnNames(table)).toEqual(['Date', 'Open', 'High', 'Low', 'Close', 'Change', '% Change', 'Volume'])
    expect(within(table).getByText('Daily prices start on the first trading day.')).toBeInTheDocument()
    expect(main.getByText(`0 trading days · ${describeRange(rangeStart('1M', today), today)}`)).toBeInTheDocument()
  })

  it('sets the dates from a quick range, and clears the quick range when a date is typed', async () => {
    const { user, main } = renderPage('price-volume')
    const today = todayIso()

    await user.click(main.getByRole('button', { name: '1Y' }))
    expect(main.getByLabelText('From')).toHaveValue(rangeStart('1Y', today))
    expect(main.getByRole('button', { name: '1Y' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.change(main.getByLabelText('From'), { target: { value: '2026-01-05' } })
    expect(main.queryAllByRole('button', { pressed: true })).toHaveLength(0)
    expect(main.getByText(`0 trading days · ${describeRange('2026-01-05', today)}`)).toBeInTheDocument()
  })

  it('flags a From date after the To date, and Reset goes back to the last month', async () => {
    const { user, main } = renderPage('price-volume')

    fireEvent.change(main.getByLabelText('From'), { target: { value: '2030-01-01' } })
    fireEvent.change(main.getByLabelText('To'), { target: { value: '2029-01-01' } })
    expect(main.getByRole('alert')).toHaveTextContent('The From date must be on or before the To date.')

    await user.click(main.getByRole('button', { name: 'Reset' }))
    expect(main.queryByRole('alert')).not.toBeInTheDocument()
    expect(main.getByLabelText('From')).toHaveValue(rangeStart('1M', todayIso()))
    expect(main.getByRole('button', { name: '1M' })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Stock Info › Interactive Stock Charts', () => {
  it('draws an empty chart frame for the past year by default', () => {
    const { main } = renderPage('stock-charts')
    const today = todayIso()

    expect(main.getByRole('heading', { level: 2, name: 'Interactive Stock Charts' })).toBeInTheDocument()
    expect(main.getByRole('heading', { level: 3, name: 'Closing price (RM)' })).toBeInTheDocument()
    expect(main.getByRole('img', { name: /Chart starts on the first trading day/ })).toBeInTheDocument()
    expect(main.getAllByText(describeRange(rangeStart('1Y', today), today)).length).toBeGreaterThan(0)
    expect(main.getByRole('note')).toHaveTextContent('Charts start on the first trading day')
  })

  it('switches the range and between price and volume', async () => {
    const { user, main } = renderPage('stock-charts')
    const today = todayIso()
    const ranges = main.getByRole('group', { name: 'Chart range' })
    const views = main.getByRole('group', { name: 'Chart view' })

    expect(within(ranges).getAllByRole('button').map((button) => button.textContent)).toEqual([
      '1M',
      '3M',
      '6M',
      'YTD',
      '1Y',
      'All',
    ])
    await user.click(within(views).getByRole('button', { name: 'Volume' }))
    expect(main.getByRole('heading', { level: 3, name: 'Daily volume traded' })).toBeInTheDocument()
    expect(within(views).getByRole('button', { name: 'Volume' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(within(ranges).getByRole('button', { name: 'YTD' }))
    expect(main.getByRole('img', { name: new RegExp(`${today.slice(0, 4)}`) })).toHaveAccessibleName(
      `Daily volume traded, ${describeRange(`${today.slice(0, 4)}-01-01`, today)}: Chart starts on the first trading day.`,
    )
    await user.click(within(ranges).getByRole('button', { name: 'All' }))
    expect(main.getAllByText('Since listing').length).toBeGreaterThan(0)
  })
})

describe('Stock Info › Distribution of Shareholdings', () => {
  it('lays out the Bursa size-of-holdings bands with a total row', () => {
    const { main } = renderPage('shareholdings-distribution')

    expect(main.getByRole('heading', { level: 2, name: 'Distribution of Shareholdings' })).toBeInTheDocument()
    expect(main.getByText('First record of depositors after listing')).toBeInTheDocument()
    const table = main.getByRole('table', { name: 'Distribution of shareholdings by size of holdings' })
    expect(columnNames(table)).toEqual(['Size of holdings', 'No. of holders', '% of holders', 'No. of shares', '% of shares'])
    HOLDING_BANDS.forEach((band) => expect(within(table).getByRole('rowheader', { name: band })).toBeInTheDocument())
    const total = within(table).getByRole('row', { name: /Total/ })
    expect(within(total).getAllByText('—')).toHaveLength(4)
    expect(main.getByText(/5% of issued shares is 22,500,000 shares/)).toBeInTheDocument()
  })

  it('shows the shareholding on listing and the shareholders of Core Perpetual', () => {
    const { main } = renderPage('shareholdings-distribution')

    expect(main.getByRole('img', { name: /Shareholding on listing: Core Perpetual Sdn Bhd 70.4%/ })).toBeInTheDocument()
    const owners = main.getByRole('table', { name: 'Shareholders of Core Perpetual Sdn Bhd' })
    CORE_PERPETUAL_OWNERS.forEach((owner) => {
      const row = within(owners).getByRole('row', { name: new RegExp(owner.name) })
      expect(row).toHaveTextContent(`${owner.percent}%`)
    })
  })
})

describe('Stock Info › Top 30 Shareholders', () => {
  it('shows the empty top-30 table and the substantial shareholder on listing', () => {
    const { main } = renderPage('top-30-shareholders')

    expect(main.getByRole('heading', { level: 2, name: 'Top 30 Shareholders' })).toBeInTheDocument()
    const table = main.getByRole('table', { name: 'Top 30 shareholders' })
    expect(columnNames(table)).toEqual(['No.', 'Name', 'No. of shares', '% of issued shares'])
    expect(within(table).getByText(/first record of depositors after listing/)).toBeInTheDocument()
    expect(main.getByRole('heading', { level: 3, name: 'Substantial shareholder on listing' })).toBeInTheDocument()
    expect(main.getByText('Core Perpetual Sdn Bhd')).toBeInTheDocument()
    expect(main.getByText('70.4%')).toBeInTheDocument()
    expect(main.getByText('316.8 million')).toBeInTheDocument()
    expect(main.getByRole('link', { name: 'Bursa Announcements' })).toHaveAttribute(
      'href',
      irPath('news', 'bursa-announcements'),
    )
  })
})

describe('Stock Info › Entitlements', () => {
  it('shows the dividend policy, the entitlement columns and the key dates', () => {
    const { main } = renderPage('entitlements')

    expect(main.getByRole('heading', { level: 2, name: 'Entitlements' })).toBeInTheDocument()
    expect(main.getByText(DIVIDEND_POLICY)).toBeInTheDocument()
    const table = main.getByRole('table', { name: 'Dividends and other entitlements' })
    expect(columnNames(table)).toEqual([
      'Announced',
      'Ex-date',
      'Entitlement date',
      'Payment date',
      'Type',
      'Details',
      'Rate',
    ])
    expect(within(table).getByText('No entitlements declared yet.')).toBeInTheDocument()
    KEY_DATES.forEach((entry) => expect(main.getByText(entry.meaning)).toBeInTheDocument())
  })

  it('filters by year and entitlement type, and resets', async () => {
    const { user, main } = renderPage('entitlements')
    const year = main.getByLabelText('Year')
    const type = main.getByLabelText('Entitlement type')

    expect(within(type).getAllByRole('option').map((option) => option.textContent)).toEqual([
      'All types',
      'Dividend',
      'Bonus issue',
      'Rights issue',
      'Share split',
    ])
    await user.selectOptions(year, todayIso().slice(0, 4))
    await user.selectOptions(type, 'rights')
    expect(year).toHaveValue(todayIso().slice(0, 4))
    expect(type).toHaveValue('rights')

    await user.click(main.getByRole('button', { name: 'Reset' }))
    expect(year).toHaveValue('all')
    expect(type).toHaveValue('all')
  })
})

describe('stock date helpers', () => {
  it('steps back whole months, clamping to the end of shorter months', () => {
    expect(monthsBefore('2026-03-31', 1)).toBe('2026-02-28')
    expect(monthsBefore('2024-03-31', 1)).toBe('2024-02-29')
    expect(monthsBefore('2026-01-15', 3)).toBe('2025-10-15')
    expect(monthsBefore('2026-11-16', 12)).toBe('2025-11-16')
  })

  it('works out where each range starts', () => {
    expect(rangeStart('6M', '2026-11-16')).toBe('2026-05-16')
    expect(rangeStart('YTD', '2026-11-16')).toBe('2026-01-01')
    expect(rangeStart('All', '2026-11-16')).toBe('')
    expect(todayIso(new Date(2026, 10, 6))).toBe('2026-11-06')
  })

  it('rejects a From date after the To date only when both are set', () => {
    expect(dateRangeError('2026-02-01', '2026-01-01')).toBeDefined()
    expect(dateRangeError('2026-01-01', '2026-01-01')).toBeUndefined()
    expect(dateRangeError('2026-02-01', '')).toBeUndefined()
  })

  it('formats dates, ranges and figures', () => {
    expect(formatIsoDate('2026-01-05')).toBe('5 Jan 2026')
    expect(formatIsoDate('TBA')).toBe('TBA')
    expect(describeRange('2026-01-05', '')).toBe('From 5 Jan 2026')
    expect(describeRange('', '2026-01-05')).toBe('Up to 5 Jan 2026')
    expect(describeRange('', '')).toBe('All dates')
    expect(formatPrice(0.5)).toBe('0.500')
    expect(formatSigned(0.015, 3)).toBe('+0.015')
    expect(formatSigned(-1.2, 2)).toBe('-1.20')
    expect(orDash(null, formatPrice)).toBe('—')
  })
})

describe('stock calculations', () => {
  const price = (isoDate: string): PriceRow => ({
    isoDate,
    open: 1,
    high: 1,
    low: 1,
    close: 1,
    change: 0,
    changePct: 0,
    volume: 100,
  })
  const entitlement = (id: string, announced: string, type: Entitlement['type']): Entitlement => ({
    id,
    announced,
    exDate: announced,
    entitlementDate: announced,
    paymentDate: announced,
    type,
    details: id,
    rate: '1 sen',
  })

  it('derives the share counts from the prospectus terms', () => {
    expect(SHARES_IN_ISSUE).toBe(450_000_000)
    expect(FIVE_PERCENT_SHARES).toBe(22_500_000)
  })

  it('keeps the trading days inside the range', () => {
    const rows = [price('2026-12-03'), price('2026-12-02'), price('2026-12-01')]
    expect(filterPriceRows(rows, '2026-12-02', '').map((row) => row.isoDate)).toEqual(['2026-12-03', '2026-12-02'])
    expect(filterPriceRows(rows, '', '')).toHaveLength(3)
  })

  it('filters entitlements by year and type, and offers each year once', () => {
    const rows = [entitlement('a', '2027-05-01', 'dividend'), entitlement('b', '2028-03-01', 'bonus')]
    expect(filterEntitlements(rows, { year: '2027', type: 'all' }).map((row) => row.id)).toEqual(['a'])
    expect(filterEntitlements(rows, { year: 'all', type: 'bonus' }).map((row) => row.id)).toEqual(['b'])
    expect(filterEntitlements(rows, { year: '2027', type: 'bonus' })).toHaveLength(0)
    expect(entitlementYears(rows, '2027')).toEqual(['2028', '2027'])
  })

  it('totals the distribution only when every figure is published', () => {
    const row = (holders: number | null): DistributionRow => ({
      band: 'x',
      holders,
      holdersPct: holders,
      shares: holders,
      sharesPct: holders,
    })
    expect(distributionTotal([row(1), row(2)])).toMatchObject({ band: 'Total', holders: 3, shares: 3 })
    expect(distributionTotal([row(1), row(null)]).holders).toBeNull()
  })
})
