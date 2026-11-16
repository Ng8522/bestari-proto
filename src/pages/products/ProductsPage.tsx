import { useRef } from 'react'
import { useScrollReveal } from '../../components/motion'
import { useDocumentTitle } from '../../components/routing'
import { Tabs, type TabItem } from '../investors/Tabs'
import { linesInCategory } from './catalogue'
import { PRODUCT_CATEGORIES, PRODUCT_LINES, type ProductCategoryId } from './data'
import { BuyLinks, ProductGrid } from './parts'
import './products.css'

type RangeTab = 'all' | ProductCategoryId

const RANGE_TITLE_ID = 'products-range-title'
const BUY_TITLE_ID = 'products-buy-title'
const PACK_TOTAL = PRODUCT_LINES.reduce((total, line) => total + line.packs.length, 0)

/** One tab per category, after "All products", so the range stays one screen of cards instead of a long list. */
const RANGE_TABS: readonly TabItem<RangeTab>[] = [
  { id: 'all', label: 'All products', content: <ProductGrid lines={PRODUCT_LINES} /> },
  ...PRODUCT_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    content: <ProductGrid lines={linesInCategory(category.id)} />,
  })),
]

/** Products: the whole Bestari range by category; each card opens the product's page with every pack's details. */
export function ProductsPage() {
  useDocumentTitle('Products')
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollReveal(rootRef)

  return (
    <div className="prod" ref={rootRef}>
      <section className="prod__hero">
        <div className="wrap">
          <p className="eyebrow reveal">Our Products</p>
          <h1 className="reveal">Mudah dan sedap, in every pack.</h1>
          <p className="prod__lede reveal">
            {PRODUCT_LINES.length} products in {PACK_TOTAL} packs: frying flours, seasonings, desserts and pantry
            staples. Choose a product to see each pack’s barcode, shelf life and carton size.
          </p>
        </div>
      </section>

      <section className="prod__range" aria-labelledby={RANGE_TITLE_ID}>
        <div className="wrap">
          <h2 id={RANGE_TITLE_ID} className="visually-hidden">
            Browse by category
          </h2>
          <Tabs idPrefix="products" labelledBy={RANGE_TITLE_ID} tabs={RANGE_TABS} />
        </div>
      </section>

      <section className="wrap" aria-labelledby={BUY_TITLE_ID}>
        <div className="prod__cta reveal">
          <h2 id={BUY_TITLE_ID}>Where to buy</h2>
          <p>Order online, or find a shop near you that stocks Bestari.</p>
          <BuyLinks />
        </div>
      </section>
    </div>
  )
}
