import { useRef, useState, type TouchEvent } from 'react'
import { usePrefersReducedMotion } from '../../components/motion'
import { SmartLink } from '../../components/routing'
import { HERO_SLIDE_INTERVAL_MS, HERO_SLIDE_STORAGE_KEY, HERO_SLIDES } from './data'
import { useCarousel } from './useCarousel'

/** A horizontal swipe longer than this moves to the next or previous range. */
const SWIPE_PX = 40

const twoDigits = (value: number): string => String(value).padStart(2, '0')

/**
 * 01 Hero: the first screen is a slider of the product ranges, each slide a row of pack shots.
 * It changes on its own every 5 seconds (never under reduced motion) and has arrows, numbered bars, pause and swipe.
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
      <div className="hs-stage">
        <div className="hs-track" style={{ transform: `translateX(${-100 * index}%)` }} aria-live={isPaused ? 'polite' : 'off'}>
          {HERO_SLIDES.map((slide, slideIndex) => {
            const isCurrent = slideIndex === index
            return (
              <div
                key={slide.id}
                className={`hs-slide hs-slide--${slide.tone}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${count}`}
                aria-hidden={!isCurrent}
              >
                <div className="hs-packs">
                  {slide.packs.map((pack) => (
                    <img key={pack.src} src={pack.src} alt={pack.alt} draggable={false} />
                  ))}
                </div>
                <div className="hs-cap">
                  <p className="hs-num" aria-hidden="true">
                    {twoDigits(slideIndex + 1)}
                  </p>
                  <div className="hs-cap__text">
                    <p className="hs-eyebrow">{slide.eyebrow}</p>
                    <p className="hs-title">{slide.title}</p>
                    <SmartLink className="hs-link" href={slide.href} tabIndex={isCurrent ? 0 : -1}>
                      {slide.linkLabel} <span className="arr" aria-hidden="true">→</span>
                    </SmartLink>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="hs-ctl">
          <button type="button" className="hs-btn" aria-label="Previous range" onClick={() => step(-1)}>
            <ChevronIcon direction="left" />
          </button>
          {HERO_SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              className="hs-bar"
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
