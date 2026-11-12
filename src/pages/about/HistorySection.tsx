import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { usePrefersReducedMotion } from '../../components/motion'
import { asset } from '../../content/site'
import { HISTORY_CARDS, type HistoryCard } from './data'
import { clamp, useScrollFrame } from './useScrollFrame'

interface PinRefs {
  sectionRef: RefObject<HTMLElement | null>
  railRef: RefObject<HTMLDivElement | null>
  progressRef: RefObject<HTMLElement | null>
}

/** How far the rail sticks out past its visible width. */
function railOverflow(rail: HTMLElement): number {
  return Math.max(0, rail.scrollWidth - rail.clientWidth)
}

/** The section is one viewport tall plus the rail's overflow, so vertical travel equals horizontal travel. */
function useSectionSizing({ sectionRef, railRef, progressRef }: PinRefs, isEnabled: boolean): void {
  useEffect(() => {
    const section = sectionRef.current
    const rail = railRef.current
    if (!isEnabled || !section || !rail) return

    const sizeSection = () => {
      section.style.height = `${window.innerHeight + railOverflow(rail)}px`
    }
    sizeSection()
    window.addEventListener('resize', sizeSection)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sizeSection)
    observer?.observe(rail)

    return () => {
      window.removeEventListener('resize', sizeSection)
      observer?.disconnect()
      section.style.height = ''
      rail.style.transform = ''
      if (progressRef.current) progressRef.current.style.width = ''
    }
  }, [isEnabled, sectionRef, railRef, progressRef])
}

/** Pinned mode: page scroll through the section maps to the rail's translateX and the progress width. */
function usePinnedRail(refs: PinRefs, isEnabled: boolean): void {
  const { sectionRef, railRef, progressRef } = refs
  useSectionSizing(refs, isEnabled)

  const update = useCallback(() => {
    const section = sectionRef.current
    const rail = railRef.current
    const progress = progressRef.current
    if (!section || !rail || !progress) return
    const travel = Math.max(1, section.offsetHeight - window.innerHeight)
    const ratio = clamp(-section.getBoundingClientRect().top / travel, 0, 1)
    rail.style.transform = `translateX(${-ratio * railOverflow(rail)}px)`
    progress.style.width = `${ratio * 100}%`
  }, [sectionRef, railRef, progressRef])

  useScrollFrame(update, isEnabled)
}

/** Native-scroller mode (reduced motion): the progress bar follows the rail's own scroll position. */
function useNativeRailProgress({ railRef, progressRef }: PinRefs, isEnabled: boolean): void {
  const update = useCallback(() => {
    const rail = railRef.current
    const progress = progressRef.current
    if (!rail || !progress) return
    const overflow = railOverflow(rail)
    progress.style.width = `${overflow > 0 ? (rail.scrollLeft / overflow) * 100 : 0}%`
  }, [railRef, progressRef])

  useScrollFrame(update, isEnabled, railRef)
}

interface HistoryCardViewProps {
  card: HistoryCard
}

function HistoryCardView({ card }: HistoryCardViewProps) {
  return (
    <article className={card.isFuture ? 'yc fut' : 'yc'} style={card.background ? { background: card.background } : undefined}>
      {card.image ? <img src={asset(card.image)} alt="" /> : null}
      {card.tag ? <span className="tag">{card.tag}</span> : null}
      <div className="y">{card.label}</div>
      <div>
        <h3>{card.title}</h3>
        <p>{card.body}</p>
      </div>
    </article>
  )
}

/**
 * 04 The crispy history: a pinned rail that scrolls sideways as the page scrolls down.
 * With reduced motion it becomes an ordinary, keyboard-scrollable horizontal scroller.
 */
export function HistorySection() {
  const isReducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLElement>(null)
  const refs: PinRefs = { sectionRef, railRef, progressRef }

  usePinnedRail(refs, !isReducedMotion)
  useNativeRailProgress(refs, isReducedMotion)

  const nativeScrollerProps = isReducedMotion
    ? { tabIndex: 0, role: 'region', 'aria-label': 'Bestari history timeline, scrolls sideways' }
    : {}

  return (
    <section
      className={isReducedMotion ? 'hist hist--static' : 'hist'}
      id="journey"
      ref={sectionRef}
      aria-labelledby="journey-title"
    >
      <div className="pin">
        <div className="wrap wrap--wide">
          <div className="hd">
            <div>
              <div className="eyebrow">Our journey</div>
              <h2 id="journey-title">
                The crispy history <em>of Bestari.</em>
              </h2>
            </div>
            <div className="prog" aria-hidden="true">
              <i ref={progressRef} />
            </div>
          </div>
        </div>
        <div className="rail" ref={railRef} {...nativeScrollerProps}>
          {HISTORY_CARDS.map((card) => (
            <HistoryCardView key={card.id} card={card} />
          ))}
          <div className="rail__end" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
