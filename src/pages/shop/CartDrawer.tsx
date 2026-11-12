import { useEffect, useId, useRef } from 'react'
import { formatRM, freeDeliveryProgress, lineTotal, subtotal, type Cart, type CartItem } from './cart'
import { PAYMENT_METHODS } from './data'
import { useModalKeys } from './hooks'

interface CartDrawerProps {
  id: string
  isOpen: boolean
  cart: Cart
  onClose: () => void
  onChangeQty: (key: string, delta: number) => void
  onCheckout: () => void
}

interface DeliveryProgressBarProps {
  amount: number
}

function DeliveryProgressBar({ amount }: DeliveryProgressBarProps) {
  const { remaining, percent, isUnlocked } = freeDeliveryProgress(amount)
  return (
    <div className="ship">
      <span>
        {isUnlocked ? (
          <b>You’ve unlocked free delivery</b>
        ) : (
          <>
            Add <b>{formatRM(remaining)}</b> more for free delivery
          </>
        )}
      </span>
      <div
        className="ship__bar"
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
      >
        <i className="ship__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

interface CartLineProps {
  line: CartItem
  onChangeQty: (key: string, delta: number) => void
}

function CartLine({ line, onChangeQty }: CartLineProps) {
  const label = `${line.name} ${line.variant}`
  return (
    <li className="it">
      <img className="it__img" src={line.img} alt="" />
      <div>
        <h3 className="it__name">{line.name}</h3>
        <span className="it__variant">{line.variant}</span>
        <div className="qty">
          <button type="button" aria-label={`Decrease quantity of ${label}`} onClick={() => onChangeQty(line.key, -1)}>
            −
          </button>
          <span className="qty__n">
            <span className="visually-hidden">Quantity </span>
            {line.qty}
          </span>
          <button type="button" aria-label={`Increase quantity of ${label}`} onClick={() => onChangeQty(line.key, 1)}>
            +
          </button>
        </div>
      </div>
      <b className="it__total">{formatRM(lineTotal(line))}</b>
    </li>
  )
}

interface CartLinesProps {
  cart: Cart
  onChangeQty: (key: string, delta: number) => void
}

function CartLines({ cart, onChangeQty }: CartLinesProps) {
  if (cart.length === 0) {
    return (
      <p className="cart-empty">
        Your cart is empty.
        <br />
        Let’s makan!
      </p>
    )
  }
  return (
    <ul aria-label="Cart items">
      {cart.map((line) => (
        <CartLine key={line.key} line={line} onChangeQty={onChangeQty} />
      ))}
    </ul>
  )
}

interface CartSummaryProps {
  amount: number
  onCheckout: () => void
}

function CartSummary({ amount, onCheckout }: CartSummaryProps) {
  return (
    <div className="drawer__foot">
      <div className="tot">
        <span>Subtotal</span>
        <span>{formatRM(amount)}</span>
      </div>
      <p className="pay">{PAYMENT_METHODS}</p>
      <button type="button" className="btn btn-brand checkout" onClick={onCheckout}>
        Checkout <span className="arr" aria-hidden="true">→</span>
      </button>
    </div>
  )
}

/** Right-hand cart drawer: a modal dialog that traps focus, closes on Escape or backdrop click. */
export function CartDrawer({ id, isOpen, cart, onClose, onChangeQty, onCheckout }: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const amount = subtotal(cart)
  useModalKeys(drawerRef, isOpen, onClose)

  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  return (
    <>
      <div className={`scrim${isOpen ? ' open' : ''}`} aria-hidden="true" onClick={onClose} />
      <div
        ref={drawerRef}
        id={id}
        className={`drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={isOpen ? undefined : true}
        inert={!isOpen}
      >
        <div className="drawer__head">
          <h2 className="drawer__title" id={titleId}>
            Your cart
          </h2>
          <button ref={closeRef} type="button" className="drawer__x" aria-label="Close cart" onClick={onClose}>
            ✕
          </button>
        </div>
        <DeliveryProgressBar amount={amount} />
        <div className="items">
          <CartLines cart={cart} onChangeQty={onChangeQty} />
        </div>
        <CartSummary amount={amount} onCheckout={onCheckout} />
      </div>
    </>
  )
}
