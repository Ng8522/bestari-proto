import { useRef, useState, type TouchEvent } from 'react'
import { usePrefersReducedMotion } from '../../components/motion'
import { SmartLink } from '../../components/routing'
import { heroBanner, HERO_SLIDE_INTERVAL_MS, HERO_SLIDE_STORAGE_KEY, HERO_SLIDES } from './data'
import { useCarousel } from './useCarousel'

/** A horizontal swipe longer than this moves to the next or previous banner. */
const SWIPE_PX = 40
/** Intrinsic size of the largest banner file, so the browser reserves the right space before it loads. */
const BANNER_WIDTH = 2048
const BANNER_HEIGHT = 878

const twoDigits = (value: number): string => String(value).padStart(2, '0')

/** The current banner and its neighbours load straight away; the rest wait until they are close. */
function isNearby(slideIndex: number, currentIndex: number, count: number): boolean {
  const distance = (slideIndex - currentIndex + count) % count
  return distance === 0 || distance === 1 || distance === count - 1
}

/**
 * 01 Hero: the first screen is a slider of the Bestari campaign banners, each linking to its product.
 * It changes on its own every 5 seconds (never under reduced motion) and has arrows, bars, pause and swipe.
 */
export function HeroSlider() {
  const isReducedMotion = usePrefersReducedMotion()
  const [isPausedByUser, setPausedByUser] = useState(false)
  const isPaused = isPausedByUser || isReducedMotion
  const count = HERO_SLIDES.length
  const { index, show, step } = useCarousel({
    count,
    intervalMs: HERO_SLIDE_INTERVAL_MS,
    storageKey: HERO_SLIDE_STORAGE_KEY,
    isPaused,
  })
  const touchStartX = useRef<number | null>(null)
  const current = HERO_SLIDES[index]

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }
  const handleTouchEnd = (event: TouchEvent) => {
    const startX = touchStartX.current
    const endX = event.changedTouches[0]?.clientX
    touchStartX.current = null
    if (startX === null || endX === undefined) return
    const distance = endX - startX
    if (Math.abs(distance) > SWIPE_PX) step(distance < 0 ? 1 : -1)
  }

  return (
    <section
      className="hero-slider"
      id="top"
      aria-roledescription="carousel"
      aria-label="Bestari product ranges"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h1 className="visually-hidden">Bestari Food Berhad</h1>
      <div className="hs-stage">
        <div className="hs-track" style={{ transform: `translateX(${-100 * index}%)` }} aria-live={isPaused ? 'polite' : 'off'}>
          {HERO_SLIDES.map((slide, slideIndex) => {
            const isCurrent = slideIndex === index
            const banner = heroBanner(slide.id)
            return (
              <div
                key={slide.id}
                className="hs-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${count}`}
                aria-hidden={!isCurrent}
              >
                <SmartLink href={slide.href} tabIndex={isCurrent ? 0 : -1}>
                  <img
                    src={banner.src}
                    srcSet={banner.srcSet}
                    sizes="100vw"
                    width={BANNER_WIDTH}
                    height={BANNER_HEIGHT}
                    alt={slide.alt}
                    loading={isNearby(slideIndex, index, count) ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                </SmartLink>
              </div>
            )
          })}
        </div>
      </div>
      <div className="hs-strip">
        <p className="hs-name" aria-hidden="true">
          <span className="hs-num">{twoDigits(index + 1)}</span> {current.title}
        </p>
        <div className="hs-ctl">
          <button type="button" className="hs-btn" aria-label="Previous range" onClick={() => step(-1)}>
            <ChevronIcon direction="left" />
          </button>
          {HERO_SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              className="hs-dot"
              aria-label={`Show range ${slideIndex + 1}: ${slide.title}`}
              aria-current={slideIndex === index}
              onClick={() => show(slideIndex)}
            >
              <span />
            </button>
          ))}
          <p className="hs-count" aria-hidden="true">
            {twoDigits(index + 1)} / {twoDigits(count)}
          </p>
          <button type="button" className="hs-btn" aria-label="Next range" onClick={() => step(1)}>
            <ChevronIcon direction="right" />
          </button>
          <button
            type="button"
            className="hs-btn"
            aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
            onClick={() => setPausedByUser(!isPausedByUser)}
          >
            {isPaused ? <PlayIcon /> : <PauseIcon />}
          </button>
        </div>
      </div>
    </section>
  )
}

interface ChevronIconProps {
  direction: 'left' | 'right'
}

function ChevronIcon({ direction }: ChevronIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 5v14l12-7z" />
    </svg>
  )
}
