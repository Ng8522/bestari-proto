import { asset } from '../../content/site'
import { PERKS } from './data'

interface PromoHeroProps {
  onAddPromo: () => void
}

/** Green Mala banner (2fr) with two side tiles (1fr), then the trust strip. */
export function PromoHero({ onAddPromo }: PromoHeroProps) {
  return (
    <section className="phero" aria-label="Featured">
      <div className="wrap">
        <div className="phero__grid">
          <div className="banner">
            <div className="banner__sun" aria-hidden="true" />
            <div className="banner__copy">
              <p className="eyebrow">New flavour · Mala</p>
              <h1>Crispy, spicy, numbing. Sedap!</h1>
              <p className="banner__lede">
                Our Multipurpose Crispy Frying Flour Mix now in Mala. Eggless coating, made with Himalayan rock salt.
              </p>
              <button type="button" className="btn btn-saffron" onClick={onAddPromo}>
                Add Mala 520g to cart <span className="arr" aria-hidden="true">→</span>
              </button>
            </div>
            <div className="banner__imgs" aria-hidden="true">
              <img className="banner__img--a" src={asset('p-flour-kawkaw-1kg.png')} alt="" />
              <img className="banner__img--b" src={asset('p-flour-mala-520g.png')} alt="" />
            </div>
          </div>
          <div className="side">
            <a className="mini mini--y" href="#bundles">
              <img src={asset('p-curry-meat.png')} alt="" />
              <h2 className="mini__title">Curry night bundles</h2>
              <p>Chicken &amp; seafood premixes, paired.</p>
            </a>
            <a className="mini mini--g" href="#trade">
              <img src={asset('p-chickenstock-1kg.png')} alt="" />
              <h2 className="mini__title">Bulk for F&amp;B</h2>
              <p>1 KG packs for restaurants &amp; resellers.</p>
            </a>
          </div>
        </div>
        <ul className="perks" aria-label="Why shop with Bestari">
          {PERKS.map((perk) => (
            <li key={perk.title}>
              <b>{perk.title}</b>
              <span>{perk.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
