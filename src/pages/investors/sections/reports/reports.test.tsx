import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../../../App'
import { findPage, findSection, irPath } from '../../../../content/ir-nav'
import { SC_EXPOSURE_URL } from '../../content/prospectus'
import { ANNUAL_REPORT_DOCUMENTS, APPROVAL_COVERAGE } from './content'
import { deadlineAfter, formatDeadline } from './reporting'

const SECTION = 'reports'

function pageLabel(pageSlug: string): string {
  const section = findSection(SECTION)
  const label = section && findPage(section, pageSlug)?.label
  if (!label) throw new Error(`No reports page "${pageSlug}"`)
  return label
}

/** Renders a Reports & Presentations sub-page and returns its <article>. */
function renderPage(pageSlug: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[irPath(SECTION, pageSlug)]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  const name = pageLabel(pageSlug)
  expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
  return { user, page: screen.getByRole('article', { name }) }
}

/** The page's section tabs, named by the page title. */
function tabLabels(pageSlug: string): (string | null)[] {
  const tabList = screen.getByRole('tablist', { name: pageLabel(pageSlug) })
  return within(tabList)
    .getAllByRole('tab')
    .map((tab) => tab.textContent)
}

function bodyRows(table: HTMLElement): HTMLElement[] {
  return within(table).getAllByRole('row').slice(1)
}

describe('reporting deadlines', () => {
  it('counts months from the quarter end and flags the following year', () => {
    expect(formatDeadline(deadlineAfter(2, 2))).toBe('End of May')
    expect(formatDeadline(deadlineAfter(11, 2))).toBe('End of February (following year)')
  })
})

describe('Annual Reports', () => {
  it('shows the first annual report after listing with its four documents, all pending', () => {
    const { page } = renderPage('annual-reports')
    expect(tabLabels('annual-reports')).toEqual(['Annual reports', 'Audited figures'])
    expect(within(page).getByRole('note')).toHaveTextContent('No annual report published yet')
    expect(within(page).getByRole('note')).toHaveTextContent('by the end of April of the following year')

    const card = within(page).getByRole('article', { name: 'First annual report after listing' })
    expect(within(card).getByText('year to be confirmed')).toHaveClass('ph')
    const docs = within(card).getByRole('list', { name: 'Documents in this annual report' })
    const items = within(docs).getAllByRole('listitem')
    expect(items).toHaveLength(ANNUAL_REPORT_DOCUMENTS.length)
    ANNUAL_REPORT_DOCUMENTS.forEach((doc, index) => expect(items[index]).toHaveTextContent(doc.title))
    expect(within(docs).getAllByText('Not yet published')).toHaveLength(ANNUAL_REPORT_DOCUMENTS.length)
    expect(within(card).queryByRole('link')).toBeNull()
  })

  it('points to the audited figures in the prospectus until then', async () => {
    const { user, page } = renderPage('annual-reports')
    expect(within(page).queryByRole('region', { name: 'Audited figures before listing' })).not.toBeInTheDocument()
    await user.click(within(page).getByRole('tab', { name: 'Audited figures' }))
    expect(within(page).queryByRole('list', { name: 'Annual reports by financial year' })).not.toBeInTheDocument()
    const panel = within(page).getByRole('region', { name: 'Audited figures before listing' })
    expect(panel).toHaveTextContent('FY2023 to FY2025')
    expect(panel).toHaveTextContent('Baker Tilly Monteiro Heng PLT')
    expect(within(panel).getByRole('link', { name: 'Prospectus documents' })).toHaveAttribute('href', irPath('reports', 'prospectus'))
  })
})

