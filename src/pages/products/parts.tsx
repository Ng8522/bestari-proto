import { Link } from 'react-router'
import { SmartLink } from '../../components/routing'
import { ROUTES } from '../../content/site'
import { categoryLabel, coverPhoto, packCount, productPath } from './catalogue'
import type { ProductLine } from './data'

/** Grid of product cards, each linking to its product page. */
export function ProductGrid({ lines }: { lines: readonly ProductLine[] }) {
  return (
    <ul className="prod-grid">
      {lines.map((line) => (
        <ProductCard key={line.slug} line={line} />
      ))}
    </ul>
  )
}

function ProductCard({ line }: { line: ProductLine }) {
  const photo = coverPhoto(line)
  return (
    <li>
      <Link className="prod-card" to={productPath(line.slug)}>
        <div className="prod-card__media">{photo && <img src={photo.src} alt="" loading="lazy" />}</div>
        <div className="prod-card__body">
          <p className="prod-card__cat">{categoryLabel(line.category)}</p>
          <h3 className="prod-card__name">{line.name}</h3>
          <p className="prod-card__zh" lang="zh-Hans">
            {line.nameZh}
          </p>
          <p className="prod-card__count">
            {packCount(line.packs.length)} <span aria-hidden="true">→</span>
          </p>
        </div>
      </Link>
    </li>
  )
}

/** Where to buy: the online shop (opens in a new tab) and the outlet finder. */
export function BuyLinks() {
  return (
    <div className="prod-buy">
      <SmartLink className="btn btn-brand" href={ROUTES.shop}>
        Shop online <span className="arr" aria-hidden="true">→</span>
      </SmartLink>
      <Link className="btn btn-ghost" to={ROUTES.onsiteOutlets}>
        Find an outlet
      </Link>
    </div>
  )
}
