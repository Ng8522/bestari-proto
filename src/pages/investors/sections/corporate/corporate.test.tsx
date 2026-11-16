import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../../../../App'
import { findPage, findSection, irPath } from '../../../../content/ir-nav'
import { DIRECTORS, INCOME_STATEMENT, KEY_MANAGEMENT, SUBSIDIARIES } from '../../content/prospectus'
import {
  activityGroupOf,
  boardComposition,
  boardStats,
  groupSubsidiaries,
  initials,
  structureOwners,
} from './content'
import { cagrPct, financialReviewRows, growthOf, segmentRows, segmentTotals } from './finance'

const SECTION = 'corporate-info'

function pageLabel(pageSlug: string): string {
  const section = findSection(SECTION)
  const page = section ? findPage(section, pageSlug) : undefined
  if (!page) throw new Error(`No IR page ${SECTION}/${pageSlug}`)
  return page.label
}

function renderPage(pageSlug: string): void {
  render(
    <MemoryRouter initialEntries={[irPath(SECTION, pageSlug)]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { level: 2, name: pageLabel(pageSlug) })).toBeInTheDocument()
}

describe('Corporate Info content', () => {
  it('works out the board composition from the directors', () => {
    expect(boardComposition(DIRECTORS)).toMatchObject({ total: 6, executive: 2, independent: 4, women: 2 })
    expect(boardComposition(DIRECTORS).averageAge).toBeCloseTo(52.5)
    const values = boardStats(DIRECTORS).map((stat) => stat.value)
    expect(values).toEqual(['6', '4 (66.7%)', '2 (33.3%)', '52.5 years'])
  })

  it('makes initials from the first and last word, ignoring an "@" alias', () => {
    expect(initials('Low Chin Ann @ Han Chin Ann')).toBe('LA')
    expect(initials('Badrulnizam Bin Bahaman')).toBe('BB')
    expect(initials('Cher')).toBe('C')
    expect(initials('   ')).toBe('')
  })

  it('puts every subsidiary in exactly one activity group', () => {
    const groups = groupSubsidiaries()
    expect(groups.map((group) => group.label)).toEqual([
      'Food premixes',
      'Ingredients, equipment & maintenance',
      'Management services',
    ])
    expect(groups.flatMap((group) => group.subsidiaries)).toHaveLength(SUBSIDIARIES.length)
    expect(activityGroupOf('Sale of food premixes')).toBe('premixes')
    expect(activityGroupOf('Management services')).toBe('services')
    expect(groupSubsidiaries([])).toEqual([])
  })

  it('shows the selling shareholder and the public as the holding company’s owners', () => {
    expect(structureOwners()).toEqual([
      expect.objectContaining({ label: 'Core Perpetual Sdn Bhd', percent: 70.4, isPublic: false }),
      expect.objectContaining({ label: 'Public shareholders', percent: 29.6, isPublic: true }),
    ])
  })

  it('computes growth, CAGR and segment totals that match reported revenue', () => {
    expect(growthOf([100, 110, 99])).toEqual([null, 10, -10])
    expect(cagrPct(100, 121, 2)).toBe(10)
    expect(segmentTotals()).toEqual(INCOME_STATEMENT.revenue)
    const revenueGrowth = financialReviewRows().find((row) => row.label === 'Revenue growth')
    expect(revenueGrowth?.cells).toEqual(['—', '16.6%', '9.1%'])
    expect(segmentRows('share').at(-1)?.cells).toEqual(['100.0%', '100.0%', '100.0%'])
  })
})

