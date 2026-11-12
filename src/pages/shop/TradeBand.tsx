import { COMPANY } from '../../content/site'
import { TRADE_POINTS } from './data'

/** Dark "Cooking for a crowd?" band for restaurants, caterers and resellers. */
export function TradeBand() {
  return (
    <section className="trade" id="trade" aria-labelledby="shop-trade-title">
      <div className="wrap">
        <div className="trade__box">
          <div>
            <h2 id="shop-trade-title">Cooking for a crowd?</h2>
            <p className="trade__lede">
              Restaurants, caterers, warung and resellers can order carton quantities at trade pricing, with dedicated
              account support.
            </p>
            <a className="btn btn-saffron" href={COMPANY.email.href}>
              Apply for a trade account <span className="arr" aria-hidden="true">→</span>
            </a>
          </div>
          <ul className="trade__list">
            {TRADE_POINTS.map((point, index) => (
              <li key={point}>
                <b>{String(index + 1).padStart(2, '0')}</b>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
