import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../../../App'
import { findPage, findSection, irPath } from '../../../../content/ir-nav'
import { ALERTS_THANK_YOU } from '../../content/sections'
import { TIMETABLE } from '../../data'
import { EMPTY_ALERTS, toggleType, validateAlerts } from './alerts'
import { CALENDAR_ROWS } from './calendar'
import { FAQ_ITEMS } from './faqContent'
import { PRIVACY_SECTION_ID, TERMS_SECTIONS } from './terms'

const SECTION = 'resources'

function pageLabel(pageSlug: string): string {
  const section = findSection(SECTION)
  const label = section && findPage(section, pageSlug)?.label
  if (!label) throw new Error(`No resources page "${pageSlug}"`)
  return label
}

/** Renders an Investor Resources sub-page and returns its <article>. */
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

describe('Corporate Calendar', () => {
  it('lists the IPO timetable and shareholder dates with status chips and placeholder dates', () => {
    const { page } = renderPage('corporate-calendar')
    expect(tabLabels('corporate-calendar')).toEqual(['Key dates', 'Regular dates'])
    expect(within(page).getByRole('note')).toHaveTextContent('More dates after listing')
    const table = within(page).getByRole('table', { name: 'Corporate calendar' })
    const rows = bodyRows(table)
    expect(rows).toHaveLength(CALENDAR_ROWS.length)
    TIMETABLE.forEach((milestone) => expect(table).toHaveTextContent(milestone.event))
    expect(table).toHaveTextContent('First annual general meeting')
    expect(table).toHaveTextContent('31 Dec, yearly')
    expect(within(table).getAllByText('Done')).toHaveLength(TIMETABLE.filter((m) => m.status === 'done').length)
    within(table)
      .getAllByText('TBA')
      .forEach((date) => expect(date).toHaveClass('ph'))
  })

  it('filters by year and status, and resets', async () => {
    const { user, page } = renderPage('corporate-calendar')
    const table = within(page).getByRole('table', { name: 'Corporate calendar' })
    const count = within(page).getByRole('status')

    await user.selectOptions(within(page).getByLabelText('Year'), '2026')
    expect(bodyRows(table).map((row) => within(row).getByRole('rowheader').textContent)).toEqual([
      'Draft prospectus lodged with SC',
      'SC approval & Shariah-compliant status',
      'Financial year end',
    ])

    await user.selectOptions(within(page).getByLabelText('Year'), 'tba')
    expect(count).toHaveTextContent('4 events')

    await user.selectOptions(within(page).getByLabelText('Status'), 'done')
    expect(table).toHaveTextContent('No events match these filters.')

    await user.click(within(page).getByRole('button', { name: 'Reset' }))
    expect(count).toHaveTextContent(`${CALENDAR_ROWS.length} events`)
  })

  it('shows the regular reporting dates counted from the 31 December year end', async () => {
    const { user, page } = renderPage('corporate-calendar')
    expect(within(page).queryByRole('table', { name: 'Regular reporting dates' })).not.toBeInTheDocument()
    await user.click(within(page).getByRole('tab', { name: 'Regular dates' }))
    const table = within(page).getByRole('table', { name: 'Regular reporting dates' })
    expect(table).toHaveTextContent('by the end of May, August, November, February')
    expect(table).toHaveTextContent('by the end of April')
    expect(table).toHaveTextContent('by the end of June')
  })
})

describe('news alerts validation', () => {
  it('needs a valid email, an alert type and consent', () => {
    expect(validateAlerts(EMPTY_ALERTS)).toEqual({
      email: 'Please enter your email address.',
      types: 'Please choose at least one type of alert.',
      consent: 'Please agree to receive emails from us.',
    })
    expect(validateAlerts({ ...EMPTY_ALERTS, email: 'not-an-email' }).email).toBe('Please enter a valid email address.')
    expect(validateAlerts({ name: '', email: 'a@b.co', types: ['press'], hasConsent: true })).toEqual({})
  })

  it('adds and removes alert types without changing the original list', () => {
    const original = ['press'] as const
    expect(toggleType(original, 'results', true)).toEqual(['press', 'results'])
    expect(toggleType(original, 'press', false)).toEqual([])
    expect(original).toEqual(['press'])
  })
})

