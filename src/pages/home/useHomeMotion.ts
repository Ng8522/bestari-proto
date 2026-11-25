import { useEffect, useState } from 'react'

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
