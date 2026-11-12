import { formatRM, productLine, type NewCartItem } from './cart'
import type { Product, Variant } from './data'

interface ProductCardProps {
  product: Product
  variant: Variant
  onSelectVariant: (productId: string, label: string) => void
  onAdd: (item: NewCartItem) => void
}

interface SizeChipsProps {
  product: Product
  selectedLabel: string
  onSelect: (label: string) => void
}

/** Size buttons; selecting one swaps the card's price and image. A single size is a static chip. */
function SizeChips({ product, selectedLabel, onSelect }: SizeChipsProps) {
  if (product.variants.length === 1) {
    return (
      <div className="sizes">
        <span className="sizes__chip on">{product.variants[0].label}</span>
      </div>
    )
  }
  return (
    <div className="sizes" role="group" aria-label={`${product.name} size`}>
      {product.variants.map((item) => {
        const isOn = item.label === selectedLabel
        return (
          <button
            key={item.label}
            type="button"
            className={`sizes__chip${isOn ? ' on' : ''}`}
            aria-pressed={isOn}
            onClick={() => onSelect(item.label)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export function ProductCard({ product, variant, onSelectVariant, onAdd }: ProductCardProps) {
  const { badge } = product
  return (
    <li className="pc">
      {badge && <span className={`pc__badge${badge.tone === 'green' ? ' pc__badge--n' : ''}`}>{badge.label}</span>}
      <div className="pc__im">
        <img src={variant.img} alt={`${product.name}, ${variant.label}`} loading="lazy" />
      </div>
      <div className="pc__bd">
        <div>
          <h3 className="pc__name">{product.name}</h3>
          <div className="pc__zh" lang="zh-Hans">
            {product.zh}
          </div>
        </div>
        <SizeChips
          product={product}
          selectedLabel={variant.label}
          onSelect={(label) => onSelectVariant(product.id, label)}
        />
        <div className="pc__row">
          <span className="price">{formatRM(variant.price)}</span>
          <button
            type="button"
            className="add"
            aria-label={`Add ${product.name} ${variant.label} to cart`}
            onClick={() => onAdd(productLine(product, variant))}
          >
            +
          </button>
        </div>
      </div>
    </li>
  )
}
