import { bundleLine, formatRM, type NewCartItem } from './cart'
import { BUNDLES } from './data'

interface BundlesProps {
  onAdd: (item: NewCartItem) => void
}

/** Three meal bundles with a strike-through "was" price. */
export function Bundles({ onAdd }: BundlesProps) {
  return (
    <section className="bundles" id="bundles" aria-labelledby="shop-bundles-title">
      <div className="wrap">
        <p className="eyebrow bundles__eyebrow">Bundles</p>
        <h2 id="shop-bundles-title">Cook the whole meal.</h2>
        <ul className="bgrid">
          {BUNDLES.map((bundle) => (
            <li className="bc" key={bundle.id}>
              <div className="bc__stack" aria-hidden="true">
                {bundle.shots.map((shot) => (
                  <img key={shot.img} src={shot.img} alt="" loading="lazy" style={{ left: shot.left }} />
                ))}
              </div>
              <h3>{bundle.name}</h3>
              <p>{bundle.description}</p>
              <div className="bc__row">
                <span className="price">
                  {formatRM(bundle.price)}
                  <s className="bc__was">
                    <span className="visually-hidden">Was </span>
                    {formatRM(bundle.was)}
                  </s>
                </span>
                <button
                  type="button"
                  className="btn btn-brand bc__add"
                  aria-label={`Add ${bundle.name} bundle to cart`}
                  onClick={() => onAdd(bundleLine(bundle))}
                >
                  Add
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
