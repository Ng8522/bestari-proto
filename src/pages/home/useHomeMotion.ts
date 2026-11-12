import { useEffect, useState, type RefObject } from 'react'

const FALLBACK_FRAME_MS = 16

interface FrameScheduler {
  /** Runs the task on the next animation frame; repeated calls before then are merged into one. */
  schedule: () => void
  cancel: () => void
}

/** requestAnimationFrame throttle (falls back to a 16ms timeout where rAF is missing). */
export function createFrameScheduler(task: () => void): FrameScheduler {
  const hasRaf = typeof window.requestAnimationFrame === 'function'
  let handle: number | null = null

  const run = () => {
    handle = null
    task()
  }

  return {
    schedule: () => {
      if (handle !== null) return
      handle = hasRaf ? window.requestAnimationFrame(run) : window.setTimeout(run, FALLBACK_FRAME_MS)
    },
    cancel: () => {
      if (handle === null) return
      if (hasRaf) window.cancelAnimationFrame(handle)
      else window.clearTimeout(handle)
      handle = null
    },
  }
}

/** True once the window has scrolled more than `ratio` × the viewport height plus `offsetPx`. */
export function useScrolledPast(ratio: number, offsetPx = 0): boolean {
  const [isPast, setPast] = useState(false)

  useEffect(() => {
    const check = () => setPast(window.scrollY > window.innerHeight * ratio + offsetPx)
    const scheduler = createFrameScheduler(check)
    check()
    window.addEventListener('scroll', scheduler.schedule, { passive: true })
    window.addEventListener('resize', scheduler.schedule)
    return () => {
      window.removeEventListener('scroll', scheduler.schedule)
      window.removeEventListener('resize', scheduler.schedule)
      scheduler.cancel()
    }
  }, [ratio, offsetPx])

  return isPast
}

interface PointerOffset {
  x: number
  y: number
}

/**
 * Moves element i by depths[i] × the mouse offset from the window centre (the handoff's slogan parallax).
 * Only real mouse pointers count, so touch and pen taps never shift the packs.
 */
export function useMouseParallax(
  areaRef: RefObject<HTMLElement | null>,
  elementsRef: RefObject<Array<HTMLElement | null>>,
  depths: readonly number[],
  isEnabled: boolean,
): void {
  useEffect(() => {
    const area = areaRef.current
    const elements = elementsRef.current
    if (!area || !isEnabled) return

    let offset: PointerOffset = { x: 0, y: 0 }
    const apply = () =>
      elements.forEach((element, index) => {
        const depth = depths[index] ?? 0
        if (element) element.style.transform = `translate(${offset.x * depth}px,${offset.y * depth}px)`
      })
    const scheduler = createFrameScheduler(apply)

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      offset = { x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 }
      scheduler.schedule()
    }

    area.addEventListener('pointermove', handlePointerMove)
    return () => {
      area.removeEventListener('pointermove', handlePointerMove)
      scheduler.cancel()
      elements.forEach((element) => {
        if (element) element.style.transform = ''
      })
    }
  }, [areaRef, elementsRef, depths, isEnabled])
}
