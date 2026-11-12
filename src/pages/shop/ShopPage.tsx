import { useCallback, useId, useRef, useState } from 'react'
import { useDocumentTitle } from '../../components/routing'
import { findVariant } from './browse'
import { itemCount, productLine, type NewCartItem } from './cart'
import { Bundles } from './Bundles'
import { CartDrawer } from './CartDrawer'
import { Catalogue } from './Catalogue'
import { HERO_PROMO, PRODUCTS } from './data'
import { BADGE_POP_MS, useCart, useTimedFlag, useToast } from './hooks'
import { PromoHero } from './PromoHero'
import { ShopFooter } from './ShopFooter'
import { ShopNav, UtilityBar } from './ShopHeader'
import { TradeBand } from './TradeBand'
import './shop.css'

const CHECKOUT_MESSAGE = 'Checkout is coming soon'
const SIGN_IN_MESSAGE = 'Sign in is coming soon'

function promoLine(): NewCartItem | undefined {
  const product = PRODUCTS.find((item) => item.id === HERO_PROMO.productId)
  const variant = product && findVariant(product, HERO_PROMO.variantLabel)
  return product && variant ? productLine(product, variant) : undefined
}

/** Cart state plus the feedback every add gives: the badge pops and a toast names the item. */
function useShopCart() {
  const { cart, add, changeQty } = useCart()
  const [isBadgePopping, popBadge] = useTimedFlag(BADGE_POP_MS)
  const toast = useToast()
  const { show: showToast } = toast

  const handleAdd = useCallback(
    (item: NewCartItem) => {
      add(item)
      popBadge()
      showToast(`Added · ${item.name}`)
    },
    [add, popBadge, showToast],
  )
  const handleAddPromo = useCallback(() => {
    const line = promoLine()
    if (line) handleAdd(line)
  }, [handleAdd])

  return { cart, changeQty, handleAdd, handleAddPromo, isBadgePopping, toast }
}

/** shop.bestarifood.com: draws its own utility bar, nav and footer (it is not inside Layout). */
export function ShopPage() {
  useDocumentTitle('Shop')
  const { cart, changeQty, handleAdd, handleAddPromo, isBadgePopping, toast } = useShopCart()
  const [query, setQuery] = useState('')
  const [isCartOpen, setCartOpen] = useState(false)
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  const drawerId = useId()
  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => {
    setCartOpen(false)
    cartButtonRef.current?.focus()
  }, [])

  return (
    <div className="shop">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <UtilityBar />
      <ShopNav
        query={query}
        onQueryChange={setQuery}
        cartCount={itemCount(cart)}
        isBadgePopping={isBadgePopping}
        isCartOpen={isCartOpen}
        onOpenCart={openCart}
        onSignIn={() => toast.show(SIGN_IN_MESSAGE)}
        cartButtonRef={cartButtonRef}
        cartDrawerId={drawerId}
      />
      <main id="main">
        <PromoHero onAddPromo={handleAddPromo} />
        <Catalogue query={query} onAdd={handleAdd} />
        <Bundles onAdd={handleAdd} />
        <TradeBand />
      </main>
      <ShopFooter />
      <CartDrawer
        id={drawerId}
        isOpen={isCartOpen}
        cart={cart}
        onClose={closeCart}
        onChangeQty={changeQty}
        onCheckout={() => toast.show(CHECKOUT_MESSAGE)}
      />
      <div className={`toast${toast.isVisible ? ' show' : ''}`} role="status" aria-live="polite" aria-atomic="true">
        {toast.message}
      </div>
    </div>
  )
}