describe('News Alerts', () => {
  it('shows every error and focuses the email field on an empty submit', async () => {
    const { user, page } = renderPage('news-alerts')
    await user.click(within(page).getByRole('button', { name: /Subscribe/ }))
    const email = within(page).getByLabelText('Email')
    expect(email).toHaveFocus()
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription('Please enter your email address.')
    expect(within(page).getByRole('group', { name: 'Alerts to receive' })).toHaveAccessibleDescription(
      'Please choose at least one type of alert.',
    )
    expect(within(page).getByText('Please agree to receive emails from us.')).toBeInTheDocument()
  })

  it('rejects an invalid email, then moves focus to the next missing field', async () => {
    const { user, page } = renderPage('news-alerts')
    const submit = within(page).getByRole('button', { name: /Subscribe/ })
    await user.type(within(page).getByLabelText('Email'), 'investor@')
    await user.click(submit)
    expect(within(page).getByText('Please enter a valid email address.')).toBeInTheDocument()

    await user.type(within(page).getByLabelText('Email'), 'example.com')
    await user.click(submit)
    expect(within(page).getByRole('checkbox', { name: 'Bursa announcements' })).toHaveFocus()

    await user.click(within(page).getByRole('checkbox', { name: 'Press releases' }))
    await user.click(submit)
    expect(within(page).getByRole('checkbox', { name: /I agree to receive these emails/ })).toHaveFocus()
    expect(within(page).queryByText('Please choose at least one type of alert.')).toBeNull()
  })

  it('thanks the visitor and lists the chosen alerts once the form is valid', async () => {
    const { user, page } = renderPage('news-alerts')
    await user.type(within(page).getByLabelText('Name (optional)'), 'Aisyah')
    await user.type(within(page).getByLabelText('Email'), 'aisyah@example.com')
    await user.click(within(page).getByRole('checkbox', { name: 'Bursa announcements' }))
    await user.click(within(page).getByRole('checkbox', { name: 'Financial results' }))
    await user.click(within(page).getByRole('checkbox', { name: 'Financial results' }))
    await user.click(within(page).getByRole('checkbox', { name: 'Corporate calendar' }))
    await user.click(within(page).getByRole('checkbox', { name: /I agree to receive these emails/ }))
    await user.click(within(page).getByRole('button', { name: /Subscribe/ }))

    expect(within(page).getByText(ALERTS_THANK_YOU)).toHaveFocus()
    expect(within(page).getByText('Your alerts: Bursa announcements, Corporate calendar.')).toBeInTheDocument()
    expect(within(page).queryByRole('form', { name: 'News alerts sign-up' })).toBeNull()
  })

  it('links the consent to the privacy section of the terms', () => {
    const { page } = renderPage('news-alerts')
    expect(within(page).getByRole('link', { name: 'Privacy and personal data' })).toHaveAttribute(
      'href',
      `${irPath('resources', 'terms-of-use')}#${PRIVACY_SECTION_ID}`,
    )
  })
})

describe('Investment Calculator', () => {
  it('works out the return as the visitor types', async () => {
    const { user, page } = renderPage('investment-calculator')
    const calculator = within(page).getByRole('form', { name: 'Investment calculator' })
    expect(calculator).toHaveTextContent('Enter the number of lots and both prices to see your return.')
    await user.type(within(calculator).getByLabelText('Lots (1 lot = 100 shares)'), '5')
    await user.type(within(calculator).getByLabelText('Purchase price (RM per share)'), '2')
    await user.type(within(calculator).getByLabelText('Selling price (RM per share)'), '1.5')
    const result = within(calculator).getByLabelText('Your result')
    expect(result).toHaveTextContent('500 shares')
    expect(result).toHaveTextContent('−RM250.00')
    expect(result).toHaveTextContent('-25.00%')
  })

  it('shows the assumptions and a worked example that can fill the calculator', async () => {
    const { user, page } = renderPage('investment-calculator')
    expect(tabLabels('investment-calculator')).toEqual(['Calculator', 'Worked example'])
    expect(within(page).getByRole('region', { name: 'Assumptions' })).toHaveTextContent('One board lot on Bursa Malaysia is 100 shares')
    expect(within(page).queryByRole('table', { name: 'Worked example' })).not.toBeInTheDocument()
    await user.click(within(page).getByRole('tab', { name: 'Worked example' }))
    expect(within(page).queryByRole('region', { name: 'Assumptions' })).not.toBeInTheDocument()
    const example = within(page).getByRole('table', { name: 'Worked example' })
    expect(example).toHaveTextContent('10 lots × 100 shares')
    expect(example).toHaveTextContent('RM130.00')
    expect(example).toHaveTextContent('13.00%')
    expect(within(page).getByText(/These prices are hypothetical/)).toBeInTheDocument()

    await user.click(within(page).getByRole('button', { name: 'Use these figures' }))
    expect(within(page).getByRole('tab', { name: 'Calculator' })).toHaveAttribute('aria-selected', 'true')
    const calculator = within(page).getByRole('form', { name: 'Investment calculator' })
    expect(within(calculator).getByLabelText('Lots (1 lot = 100 shares)')).toHaveValue(10)
    expect(within(calculator).getByLabelText('Lots (1 lot = 100 shares)')).toHaveFocus()
    expect(within(calculator).getByLabelText('Your result')).toHaveTextContent('13.00%')
  })
})

