/** Pure cart logic: every update returns a new array and never mutates its input. */
import { CART_STORAGE_KEY, FREE_DELIVERY_THRESHOLD, type Bundle, type Product, type Variant } from './data'

export interface CartItem {
  readonly key: string
  readonly name: string
  readonly variant: string
  readonly price: number
  readonly img: string
  readonly qty: number
}

export type NewCartItem = Omit<CartItem, 'qty'>
export type Cart = readonly CartItem[]

export const BUNDLE_VARIANT = 'Bundle'

export function productLine(product: Product, variant: Variant): NewCartItem {
  return {
    key: `${product.id}|${variant.label}`,
    name: product.name,
    variant: variant.label,
    price: variant.price,
    img: variant.img,
  }
}

export function bundleLine(bundle: Bundle): NewCartItem {
  return { key: `b|${bundle.name}`, name: bundle.name, variant: BUNDLE_VARIANT, price: bundle.price, img: bundle.img }
}

/** Adds one of `item`, or bumps its quantity if the same key is already in the cart. */
export function addItem(cart: Cart, item: NewCartItem): CartItem[] {
  if (!cart.some((line) => line.key === item.key)) return [...cart, { ...item, qty: 1 }]
  return cart.map((line) => (line.key === item.key ? { ...line, qty: line.qty + 1 } : line))
}

/** Changes a line's quantity by `delta`; a line that drops to 0 or below is removed. */
export function changeQty(cart: Cart, key: string, delta: number): CartItem[] {
  return cart
    .map((line) => (line.key === key ? { ...line, qty: line.qty + delta } : line))
    .filter((line) => line.qty > 0)
}

function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100
}

export function itemCount(cart: Cart): number {
  return cart.reduce((total, line) => total + line.qty, 0)
}

export function lineTotal(line: CartItem): number {
  return roundCents(line.price * line.qty)
}

export function subtotal(cart: Cart): number {
  return roundCents(cart.reduce((total, line) => total + line.price * line.qty, 0))
}

export interface DeliveryProgress {
  /** RM still needed for free delivery (0 once unlocked). */
  remaining: number
  /** 0–100, for the progress bar. */
  percent: number
  isUnlocked: boolean
}

export function freeDeliveryProgress(amount: number, threshold: number = FREE_DELIVERY_THRESHOLD): DeliveryProgress {
  const remaining = roundCents(Math.max(0, threshold - amount))
  return { remaining, percent: Math.min(100, (Math.max(0, amount) / threshold) * 100), isUnlocked: remaining === 0 }
}

export function formatRM(amount: number): string {
  return `RM ${amount.toFixed(2)}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/** Type guard for one stored cart line: {key, name, variant, price, img, qty}. */
export function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) return false
  const { key, name, variant, price, img, qty } = value
  return (
    isNonEmptyString(key) &&
    isNonEmptyString(name) &&
    typeof variant === 'string' &&
    typeof img === 'string' &&
    typeof price === 'number' &&
    Number.isFinite(price) &&
    price >= 0 &&
    typeof qty === 'number' &&
    Number.isInteger(qty) &&
    qty > 0
  )
}

/**
 * Reads a stored cart. Corrupt JSON or a non-array gives an empty cart; invalid lines are dropped,
 * unknown fields are stripped, and a repeated key keeps only its first line.
 */
export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  return parsed.filter(isCartItem).reduce<CartItem[]>((lines, { key, name, variant, price, img, qty }) => {
    if (lines.some((line) => line.key === key)) return lines
    return [...lines, { key, name, variant, price, img, qty }]
  }, [])
}

export function serializeCart(cart: Cart): string {
  return JSON.stringify(cart)
}

export type CartStorage = Pick<Storage, 'getItem' | 'setItem'>

/** Storage can be missing or throw (private mode, blocked site data); the cart then starts empty. */
export function loadCart(storage: CartStorage | null): CartItem[] {
  if (!storage) return []
  try {
    return parseCart(storage.getItem(CART_STORAGE_KEY))
  } catch {
    return []
  }
}

/** Returns false when the cart could not be saved (no storage, quota exceeded); the in-memory cart still works. */
export function saveCart(storage: CartStorage | null, cart: Cart): boolean {
  if (!storage) return false
  try {
    storage.setItem(CART_STORAGE_KEY, serializeCart(cart))
    return true
  } catch {
    return false
  }
}
