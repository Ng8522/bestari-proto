import { useCallback, useEffect, useState } from 'react'

interface CarouselOptions {
  count: number
  intervalMs: number
  /** localStorage key that remembers the current slide between visits. */
  storageKey: string
  /** Hover, focus or reduced motion: autoplay waits until this is false again. */
  isPaused: boolean
}

export interface CarouselControls {
  index: number
  show: (index: number) => void
  step: (delta: number) => void
}

interface CarouselState {
  index: number
  /** Bumped on every move, so the autoplay countdown restarts even when the index stays the same. */
  moves: number
}

export function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count
}

/** Reads a remembered slide; anything missing, malformed or out of range falls back to the first slide. */
export function readStoredIndex(key: string, count: number): number {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null || raw.trim() === '') return 0
    const value = Number(raw)
    return Number.isInteger(value) && value >= 0 && value < count ? value : 0
  } catch {
    // Storage can be blocked (privacy mode, sandboxed frames); start on the first slide.
    return 0
  }
}

function storeIndex(key: string, index: number): void {
  try {
    window.localStorage.setItem(key, String(index))
  } catch {
    // Storage blocked or full: the carousel still works, it just won't remember the slide.
  }
}

/** Slide index with wrap-around, persistence and a 5.5s-style autoplay that restarts after every move. */
export function useCarousel({ count, intervalMs, storageKey, isPaused }: CarouselOptions): CarouselControls {
  const [state, setState] = useState<CarouselState>(() => ({ index: readStoredIndex(storageKey, count), moves: 0 }))

  const show = useCallback(
    (index: number) => setState((previous) => ({ index: wrapIndex(index, count), moves: previous.moves + 1 })),
    [count],
  )
  const step = useCallback(
    (delta: number) =>
      setState((previous) => ({ index: wrapIndex(previous.index + delta, count), moves: previous.moves + 1 })),
    [count],
  )

  useEffect(() => {
    storeIndex(storageKey, state.index)
  }, [storageKey, state.index])

  // `state.moves` is a deliberate dependency: each move clears the old countdown and starts a new one.
  useEffect(() => {
    if (isPaused) return
    const timer = window.setTimeout(() => step(1), intervalMs)
    return () => window.clearTimeout(timer)
  }, [state.moves, isPaused, intervalMs, step])

  return { index: state.index, show, step }
}
