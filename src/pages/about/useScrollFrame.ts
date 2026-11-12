import { useEffect, useRef, type RefObject } from 'react'

interface FrameScheduler {
  schedule: () => void
  cancel: () => void
}

/** Coalesces bursts of events into one call per animation frame. */
function createFrameScheduler(callback: () => void): FrameScheduler {
  let frameId = 0
  const run = () => {
    frameId = 0
    callback()
  }
  const hasFrames = typeof window.requestAnimationFrame === 'function'
  return {
    schedule() {
      if (frameId !== 0) return
      if (hasFrames) frameId = window.requestAnimationFrame(run)
      else run()
    },
    cancel() {
      if (frameId !== 0 && hasFrames) window.cancelAnimationFrame(frameId)
      frameId = 0
    },
  }
}

/**
 * Runs `onFrame` once when enabled, then at most once per animation frame while the page
 * scrolls or resizes. With `targetRef`, it follows that element's own scroll instead of the page's.
 */
export function useScrollFrame(
  onFrame: () => void,
  isEnabled = true,
  targetRef?: RefObject<HTMLElement | null>,
): void {
  const onFrameRef = useRef(onFrame)

  useEffect(() => {
    onFrameRef.current = onFrame
  })

  useEffect(() => {
    if (!isEnabled) return
    const scrollTarget: HTMLElement | Window | null = targetRef ? targetRef.current : window
    if (!scrollTarget) return

    const scheduler = createFrameScheduler(() => onFrameRef.current())
    onFrameRef.current()
    scrollTarget.addEventListener('scroll', scheduler.schedule, { passive: true })
    window.addEventListener('resize', scheduler.schedule)

    return () => {
      scrollTarget.removeEventListener('scroll', scheduler.schedule)
      window.removeEventListener('resize', scheduler.schedule)
      scheduler.cancel()
    }
  }, [isEnabled, targetRef])
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
