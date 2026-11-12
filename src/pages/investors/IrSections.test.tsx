import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { ROUTES } from '../../content/site'

function renderPage() {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[ROUTES.investors]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user }
}

const region = (name: string | RegExp) => screen.getByRole('region', { name })
const panelOf = (scope: HTMLElement) => within(scope).getByRole('tabpanel')

describe('Investor Relations: sections matching a full Bursa IR site', () => {
  it('groups the sub-nav like a listed company’s IR menu', () => {
    renderPage()
    const nav = screen.getByRole('navigation', { name: 'On this page' })
    expect(within(nav).getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Overview',
      'Corporate Info',
      'IPO Centre',
      'Governance',
      'Financials',
      'Stock Info',
      'News Centre',
      'Reports',
      'Resources',
      'IR Contact',
    ])
  })

  it('links the IR home highlights to the news centre and investor resources', () => {
    renderPage()
    const highlights = screen.getByRole('list', { name: 'IR highlights' })
    const hrefs = within(highlights)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(['#news', '#resources', '#ir-alerts'])
  })

  it('shows corporate general information, structure and statements', async () => {
    const { user } = renderPage()
    const corporate = region('Corporate information.')
    expect(within(corporate).getByRole('tab', { name: 'General information' })).toHaveAttribute('aria-selected', 'true')
    expect(within(panelOf(corporate)).getByText('RHB Investment Bank Berhad')).toBeInTheDocument()
    expect(within(panelOf(corporate)).getByText('Boardroom Share Registrars Sdn Bhd')).toBeInTheDocument()
    expect(within(panelOf(corporate)).getByText('Assigned at listing')).toHaveClass('ph')

    await user.click(within(corporate).getByRole('tab', { name: 'Corporate structure' }))
    ;['Food premixes', 'Food ingredients', 'Food processing & production equipment', 'Spare parts & maintenance services'].forEach(
      (activity) => expect(within(panelOf(corporate)).getByText(activity)).toBeInTheDocument(),
    )

    await user.click(within(corporate).getByRole('tab', { name: 'Chairman’s statement & MD&A' }))
    expect(panelOf(corporate)).toHaveTextContent(/first annual report/)
  })

  it('adds competitive advantages and abbreviations to the IPO centre', () => {
    renderPage()
    const ipo = region('Structure & use of proceeds.')
    const advantages = within(ipo).getByRole('list', { name: 'Competitive advantages' })
    expect(within(advantages).getAllByRole('listitem')).toHaveLength(5)
    expect(within(ipo).getByText('Securities Commission Malaysia')).toBeInTheDocument()
    expect(within(ipo).getByRole('link', { name: /Read the full disclaimer/ })).toHaveAttribute('href', '#ir-disclaimer')
  })

  it('lists governance policies and the shareholder meetings area', () => {
    renderPage()
    const governance = region('Governance & meetings.')
    const policies = within(governance).getByRole('list', { name: 'Policy disclosures' })
    ;['Constitution', 'Board Charter', 'Whistleblowing Policy', 'Anti-Bribery & Corruption Policy'].forEach((title) =>
      expect(within(policies).getByText(title)).toBeInTheDocument(),
    )
    expect(within(governance).getByRole('heading', { name: 'Shareholder meetings' })).toBeInTheDocument()
    expect(within(governance).getByText(/first annual general meeting/i)).toBeInTheDocument()
  })

  it('shows the multi-year highlights table with unconfirmed years as placeholders', async () => {
    const { user } = renderPage()
    const financials = region('Growing, profitably.')
    const table = within(financials).getByRole('table', { name: /Financial highlights/ })
    expect(within(table).getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual([
      'RM million',
      'FY2022',
      'FY2023',
      'FY2024',
      'FY2025',
    ])
    const revenue = within(table).getByRole('row', { name: /^Revenue/ })
    expect(within(revenue).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['TBA', 'TBA', '160.69', '175.32'])
    expect(within(revenue).getAllByText('TBA')[0]).toHaveClass('ph')

    await user.click(within(financials).getByRole('tab', { name: 'Segmental analysis' }))
    expect(within(panelOf(financials)).getAllByRole('listitem')).toHaveLength(4)

    await user.click(within(financials).getByRole('tab', { name: 'Financial statements' }))
    expect(within(panelOf(financials)).getByText('Accountants’ report FY2022–FY2025')).toBeInTheDocument()
  })

  it('shows a pre-listing price ticker and the entitlements policy', async () => {
    const { user } = renderPage()
    const stock = region('Stock information.')
    const ticker = panelOf(stock)
    expect(within(ticker).getByText('Main Market')).toBeInTheDocument()
    expect(within(ticker).getByText('450.0m')).toBeInTheDocument()
    expect(within(ticker).getByText('100')).toBeInTheDocument()

    await user.click(within(stock).getByRole('tab', { name: 'Entitlements' }))
    expect(panelOf(stock)).toHaveTextContent(/Up to 30%/)
    expect(within(panelOf(stock)).getByText('No entitlements declared yet.')).toBeInTheDocument()

    await user.click(within(stock).getByRole('tab', { name: 'Shareholdings' }))
    expect(within(panelOf(stock)).getByRole('link', { name: /post-IPO shareholding/ })).toHaveAttribute('href', '#shareholding')
  })

  it('has Bursa announcements, press releases and media news', async () => {
    const { user } = renderPage()
    const news = region('Announcements & news.')
    expect(panelOf(news)).toHaveTextContent(/from the listing date/)

    await user.click(within(news).getByRole('tab', { name: 'Press releases' }))
    const items = within(panelOf(news)).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('23 Oct 2026')

    await user.click(within(news).getByRole('tab', { name: 'Media news' }))
    expect(within(panelOf(news)).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('files reports under annual, quarterly, circulars, prospectus, analyst coverage and presentations', async () => {
    const { user } = renderPage()
    const reports = region('Reports & presentations.')
    expect(within(reports).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Annual reports',
      'Quarterly reports',
      'Circulars',
      'Prospectus',
      'Analyst coverage',
      'Presentations',
    ])
    await user.click(within(reports).getByRole('tab', { name: 'Prospectus' }))
    expect(within(panelOf(reports)).getByText('Prospectus: Initial Public Offering')).toBeInTheDocument()
  })

  it('moves between report tabs with the arrow, Home and End keys', async () => {
    const { user } = renderPage()
    const reports = region('Reports & presentations.')
    const first = within(reports).getByRole('tab', { name: 'Annual reports' })
    first.focus()

    await user.keyboard('{ArrowRight}')
    expect(within(reports).getByRole('tab', { name: 'Quarterly reports' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(within(reports).getByRole('tab', { name: 'Presentations' })).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{Home}')
    expect(first).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(within(reports).getByRole('tab', { name: 'Presentations' })).toHaveFocus()
  })

  it('lists corporate calendar events and the IR terms of use', () => {
    renderPage()
    const resources = region('Investor resources.')
    const calendar = within(resources).getByRole('list', { name: 'Corporate calendar' })
    expect(within(calendar).getByText('Financial year end')).toBeInTheDocument()
    expect(within(calendar).getByText('Listing on Bursa Malaysia Main Market')).toBeInTheDocument()
    expect(within(resources).getByText('IR website terms of use')).toBeInTheDocument()
  })

  it('validates and confirms a news alerts sign-up without a network request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { user } = renderPage()
    const alerts = within(region('Investor resources.')).getByRole('form', { name: 'News alerts sign-up' })

    await user.click(within(alerts).getByRole('button', { name: /Subscribe/ }))
    expect(within(alerts).getByText('Please enter your email address.')).toBeInTheDocument()
    expect(within(alerts).getByText('Please agree to the IR privacy notice.')).toBeInTheDocument()

    await user.type(within(alerts).getByRole('textbox', { name: 'Name' }), 'Aisyah')
    await user.type(within(alerts).getByRole('textbox', { name: 'Email' }), 'aisyah@example.com')
    await user.click(within(alerts).getByRole('checkbox'))
    await user.click(within(alerts).getByRole('button', { name: /Subscribe/ }))

    expect(screen.getByText(/You’re on the list/)).toHaveFocus()
    expect(fetchMock).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('calculates an investment return from lots and prices', async () => {
    const { user } = renderPage()
    const calculator = within(region('Investor resources.')).getByRole('form', { name: 'Investment calculator' })
    const output = within(calculator).getByRole('status')
    expect(output).toBeEmptyDOMElement()
    expect(within(calculator).getByText(/Enter the number of lots/)).toBeInTheDocument()

    await user.type(within(calculator).getByRole('spinbutton', { name: /Lots/ }), '10')
    await user.type(within(calculator).getByRole('spinbutton', { name: /Purchase price/ }), '0.80')
    await user.type(within(calculator).getByRole('spinbutton', { name: /Selling price/ }), '1.00')
    await user.type(within(calculator).getByRole('spinbutton', { name: /Dividends/ }), '2')

    expect(output).toHaveTextContent('1,000 shares')
    expect(output).toHaveTextContent('RM220.00')
    expect(output).toHaveTextContent('27.50%')
  })
})