describe('Investor FAQ', () => {
  it('lists the questions as an accordion with answers from our data', async () => {
    const { user, page } = renderPage('faq')
    const summaries = FAQ_ITEMS.map((item) => within(page).getByText(item.question))
    expect(summaries).toHaveLength(FAQ_ITEMS.length)
    const stockCode = within(page).getByText('What is the stock code?').closest('details') as HTMLElement
    expect(stockCode).not.toHaveAttribute('open')
    await user.click(within(page).getByText('What is the stock code?'))
    expect(stockCode).toHaveAttribute('open')
    expect(within(stockCode).getByText('assigned at listing')).toHaveClass('ph')

    const boardLot = within(page).getByText('What is a board lot?').closest('details') as HTMLElement
    expect(boardLot).toHaveTextContent('board lots of 100 shares')
    const registrar = within(page).getByText(/Who is the share registrar/).closest('details') as HTMLElement
    expect(registrar).toHaveTextContent('Boardroom Share Registrars Sdn Bhd')
    const shariah = within(page).getByText(/Shariah-compliant\?/).closest('details') as HTMLElement
    expect(shariah).toHaveTextContent('23 Oct 2026')
  })

  it('filters questions by search and shows an empty state', async () => {
    const { user, page } = renderPage('faq')
    const search = within(page).getByLabelText('Search questions')
    await user.type(search, 'dividend')
    expect(within(page).getByRole('status')).toHaveTextContent(`1 of ${FAQ_ITEMS.length} questions`)
    expect(within(page).getByText('What is the dividend policy?')).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'cryptocurrency')
    expect(within(page).getByText(/No questions match “cryptocurrency”/)).toBeInTheDocument()

    await user.click(within(page).getByRole('button', { name: 'Reset' }))
    expect(within(page).getByRole('status')).toHaveTextContent(`${FAQ_ITEMS.length} questions`)
  })
})

describe('IR Website Terms of Use', () => {
  it('splits the numbered clauses into tabs, keeping every clause and its numbering', async () => {
    const { user, page } = renderPage('terms-of-use')
    expect(within(page).getAllByRole('note')[0]).toHaveTextContent('Draft pending legal review')
    expect(tabLabels('terms-of-use')).toEqual(['Using this site', 'Information & liability', 'Privacy & legal', 'Printable versions'])
    expect(within(page).getByText('date to be confirmed')).toHaveClass('ph')

    const shown: string[] = []
    for (const label of ['Using this site', 'Information & liability', 'Privacy & legal']) {
      await user.click(within(page).getByRole('tab', { name: label }))
      const panel = within(page).getByRole('tabpanel', { name: label })
      const headings = within(panel).getAllByRole('heading', { level: 3 })
      headings.forEach((heading) => expect(heading).toBeVisible())
      shown.push(...headings.map((heading) => heading.textContent ?? ''))
      expect(within(panel).getAllByRole('listitem')).toHaveLength(headings.length)
    }
    expect(shown).toEqual(TERMS_SECTIONS.map((section) => section.title))

    expect(within(page).getByRole('region', { name: 'Governing law' })).toHaveTextContent('laws of Malaysia')
    expect(within(page).getByRole('region', { name: 'Privacy and personal data' })).toHaveTextContent(
      'Personal Data Protection Act 2010',
    )
    expect(within(page).getByRole('link', { name: 'IR team' })).toHaveAttribute('href', irPath('contact'))

    await user.click(within(page).getByRole('tab', { name: 'Printable versions' }))
    expect(within(page).getByRole('table', { name: 'IR website terms and privacy notice' })).toBeVisible()
  })

  it('opens the Privacy & legal tab for the privacy link used by the news alerts form', () => {
    render(
      <MemoryRouter initialEntries={[`${irPath(SECTION, 'terms-of-use')}#${PRIVACY_SECTION_ID}`]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByRole('tab', { name: 'Privacy & legal' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('region', { name: 'Privacy and personal data' })).toBeVisible()
  })
})
