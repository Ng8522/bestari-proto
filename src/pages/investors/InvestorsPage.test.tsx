import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { ROUTES } from '../../content/site'
import { SECTIONS, SECTION_IDS } from './data'

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

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Investor Relations page', () => {
  it('shows the hero heading and sets the document title', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Bestari Food Berhad is going public.' })).toBeInTheDocument()
    expect(screen.getByText('Main Market · Bursa Malaysia')).toBeInTheDocument()
    expect(screen.getByText('SC approved · 23 Oct 2026')).toBeInTheDocument()
    expect(document.title).toBe('Investor Relations | Bestari Food Berhad')
  })

  it('lists the IPO at a glance figures, with price and listing date still placeholders', () => {
    renderPage()
    const glance = region('IPO at a glance')
    ;['Up to 133.32m', '450.0m shares', '77.07m shares', 'Up to 56.25m shares'].forEach((figure) =>
      expect(within(glance).getByText(figure)).toBeInTheDocument(),
    )
    expect(within(glance).getByText('RM 0.00 · TBA')).toHaveClass('ph')
    expect(within(glance).getByText('TBA')).toHaveClass('ph')
  })

  it('links the sub-nav to every section, and each section exists', () => {
    renderPage()
    const nav = screen.getByRole('navigation', { name: 'On this page' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(SECTION_IDS.map((id) => `#${id}`))
    SECTION_IDS.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument())
    expect(links.filter((link) => link.hasAttribute('aria-current'))).toHaveLength(1)
  })

  it('highlights the section whose top has scrolled above 200px', async () => {
    const tops: Record<string, number> = { overview: -1200, ipo: -400, financials: 150, shareholding: 900 }
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const top = tops[this.id] ?? 2000
      return { top, bottom: top + 500, left: 0, right: 0, width: 0, height: 500, x: 0, y: top, toJSON: () => ({}) }
    })
    renderPage()
    fireEvent.scroll(window)

    const nav = screen.getByRole('navigation', { name: 'On this page' })
    await waitFor(() =>
      expect(within(nav).getByRole('link', { name: 'Financials' })).toHaveAttribute('aria-current', 'location'),
    )
    SECTIONS.filter((section) => section.id !== 'financials').forEach((section) =>
      expect(within(nav).getByRole('link', { name: section.label })).not.toHaveAttribute('aria-current'),
    )
  })

  it('shows the IPO allocation, timetable and placeholder dates', () => {
    renderPage()
    const ipo = region('Structure & use of proceeds.')
    expect(within(ipo).getByRole('img', { name: /Institutional up to 100\.0m, Public 22\.5m, Pink ~10\.8m/ })).toBeInTheDocument()
    expect(within(ipo).getAllByText('Done')).toHaveLength(2)
    expect(within(ipo).getAllByText('Upcoming')).toHaveLength(3)
    within(ipo)
      .getAllByText('TBA')
      .forEach((date) => expect(date).toHaveClass('ph'))
    expect(within(ipo).getByText('add amounts & %')).toHaveClass('ph')
    expect(within(ipo).getAllByRole('heading', { level: 4 })).toHaveLength(4)
  })

  it('gives the financial chart a text alternative with FY2024 and FY2025 figures', () => {
    renderPage()
    const financials = region('Growing, profitably.')
    const table = within(financials).getByRole('table', { name: /Revenue and net profit/ })
    const [fy2024, fy2025] = within(table).getAllByRole('row').slice(1)
    expect(within(fy2024).getByRole('rowheader')).toHaveTextContent('FY2024')
    expect(within(fy2024).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['160.69', '16.54'])
    expect(within(fy2025).getByRole('rowheader')).toHaveTextContent('FY2025')
    expect(within(fy2025).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['175.32', '31.03'])

    expect(within(financials).getByText('RM175.3m')).toBeInTheDocument()
    expect(within(financials).getByText('Up 87.6% from RM16.5m in FY2024')).toBeInTheDocument()
    expect(within(financials).getByText('Up to 30%')).toBeInTheDocument()
  })

  it('grows the bars to their final heights (no IntersectionObserver in jsdom)', () => {
    renderPage()
    const heights = Array.from(document.querySelectorAll<HTMLElement>('.ir .chart-bar')).map((bar) => bar.style.height)
    expect(heights).toEqual(['91.6%', '9.4%', '100%', '17.7%'])
  })

  it('shows the post-IPO shareholding and the owners of Core Perpetual', () => {
    renderPage()
    const shareholding = region(/Core Perpetual Sdn Bhd 70\.4% · Public investors 29\.6%/)
    expect(within(shareholding).getByRole('img', { name: /Core Perpetual Sdn Bhd 70\.4%, Public investors 29\.6%/ })).toBeInTheDocument()
    const owners = within(shareholding).getAllByRole('listitem').map((item) => item.textContent)
    expect(owners).toEqual([
      '40%Lai Kok Siong',
      '30%Lew Tai @ Kong Lew Tai',
      '10%Gabriel Lai Yung-Yao',
      '10%Gary Lai Yung-Hui',
      '10%Lai Jia Maine',
    ])
  })

  it('keeps unconfirmed board titles and independent directors as placeholders', () => {
    renderPage()
    const board = region('Board & key senior management.')
    expect(within(board).getByRole('heading', { name: 'Lai Kok Siong' })).toBeInTheDocument()
    within(board)
      .getAllByText('Title per prospectus')
      .forEach((title) => expect(title).toHaveClass('ph'))
    const independents = within(board).getAllByText('Independent Director')
    expect(independents).toHaveLength(2)
    independents.forEach((name) => expect(name).toHaveClass('ph'))
  })

  it('switches document tabs on click', async () => {
    const { user } = renderPage()
    expect(screen.getByRole('tab', { name: 'IPO' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Prospectus: Initial Public Offering')

    await user.click(screen.getByRole('tab', { name: 'Financials' }))
    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveAccessibleName('Financials')
    expect(within(panel).getByText('Quarterly results')).toBeInTheDocument()
    expect(within(panel).getByText('Accountants’ report FY2022–FY2025')).toBeInTheDocument()
  })

  it('moves between document tabs with the arrow, Home and End keys', async () => {
    const { user } = renderPage()
    const ipoTab = screen.getByRole('tab', { name: 'IPO' })
    ipoTab.focus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Financials' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Financials' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Governance' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Whistleblowing Policy')

    await user.keyboard('{Home}')
    expect(ipoTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Governance' })).toHaveFocus()
  })

  it('lists the corporate directory and keeps the IR email a placeholder', () => {
    renderPage()
    expect(screen.getByText('RHB Investment Bank Berhad')).toBeInTheDocument()
    expect(screen.getByText('Boardroom Share Registrars Sdn Bhd')).toBeInTheDocument()
    expect(screen.getByText('ir@bestarifood.com')).toHaveClass('ph')
  })

  it('asks for a name and a valid email before sending an enquiry', async () => {
    const { user } = renderPage()
    await user.click(screen.getByRole('button', { name: /Send enquiry/ }))
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter your email address.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus()

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Aisyah')
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /Send enquiry/ }))

    const email = screen.getByRole('textbox', { name: 'Email' })
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription('Please enter a valid email address.')
    expect(email).toHaveFocus()
    expect(screen.queryByText('Thank you. Our IR team will be in touch.')).not.toBeInTheDocument()
  })

  it('shows the thank-you message on a valid submit without any network request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { user } = renderPage()

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Aisyah')
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'aisyah@example.com')
    await user.type(screen.getByRole('textbox', { name: 'Your enquiry' }), 'When is the listing?')
    await user.click(screen.getByRole('button', { name: /Send enquiry/ }))

    const thanks = screen.getByText('Thank you. Our IR team will be in touch.')
    expect(thanks).toHaveFocus()
    expect(screen.queryByRole('form', { name: 'Investor enquiry' })).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
