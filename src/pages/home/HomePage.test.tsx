import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { ROUTES } from '../../content/site'
import { BRAND_SLIDES, CAROUSEL, HEADER_SCRIM_OFFSET_PX, RECIPE_VIDEOS } from './data'

function renderHome() {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[ROUTES.home]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user }
}

function getCarousel(): HTMLElement {
  return screen.getByRole('region', { name: 'Our Brands' })
}

/** The visible slide group, its counter and its product name must all agree. */
function expectSlide(position: number) {
  const carousel = getCarousel()
  const slide = BRAND_SLIDES[position - 1]
  expect(within(carousel).getByRole('group')).toHaveAccessibleName(`${position} of ${BRAND_SLIDES.length}`)
  expect(within(carousel).getByText(`${String(position).padStart(2, '0')} / 10`)).toBeInTheDocument()
  expect(within(carousel).getByRole('heading', { level: 3 })).toHaveTextContent(slide.name)
  expect(carousel).toHaveStyle({ backgroundColor: slide.bg })
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value })
}

function stubReducedMotion() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    })),
  )
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  setScrollY(0)
})

describe('Home page', () => {
  it('shows the slogan hero, skip link, footer and default title', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1, name: 'Mudah dan Sedap!' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Scroll to content' })).not.toBeInTheDocument()
    expect(document.querySelector('.home .slogan .cue')).toBeNull()
    expect(screen.queryByText('Scroll')).not.toBeInTheDocument()
    expect(document.title).toBe('Bestari Food Berhad | Mudah dan Sedap!')
  })

  it('links the three doors to About, Investor Relations and the shop', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /The playful sous chef/ })).toHaveAttribute('href', ROUTES.about)
    expect(screen.getByRole('link', { name: /SC approved · Main Market IPO/ })).toHaveAttribute('href', ROUTES.investors)
    expect(screen.getByRole('link', { name: /Your pantry, delivered/ })).toHaveAttribute('href', ROUTES.shop)
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
  it('links the brands, corporate pages, news and the shop', () => {
    renderHome()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).getByRole('link', { name: 'Our Brands' })).toHaveAttribute('href', '#brands')
    expect(within(nav).getByRole('link', { name: 'About Us' })).toHaveAttribute('href', ROUTES.about)
    expect(within(nav).getByRole('link', { name: 'Investor Relations' })).toHaveAttribute('href', ROUTES.investors)
    expect(within(nav).getByRole('link', { name: 'News' })).toHaveAttribute('href', '#latest')
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

