import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { IR_BASE, IR_PAGE_ORDER, irPath, neighbours } from '../../content/ir-nav'
import { parseIrPath } from './IrLayout'

function renderAt(path: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user }
}

const SUB_PAGES = IR_PAGE_ORDER.filter((ref) => ref.page)

describe('IR site map', () => {
  it('builds paths and neighbours across the whole IR site', () => {
    expect(irPath('')).toBe(IR_BASE)
    expect(irPath('stock-info', 'price-ticker')).toBe('/investor-relations/stock-info/price-ticker')
    expect(neighbours(IR_BASE).previous).toBeUndefined()
    expect(neighbours(irPath('contact')).next).toBeUndefined()
    expect(neighbours('/nowhere')).toEqual({})
  })

  it('parses IR paths, ignoring a trailing slash', () => {
    const location = parseIrPath('/investor-relations/news/media-news/')
    expect(location.section?.label).toBe('News Centre')
    expect(location.page?.label).toBe('Media News')
    expect(location.path).toBe('/investor-relations/news/media-news')
    expect(parseIrPath('/investor-relations/nope').section).toBeUndefined()
  })
})

describe('Investor Relations hub', () => {
  it.each(SUB_PAGES.map((ref) => [ref.href, ref.section.label, ref.label]))(
    '%s shows the section as H1 and the page as H2',
    (href, sectionLabel, pageLabel) => {
      renderAt(href)
      expect(screen.getByRole('heading', { level: 1, name: sectionLabel })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: pageLabel })).toBeInTheDocument()
      const tabs = screen.getByRole('navigation', { name: `${sectionLabel} pages` })
      expect(within(tabs).getByRole('link', { name: pageLabel })).toHaveAttribute('aria-current', 'page')
    },
  )

  it('marks the current section in the icon menu and links every section', () => {
    renderAt(irPath('financial-info', 'performance'))
    const menu = screen.getByRole('navigation', { name: 'Investor Relations' })
    expect(within(menu).getAllByRole('link')).toHaveLength(10)
    expect(within(menu).getByRole('link', { name: 'Financial Info' })).toHaveAttribute('aria-current', 'true')
    expect(document.title).toBe('Financial Performance · Financial Info | Bestari Food Berhad')
  })

  it('shows a breadcrumb and previous / next links', () => {
    renderAt(irPath('corporate-info', 'general-information'))
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(within(crumbs).getByRole('link', { name: 'Investor Relations' })).toHaveAttribute('href', IR_BASE)
    const pager = screen.getByRole('navigation', { name: 'Previous and next IR pages' })
    expect(within(pager).getByRole('link', { name: /IR Home/ })).toHaveAttribute('href', IR_BASE)
    expect(within(pager).getByRole('link', { name: /Directors’ Profile/ })).toBeInTheDocument()
  })

  it('sends a section URL to its first page, and an unknown page to the section', () => {
    renderAt(irPath('stock-info'))
    expect(screen.getByRole('heading', { level: 2, name: 'Price Ticker' })).toBeInTheDocument()
  })

  it('redirects an unknown sub-page to the first page of its section', () => {
    renderAt(irPath('reports', 'nope'))
    expect(screen.getByRole('heading', { level: 2, name: 'Annual Reports' })).toBeInTheDocument()
  })

  it('shows "Page not found" for an unknown section, under an Investor Relations H1, with no current section', () => {
    renderAt(irPath('nope', 'nothing'))
    expect(screen.getByRole('heading', { level: 1, name: 'Investor Relations' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Go to IR Home/ })).toHaveAttribute('href', IR_BASE)
    const menu = screen.getByRole('navigation', { name: 'Investor Relations' })
    expect(within(menu).getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))).toHaveLength(0)
  })

  it('survives a malformed hash instead of crashing', () => {
    renderAt(`${IR_BASE}#%E0%A4%A`)
    expect(screen.getByRole('heading', { level: 1, name: /going public/ })).toBeInTheDocument()
  })

  it('keeps focus on the sub-page tab that was followed (the menus are not remounted)', async () => {
    const { user } = renderAt(irPath('news', 'bursa-announcements'))
    const tabs = screen.getByRole('navigation', { name: 'News Centre pages' })
    const mediaTab = within(tabs).getByRole('link', { name: 'Media News' })
    await user.click(mediaTab)
    expect(screen.getByRole('heading', { level: 2, name: 'Media News' })).toBeInTheDocument()
    expect(mediaTab).toHaveFocus()
    expect(mediaTab).toHaveAttribute('aria-current', 'page')
  })

  it('sends old one-page anchors to their new pages', () => {
    renderAt(`${IR_BASE}#board`)
    expect(screen.getByRole('heading', { level: 2, name: 'Directors’ Profile' })).toBeInTheDocument()
  })
})

describe('IR Home', () => {
  it('shows the hero, the three widgets, key figures and every section', () => {
    renderAt(IR_BASE)
    expect(screen.getByRole('heading', { level: 1, name: /going public/ })).toBeInTheDocument()
    for (const name of ['Bursa Announcements', 'Media News', 'Corporate Calendar']) {
      expect(screen.getByRole('region', { name })).toBeInTheDocument()
    }
    expect(screen.getByText('RM175.3m')).toBeInTheDocument()
    expect(screen.getByText('Up 87.6% on FY2024')).toBeInTheDocument()
    const directory = screen.getByRole('list', { name: 'Investor Relations sections' })
    expect(within(directory).getByRole('link', { name: 'Top 30 Shareholders' })).toHaveAttribute(
      'href',
      irPath('stock-info', 'top-30-shareholders'),
    )
    expect(screen.queryByRole('navigation', { name: 'Previous and next IR pages' })).not.toBeInTheDocument()
  })

  it('opens media articles in a new tab', () => {
    renderAt(IR_BASE)
    const media = screen.getByRole('region', { name: 'Media News' })
    const [first] = within(media).getAllByRole('link', { name: /new tab/ })
    expect(first).toHaveAttribute('target', '_blank')
    expect(first).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('IR Contact', () => {
  it('lists the registrar, issuing house and adviser', () => {
    renderAt(irPath('contact'))
    expect(screen.getByRole('heading', { level: 1, name: 'IR Contact' })).toBeInTheDocument()
    expect(screen.getByText('Boardroom Share Registrars Sdn Bhd')).toBeInTheDocument()
    expect(screen.getByText('Malaysian Issuing House Sdn Bhd')).toBeInTheDocument()
    expect(screen.getByText('RHB Investment Bank Berhad')).toBeInTheDocument()
  })

  it('asks for a name and a valid email, then thanks the visitor', async () => {
    const { user } = renderAt(irPath('contact'))
    await user.click(screen.getByRole('button', { name: /Send enquiry/ }))
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveFocus()

    await user.type(screen.getByLabelText('Name'), 'Aina')
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /Send enquiry/ }))
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Email'))
    await user.type(screen.getByLabelText('Email'), 'aina@example.com')
    await user.selectOptions(screen.getByLabelText('Subject'), 'ipo')
    await user.click(screen.getByRole('button', { name: /Send enquiry/ }))
    expect(screen.getByText(/Our IR team will be in touch/)).toHaveFocus()
  })
})
