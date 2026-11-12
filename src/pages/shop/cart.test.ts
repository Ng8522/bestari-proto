import { describe, expect, it } from 'vitest'
import {
  addItem,
  bundleLine,
  changeQty,
  formatRM,
  isCartItem,
  itemCount,
  lineTotal,
  loadCart,
  parseCart,
  productLine,
  saveCart,
  serializeCart,
  subtotal,
  type CartItem,
  type CartStorage,
  type NewCartItem,
} from './cart'
import { BUNDLES, CART_STORAGE_KEY, PRODUCTS } from './data'

const EGG: NewCartItem = { key: 'egg|800g', name: 'Golden Salted Egg Seasoning', variant: '800g', price: 24.9, img: '/assets/p-saltedegg-800g.png' }
const SALT: NewCartItem = { key: 'salt|Pack', name: 'Iodised Himalayan Rock Salt', variant: 'Pack', price: 5.5, img: '/assets/p-salt.png' }

function line(item: NewCartItem, qty: number): CartItem {
  return { ...item, qty }
}

function memoryStorage(initial: Record<string, string> = {}): CartStorage & { data: Record<string, string> } {
  const data = { ...initial }
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value
    },
  }
}

describe('line items', () => {
  it('builds a product line keyed by product id and size', () => {
    const product = PRODUCTS.find((item) => item.id === 'flour')
    if (!product) throw new Error('flour missing')
    const mala = product.variants[3]
    expect(productLine(product, mala)).toEqual({
      key: 'flour|520g',
      name: 'Multipurpose Crispy Frying Flour Mix',
      variant: '520g',
      price: 7.9,
      img: '/assets/p-flour-mala-520g.png',
    })
  })

  it('builds a bundle line with the "Bundle" variant', () => {
    expect(bundleLine(BUNDLES[1])).toEqual({
      key: 'b|Curry Night',
      name: 'Curry Night',
      variant: 'Bundle',
      price: 12.9,
      img: '/assets/p-curry-meat.png',
    })
  })
})

describe('addItem', () => {
  it('appends a new line with quantity 1', () => {
    expect(addItem([], EGG)).toEqual([line(EGG, 1)])
  })

  it('increments the quantity of an existing key without mutating the input', () => {
    const cart = Object.freeze([Object.freeze(line(EGG, 1)), Object.freeze(line(SALT, 2))])
    const next = addItem(cart, EGG)
    expect(next).toEqual([line(EGG, 2), line(SALT, 2)])
    expect(cart[0].qty).toBe(1)
    expect(next).not.toBe(cart)
  })
})

describe('changeQty', () => {
  const cart = Object.freeze([Object.freeze(line(EGG, 2)), Object.freeze(line(SALT, 1))])

  it('changes only the matching line', () => {
    expect(changeQty(cart, EGG.key, 1)).toEqual([line(EGG, 3), line(SALT, 1)])
    expect(changeQty(cart, EGG.key, -1)).toEqual([line(EGG, 1), line(SALT, 1)])
  })

  it('removes a line that reaches 0', () => {
    expect(changeQty(cart, SALT.key, -1)).toEqual([line(EGG, 2)])
  })

  it('ignores an unknown key', () => {
    expect(changeQty(cart, 'nope', 1)).toEqual(cart)
  })
})

describe('totals', () => {
  it('counts items and sums the subtotal to the cent', () => {
    const cart = [line(EGG, 3), line(SALT, 1)]
    expect(itemCount(cart)).toBe(4)
    expect(subtotal(cart)).toBe(80.2)
    expect(lineTotal(line({ ...SALT, price: 0.1 }, 3))).toBe(0.3)
    expect(subtotal([])).toBe(0)
  })

  it('formats ringgit with two decimals', () => {
    expect(formatRM(7.9)).toBe('RM 7.90')
    expect(formatRM(0)).toBe('RM 0.00')
  })
})

describe('isCartItem', () => {
  it('accepts a complete line', () => {
    expect(isCartItem(line(EGG, 1))).toBe(true)
  })

  it.each([
    ['null', null],
    ['a string', 'egg'],
    ['an array', [EGG]],
    ['a missing key', { ...line(EGG, 1), key: '' }],
    ['a missing name', { ...line(EGG, 1), name: undefined }],
    ['a string price', { ...line(EGG, 1), price: '24.90' }],
    ['a negative price', { ...line(EGG, 1), price: -1 }],
    ['an infinite price', { ...line(EGG, 1), price: Infinity }],
    ['a zero quantity', { ...line(EGG, 1), qty: 0 }],
    ['a fractional quantity', { ...line(EGG, 1), qty: 1.5 }],
    ["the prototype's `q` field", { ...EGG, q: 1 }],
  ])('rejects %s', (_label, value) => {
    expect(isCartItem(value)).toBe(false)
  })
})

describe('parseCart / serializeCart', () => {
  it('round-trips a cart', () => {
    const cart = [line(EGG, 2), line(SALT, 1)]
    expect(parseCart(serializeCart(cart))).toEqual(cart)
  })

  it.each([
    ['null', null],
    ['an empty string', ''],
    ['corrupt JSON', '{not json'],
    ['a non-array', '{"key":"egg"}'],
  ])('returns an empty cart for %s', (_label, raw) => {
    expect(parseCart(raw)).toEqual([])
  })

  it('drops invalid entries, strips unknown fields and keeps the first of a repeated key', () => {
    const raw = JSON.stringify([
      { ...line(EGG, 2), extra: 'x' },
      { foo: 1 },
      'str',
      { ...line(SALT, -1) },
      line(EGG, 5),
    ])
    expect(parseCart(raw)).toEqual([line(EGG, 2)])
  })
})

describe('loadCart / saveCart', () => {
  it('saves to and loads from the bestari_cart key', () => {
    const storage = memoryStorage()
    expect(saveCart(storage, [line(EGG, 1)])).toBe(true)
    expect(JSON.parse(storage.data[CART_STORAGE_KEY] ?? '')).toEqual([line(EGG, 1)])
    expect(loadCart(storage)).toEqual([line(EGG, 1)])
  })

  it('falls back to an empty cart when storage is missing or throws', () => {
    const broken: CartStorage = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('quota')
      },
    }
    expect(loadCart(null)).toEqual([])
    expect(loadCart(broken)).toEqual([])
    expect(saveCart(null, [])).toBe(false)
    expect(saveCart(broken, [line(EGG, 1)])).toBe(false)
  })
})
