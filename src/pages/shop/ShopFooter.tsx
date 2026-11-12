import { Link } from 'react-router'
import { ROUTES } from '../../content/site'

/** The shop's slim dark footer. */
export function ShopFooter() {
  return (
    <footer className="shop-foot">
      <div className="wrap">
        <div className="shop-foot__bottom">
          <span>© 2026 Bestari · Official online shop · 100% JAKIM Halal</span>
          <span>
            <Link to={ROUTES.home}>bestarifood.com</Link> · <Link to={ROUTES.investors}>Investors</Link> · Help ·
            Privacy
          </span>
        </div>
      </div>
    </footer>
  )
}
