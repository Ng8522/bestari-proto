import { useEffect, useState, type RefObject } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
/** The handoff's safety net: never leave content hidden. */
const REVEAL_FALLBACK_MS = 2500
const REVEAL_STAGGER_MS = 70

export function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches
}

export function usePrefersReducedMotion(): boolean {
  const [isReduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const handleChange = () => setReduced(query.matches)
    query.addEventListener?.('change', handleChange)
    return () => query.removeEventListener?.('change', handleChange)
  }, [])

  return isReduced
}

/**
 * Fades in every `.reveal` element inside `rootRef` once its top passes 92% of the viewport,
 * staggered 70ms in groups of four (the handoff's site.js behaviour).
 */
export function useScrollReveal(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    items.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * REVEAL_STAGGER_MS}ms`
    })
    const showAll = () => items.forEach((item) => item.classList.add('in'))

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      showAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    items.forEach((item) => observer.observe(item))
    const fallback = window.setTimeout(showAll, REVEAL_FALLBACK_MS)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [rootRef])
}

/**
 * True once the element has scrolled into view (and stays true). `rootMargin` follows
 * IntersectionObserver syntax, e.g. '0px 0px -15% 0px' for "85% into the viewport".
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = '0px'): boolean {
  const [isInView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isInView) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin, isInView])

  return isInView
}
