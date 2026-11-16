import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../../../../App'
import { irPath } from '../../../../content/ir-nav'
import { SC_EXPOSURE_URL } from '../../content/prospectus'

function renderPage(page: string) {
  return render(
    <MemoryRouter initialEntries={[irPath('financial-info', page)]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

const tabLabels = (): string[] => screen.getAllByRole('tab').map((tab) => tab.textContent ?? '')

const rowOf = (table: HTMLElement, name: RegExp | string): HTMLElement =>
  within(table).getByRole('row', { name: typeof name === 'string' ? new RegExp(`^${name}`) : name })

describe('Financial Info pages', () => {
  it.each([
    ['highlights', 'Financial Highlights'],
    ['performance', 'Financial Performance'],
    ['statements', 'Financial Statements'],
    ['segmental-analysis', 'Segmental Analysis'],
  ])('renders %s with its page title', (page, title) => {
    renderPage(page)
    expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument()
    expect(screen.getAllByText(/Source: Draft prospectus/).length).toBeGreaterThan(0)
  })
})

describe('Financial Highlights', () => {
  it('shows a chart per metric, switching with the tabs', async () => {
    const user = userEvent.setup()
    renderPage('highlights')

    expect(screen.getByRole('button', { name: 'Annual' })).toHaveAttribute('aria-pressed', 'true')
    const sections = screen.getByRole('tablist', { name: 'Financial Highlights' })
    expect(within(sections).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Key figures',
      'Three-year summary',
      'Latest year',
    ])
    expect(screen.getAllByRole('tab')).toHaveLength(8)
    expect(screen.getByRole('img', { name: /^Revenue \(RM million\): FY2023 137\.9, FY2024 160\.7, FY2025 175\.3$/ })).toBeVisible()
    expect(screen.queryByRole('img', { name: /^Gross profit \(RM million\)/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Gross profit' }))

    expect(screen.getByRole('tab', { name: 'Gross profit' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('img', { name: /^Gross profit \(RM million\): FY2023 48\.9/ })).toBeInTheDocument()
  })

  it('shows the three-year table with margins and EPS, and the latest year’s key figures', async () => {
    const user = userEvent.setup()
    renderPage('highlights')
    expect(screen.queryByRole('table', { name: 'Financial highlights, FY2023–FY2025' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Three-year summary' }))
    const table = screen.getByRole('table', { name: 'Financial highlights, FY2023–FY2025' })
    expect(rowOf(table, 'Revenue')).toHaveTextContent('137,865160,691175,323')
    expect(rowOf(table, 'Gross profit margin')).toHaveTextContent('35.539.546.8')
    expect(rowOf(table, 'Earnings per share')).toHaveTextContent('2.03.76.9')

    await user.click(screen.getByRole('tab', { name: 'Latest year' }))
    const stats = screen.getByLabelText('FY2025 key figures')
    expect(stats).toBeVisible()
    expect(within(stats).getByText('RM175.3m')).toBeInTheDocument()
    expect(within(stats).getByText('+9.1% on FY2024')).toBeInTheDocument()
  })

  it('switches to the quarterly view, which is empty until listing', async () => {
    const user = userEvent.setup()
    renderPage('highlights')

    await user.click(screen.getByRole('button', { name: 'Quarterly' }))

    expect(screen.getByRole('button', { name: 'Quarterly' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Quarterly results start after listing')).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Quarterly results' })
    for (const quarter of ['Q1', 'Q2', 'Q3', 'Q4']) {
      expect(within(table).getByRole('columnheader', { name: quarter })).toBeInTheDocument()
    }
    expect(within(table).getByText(/No quarterly results yet/)).toBeInTheDocument()
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })
})

describe('Financial Performance', () => {
  it('shows computed year-on-year growth and compound growth', () => {
    renderPage('performance')
    expect(tabLabels()).toEqual(['Year-on-year growth', 'Margin trend', 'Commentary'])
    const table = screen.getByRole('table', { name: 'Year-on-year growth, FY2023–FY2025' })
    expect(within(table).getByRole('columnheader', { name: 'FY2025 vs FY2024' })).toBeInTheDocument()
    expect(rowOf(table, 'Revenue')).toHaveTextContent('+16.6%+9.1%+12.8%')
    expect(rowOf(table, 'Profit after tax')).toHaveTextContent('+80.2%+87.6%+83.8%')
  })

  it('charts the margin chosen in the select', async () => {
    const user = userEvent.setup()
    renderPage('performance')
    expect(screen.queryByRole('img', { name: /^Gross profit margin \(%\)/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Margin trend' }))
    expect(screen.getByRole('img', { name: 'Gross profit margin (%): FY2023 35.5%, FY2024 39.5%, FY2025 46.8%' })).toBeVisible()

    await user.selectOptions(screen.getByLabelText('Margin'), 'PAT margin')

    expect(screen.getByRole('img', { name: 'PAT margin (%): FY2023 6.7%, FY2024 10.3%, FY2025 17.7%' })).toBeInTheDocument()
    const ratios = screen.getByRole('table', { name: 'Margins and effective tax rate, FY2023–FY2025' })
    expect(rowOf(ratios, 'Effective tax rate')).toHaveTextContent('23.6%25.7%25.4%+1.8 pts')
  })

  it('writes the commentary from the computed figures', async () => {
    const user = userEvent.setup()
    renderPage('performance')
    await user.click(screen.getByRole('tab', { name: 'Commentary' }))
    expect(screen.getByText('Gross profit margin widened from 35.5% in FY2023 to 46.8% in FY2025 (+11.3 pts).')).toBeInTheDocument()
  })
})

describe('Financial Statements', () => {
  it('shows the income statement, with derived lines in brackets', () => {
    renderPage('statements')
    expect(tabLabels()).toEqual(['Statements', 'Source documents'])
    expect(screen.getByRole('button', { name: 'Income statement' })).toHaveAttribute('aria-pressed', 'true')
    const table = screen.getByRole('table', { name: 'Income statement, FY2023–FY2025' })
    expect(rowOf(table, 'Cost of sales')).toHaveTextContent('(88,951)(97,154)(93,337)')
    expect(rowOf(table, 'Profit after tax')).toHaveTextContent('9,18316,54431,032')
  })

  it('switches to the financial position and cash flow layouts, with placeholder values', async () => {
    const user = userEvent.setup()
    renderPage('statements')

    await user.click(screen.getByRole('button', { name: 'Financial position' }))
    const position = screen.getByRole('table', { name: 'Statement of financial position, FY2023–FY2025' })
    expect(within(rowOf(position, 'Total assets')).getAllByText('per accountants’ report')).toHaveLength(3)
    expect(screen.queryByRole('table', { name: /Income statement/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cash flows' }))
    const cashFlows = screen.getByRole('table', { name: 'Statement of cash flows, FY2023–FY2025' })
    expect(rowOf(cashFlows, 'Profit before tax')).toHaveTextContent('12,02222,25341,572')
  })

  it('links to the accountants’ report on the SC exposure page', async () => {
    const user = userEvent.setup()
    renderPage('statements')
    expect(screen.queryByRole('link', { name: /Read the accountants’ report/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Source documents' }))
    const link = screen.getByRole('link', { name: /Read the accountants’ report in the draft prospectus/ })
    expect(link).toHaveAttribute('href', SC_EXPOSURE_URL)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('Segmental Analysis', () => {
  it('shows the latest year’s segment mix, without the breakdown line', () => {
    renderPage('segmental-analysis')
    expect(tabLabels()).toEqual(['Revenue mix', 'Segment revenue', 'By market'])
    expect(screen.getByLabelText('Financial year')).toHaveValue('FY2025')
    const donut = screen.getByRole('img', { name: /^Revenue by business segment, FY2025:/ })
    expect(donut).toHaveAccessibleName(/Food premixes 81\.8%, Food ingredients 14\.4%/)
    expect(donut.getAttribute('aria-label')).not.toMatch(/of which/)
    expect(screen.getByText('RM175.3m')).toBeInTheDocument()
  })

  it('redraws the donut for the financial year chosen', async () => {
    const user = userEvent.setup()
    renderPage('segmental-analysis')

    await user.selectOptions(screen.getByLabelText('Financial year'), 'FY2023')

    expect(screen.getByRole('img', { name: /^Revenue by business segment, FY2023: Food premixes 75\.7%/ })).toBeInTheDocument()
    expect(screen.getByText('RM137.9m')).toBeInTheDocument()
  })

  it('tables revenue and shares by segment and by market', async () => {
    const user = userEvent.setup()
    renderPage('segmental-analysis')
    expect(screen.queryByRole('table', { name: /^Revenue by market/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Segment revenue' }))
    const segments = screen.getByRole('table', { name: 'Revenue by business segment, FY2023–FY2025' })
    expect(rowOf(segments, 'Total revenue')).toHaveTextContent('137,865100.0%160,691100.0%175,323100.0%')
    expect(rowOf(segments, 'Food premixes')).toHaveTextContent('104,37875.7%')

    await user.click(screen.getByRole('tab', { name: 'By market' }))
    const markets = screen.getByRole('table', { name: 'Revenue by market, FY2023–FY2025' })
    expect(rowOf(markets, 'Domestic')).toHaveTextContent('96.5%97.3%96.8%')
    expect(rowOf(markets, 'Foreign')).toHaveTextContent('3.5%2.7%3.2%')
  })
})