describe('Quarterly Reports', () => {
  it('lists the four quarters of a 31 December year with empty values and pending reports', () => {
    const { page } = renderPage('quarterly-reports')
    expect(tabLabels('quarterly-reports')).toEqual(['Quarterly results', 'Announcement dates'])
    expect(within(page).getByRole('note')).toHaveTextContent('Results are published after listing')
    expect(within(page).getByLabelText('Financial year')).toHaveValue('first')

    const table = within(page).getByRole('table', { name: /Quarterly results: First financial year after listing/ })
    const headers = within(table).getAllByRole('columnheader').map((header) => header.textContent)
    expect(headers).toEqual([
      'Quarter',
      'Period ended',
      'Date announced',
      'Revenue (RM’000)',
      'Profit after tax (RM’000)',
      'EPS (sen)',
      'Report',
    ])
    const rows = bodyRows(table)
    expect(rows.map((row) => within(row).getAllByRole('cell')[0].textContent)).toEqual([
      '31 Mar (3 months)',
      '30 Jun (3 months)',
      '30 Sep (3 months)',
      '31 Dec (3 months)',
    ])
    expect(within(table).getAllByText('After listing')).toHaveLength(4)
    expect(within(rows[0]).getAllByText('—')).toHaveLength(4)
  })

  it('switches to cumulative year-to-date periods', async () => {
    const { user, page } = renderPage('quarterly-reports')
    const cumulative = within(page).getByRole('button', { name: 'Cumulative' })
    await user.click(cumulative)
    expect(cumulative).toHaveAttribute('aria-pressed', 'true')
    const table = within(page).getByRole('table', { name: /cumulative, year to date/ })
    expect(table).toHaveTextContent('30 Jun (6 months)')
    expect(table).toHaveTextContent('31 Dec (12 months)')
    expect(within(page).getByText(/Cumulative figures add up the quarters/)).toBeInTheDocument()

    await user.click(within(page).getByRole('button', { name: 'Individual' }))
    expect(within(page).getByRole('table', { name: /individual quarters/ })).toHaveTextContent('31 Dec (3 months)')
  })

  it('shows when each quarter’s results are due', async () => {
    const { user, page } = renderPage('quarterly-reports')
    expect(within(page).queryByRole('table', { name: 'Quarterly results announcement deadlines' })).not.toBeInTheDocument()
    await user.click(within(page).getByRole('tab', { name: 'Announcement dates' }))
    const table = within(page).getByRole('table', { name: 'Quarterly results announcement deadlines' })
    expect(bodyRows(table).map((row) => within(row).getAllByRole('cell')[1].textContent)).toEqual([
      'End of May',
      'End of August',
      'End of November',
      'End of February (following year)',
    ])
  })
})

describe('Circulars', () => {
  it('shows an empty document table that filters by category', async () => {
    const { user, page } = renderPage('circulars')
    expect(tabLabels('circulars')).toEqual(['Circulars & statements', 'What a circular covers'])
    expect(within(page).queryByRole('region', { name: 'What a circular can cover' })).not.toBeInTheDocument()
    const table = within(page).getByRole('table', { name: 'Circulars and statements to shareholders' })
    expect(table).toHaveTextContent('No circulars or statements to shareholders have been issued yet.')
    expect(within(page).getByRole('status')).toHaveTextContent('0 documents')

    await user.selectOptions(within(page).getByLabelText('Category'), 'statement')
    expect(table).toHaveTextContent('No statements to shareholders have been issued yet.')

    await user.click(within(page).getByRole('button', { name: 'Reset' }))
    expect(within(page).getByLabelText('Category')).toHaveValue('all')
    expect(within(page).getByRole('link', { name: 'Shareholders Meeting' })).toHaveAttribute(
      'href',
      irPath('governance', 'shareholders-meeting'),
    )

    await user.click(within(page).getByRole('tab', { name: 'What a circular covers' }))
    expect(within(page).getByRole('region', { name: 'What a circular can cover' })).toBeVisible()
    expect(within(page).queryByRole('table', { name: 'Circulars and statements to shareholders' })).not.toBeInTheDocument()
  })
})

