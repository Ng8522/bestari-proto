import { describe, expect, it } from 'vitest'
import {
  categoryLabel,
  coverPhoto,
  findProductLine,
  formatBarcode,
  linesInCategory,
  missingSpecs,
  moreProducts,
  packCount,
  packPhoto,
  productPath,
  specRows,
} from './catalogue'
import { PRODUCT_CATEGORIES, PRODUCT_LINES, type ProductLine } from './data'

function lineOf(slug: string): ProductLine {
  const line = findProductLine(slug)
  if (!line) throw new Error(`No product ${slug}`)
  return line
}

describe('product catalogue data', () => {
  it('gives every product a unique slug, a known category and a photo', () => {
    const slugs = PRODUCT_LINES.map((line) => line.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    const categoryIds: readonly string[] = PRODUCT_CATEGORIES.map((category) => category.id)
    PRODUCT_LINES.forEach((line) => {
      expect(categoryIds).toContain(line.category)
      expect(coverPhoto(line)?.src).toMatch(/\.png$/)
    })
  })

  it('gives every pack a unique id within its product', () => {
    PRODUCT_LINES.forEach((line) => {
      const ids = line.packs.map((pack) => pack.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  it('stores each barcode as a unique 13-digit EAN', () => {
    const barcodes = PRODUCT_LINES.flatMap((line) => line.packs.flatMap((pack) => pack.specs?.barcode ?? []))
    barcodes.forEach((barcode) => expect(barcode).toMatch(/^\d{13}$/))
    expect(new Set(barcodes).size).toBe(barcodes.length)
  })

  it('puts every product in exactly one category', () => {
    const total = PRODUCT_CATEGORIES.reduce((sum, category) => sum + linesInCategory(category.id).length, 0)
    expect(total).toBe(PRODUCT_LINES.length)
  })
})

describe('catalogue lookups', () => {
  it('finds a product by slug and builds its path', () => {
    expect(findProductLine('tempura')?.name).toBe('Tempura Flour')
    expect(findProductLine('no-such-product')).toBeUndefined()
    expect(findProductLine(undefined)).toBeUndefined()
    expect(productPath('tempura')).toBe('/products/tempura')
  })

  it('names categories', () => {
    expect(categoryLabel('frying')).toBe('Frying flours & batters')
    expect(categoryLabel('pantry')).toBe('Pantry staples')
  })

  it('suggests the same category first, never the product itself, up to the limit', () => {
    const custard = lineOf('custard')
    const more = moreProducts(custard, 4)
    expect(more).toHaveLength(4)
    expect(more.map((line) => line.slug)).not.toContain('custard')
    expect(more[0].category).toBe('dessert')
    expect(more.slice(1).every((line) => line.category !== 'dessert')).toBe(true)
  })

  it('counts packs', () => {
    expect(packCount(1)).toBe('1 pack')
    expect(packCount(12)).toBe('12 packs')
  })
})

describe('pack photos', () => {
  it("uses the pack's own photo when it has one", () => {
    const flour = lineOf('crispy-frying-flour-mix')
    const garlic1kg = flour.packs[2]
    expect(packPhoto(flour, garlic1kg)).toEqual({ src: garlic1kg.image, shows: garlic1kg, isOwn: true })
  })

  it('stands in another pack of the same product when the pack has no photo', () => {
    const flour = lineOf('crispy-frying-flour-mix')
    const garlic150g = flour.packs.find((pack) => pack.id === 'garlic-150g')
    if (!garlic150g) throw new Error('missing pack')
    const photo = packPhoto(flour, garlic150g)
    expect(photo?.isOwn).toBe(false)
    expect(photo?.shows.label).toBe('Original 1 kg')
  })
})

describe('pack specs', () => {
  it('formats barcodes as on the packs', () => {
    expect(formatBarcode('9555279100018')).toBe('955 527910 0018')
  })

  it('lists pack size first, then the published fields', () => {
    const [original1kg] = lineOf('crispy-frying-flour-mix').packs
    expect(specRows(original1kg)).toEqual([
      { label: 'Pack size', value: '1 kg' },
      { label: 'Barcode', value: '955 527910 0018' },
      { label: 'Shelf life', value: '18 months' },
      { label: 'Dimensions (cm)', value: '28 (W) × 25 (H) × 5 (D)' },
      { label: 'Carton', value: '20 × 1 kg' },
    ])
    expect(missingSpecs(original1kg)).toEqual([])
  })

  it('skips fields still to be confirmed and names them', () => {
    const [msg1kg] = lineOf('msg').packs
    expect(specRows(msg1kg).map((row) => row.label)).not.toContain('Barcode')
    expect(missingSpecs(msg1kg)).toEqual(['Barcode'])

    const [rasaSedap230g] = lineOf('rasa-sedap').packs
    expect(specRows(rasaSedap230g)).toEqual([{ label: 'Pack size', value: '230 g' }])
    expect(missingSpecs(rasaSedap230g)).toEqual(['Barcode', 'Shelf life', 'Dimensions (cm)', 'Carton'])
  })
})
