import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useDocumentTitle } from '../../components/routing'
import { ROUTES } from '../../content/site'
import { NotFoundPage } from '../NotFoundPage'
import { categoryLabel, findProductLine, missingSpecs, moreProducts, packCount, packPhoto, specRows } from './catalogue'
import type { Pack, ProductLine } from './data'
import { BuyLinks, ProductGrid } from './parts'
import './products.css'

const MORE_PRODUCTS_LIMIT = 4
const PACK_TITLE_ID = 'pd-pack-title'
const MORE_TITLE_ID = 'pd-more-title'

/** /products/:slug — one product: its names, a pack picker, and the chosen pack's photo and trade details. */
export function ProductDetailPage() {
  const { slug } = useParams()
  const line = findProductLine(slug)
  if (!line) return <NotFoundPage />
  // Keyed by product, so moving to another product starts again on its first pack.
  return <ProductDetail key={line.slug} line={line} />
}

function ProductDetail({ line }: { line: ProductLine }) {
  useDocumentTitle(line.name)
  const [packId, setPackId] = useState(line.packs[0].id)
  const pack = line.packs.find((entry) => entry.id === packId) ?? line.packs[0]

  return (
    <div className="pd">
      <div className="wrap">
        <nav className="pd__crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to={ROUTES.products}>Products</Link>
            </li>
            <li aria-current="page">{line.name}</li>
          </ol>
        </nav>

        <div className="pd__main">
          <header className="pd__head">
            <p className="eyebrow">
              {categoryLabel(line.category)} · {line.tagline}
            </p>
            <h1>{line.name}</h1>
            <p className="pd__names">
              {line.nameMs && <span lang="ms">{line.nameMs}</span>}
              <span lang="zh-Hans">{line.nameZh}</span>
            </p>
          </header>
          <PackFigure line={line} pack={pack} />
          <div className="pd__details">
            <PackPicker packs={line.packs} selectedId={pack.id} onSelect={setPackId} />
            <PackDetails pack={pack} />
            <BuyLinks />
          </div>
        </div>

        <section className="pd__more" aria-labelledby={MORE_TITLE_ID}>
          <div className="pd__more-head">
            <h2 id={MORE_TITLE_ID}>More from Bestari</h2>
            <Link className="pd__all" to={ROUTES.products}>
              All products <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ProductGrid lines={moreProducts(line, MORE_PRODUCTS_LIMIT)} />
        </section>
      </div>
    </div>
  )
}

function PackFigure({ line, pack }: { line: ProductLine; pack: Pack }) {
  const photo = packPhoto(line, pack)
  if (!photo) return null
  return (
    <figure className="pd__media">
      <div className="pd__photo">
        <img src={photo.src} alt={`${line.name}, ${photo.shows.label} pack`} />
      </div>
      {!photo.isOwn && <figcaption>Photo shows the {photo.shows.label} pack.</figcaption>}
    </figure>
  )
}

interface PackPickerProps {
  packs: readonly Pack[]
  selectedId: string
  onSelect: (id: string) => void
}

/** Native radio buttons styled as chips: arrow keys move between packs, and the choice shows straight away. */
function PackPicker({ packs, selectedId, onSelect }: PackPickerProps) {
  return (
    <fieldset className="pd__packs">
      <legend>
        Choose a pack <span aria-hidden="true">· {packCount(packs.length)}</span>
      </legend>
      <div className="pd__chips">
        {packs.map((pack) => (
          <label key={pack.id} className="pd__chip">
            <input
              type="radio"
              name="pack"
              value={pack.id}
              checked={pack.id === selectedId}
              onChange={() => onSelect(pack.id)}
            />
            <span>{pack.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function PackDetails({ pack }: { pack: Pack }) {
  const missing = missingSpecs(pack)
  return (
    <section className="pd__spec" aria-labelledby={PACK_TITLE_ID}>
      <h2 id={PACK_TITLE_ID}>{pack.label}</h2>
      {pack.localName && <p className="pd__local">{pack.localName}</p>}
      <dl className="pd__rows">
        {specRows(pack).map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      {missing.length > 0 && (
        <p className="pd__note">Still to be confirmed for this pack: {missing.join(', ').toLowerCase()}.</p>
      )}
    </section>
  )
}
