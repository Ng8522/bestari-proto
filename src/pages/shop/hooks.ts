import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { addItem, changeQty, loadCart, saveCart, type CartItem, type CartStorage, type NewCartItem } from './cart'

export const TOAST_MS = 1800
export const BADGE_POP_MS = 250

/** A flag that turns on when triggered and back off after `durationMs` (re-triggering restarts the timer). */
export function useTimedFlag(durationMs: number): [boolean, () => void] {
  const [isOn, setOn] = useState(false)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const trigger = useCallback(() => {
    window.clearTimeout(timerRef.current)
    setOn(true)
    timerRef.current = window.setTimeout(() => setOn(false), durationMs)
  }, [durationMs])

  return [isOn, trigger]
}

export interface Toast {
  message: string
  isVisible: boolean
  show: (message: string) => void
}

export function useToast(durationMs: number = TOAST_MS): Toast {
  const [message, setMessage] = useState('')
  const [isVisible, trigger] = useTimedFlag(durationMs)
  const show = useCallback(
    (next: string) => {
      setMessage(next)
      trigger()
    },
    [trigger],
  )
  return { message, isVisible, show }
}

/** Reading `window.localStorage` itself can throw when site data is blocked. */
function browserStorage(): CartStorage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export interface CartState {
  cart: CartItem[]
  add: (item: NewCartItem) => void
  changeQty: (key: string, delta: number) => void
}

/** The cart, persisted to localStorage on every change. */
export function useCart(): CartState {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart(browserStorage()))

  useEffect(() => {
    saveCart(browserStorage(), cart)
  }, [cart])

  const add = useCallback((item: NewCartItem) => setCart((current) => addItem(current, item)), [])
  const change = useCallback(
    (key: string, delta: number) => setCart((current) => changeQty(current, key, delta)),
    [],
  )

  return { cart, add, changeQty: change }
}

function isTypingTarget(element: Element | null): boolean {
  if (!(element instanceof HTMLElement)) return false
  return element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
}

/** Focuses `targetRef` when "/" is pressed, unless the user is typing in a field. */
export function useSlashShortcut(targetRef: RefObject<HTMLElement | null>, isEnabled: boolean): void {
  useEffect(() => {
    if (!isEnabled) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return
      if (isTypingTarget(document.activeElement)) return
      event.preventDefault()
      targetRef.current?.focus()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [targetRef, isEnabled])
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** While open: Escape calls `onClose`, and Tab / Shift+Tab cycle focus inside `containerRef`. */
export function useModalKeys(
  containerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
): void {
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      const container = containerRef.current
      if (event.key !== 'Tab' || !container) return
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      const isOutside = !container.contains(active)
      if (event.shiftKey && (active === first || isOutside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || isOutside)) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [containerRef, isOpen, onClose])
}
