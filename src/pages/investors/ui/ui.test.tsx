import { describe, expect, it } from 'vitest'
import { render, renderHook, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { BarChart, niceMax } from './BarChart'
import { DataTable, DocTable } from './DataTable'
import { Donut, donutGradient } from './Donut'
import { FilterBar, InputField, Segmented, SelectField, isWithinRange } from './Filters'
import { Pagination, usePagination } from './Pagination'
import { Notice, PageHeader, Panel, StatGrid } from './PageParts'
import { SectionTabs } from './SectionTabs'
import { emailError } from './validation'

describe('niceMax', () => {
  it.each([
    [0, 1],
    [175.3, 200],
    [31, 40],
    [9.2, 10],
    [100, 100],
    [230, 250],
  ])('rounds %s up to %s', (max, expected) => expect(niceMax(max)).toBe(expected))
})

describe('BarChart', () => {
  it('names every value, and draws unknown values as TBA', () => {
    render(<BarChart title="Revenue (RM million)" data={[{ label: 'FY2024', value: 160.7 }, { label: 'FY2025', value: null }]} />)
    const chart = screen.getByRole('img')
    expect(chart).toHaveAccessibleName('Revenue (RM million): FY2024 160.70, FY2025 to be announced')
    expect(screen.getByText('TBA')).toBeInTheDocument()
  })
})

describe('Donut', () => {
  const slices = [
    { label: 'A', percent: 70.4, color: 'red' },
    { label: 'B', percent: 29.6, color: 'blue' },
  ]

  it('builds one gradient stop per slice', () => {
    expect(donutGradient(slices)).toBe('conic-gradient(red 0% 70.4%, blue 70.4% 100%)')
  })

  it('summarises the slices for screen readers', () => {
    render(<Donut label="Holdings" slices={slices} />)
    expect(screen.getByRole('img')).toHaveAccessibleName('Holdings: A 70.4%, B 29.6%')
  })
})

describe('DataTable', () => {
  const columns = [
    { key: 'name', header: 'Name', render: (row: { name: string }) => row.name, isRowHeader: true },
    { key: 'n', header: 'Shares', render: () => '1', align: 'right' as const },
  ]

  it('shows rows with row headers', () => {
    render(<DataTable caption="Holders" columns={columns} rows={[{ name: 'Core' }]} rowKey={(row) => row.name} />)
    expect(screen.getByRole('rowheader', { name: 'Core' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Holders' })).toBeInTheDocument()
  })

  it('shows the empty message when there are no rows', () => {
    render(<DataTable caption="Holders" columns={columns} rows={[]} rowKey={() => ''} emptyMessage="None yet" />)
    expect(screen.getByRole('cell', { name: 'None yet' })).toHaveAttribute('colspan', '2')
  })

  it('gives published documents View and Download links, and others a pending pill', () => {
    render(
      <DocTable
        caption="Docs"
        documents={[
          { title: 'Charter', meta: '1 Jan 2027', format: 'PDF', href: '/charter.pdf' },
          { title: 'Policy', meta: 'TBA', format: 'PDF' },
        ]}
      />,
    )
    expect(screen.getByRole('link', { name: 'View Charter' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'Download Charter (PDF)' })).toHaveAttribute('download')
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })
})

describe('filters', () => {
  it('checks ISO dates against an optional range', () => {
    expect(isWithinRange('2026-10-23', '', '')).toBe(true)
    expect(isWithinRange('2026-10-23', '2026-11-01', '')).toBe(false)
    expect(isWithinRange('2026-10-23', '', '2026-10-01')).toBe(false)
    expect(isWithinRange('2026-10-23', '2026-10-23', '2026-10-23')).toBe(true)
  })

  it('reports select, input, reset and switch changes', async () => {
    const user = userEvent.setup()
    const calls: string[] = []
    render(
      <>
        <FilterBar label="Filter" onReset={() => calls.push('reset')}>
          <SelectField
            id="cat"
            label="Category"
            value="a"
            options={[
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
            ]}
            onChange={(value) => calls.push(`select:${value}`)}
          />
          <InputField id="kw" label="Keyword" value="" onChange={(value) => calls.push(`input:${value}`)} />
        </FilterBar>
        <Segmented
          label="Period"
          value="annual"
          options={[
            { value: 'annual', label: 'Annual' },
            { value: 'quarterly', label: 'Quarterly' },
          ]}
          onChange={(value) => calls.push(`switch:${value}`)}
        />
      </>,
    )
    await user.selectOptions(screen.getByLabelText('Category'), 'b')
    await user.type(screen.getByLabelText('Keyword'), 'x')
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    await user.click(screen.getByRole('button', { name: 'Quarterly' }))
    expect(screen.getByRole('button', { name: 'Annual' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('search', { name: 'Filter' })).toBeInTheDocument()
    expect(calls).toEqual(['select:b', 'input:x', 'reset', 'switch:quarterly'])
  })
})

describe('pagination', () => {
  it('slices items and clamps the page when the list shrinks', () => {
    const { result, rerender } = renderHook(({ items }) => usePagination(items, 2), {
      initialProps: { items: [1, 2, 3, 4, 5] },
    })
    expect(result.current.pageCount).toBe(3)
    act(() => result.current.setPage(3))
    expect(result.current.pageItems).toEqual([5])
    rerender({ items: [1, 2] })
    expect(result.current.page).toBe(1)
  })

  it('renders numbered pages, and nothing for a single page', async () => {
    const user = userEvent.setup()
    const pages: number[] = []
    const { rerender } = render(<Pagination page={1} pageCount={3} onChange={(page) => pages.push(page)} label="Pages" />)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('button', { name: 'Page 3' }))
    await user.click(screen.getByRole('button', { name: /Next/ }))
    expect(pages).toEqual([3, 2])
    rerender(<Pagination page={1} pageCount={1} onChange={() => undefined} label="Pages" />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})

describe('page parts', () => {
  it('names panels by their title and renders notices and stats', () => {
    render(
      <>
        <Panel title="Board" sub="As at listing" actions={<button type="button">Year</button>}>
          body
        </Panel>
        <Notice title="Heads up">Soon</Notice>
        <StatGrid label="Figures" stats={[{ label: 'Price', value: 'TBA', isPlaceholder: true, detail: 'per share' }]} />
      </>,
    )
    expect(screen.getByRole('region', { name: 'Board' })).toHaveTextContent('As at listing')
    expect(screen.getByRole('note')).toHaveTextContent('Heads upSoon')
    expect(screen.getByText('TBA')).toHaveClass('ph')
  })
})

describe('SectionTabs', () => {
  it('shows one section at a time, named by the page title, and moves with the arrow keys', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <PageHeader title="Reports" />
        <SectionTabs tabs={SECTION_TABS} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('tablist', { name: 'Reports' })).toHaveClass('tabs-line')
    expect(screen.getByText('Annual body')).toBeVisible()
    expect(screen.getByText('Quarterly body')).not.toBeVisible()

    await user.click(screen.getByRole('tab', { name: 'Annual' }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Quarterly' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Quarterly' })).toHaveFocus()
    expect(screen.getByRole('tabpanel', { name: 'Quarterly' })).toHaveTextContent('Quarterly body')
    expect(screen.getByText('Annual body')).not.toBeVisible()
  })

  it('opens the tab holding the element named in the URL hash', () => {
    render(
      <MemoryRouter initialEntries={['/reports#q-notes']}>
        <PageHeader title="Reports" />
        <SectionTabs tabs={SECTION_TABS} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('tab', { name: 'Quarterly' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Quarterly body')).toBeVisible()
  })

  it('follows the tab chosen by the page when controlled', async () => {
    const user = userEvent.setup()
    const picks: string[] = []
    render(
      <MemoryRouter>
        <PageHeader title="Reports" />
        <SectionTabs tabs={SECTION_TABS} activeId="quarterly" onActiveChange={(id) => picks.push(id)} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Quarterly body')).toBeVisible()
    await user.click(screen.getByRole('tab', { name: 'Annual' }))
    expect(picks).toEqual(['annual'])
    expect(screen.getByText('Quarterly body')).toBeVisible()
  })
})

const SECTION_TABS = [
  { id: 'annual', label: 'Annual', content: <p>Annual body</p> },
  { id: 'quarterly', label: 'Quarterly', content: <p id="q-notes">Quarterly body</p> },
] as const

describe('emailError', () => {
  it.each([
    ['', 'Please enter your email address.'],
    ['nope', 'Please enter a valid email address.'],
    [' a@b.co ', undefined],
  ])('%j → %j', (email, expected) => expect(emailError(email)).toBe(expected))
})
