import { useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react'
import { usePrefersReducedMotion } from '../../components/motion'
import { SmartLink } from '../../components/routing'
import { ROUTES } from '../../content/site'
import { BRAND_SLIDES, CAROUSEL } from './data'
import { useCarousel, type CarouselControls } from './useCarousel'

const SLIDE_COUNT = BRAND_SLIDES.length

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function keyAction(key: string, { show, step }: CarouselControls): (() => void) | null {
  switch (key) {
    case 'ArrowRight':
      return () => step(1)
    case 'ArrowLeft':
      return () => step(-1)
    case 'Home':
      return () => show(0)
    case 'End':
      return () => show(SLIDE_COUNT - 1)
    default:
      return null
  }
}

/** Pause reasons and the swipe gesture, wired to the section's pointer, focus and key events. */
function useCarouselInput(isReducedMotion: boolean) {
  const [isHovered, setHovered] = useState(false)
  const [isFocused, setFocused] = useState(false)
  const isPaused = isReducedMotion || isHovered || isFocused
  const carousel = useCarousel({
    count: SLIDE_COUNT,
    intervalMs: CAROUSEL.autoplayMs,
    storageKey: CAROUSEL.storageKey,
    isPaused,
  })
  const swipeStartX = useRef<number | null>(null)

  const handlers = {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      const action = keyAction(event.key, carousel)
      if (!action) return
      event.preventDefault()
      action()
    },
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      swipeStartX.current = event.clientX
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      const startX = swipeStartX.current
      swipeStartX.current = null
      if (startX === null || Math.abs(event.clientX - startX) <= CAROUSEL.swipeThresholdPx) return
      carousel.step(event.clientX < startX ? 1 : -1)
    },
    onPointerCancel: () => {
      swipeStartX.current = null
    },
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    onFocus: () => setFocused(true),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setFocused(false)
    },
  }

  return { carousel, isPaused, handlers }
}

/** 03 Our Brands: full-screen product carousel with colour wash, outline marquee, arrows, dots and swipe. */
export function BrandCarousel() {
  const isReducedMotion = usePrefersReducedMotion()
  const { carousel, isPaused, handlers } = useCarouselInput(isReducedMotion)
  const { index, show, step } = carousel
  const slide = BRAND_SLIDES[index]

  return (
    <section
      className="hero"
      id="brands"
      aria-roledescription="carousel"
      aria-label="Our Brands"
      style={{ backgroundColor: slide.bg }}
      {...handlers}
    >
      <div className="bhead">
        <div className="wrap">
          <div>
            <div className="eyebrow">Our Brands</div>
            <h2>Say hello to the family.</h2>
          </div>
          <div className="ctrl">
            <span className="count">
              {pad(index + 1)} / {pad(SLIDE_COUNT)}
            </span>
            <button type="button" className="arrow" aria-label="Previous slide" onClick={() => step(-1)}>
              ←
            </button>
            <button type="button" className="arrow" aria-label="Next slide" onClick={() => step(1)}>
              →
            </button>
          </div>
        </div>
      </div>

      <div className={isReducedMotion ? 'mq mq--still' : 'mq'} aria-hidden="true">
        <div>{`${slide.marquee} · `.repeat(CAROUSEL.marqueeRepeats)}</div>
      </div>

      <div className="slides">
        {BRAND_SLIDES.map((item, itemIndex) => (
          <div
            key={item.name}
            className={itemIndex === index ? 'slide on' : 'slide'}
            role="group"
            aria-roledescription="slide"
            aria-label={`${itemIndex + 1} of ${SLIDE_COUNT}`}
            aria-hidden={itemIndex !== index}
          >
            <img src={item.image} alt={item.name} draggable={false} />
          </div>
        ))}
      </div>

      <div className="info">
        <div className="wrap">
          <div className="name" aria-live={isPaused ? 'polite' : 'off'} aria-atomic="true">
            <div className="eyebrow">{slide.eyebrow}</div>
            <h3>{slide.name}</h3>
            <div className="zh" lang="zh-Hans">
              {slide.nameZh}
            </div>
          </div>
          <div className="ctrl">
            <div className="dots">
              {BRAND_SLIDES.map((item, itemIndex) => (
                <button
                  key={item.name}
                  type="button"
                  className={itemIndex === index ? 'on' : undefined}
                  aria-label={`Show slide ${itemIndex + 1} of ${SLIDE_COUNT}: ${item.name}`}
                  aria-current={itemIndex === index ? 'true' : undefined}
                  onClick={() => show(itemIndex)}
                />
              ))}
            </div>
            <SmartLink className="btn" href={ROUTES.shop}>
              Buy now <span className="arr" aria-hidden="true">→</span>
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  )
}
