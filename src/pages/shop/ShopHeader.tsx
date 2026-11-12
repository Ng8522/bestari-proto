import { useId, useRef, type RefObject } from 'react'
import { Link } from 'react-router'
import { COMPANY, LOGO, ROUTES } from '../../content/site'
import { useSlashShortcut } from './hooks'

/** Green strip above the shop nav: links back to the corporate site. */
export function UtilityBar() {
  return (
    <div className="shop-util">
      <div className="wrap shop-util__inner">
        <nav className="shop-util__links" aria-label="Bestari sites">
          <Link to={ROUTES.home}>
            <span aria-hidden="true">← </span>bestarifood.com
          </Link>
          <Link to={ROUTES.investors}>Investors</Link>
          <a href="#">Track order</a>
          <a href={COMPANY.email.href}>Help</a>
        </nav>
      </div>
    </div>
  )
}

interface ShopNavProps {
  query: string
  onQueryChange: (query: string) => void
  cartCount: number
  isBadgePopping: boolean
  isCartOpen: boolean
  onOpenCart: () => void
  onSignIn: () => void
  cartButtonRef: RefObject<HTMLButtonElement | null>
  cartDrawerId: string
}

/** Sticky shop nav: logo, search ("/" focuses it), Sign in and Cart. */
export function ShopNav(props: ShopNavProps) {
  const { query, onQueryChange, cartCount, isBadgePopping, isCartOpen, onOpenCart, onSignIn } = props
  const searchRef = useRef<HTMLInputElement>(null)
  const searchId = useId()
  useSlashShortcut(searchRef, !isCartOpen)
  const itemsLabel = `${cartCount} ${cartCount === 1 ? 'item' : 'items'}`

  return (
    <header className="shop-nav">
      <div className="wrap shop-nav__inner">
        <Link className="shop-nav__logo" to={ROUTES.home}>
          <img src={LOGO.src} alt={LOGO.alt} width="97" height="58" />
        </Link>
        <div className="shop-nav__search" role="search">
          <label className="shop-search" htmlFor={searchId}>
            <span className="visually-hidden">Search products</span>
            <span aria-hidden="true">⌕</span>
            <input
              ref={searchRef}
              id={searchId}
              className="shop-search__input"
              type="search"
              placeholder="Search tepung goreng, kari, tempura…"
              autoComplete="off"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
            <kbd aria-hidden="true">/</kbd>
          </label>
        </div>
        <button type="button" className="shop-icobtn shop-nav__signin" onClick={onSignIn}>
          Sign in
        </button>
        <button
          type="button"
          ref={props.cartButtonRef}
          className="shop-icobtn shop-cartbtn"
          aria-label={`Cart, ${itemsLabel}`}
          aria-haspopup="dialog"
          aria-controls={props.cartDrawerId}
          onClick={onOpenCart}
        >
          Cart <span className={`shop-cartbtn__count${isBadgePopping ? ' pop' : ''}`}>{cartCount}</span>
        </button>
      </div>
    </header>
  )
}
