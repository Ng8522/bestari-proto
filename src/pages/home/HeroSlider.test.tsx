import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HERO_SLIDE_INTERVAL_MS, HERO_SLIDE_STORAGE_KEY, HERO_SLIDES } from './data'
import { HeroSlider } from './HeroSlider'

function renderSlider() {
  return render(
    <MemoryRouter>
      <HeroSlider />
    </MemoryRouter>,
  )
}

function slides(): HTMLElement[] {
  return screen.getAllByRole('group', { hidden: true })
}

function currentSlide(): number {
  return slides().findIndex((slide) => slide.getAttribute('aria-hidden') === 'false') + 1
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  window.localStorage.clear()
})

describe('HeroSlider', () => {
  it('opens on the first range with every slide made of pack shots', () => {
    renderSlider()

    expect(slides()).toHaveLength(HERO_SLIDES.length)
    expect(currentSlide()).toBe(1)
    expect(screen.getByText('01 / 04')).toBeInTheDocument()
    for (const slide of HERO_SLIDES) {
      expect(slide.packs.length).toBeGreaterThan(1)
      for (const pack of slide.packs) expect(screen.getByAltText(pack.alt)).toBeInTheDocument()
    }
  })

  it('moves with the arrows and the numbered bars, wrapping at both ends', () => {
    renderSlider()

    fireEvent.click(screen.getByRole('button', { name: 'Next range' }))
    expect(currentSlide()).toBe(2)
    expect(screen.getByText('02 / 04')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: `Show range 4: ${HERO_SLIDES[3].title}` }))
    expect(currentSlide()).toBe(4)

    fireEvent.click(screen.getByRole('button', { name: 'Next range' }))
    expect(currentSlide()).toBe(1)

    fireEvent.click(screen.getByRole('button', { name: 'Previous range' }))
    expect(currentSlide()).toBe(4)
  })

  it('keeps links in hidden slides out of the tab order', () => {
    renderSlider()
    const links = screen.getAllByRole('link', { hidden: true })

    expect(links.filter((link) => link.tabIndex === 0)).toHaveLength(1)
    expect(links[0]).toHaveAttribute('tabindex', '0')
  })

  it('changes slide on its own and stops when paused', () => {
    vi.useFakeTimers()
    renderSlider()

    act(() => vi.advanceTimersByTime(HERO_SLIDE_INTERVAL_MS))
    expect(currentSlide()).toBe(2)

    fireEvent.click(screen.getByRole('button', { name: 'Pause slideshow' }))
    act(() => vi.advanceTimersByTime(HERO_SLIDE_INTERVAL_MS * 3))
    expect(currentSlide()).toBe(2)

    fireEvent.click(screen.getByRole('button', { name: 'Play slideshow' }))
    act(() => vi.advanceTimersByTime(HERO_SLIDE_INTERVAL_MS))
    expect(currentSlide()).toBe(3)
  })

  it('swipes to the next and previous range on touch screens', () => {
    renderSlider()
    const slider = screen.getByRole('region', { name: 'Bestari product ranges' })

    fireEvent.touchStart(slider, { touches: [{ clientX: 300 }] })
    fireEvent.touchEnd(slider, { changedTouches: [{ clientX: 200 }] })
    expect(currentSlide()).toBe(2)

    fireEvent.touchStart(slider, { touches: [{ clientX: 200 }] })
    fireEvent.touchEnd(slider, { changedTouches: [{ clientX: 300 }] })
    expect(currentSlide()).toBe(1)
  })

  it('does not change slide on its own when reduced motion is requested', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )
    vi.useFakeTimers()
    renderSlider()

    act(() => vi.advanceTimersByTime(HERO_SLIDE_INTERVAL_MS * 3))
    expect(currentSlide()).toBe(1)
  })

  it('remembers the last range between visits', () => {
    window.localStorage.setItem(HERO_SLIDE_STORAGE_KEY, '2')
    renderSlider()

    expect(currentSlide()).toBe(3)
  })
})
