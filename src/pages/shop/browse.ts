/** Catalogue filtering, search and sorting, as pure functions over the product list. */
import type { CategoryFilter, Product, Variant } from './data'

export type SortOrder = 'pop' | 'lo' | 'hi'

export interface SortOption {
  value: SortOrder
  label: string
}

export const SORT_OPTIONS: readonly SortOption[] = [
  { value: 'pop', label: 'Sort: Popular' },
  { value: 'lo', label: 'Price: low to high' },
  { value: 'hi', label: 'Price: high to low' },
]

export function isSortOrder(value: string): value is SortOrder {
  return SORT_OPTIONS.some((option) => option.value === value)
}

/** Selected size label per product id. Products without an entry use their first variant. */
export type VariantSelection = Readonly<Record<string, string>>

export function findVariant(product: Product, label: string | undefined): Variant | undefined {
  return product.variants.find((item) => item.label === label)
}

export function selectedVariant(product: Product, selection: VariantSelection): Variant {
  return findVariant(product, selection[product.id]) ?? product.variants[0]
}

/** Case-insensitive match on the English and Chinese names, sizes and Malay keywords. */
export function matchesQuery(product: Product, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [product.name, product.zh, product.keywords ?? '', ...product.variants.map((item) => item.label)]
  return haystack.join(' ').toLowerCase().includes(needle)
}

export interface BrowseOptions {
  category: CategoryFilter
  sort: SortOrder
  query: string
  selection: VariantSelection
}

type PricedProduct = { product: Product; price: number }

const COMPARE: Record<SortOrder, (a: PricedProduct, b: PricedProduct) => number> = {
  pop: (a, b) => a.product.popularity - b.product.popularity,
  lo: (a, b) => a.price - b.price,
  hi: (a, b) => b.price - a.price,
}

/** Products to show, sorted by the currently selected size's price (ties keep catalogue order). */
export function visibleProducts(products: readonly Product[], options: BrowseOptions): Product[] {
  const { category, sort, query, selection } = options
  return products
    .filter((product) => (category === 'All' || product.category === category) && matchesQuery(product, query))
    .map((product) => ({ product, price: selectedVariant(product, selection).price }))
    .sort(COMPARE[sort])
    .map(({ product }) => product)
}