describe('Corporate Info pages', () => {
  it('General Information lists the corporate directory, the Group and its activities', () => {
    renderPage('general-information')
    const directory = screen.getByRole('region', { name: 'Corporate directory' })
    expect(within(directory).getByText('Company name')).toBeInTheDocument()
    expect(within(directory).getByText('Assigned at listing')).toHaveClass('ph')
    expect(within(directory).getByText('202501007201 (1608615-T)')).toBeInTheDocument()
    expect(within(directory).getByText('Lim Li Heong (MAICSA 7054716)')).toBeInTheDocument()
    expect(within(directory).getByText('Boardroom Share Registrars Sdn Bhd')).toBeInTheDocument()
    expect(within(directory).getByText('Per registered prospectus')).toHaveClass('ph')
    expect(within(directory).getByRole('link', { name: '+60 3-3122 5399' })).toHaveAttribute('href', 'tel:+60331225399')
    expect(within(directory).getByRole('link', { name: 'enquiry@bestarifood.com' })).toHaveAttribute(
      'href',
      'mailto:enquiry@bestarifood.com',
    )
    expect(screen.getByRole('heading', { level: 3, name: 'About the Group' })).toBeInTheDocument()
    expect(screen.getByText('Spare parts & maintenance services')).toBeInTheDocument()
  })

  it('Directors’ Profile shows the board composition and a card per director with a full profile', async () => {
    renderPage('directors-profile')
    const composition = screen.getByRole('region', { name: 'Board composition' })
    expect(within(composition).getByText('4 (66.7%)')).toBeInTheDocument()
    expect(within(composition).getByText('2 (33.3%)')).toBeInTheDocument()
    expect(within(composition).getByText('52.5 years')).toBeInTheDocument()

    const board = screen.getByRole('list', { name: 'Board of Directors' })
    expect(within(board).getAllByRole('article')).toHaveLength(DIRECTORS.length)
    const owCard = within(board).getByRole('article', { name: 'Ow Yin Yee' })
    expect(within(owCard).getByText('Chair, Audit and Risk Management Committee')).toBeInTheDocument()
    expect(within(owCard).getByText('Independent Non-Executive')).toBeInTheDocument()
    expect(within(owCard).getByText('Female')).toBeInTheDocument()
    expect(within(owCard).getByText('OY')).toBeInTheDocument()

    const summary = within(owCard).getByText('Full profile', { exact: false })
    const details = summary.closest('details')
    expect(details).not.toHaveAttribute('open')
    await userEvent.click(summary)
    expect(details).toHaveAttribute('open')
    expect(within(owCard).getByText('MBA, Universiti Malaya')).toBeInTheDocument()

    const mdCard = within(board).getByRole('article', { name: 'Lai Kok Siong' })
    expect(within(mdCard).getByText('Per registered prospectus')).toHaveClass('ph')
  })

  it('Key Management Team shows a card per manager and marks board members', () => {
    renderPage('key-management')
    const team = screen.getByRole('list', { name: 'Key senior management' })
    expect(within(team).getAllByRole('article')).toHaveLength(KEY_MANAGEMENT.length)
    const cfo = within(team).getByRole('article', { name: 'Fong Zhoon Zhien' })
    expect(within(cfo).getByText('Chief Financial Officer')).toBeInTheDocument()
    expect(within(cfo).getByText('CFO since Jul 2025')).toBeInTheDocument()
    expect(within(cfo).queryByText('Board member')).not.toBeInTheDocument()
    const md = within(team).getByRole('article', { name: 'Lai Kok Siong' })
    expect(within(md).getByText('Board member')).toBeInTheDocument()
  })

  it('Corporate Structure draws the org chart and lists every subsidiary', () => {
    renderPage('corporate-structure')
    const owners = screen.getByRole('list', { name: 'Shareholders after the IPO' })
    expect(within(owners).getByText('Core Perpetual Sdn Bhd')).toBeInTheDocument()
    expect(within(owners).getByText('70.4%')).toBeInTheDocument()
    const groups = screen.getByRole('list', { name: 'Subsidiaries by business activity' })
    expect(within(groups).getAllByRole('heading', { level: 4 })).toHaveLength(3)
    expect(within(groups).getAllByText('100%')).toHaveLength(SUBSIDIARIES.length)

    const table = screen.getByRole('table', { name: 'Subsidiaries of Bestari Food Berhad' })
    expect(within(table).getAllByRole('row')).toHaveLength(SUBSIDIARIES.length + 1)
    expect(within(table).getByRole('rowheader', { name: 'Synerchem (S)' })).toBeInTheDocument()
    expect(screen.getByRole('note')).toHaveTextContent(/once the pre-IPO acquisitions of the subsidiaries are completed/)
  })

  it('Chairman’s Statement shows the Chairman, the pending statement and the MD’s quote', () => {
    renderPage('chairmans-statement')
    expect(screen.getByRole('article', { name: 'Badrulnizam Bin Bahaman' })).toBeInTheDocument()
    expect(screen.getByText(/first annual report after listing/, { selector: '.notice div' })).toBeInTheDocument()
    const quote = screen.getByRole('heading', { level: 3, name: 'From the Managing Director' }).closest('section')
    expect(quote).not.toBeNull()
    expect(within(quote as HTMLElement).getByText(/stronger platform/)).toBeInTheDocument()
    expect(within(quote as HTMLElement).getByText('Managing Director, Bestari Food Berhad')).toBeInTheDocument()
    const archive = screen.getByRole('table', { name: 'Chairman’s statements by financial year' })
    expect(within(archive).getByText(/No statements yet/)).toBeInTheDocument()
  })

  it('Management Discussion & Analysis computes the review and switches segment units', async () => {
    renderPage('management-discussion')
    expect(screen.getByText('Prepared from the draft prospectus')).toBeInTheDocument()
    expect(screen.getByText('Revenue CAGR, FY2023–FY2025')).toBeInTheDocument()
    expect(screen.getByText('12.8%')).toBeInTheDocument()

    const review = screen.getByRole('table', { name: /Income statement highlights/ })
    const revenueRow = within(review).getByRole('row', { name: /Revenue \(RM’000\)/ })
    expect(within(revenueRow).getByText('175,323')).toBeInTheDocument()

    expect(screen.getByRole('table', { name: 'Revenue by business activity (RM’000)' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '% of revenue' }))
    expect(screen.getByRole('button', { name: '% of revenue' })).toHaveAttribute('aria-pressed', 'true')
    const shares = screen.getByRole('table', { name: /Revenue by business activity \(% of/ })
    expect(within(shares).getByRole('row', { name: /Total revenue/ })).toHaveTextContent('100.0%')

    expect(screen.getByRole('table', { name: /Revenue by market/ })).toHaveTextContent('Domestic (Malaysia)')
    expect(screen.getByText('Up to 30%')).toBeInTheDocument()
    expect(screen.getByText(/Bandar Industrial Zone, Banting/)).toBeInTheDocument()
  })
})
