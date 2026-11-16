/** Lookups and formatting for the product catalogue in data.ts. */
import { ROUTES } from '../../content/site'
import { PRODUCT_CATEGORIES, PRODUCT_LINES, type Pack, type ProductCategoryId, type ProductLine } from './data'

export function productPath(slug: string): string {
  return `${ROUTES.products}/${slug}`
}

export function findProductLine(slug: string | undefined): ProductLine | undefined {
  return PRODUCT_LINES.find((line) => line.slug === slug)
}

export function categoryLabel(id: ProductCategoryId): string {
  return PRODUCT_CATEGORIES.find((category) => category.id === id)?.label ?? ''
}

export function linesInCategory(id: ProductCategoryId): readonly ProductLine[] {
  return PRODUCT_LINES.filter((line) => line.category === id)
}

/** Other products for the bottom of a product page: the same category first, then the rest in catalogue order. */
export function moreProducts(line: ProductLine, limit: number): readonly ProductLine[] {
  const others = PRODUCT_LINES.filter((entry) => entry.slug !== line.slug)
  const sameCategory = others.filter((entry) => entry.category === line.category)
  const rest = others.filter((entry) => entry.category !== line.category)
  return [...sameCategory, ...rest].slice(0, limit)
}

export interface PackPhoto {
  src: string
  /** The pack in the photo: the chosen pack, or another pack of the same product when it has no photo of its own. */
  shows: Pack
  isOwn: boolean
}

export function packPhoto(line: ProductLine, pack: Pack): PackPhoto | undefined {
  if (pack.image) return { src: pack.image, shows: pack, isOwn: true }
  const standIn = line.packs.find((entry) => entry.image)
  return standIn?.image ? { src: standIn.image, shows: standIn, isOwn: false } : undefined
}

/** The photo for a product card: its first pack, or the first pack that has a photo. */
export function coverPhoto(line: ProductLine): PackPhoto | undefined {
  return packPhoto(line, line.packs[0])
}

/** "9555279100018" → "955 527910 0018", grouped as on bestarifood.com. */
export function formatBarcode(digits: string): string {
  return `${digits.slice(0, 3)} ${digits.slice(3, 9)} ${digits.slice(9)}`
}

export interface SpecRow {
  label: string
  value: string
}

type SpecField = 'barcode' | 'shelfLife' | 'dimensions' | 'carton'

const SPEC_FIELDS: readonly { field: SpecField; label: string }[] = [
  { field: 'barcode', label: 'Barcode' },
  { field: 'shelfLife', label: 'Shelf life' },
  { field: 'dimensions', label: 'Dimensions (cm)' },
  { field: 'carton', label: 'Carton' },
]

/** Spec rows for a pack, in display order; fields still to be confirmed are skipped. */
export function specRows(pack: Pack): readonly SpecRow[] {
  const known = SPEC_FIELDS.flatMap(({ field, label }) => {
    const value = pack.specs?.[field]
    if (!value) return []
    return [{ label, value: field === 'barcode' ? formatBarcode(value) : value }]
  })
  return [{ label: 'Pack size', value: pack.size }, ...known]
}

/** Labels of the spec fields not yet published for a pack. */
export function missingSpecs(pack: Pack): readonly string[] {
  return SPEC_FIELDS.filter(({ field }) => !pack.specs?.[field]).map(({ label }) => label)
}

export function packCount(count: number): string {
  return `${count} ${count === 1 ? 'pack' : 'packs'}`
}
