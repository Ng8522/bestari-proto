import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { ROUTES } from '../../content/site'
import { PRODUCT_CATEGORIES } from '../products/data'
import { HEADER_SCRIM_OFFSET_PX, RECIPE_VIDEOS } from './data'

function renderHome() {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[ROUTES.home]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user }
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value })
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  setScrollY(0)
})

describe('Home page', () => {
  it('opens on the hero slider with the skip link, footer and default title, and no slogan section', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1, name: 'Bestari Food Berhad' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Bestari product ranges' })).toHaveAttribute('id', 'top')
    expect(document.querySelector('.home .slogan')).toBeNull()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Scroll to content' })).not.toBeInTheDocument()
    expect(screen.queryByText('Scroll')).not.toBeInTheDocument()
    expect(document.title).toBe('Bestari Food Berhad | Mudah dan Sedap!')
  })

  it('tells the story in one-message bands, with no brand carousel or door cards', () => {
    renderHome()
    const titles = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(titles).toEqual(
      expect.arrayContaining([
        'Mudah & sedap since 2004.',
        'Kitchen essentials, from batter to seasoning.',
        'Let’s makan together.',
        'Bestari Food Berhad is going public.',
      ]),
    )
    const intro = document.getElementById('about') as HTMLElement
    expect(within(intro).getByRole('link', { name: /Our story/ })).toHaveAttribute('href', ROUTES.about)
    expect(screen.queryByRole('region', { name: 'Our Brands' })).toBeNull()
    expect(document.querySelector('.home .door')).toBeNull()
  })

  it('shows the four product ranges as tiles that open the products page', () => {
    renderHome()
    const ranges = within(document.getElementById('products') as HTMLElement).getAllByRole('link')
    expect(ranges).toHaveLength(PRODUCT_CATEGORIES.length)
    ranges.forEach((link, index) => {
      expect(link).toHaveTextContent(PRODUCT_CATEGORIES[index].label)
      expect(link).toHaveAttribute('href', ROUTES.products)
    })
  })

  it('shows only the settled IPO figures and one way into Investor Relations', () => {
    renderHome()
    const ipo = document.getElementById('ipo') as HTMLElement
    expect(within(ipo).getByText('Up to 133.32m')).toBeInTheDocument()
    expect(within(ipo).getByText('450.0m shares')).toBeInTheDocument()
    expect(within(ipo).queryByText('TBA')).toBeNull()
    expect(within(ipo).getByRole('link', { name: /Go to Investor Relations/ })).toHaveAttribute('href', ROUTES.investors)
  })

  it('leads the news with the IPO story and has no careers band', () => {
    renderHome()
    const news = document.getElementById('latest')
    expect(news).not.toBeNull()
    const ipoCard = within(news as HTMLElement).getByRole('link', { name: /SC approval for Main Market listing/ })
    expect(ipoCard).toHaveAttribute('href', ROUTES.investors)
    expect(ipoCard).toHaveClass('ipo')
    expect(document.getElementById('careers')).toBeNull()
    expect(screen.queryByRole('link', { name: 'Careers' })).toBeNull()
  })
})

describe('Home header', () => {
  it('links home, the corporate pages and the shop, with no News link', () => {
    renderHome()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#top')
    expect(within(nav).queryByRole('link', { name: 'Our Brands' })).not.toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'About Us' })).toHaveAttribute('href', ROUTES.about)
    expect(within(nav).getByRole('link', { name: 'Products' })).toHaveAttribute('href', ROUTES.products)
    expect(within(nav).getByRole('link', { name: 'Investor Relations' })).toHaveAttribute('href', ROUTES.investors)
    expect(within(nav).getByRole('link', { name: 'Sustainability' })).toHaveAttribute('href', ROUTES.sustainability)
    expect(within(nav).queryByRole('link', { name: 'News' })).not.toBeInTheDocument()
    const shopLinks = within(screen.getByRole('banner')).getAllByRole('link', { name: /Shop online/ })
    shopLinks.forEach((link) => expect(link).toHaveAttribute('href', ROUTES.shop))
  })

  it('gains a backdrop as soon as the page scrolls so the hero title never shows through the links', async () => {
    renderHome()
    const header = screen.getByRole('banner')
    expect(header).not.toHaveClass('scrolled')

    setScrollY(HEADER_SCRIM_OFFSET_PX + 1)
    fireEvent.scroll(window)
    await waitFor(() => expect(header).toHaveClass('scrolled'))
    expect(header).not.toHaveClass('solid')

    setScrollY(0)
    fireEvent.scroll(window)
    await waitFor(() => expect(header).not.toHaveClass('scrolled'))
  })

  it('turns solid after scrolling past 85% of the viewport and clears again at the top', async () => {
    renderHome()
    const header = screen.getByRole('banner')
    expect(header).not.toHaveClass('solid')

    setScrollY(Math.ceil(window.innerHeight * 0.85) + 1)
    fireEvent.scroll(window)
    await waitFor(() => expect(header).toHaveClass('solid'))

    setScrollY(0)
    fireEvent.scroll(window)
    await waitFor(() => expect(header).not.toHaveClass('solid'))
  })

  it('opens the mobile menu and closes it with Escape, returning focus', async () => {
    const { user } = renderHome()
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('banner')).toHaveClass('open')

    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })
})

describe('Recipe videos', () => {
  it('loads the first video without autoplay, then swaps and autoplays the chosen one', async () => {
    const { user } = renderHome()
    const [first, second] = RECIPE_VIDEOS
    const player = () => screen.getByTitle(/^Bestari video:/)
    expect(player()).toHaveAttribute('src', `https://www.youtube-nocookie.com/embed/${first.id}?rel=0`)
    const playlist = screen.getByRole('list', { name: 'Recipe videos' })
    expect(within(playlist).getByRole('button', { name: new RegExp(first.title) })).toHaveAttribute('aria-pressed', 'true')

    const secondButton = within(playlist).getByRole('button', { name: new RegExp(second.title) })
    await user.click(secondButton)
    expect(player()).toHaveAttribute('src', `https://www.youtube-nocookie.com/embed/${second.id}?rel=0&autoplay=1`)
    expect(player()).toHaveAttribute('title', `Bestari video: ${second.title}`)
    expect(secondButton).toHaveAttribute('aria-pressed', 'true')
    expect(within(playlist).getByRole('button', { name: new RegExp(first.title) })).toHaveAttribute('aria-pressed', 'false')
  })
})