describe('Prospectus', () => {
  it('links the exposure draft to the SC website without a download link', () => {
    const { page } = renderPage('prospectus')
    expect(tabLabels('prospectus')).toEqual(['Prospectus documents', 'Dates & parties'])
    const table = within(page).getByRole('table', { name: 'Prospectus documents' })
    const draftRow = within(table).getByRole('rowheader', { name: /Draft prospectus \(exposure draft\)/ }).closest('tr')
    expect(draftRow).toHaveTextContent('6 Jul 2026 (updated 2 Oct 2026)')
    const link = within(draftRow as HTMLElement).getByRole('link', { name: /View on SC website/ })
    expect(link).toHaveAttribute('href', SC_EXPOSURE_URL)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(within(table).queryByRole('link', { name: /Download/ })).toBeNull()
  })

  it('lists the registered prospectus as pending and the SC approval with its press coverage', () => {
    const { page } = renderPage('prospectus')
    const table = within(page).getByRole('table', { name: 'Prospectus documents' })
    const registered = within(table).getByRole('rowheader', { name: /Registered prospectus/ }).closest('tr') as HTMLElement
    expect(within(registered).getByText('TBA')).toHaveClass('ph')
    expect(within(registered).getByText('At launch')).toHaveClass('pending')

    const approval = within(table).getByRole('rowheader', { name: /SC approval/ }).closest('tr') as HTMLElement
    expect(approval).toHaveTextContent('23 Oct 2026')
    APPROVAL_COVERAGE.forEach((source) => expect(approval).toHaveTextContent(source))
    expect(within(approval).getByRole('link', { name: /Press coverage/ })).toHaveAttribute('href', irPath('news', 'media-news'))
    expect(within(page).getByRole('note')).toHaveTextContent('Read the registered prospectus before you invest')
  })
})

describe('Prospectus key dates', () => {
  it('lists the dates and parties under their own tab', async () => {
    const { user, page } = renderPage('prospectus')
    expect(within(page).queryByRole('region', { name: 'Key dates & parties' })).not.toBeInTheDocument()
    await user.click(within(page).getByRole('tab', { name: 'Dates & parties' }))
    const panel = within(page).getByRole('region', { name: 'Key dates & parties' })
    expect(panel).toBeVisible()
    expect(panel).toHaveTextContent('SC approval')
    expect(panel).toHaveTextContent('Registered prospectus')
  })
})

describe('Analyst Coverage', () => {
  it('shows the coverage table, its filter and an empty state', async () => {
    const { user, page } = renderPage('analyst-coverage')
    expect(tabLabels('analyst-coverage')).toEqual(['Coverage summary', 'Research reports'])
    expect(within(page).getByLabelText('Analyst coverage summary')).toHaveTextContent('None yet')
    expect(within(page).queryByRole('table', { name: 'Analyst research reports on Bestari Food Berhad' })).not.toBeInTheDocument()
    await user.click(within(page).getByRole('tab', { name: 'Research reports' }))
    const table = within(page).getByRole('table', { name: 'Analyst research reports on Bestari Food Berhad' })
    expect(within(table).getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Research house',
      'Analyst',
      'Date',
      'Recommendation',
      'Target price (RM)',
      'Report',
    ])
    expect(table).toHaveTextContent('No research house covers Bestari Food Berhad yet.')

    await user.selectOptions(within(page).getByLabelText('Recommendation'), 'buy')
    expect(within(page).getByLabelText('Recommendation')).toHaveValue('buy')
    expect(table).toHaveTextContent('No research house covers Bestari Food Berhad yet.')
    expect(within(page).getByRole('note')).toHaveTextContent('How coverage is listed')
  })
})

describe('Corporate Presentations', () => {
  it('lists the investor presentation as coming soon and no results briefings yet', async () => {
    const { user, page } = renderPage('presentations')
    expect(tabLabels('presentations')).toEqual(['Investor presentations', 'Results briefings'])
    const investor = within(page).getByRole('table', { name: 'Investor presentations' })
    expect(within(investor).getByRole('rowheader', { name: 'Investor presentation' })).toBeInTheDocument()
    expect(within(investor).getByText('Coming soon')).toBeInTheDocument()
    expect(within(page).queryByRole('table', { name: 'Results briefing presentations' })).not.toBeInTheDocument()
    await user.click(within(page).getByRole('tab', { name: 'Results briefings' }))
    expect(within(page).getByRole('table', { name: 'Results briefing presentations' })).toHaveTextContent(
      'No results briefings yet.',
    )
    expect(within(page).getByRole('link', { name: 'news alerts' })).toHaveAttribute('href', irPath('resources', 'news-alerts'))
  })
})
