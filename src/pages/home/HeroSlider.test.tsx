import { act, fireEvent, render, screen, within } from '@testing-library/react'
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

const total = String(HERO_SLIDES.length).padStart(2, '0')

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  window.localStorage.clear()
})

describe('HeroSlider', () => {
  it('opens on the first banner, each banner a described image in three sizes', () => {
    renderSlider()

    expect(slides()).toHaveLength(HERO_SLIDES.length)
    expect(currentSlide()).toBe(1)
    expect(screen.getByText(`01 / ${total}`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Bestari Food Berhad' })).toBeInTheDocument()
    for (const slide of HERO_SLIDES) {
      const image = screen.getByAltText(slide.alt)
      expect(image.getAttribute('srcset')).toContain(`hero/hero-${slide.id}-2048.png 2048w`)
      expect(image.getAttribute('srcset')).toContain(`hero/hero-${slide.id}-768.png 768w`)
    }
  })

  it('links each banner to its product and keeps hidden banners out of the tab order', () => {
    renderSlider()

    slides().forEach((slide, slideIndex) => {
      const link = within(slide).getByRole('link', { hidden: true })
      expect(link).toHaveAttribute('href', HERO_SLIDES[slideIndex].href)
      expect(link).toHaveAttribute('tabindex', slideIndex === 0 ? '0' : '-1')
    })
  })

  it('loads the current banner and its neighbours first and the rest lazily', () => {
    renderSlider()
    const loading = HERO_SLIDES.map((slide) => screen.getByAltText(slide.alt).getAttribute('loading'))

    expect(loading[0]).toBe('eager')
    expect(loading[1]).toBe('eager')
    expect(loading[HERO_SLIDES.length - 1]).toBe('eager')
    expect(loading[3]).toBe('lazy')
  })

  it('moves with the arrows and the bars, wrapping at both ends, and names the current banner', () => {
    renderSlider()

    fireEvent.click(screen.getByRole('button', { name: 'Next range' }))
    expect(currentSlide()).toBe(2)
    expect(screen.getByText(`02 / ${total}`)).toBeInTheDocument()
    expect(screen.getByText(HERO_SLIDES[1].title)).toBeInTheDocument()

    const last = HERO_SLIDES.length
    fireEvent.click(screen.getByRole('button', { name: `Show range ${last}: ${HERO_SLIDES[last - 1].title}` }))
    expect(currentSlide()).toBe(last)

    fireEvent.click(screen.getByRole('button', { name: 'Next range' }))
    expect(currentSlide()).toBe(1)

    fireEvent.click(screen.getByRole('button', { name: 'Previous range' }))
    expect(currentSlide()).toBe(last)
  })

  it('changes banner on its own and stops when paused', () => {
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

  it('swipes to the next and previous banner on touch screens', () => {
    renderSlider()
    const slider = screen.getByRole('region', { name: 'Bestari product ranges' })

    fireEvent.touchStart(slider, { touches: [{ clientX: 300 }] })
    fireEvent.touchEnd(slider, { changedTouches: [{ clientX: 200 }] })
    expect(currentSlide()).toBe(2)

    fireEvent.touchStart(slider, { touches: [{ clientX: 200 }] })
    fireEvent.touchEnd(slider, { changedTouches: [{ clientX: 300 }] })
    expect(currentSlide()).toBe(1)
  })

  it('does not change banner on its own when reduced motion is requested', () => {
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

  it('remembers the last banner between visits', () => {
    window.localStorage.setItem(HERO_SLIDE_STORAGE_KEY, '2')
    renderSlider()

    expect(currentSlide()).toBe(3)
  })
})
