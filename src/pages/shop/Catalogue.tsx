import { useCallback, useId, useMemo, useState } from 'react'
import { isSortOrder, SORT_OPTIONS, selectedVariant, visibleProducts, type SortOrder, type VariantSelection } from './browse'
import type { NewCartItem } from './cart'
import { CATEGORY_FILTERS, PRODUCTS, type CategoryFilter } from './data'
import { ProductCard } from './ProductCard'

interface CatalogueProps {
  query: string
  onAdd: (item: NewCartItem) => void
}

interface FilterPillsProps {
  active: CategoryFilter
  onChange: (category: CategoryFilter) => void
}

function FilterPills({ active, onChange }: FilterPillsProps) {
  return (
    <div className="filters" role="group" aria-label="Filter by category">
      {CATEGORY_FILTERS.map((category) => (
        <button
          key={category}
          type="button"
          className={category === active ? 'on' : undefined}
          aria-pressed={category === active}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

interface SortSelectProps {
  value: SortOrder
  onChange: (sort: SortOrder) => void
}

function SortSelect({ value, onChange }: SortSelectProps) {
  const sortId = useId()
  return (
    <>
      <label className="visually-hidden" htmlFor={sortId}>
        Sort products
      </label>
      <select
        id={sortId}
        className="sort"
        value={value}
        onChange={(event) => isSortOrder(event.target.value) && onChange(event.target.value)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

/** "The Bestari pantry": category pills, sort, live search results and product cards. */
export function Catalogue({ query, onAdd }: CatalogueProps) {
  const [category, setCategory] = useState<CategoryFilter>('All')
  const [sort, setSort] = useState<SortOrder>('pop')
  const [selection, setSelection] = useState<VariantSelection>({})
  const headingId = useId()

  const products = useMemo(
    () => visibleProducts(PRODUCTS, { category, sort, query, selection }),
    [category, sort, query, selection],
  )
  const selectVariant = useCallback(
    (productId: string, label: string) => setSelection((current) => ({ ...current, [productId]: label })),
    [],
  )

  return (
    <section className="cat-sec" aria-labelledby={headingId}>
      <div className="wrap">
        <div className="cat-head">
          <div>
            <p className="eyebrow">Shop all</p>
            <h2 className="cat-head__title" id={headingId}>
              The Bestari pantry
            </h2>
          </div>
          <SortSelect value={sort} onChange={setSort} />
        </div>
        <FilterPills active={category} onChange={setCategory} />
        <p className="visually-hidden" aria-live="polite">
          {products.length} {products.length === 1 ? 'product' : 'products'} shown
        </p>
        {products.length > 0 ? (
          <ul className="grid-p" aria-label="Products">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={selectedVariant(product, selection)}
                onSelectVariant={selectVariant}
                onAdd={onAdd}
              />
            ))}
          </ul>
        ) : (
          <p className="cat-empty">No products match.</p>
        )}
        <p className="cat-note">Prices shown are sample placeholders for design purposes.</p>
      </div>
    </section>
  )
}
