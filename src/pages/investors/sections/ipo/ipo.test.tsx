import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from '../../../../App'
import { IR_BASE, irPath } from '../../../../content/ir-nav'
import { SC_EXPOSURE_URL } from '../../content/prospectus'
import { IPO_NOTICE_STORAGE_KEY, hasAgreedToIpoNotice, rememberIpoNoticeAgreement } from './consent'

function renderPage(page: string) {
  return render(
    <MemoryRouter initialEntries={[irPath('ipo-centre', page)]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

/** Renders a page as a visitor who agreed to the notice earlier in the session. */
function renderAgreed(page: string) {
  window.sessionStorage.setItem(IPO_NOTICE_STORAGE_KEY, 'agreed')
  return renderPage(page)
}

function blockStorage() {
  const blocked = () => {
    throw new DOMException('Storage is blocked', 'SecurityError')
  }
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked)
}

const tabLabels = (): string[] => screen.getAllByRole('tab').map((tab) => tab.textContent ?? '')

const rowOf = (table: HTMLElement, name: string): HTMLElement =>
  within(table).getByRole('row', { name: new RegExp(`^${name}`) })

beforeEach(() => {
  window.sessionStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('IPO Centre important notice', () => {
  it('hides the page until the visitor agrees, then shows it and remembers the choice', async () => {
    const user = userEvent.setup()
    renderPage('overview')

    expect(screen.getByRole('heading', { level: 2, name: 'IPO Overview' })).toBeInTheDocument()
    const notice = screen.getByRole('region', { name: 'Important notice' })
    expect(notice).toHaveTextContent(/does not constitute or form part of any offer or invitation to subscribe/)
    expect(notice).toHaveTextContent(/intended only for persons in Malaysia/)
    expect(notice).toHaveTextContent(/prospectus registered with the Securities Commission Malaysia/)
    expect(screen.queryByRole('heading', { name: 'IPO at a glance' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'I agree' }))

    expect(screen.queryByRole('region', { name: 'Important notice' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'IPO at a glance' })).toBeInTheDocument()
    expect(document.activeElement).toHaveClass('ipo-content')
    expect(window.sessionStorage.getItem(IPO_NOTICE_STORAGE_KEY)).toBe('agreed')
  })

  it('does not ask again on another IPO page in the same session', async () => {
    const user = userEvent.setup()
    renderPage('overview')
    await user.click(screen.getByRole('button', { name: 'I agree' }))

    await user.click(screen.getByRole('tab', { name: 'Approval & prospectus' }))
    const prospectus = screen.getByRole('region', { name: 'Prospectus' })
    await user.click(within(prospectus).getByRole('link', { name: 'How to apply' }))

    expect(screen.getByRole('heading', { level: 2, name: 'How to Apply' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'I agree' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Ways to apply' })).toBeInTheDocument()
  })

  it('links “I disagree” back to IR Home', async () => {
    const user = userEvent.setup()
    renderPage('timetable')
    const disagree = screen.getByRole('link', { name: 'I disagree' })
    expect(disagree).toHaveAttribute('href', IR_BASE)

    await user.click(disagree)

    expect(screen.getByRole('heading', { level: 1, name: 'Bestari Food Berhad is going public.' })).toBeInTheDocument()
  })

  it('still opens when browser storage is blocked', async () => {
    const user = userEvent.setup()
    blockStorage()
    renderPage('shareholding')

    await user.click(screen.getByRole('button', { name: 'I agree' }))

    expect(screen.getByRole('heading', { level: 3, name: 'Shareholding after the IPO' })).toBeInTheDocument()
  })

  it('treats blocked storage as not agreed, without throwing', () => {
    blockStorage()
    expect(() => rememberIpoNoticeAgreement()).not.toThrow()
    expect(hasAgreedToIpoNotice()).toBe(false)
  })
})

describe('IPO Centre pages', () => {
  it.each([
    ['overview', 'IPO Overview'],
    ['timetable', 'IPO Timetable'],
    ['use-of-proceeds', 'Utilisation of Proceeds'],
    ['shareholding', 'Shareholding Structure'],
    ['competitive-strengths', 'Competitive Strengths'],
    ['how-to-apply', 'How to Apply'],
  ])('renders %s behind the notice', (page, title) => {
    renderPage(page)
    expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'I agree' })).toBeInTheDocument()
  })

  it('shows the IPO overview one section per tab: key figures, offer, allocation, parties and prospectus link', async () => {
    const user = userEvent.setup()
    renderAgreed('overview')
    expect(screen.getByRole('tablist', { name: 'IPO Overview' })).toBeInTheDocument()
    expect(tabLabels()).toEqual(['At a glance', 'Offer & allocation', 'Key parties', 'Approval & prospectus'])

    const glance = screen.getByLabelText('IPO key figures')
    expect(glance).toBeVisible()
    expect(within(glance).getByText('Up to 133.32m')).toBeInTheDocument()
    expect(within(glance).getByText('RM 0.00 · TBA')).toHaveClass('ph')
    expect(screen.queryByRole('table', { name: 'Offer structure of the IPO' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Offer & allocation' }))
    const offer = screen.getByRole('table', { name: 'Offer structure of the IPO' })
    expect(offer).toBeVisible()
    expect(rowOf(offer, 'Public issue')).toHaveTextContent('77,070,300 new shares')
    expect(rowOf(offer, 'Offer for sale')).toHaveTextContent('Core Perpetual Sdn Bhd')
    expect(rowOf(offer, 'Enlarged share capital')).toHaveTextContent('450,000,000 shares')
    expect(screen.getByRole('img', { name: /^Allocation of IPO shares: Institutional up to 100\.0m/ })).toBeVisible()

    await user.click(screen.getByRole('tab', { name: 'Key parties' }))
    expect(screen.getByText('RHB Investment Bank Berhad')).toBeVisible()
    expect(screen.getByText('Malaysian Issuing House Sdn Bhd')).toBeVisible()

    await user.click(screen.getByRole('tab', { name: 'Approval & prospectus' }))
    expect(screen.getByText(/within six months of the SC’s approval on 23 Oct 2026/)).toBeVisible()
    const link = screen.getByRole('link', { name: /Read the draft prospectus/ })
    expect(link).toHaveAttribute('href', SC_EXPOSURE_URL)
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows the timetable with dates and status, and the stages under their own tab', async () => {
    const user = userEvent.setup()
    renderAgreed('timetable')
    expect(tabLabels()).toEqual(['Timetable', 'Stages'])
    const table = screen.getByRole('table', { name: 'Indicative IPO timetable' })
    expect(within(table).getAllByRole('row')).toHaveLength(6)
    expect(rowOf(table, 'SC approval')).toHaveTextContent('23 Oct 2026Done')
    expect(rowOf(table, 'Listing on Bursa Malaysia')).toHaveTextContent('TBAUpcoming')
    expect(screen.getByText('2 of 5')).toBeInTheDocument()
    expect(screen.getByText('Six-month approval window')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'What happens at each stage' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Stages' }))
    expect(screen.getByRole('region', { name: 'What happens at each stage' })).toBeVisible()
  })

  it('shows the use of proceeds with timeframes, and amounts left blank as in the draft', async () => {
    const user = userEvent.setup()
    renderAgreed('use-of-proceeds')
    expect(tabLabels()).toEqual(['Utilisation', 'Facility & offer', 'Status'])
    const table = screen.getByRole('table', { name: 'Planned utilisation of the public issue proceeds' })
    expect(rowOf(table, '01 New production facility')).toHaveTextContent('Within 36 months')
    expect(rowOf(table, '04 Listing expenses')).toHaveTextContent('Within 1 month')
    expect(within(table).getAllByText('RM[●]')).toHaveLength(5)
    expect(screen.queryByRole('table', { name: 'Status of utilisation of proceeds' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Facility & offer' }))
    expect(screen.getByRole('region', { name: 'Offer for sale' })).toBeVisible()

    await user.click(screen.getByRole('tab', { name: 'Status' }))
    expect(screen.getByRole('table', { name: 'Status of utilisation of proceeds' })).toBeVisible()
  })

  it('shows the shareholding after the IPO and the owners of Core Perpetual', async () => {
    const user = userEvent.setup()
    renderAgreed('shareholding')
    expect(tabLabels()).toEqual(['After the IPO', 'Selling shareholder'])
    expect(screen.getByRole('img', { name: /^Shareholding after the IPO: Core Perpetual Sdn Bhd 70\.4%/ })).toBeInTheDocument()
    const holdings = screen.getByRole('table', { name: 'Shareholding after the IPO' })
    expect(rowOf(holdings, 'Total')).toHaveTextContent('100.0')

    expect(screen.queryByRole('table', { name: 'Shareholders of Core Perpetual Sdn Bhd' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Selling shareholder' }))
    const owners = screen.getByRole('table', { name: 'Shareholders of Core Perpetual Sdn Bhd' })
    expect(rowOf(owners, 'Lai Kok Siong')).toHaveTextContent('Managing Director40')
    expect(rowOf(owners, 'Lew Tai @ Kong Lew Tai')).toHaveTextContent('—30')
  })

  it('shows the competitive strengths, business model and growth plans', async () => {
    const user = userEvent.setup()
    renderAgreed('competitive-strengths')
    expect(tabLabels()).toEqual(['Strengths', 'Business model', 'Growth plans'])
    const strengths = screen.getByRole('region', { name: 'Our competitive strengths' })
    expect(within(strengths).getAllByRole('listitem')).toHaveLength(5)
    expect(within(strengths).getByRole('heading', { name: 'Category-leading flagship' })).toBeInTheDocument()

    expect(screen.queryByRole('region', { name: 'Growth plans' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Business model' }))
    expect(screen.getByRole('heading', { level: 4, name: 'Commercial' })).toBeVisible()
    const sell = screen.getByRole('region', { name: 'What we sell' })
    expect(within(sell).getByText('81.8%')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Growth plans' }))
    expect(screen.getByRole('region', { name: 'Growth plans' })).toHaveTextContent('New production facility Within 36 months')
  })

  it('explains how to apply, with an FAQ that opens on click', async () => {
    const user = userEvent.setup()
    renderAgreed('how-to-apply')
    expect(tabLabels()).toEqual(['Ways to apply', 'Before you apply', 'FAQ'])
    expect(screen.getByText('See the registered prospectus for the exact procedures and dates.')).toBeInTheDocument()
    for (const channel of ['Electronic Share Application', 'Internet Share Application', 'Application forms']) {
      expect(screen.getByRole('heading', { level: 4, name: channel })).toBeInTheDocument()
    }

    expect(screen.queryByRole('region', { name: 'Before you apply' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Before you apply' }))
    expect(screen.getByRole('region', { name: 'Before you apply' })).toBeVisible()

    await user.click(screen.getByRole('tab', { name: 'FAQ' }))
    const question = screen.getByText('What is the minimum application?')
    const details = question.closest('details')
    expect(details).not.toHaveAttribute('open')

    await user.click(question)

    expect(details).toHaveAttribute('open')
    expect(details).toHaveTextContent(/board lots of 100/)
  })
})
