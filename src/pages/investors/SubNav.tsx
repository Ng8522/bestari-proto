import { useEffect, useState } from 'react'
import { SECTIONS, SECTION_IDS } from './data'

/** A section is "current" once its top has scrolled above this line (the handoff's scroll spy). */
const SPY_LINE_PX = 200

/** The last section whose top is above `linePx`, or the first section when none is. */
export function findCurrentSection<T extends string>(ids: readonly T[], linePx: number): T {
  return ids.reduce<T>((current, id) => {
    const element = document.getElementById(id)
    return element && element.getBoundingClientRect().top < linePx ? id : current
  }, ids[0])
}

/** Scroll spy throttled to one measurement per animation frame. */
export function useScrollSpy<T extends string>(ids: readonly T[], linePx: number): T {
  const [activeId, setActiveId] = useState<T>(ids[0])

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setActiveId(findCurrentSection(ids, linePx))
    }
    const schedule = () => {
      if (typeof window.requestAnimationFrame !== 'function') {
        measure()
      } else if (frame === 0) {
        frame = window.requestAnimationFrame(measure)
      }
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [ids, linePx])

  return activeId
}

/** Sticky in-page navigation under the site header; the current section shows as a dark pill. */
export function SubNav() {
  const activeId = useScrollSpy(SECTION_IDS, SPY_LINE_PX)

  return (
    <nav className="subnav" aria-label="On this page">
      <div className="wrap wrap--wide subnav-bar">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={section.id === activeId ? 'location' : undefined}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
