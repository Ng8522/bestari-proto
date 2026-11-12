import { useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { render, renderHook, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../App'
import { COMPANY, FOOTER_COLUMNS, ROUTES } from '../content/site'
import { useInView, usePrefersReducedMotion, useScrollReveal } from './motion'
import { LetterReveal, Ph } from './text'

function renderAt(path: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user }
}

describe('SiteHeader', () => {
  it('links the corporate pages and marks the current one', () => {
    renderAt(ROUTES.about)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).getByRole('link', { name: 'About Us' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
    expect(within(nav).getByRole('link', { name: 'Investor Relations' })).toHaveAttribute('href', ROUTES.investors)
    expect(within(nav).getByRole('link', { name: /Shop online/ })).toHaveAttribute('href', ROUTES.shop)
  })

  it('opens the mobile menu and closes it with Escape, returning focus', async () => {
    const { user } = renderAt(ROUTES.investors)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('closes the mobile menu when a link is followed or the page is clicked elsewhere', async () => {
    const { user } = renderAt(ROUTES.investors)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await user.click(toggle)
    await user.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'About Us' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    await user.click(screen.getByRole('main'))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('SiteFooter', () => {
  it('lists every footer column with working links and the company contact', () => {
    renderAt(ROUTES.whereToBuy)
    const footer = screen.getByRole('contentinfo')
    FOOTER_COLUMNS.forEach((column) => {
      const columnNav = within(footer).getByRole('navigation', { name: column.title })
      column.links.forEach((link) =>
        expect(within(columnNav).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href),
      )
    })
    expect(within(footer).getByRole('link', { name: COMPANY.email.label })).toHaveAttribute('href', COMPANY.email.href)
    expect(within(footer).getByRole('img', { name: /HACCP/ })).toBeInTheDocument()
  })
})

describe('Routes', () => {
  it('shows a helpful 404 inside the shared layout', () => {
    renderAt('/no-such-page')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Back to home/ })).toHaveAttribute('href', ROUTES.home)
    expect(document.title).toBe('Page not found | Bestari Food Berhad')
  })
})

describe('LetterReveal', () => {
  it('keeps the readable text for assistive tech while animating each letter', () => {
    const { container } = render(
      <h1>
        <LetterReveal text="Mudah" startIndex={3} />
      </h1>,
    )
    expect(screen.getByRole('heading', { name: 'Mudah' })).toBeInTheDocument()
    const letters = container.querySelectorAll<HTMLElement>('.lr__ch')
    expect(letters).toHaveLength(5)
    expect(letters[0].style.getPropertyValue('--i')).toBe('3')
  })

  it('keeps spaces between words as plain text', () => {
    const { container } = render(<LetterReveal text="We are" />)
    expect(container.querySelectorAll('.lr__ch')).toHaveLength(5)
  })
})

describe('Ph', () => {
  it('marks placeholder content', () => {
    render(<Ph>TBA</Ph>)
    expect(screen.getByText('TBA')).toHaveClass('ph')
  })
})

describe('motion hooks', () => {
  it('reveals every .reveal element when IntersectionObserver is unavailable', () => {
    function Probe() {
      const ref = useRef<HTMLDivElement>(null)
      useScrollReveal(ref)
      return (
        <div ref={ref}>
          <p className="reveal">One</p>
          <p className="reveal">Two</p>
        </div>
      )
    }
    render(<Probe />)
    expect(screen.getByText('One')).toHaveClass('in')
    expect(screen.getByText('Two')).toHaveClass('in')
    expect(screen.getByText('Two').style.transitionDelay).toBe('70ms')
  })

  it('treats elements as in view when IntersectionObserver is unavailable', () => {
    const element = document.createElement('div')
    const { result } = renderHook(() => useInView({ current: element }))
    expect(result.current).toBe(true)
  })

  it('reports no reduced-motion preference when matchMedia is unavailable', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })
})