describe('Brands carousel', () => {
  it('is announced as a carousel of labelled slides', () => {
    renderHome()
    const carousel = getCarousel()
    expect(carousel).toHaveAttribute('id', 'brands')
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')
    expect(within(carousel).getAllByRole('group', { hidden: true })).toHaveLength(BRAND_SLIDES.length)
    expectSlide(1)
    expect(within(carousel).getByRole('img', { name: BRAND_SLIDES[0].name })).toBeInTheDocument()
    expect(within(carousel).getByRole('link', { name: /Buy now/ })).toHaveAttribute('href', ROUTES.shop)
  })

  it('moves with the arrows, wrapping at both ends, and remembers the slide', async () => {
    const { user } = renderHome()
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expectSlide(2)
    expect(window.localStorage.getItem(CAROUSEL.storageKey)).toBe('1')

    await user.click(screen.getByRole('button', { name: 'Previous slide' }))
    await user.click(screen.getByRole('button', { name: 'Previous slide' }))
    expectSlide(10)
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expectSlide(1)
  })

  it('jumps to a slide from its dot and marks that dot current', async () => {
    const { user } = renderHome()
    const dot = screen.getByRole('button', { name: `Show slide 5 of 10: ${BRAND_SLIDES[4].name}` })
    await user.click(dot)
    expectSlide(5)
    expect(dot).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: /Show slide 1 of 10/ })).not.toHaveAttribute('aria-current')
  })

  it('supports arrow, Home and End keys while focus is inside', async () => {
    const { user } = renderHome()
    act(() => screen.getByRole('button', { name: 'Next slide' }).focus())

    await user.keyboard('{ArrowRight}{ArrowRight}')
    expectSlide(3)
    await user.keyboard('{ArrowLeft}')
    expectSlide(2)
    await user.keyboard('{End}')
    expectSlide(10)
    await user.keyboard('{Home}')
    expectSlide(1)
  })

  it('changes slide on a swipe longer than 60px only', () => {
    renderHome()
    const carousel = getCarousel()
    fireEvent.pointerDown(carousel, { clientX: 400 })
    fireEvent.pointerUp(carousel, { clientX: 300 })
    expectSlide(2)

    fireEvent.pointerDown(carousel, { clientX: 300 })
    fireEvent.pointerUp(carousel, { clientX: 340 })
    expectSlide(2)

    fireEvent.pointerDown(carousel, { clientX: 200 })
    fireEvent.pointerUp(carousel, { clientX: 300 })
    expectSlide(1)
  })

  it('autoplays every 5.5s, restarts the countdown after a move and pauses on hover', () => {
    vi.useFakeTimers()
    renderHome()
    act(() => vi.advanceTimersByTime(CAROUSEL.autoplayMs))
    expectSlide(2)

    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expectSlide(3)
    act(() => vi.advanceTimersByTime(4000))
    expectSlide(3)
    act(() => vi.advanceTimersByTime(1500))
    expectSlide(4)

    const carousel = getCarousel()
    fireEvent.pointerOver(carousel)
    act(() => vi.advanceTimersByTime(CAROUSEL.autoplayMs * 2))
    expectSlide(4)

    fireEvent.pointerOut(carousel, { relatedTarget: document.body })
    act(() => vi.advanceTimersByTime(CAROUSEL.autoplayMs))
    expectSlide(5)
  })

  it('does not autoplay or scroll the marquee when reduced motion is requested', () => {
    stubReducedMotion()
    vi.useFakeTimers()
    renderHome()
    act(() => vi.advanceTimersByTime(CAROUSEL.autoplayMs * 3))
    expectSlide(1)
    expect(getCarousel().querySelector('.mq')).toHaveClass('mq--still')
  })

  it('restores the saved slide from localStorage', () => {
    window.localStorage.setItem(CAROUSEL.storageKey, '3')
    renderHome()
    expectSlide(4)
  })

  it.each(['42', '-1', '2.5', 'abc', ''])('ignores an invalid saved slide (%j)', (stored) => {
    window.localStorage.setItem(CAROUSEL.storageKey, stored)
    renderHome()
    expectSlide(1)
  })

  it('still works when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const { user } = renderHome()
    expectSlide(1)
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expectSlide(2)
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

describe('Slogan parallax', () => {
  function floatingPacks(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>('.slogan .fl'))
  }

  it('shifts the floating packs with the mouse', async () => {
    renderHome()
    const hero = document.getElementById('top') as HTMLElement
    fireEvent.pointerMove(hero, { pointerType: 'mouse', clientX: window.innerWidth, clientY: window.innerHeight })
    await waitFor(() => expect(floatingPacks()[0].style.transform).toBe('translate(14px,14px)'))
    expect(floatingPacks()[1].style.transform).toBe('translate(-11px,-11px)')
  })

  it('ignores touch pointers', async () => {
    renderHome()
    const hero = document.getElementById('top') as HTMLElement
    fireEvent.pointerMove(hero, { pointerType: 'touch', clientX: 0, clientY: 0 })
    await new Promise((resolve) => window.setTimeout(resolve, 40))
    floatingPacks().forEach((pack) => expect(pack.style.transform).toBe(''))
  })

  it('stays still when reduced motion is requested', async () => {
    stubReducedMotion()
    renderHome()
    const hero = document.getElementById('top') as HTMLElement
    fireEvent.pointerMove(hero, { pointerType: 'mouse', clientX: 0, clientY: 0 })
    await new Promise((resolve) => window.setTimeout(resolve, 40))
    floatingPacks().forEach((pack) => expect(pack.style.transform).toBe(''))
  })
})
