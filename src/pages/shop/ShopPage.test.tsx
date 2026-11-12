import { describe, expect, it, vi } from 'vitest'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { ROUTES } from '../../content/site'
import { CART_STORAGE_KEY } from './data'

type User = ReturnType<typeof userEvent.setup>

function renderShop(user: User = userEvent.setup()) {
  const view = render(
    <MemoryRouter initialEntries={[ROUTES.shop]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user, ...view }
}

function productNames(): string[] {
  const grid = screen.getByRole('list', { name: 'Products' })
  return within(grid)
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent ?? '')
}

function card(name: string): HTMLElement {
  const item = screen.getByRole('heading', { level: 3, name }).closest('li')
  if (!item) throw new Error(`No card for ${name}`)
  return item
}

function cartButton(): HTMLElement {
  return screen.getByRole('button', { name: /^Cart,/ })
}

function cartCount(): string {
  return cartButton().querySelector('.shop-cartbtn__count')?.textContent ?? ''
}

async function openCart(user: User): Promise<HTMLElement> {
  await user.click(cartButton())
  return screen.getByRole('dialog', { name: 'Your cart' })
}

const EGG = 'Golden Salted Egg Seasoning'

describe('Shop page', () => {
  it('draws its own chrome, sets the title and links back to the corporate site', () => {
    renderShop()
    expect(document.title).toBe('Shop | Bestari Food Berhad')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('heading', { level: 1, name: 'Crispy, spicy, numbing. Sedap!' })).toBeInTheDocument()

    const util = screen.getByRole('navigation', { name: 'Bestari sites' })
    expect(within(util).getByRole('link', { name: 'bestarifood.com' })).toHaveAttribute('href', ROUTES.home)
    expect(within(util).getByRole('link', { name: 'Investors' })).toHaveAttribute('href', ROUTES.investors)
    expect(screen.getByRole('link', { name: 'Bestari Food Berhad' })).toHaveAttribute('href', ROUTES.home)
    expect(screen.getByText('© 2026 Bestari · Official online shop · 100% JAKIM Halal')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cooking for a crowd?' }).closest('section')).toHaveAttribute('id', 'trade')
    expect(screen.getByText('Prices shown are sample placeholders for design purposes.')).toBeInTheDocument()
  })

  it('lists all 15 products by popularity', () => {
    renderShop()
    const names = productNames()
    expect(names).toHaveLength(15)
    expect(names.slice(0, 4)).toEqual([
      'Multipurpose Crispy Frying Flour Mix',
      'Instant Curry Powder Premix',
      'Crispy Frying Flour Mix — 150g Flavours',
      EGG,
    ])
  })

  it('filters by category with pressed-state pills', async () => {
    const { user } = renderShop()
    const pills = screen.getByRole('group', { name: 'Filter by category' })
    expect(within(pills).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(within(pills).getByRole('button', { name: 'Pantry' }))
    expect(within(pills).getByRole('button', { name: 'Pantry' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(pills).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
    expect(productNames()).toEqual(['Starch', 'Spices', 'Iodised Himalayan Rock Salt', 'Flavour Enhancer MSG'])

    await user.click(within(pills).getByRole('button', { name: 'Dessert & snack' }))
    expect(productNames()).toEqual(['Instant Mashed Potatoes', 'Cucur', 'Custard'])
  })

  it('sorts by the selected size price', async () => {
    const { user } = renderShop()
    const sort = screen.getByRole('combobox', { name: 'Sort products' })

    await user.selectOptions(sort, 'Price: low to high')
    expect(productNames().slice(0, 3)).toEqual(['Crispy Frying Flour Mix — 150g Flavours', 'Starch', 'Cucur'])
    expect(productNames().at(-1)).toBe(EGG)

    await user.selectOptions(sort, 'Price: high to low')
    expect(productNames()[0]).toBe(EGG)

    // Picking the 150g salted egg (RM 5.90) moves it down the list.
    await user.click(within(card(EGG)).getByRole('button', { name: '150g' }))
    expect(productNames()[0]).toBe('Chicken Stock')
  })

  it('searches live by English, Chinese and Malay terms, with an empty state', async () => {
    const { user } = renderShop()
    const search = screen.getByRole('searchbox', { name: 'Search products' })

    await user.type(search, 'SALTED')
    expect(productNames()).toEqual([EGG])

    await user.clear(search)
    await user.type(search, '咖喱')
    expect(productNames()).toEqual(['Instant Curry Powder Premix'])

    await user.clear(search)
    await user.type(search, 'kari')
    expect(productNames()).toEqual(['Instant Curry Powder Premix'])

    await user.clear(search)
    await user.type(search, 'zzz')
    expect(screen.getByText('No products match.')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Products' })).not.toBeInTheDocument()

    await user.clear(search)
    expect(productNames()).toHaveLength(15)
  })

  it('focuses the search with "/" unless the user is typing in a field', async () => {
    const { user } = renderShop()
    const search = screen.getByRole('searchbox', { name: 'Search products' })

    await user.keyboard('/')
    expect(search).toHaveFocus()
    expect(search).toHaveValue('')

    await user.keyboard('a/')
    expect(search).toHaveValue('a/')

    const sort = screen.getByRole('combobox', { name: 'Sort products' })
    sort.focus()
    await user.keyboard('/')
    expect(sort).toHaveFocus()
  })

  it('swaps price and image when a size chip is selected', async () => {
    const { user } = renderShop()
    const egg = card(EGG)
    expect(within(egg).getByText('RM 24.90')).toBeInTheDocument()
    expect(within(egg).getByRole('button', { name: '800g' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(within(egg).getByRole('button', { name: '150g' }))
    expect(within(egg).getByText('RM 5.90')).toBeInTheDocument()
    expect(within(egg).getByRole('button', { name: '150g' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(egg).getByRole('img')).toHaveAttribute('src', '/assets/p-saltedegg-150g.png')
    expect(within(egg).getByRole('button', { name: `Add ${EGG} 150g to cart` })).toBeInTheDocument()
  })

  it('adds to the cart, bumps the badge and shows a toast', async () => {
    const { user } = renderShop()
    expect(cartCount()).toBe('0')

    await user.click(screen.getByRole('button', { name: `Add ${EGG} 800g to cart` }))
    expect(cartCount()).toBe('1')
    expect(cartButton()).toHaveAccessibleName('Cart, 1 item')
    expect(cartButton().querySelector('.shop-cartbtn__count')).toHaveClass('pop')
    expect(screen.getByRole('status')).toHaveTextContent(`Added · ${EGG}`)
    expect(screen.getByRole('status')).toHaveClass('show')

    await user.click(screen.getByRole('button', { name: 'Add Mala 520g to cart' }))
    expect(cartCount()).toBe('2')
    expect(screen.getByRole('status')).toHaveTextContent('Added · Multipurpose Crispy Frying Flour Mix')
  })

  it('hides the toast after 1.8s and the badge pop after 250ms', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      const { user } = renderShop(userEvent.setup({ advanceTimers: vi.advanceTimersByTime }))
      await user.click(screen.getByRole('button', { name: `Add ${EGG} 800g to cart` }))
      const badge = cartButton().querySelector('.shop-cartbtn__count')

      act(() => vi.advanceTimersByTime(250))
      expect(badge).not.toHaveClass('pop')
      expect(screen.getByRole('status')).toHaveClass('show')

      act(() => vi.advanceTimersByTime(1550))
      expect(screen.getByRole('status')).not.toHaveClass('show')
    } finally {
      vi.useRealTimers()
    }
  })

  it('opens the cart as a modal dialog and returns focus to the Cart button', async () => {
    const { user, container } = renderShop()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const dialog = await openCart(user)
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(within(dialog).getByRole('button', { name: 'Close cart' })).toHaveFocus()
    expect(within(dialog).getByText('Your cart is empty.', { exact: false })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(cartButton()).toHaveFocus()

    await openCart(user)
    const scrim = container.querySelector('.scrim')
    if (!scrim) throw new Error('No backdrop')
    await user.click(scrim)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(cartButton()).toHaveFocus()

    await user.click(within(await openCart(user)).getByRole('button', { name: 'Close cart' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(cartButton()).toHaveFocus()
  })

  it('traps Tab inside the open drawer and ignores "/"', async () => {
    const { user } = renderShop()
    const dialog = await openCart(user)
    const close = within(dialog).getByRole('button', { name: 'Close cart' })
    const checkout = within(dialog).getByRole('button', { name: 'Checkout' })

    await user.tab({ shift: true })
    expect(checkout).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()

    await user.keyboard('/')
    expect(close).toHaveFocus()
  })

  it('changes quantities, removes at 0 and tracks free delivery', async () => {
    const { user } = renderShop()
    await user.click(screen.getByRole('button', { name: `Add ${EGG} 800g to cart` }))
    const dialog = await openCart(user)
    const progress = within(dialog).getByRole('progressbar', { name: 'Progress to free delivery' })

    expect(within(dialog).getByText('RM 55.10')).toBeInTheDocument()
    expect(dialog).toHaveTextContent('Add RM 55.10 more for free delivery')
    expect(progress).toHaveAttribute('aria-valuenow', '31')

    const increase = within(dialog).getByRole('button', { name: `Increase quantity of ${EGG} 800g` })
    await user.click(increase)
    await user.click(increase)
    await user.click(increase)
    expect(within(dialog).getByText('Quantity').parentElement).toHaveTextContent('Quantity 4')
    expect(dialog).toHaveTextContent('You’ve unlocked free delivery')
    expect(progress).toHaveAttribute('aria-valuenow', '100')
    expect(within(dialog).getAllByText('RM 99.60')).toHaveLength(2)
    expect(cartCount()).toBe('4')

    const decrease = within(dialog).getByRole('button', { name: `Decrease quantity of ${EGG} 800g` })
    for (let step = 0; step < 4; step += 1) await user.click(decrease)
    expect(within(dialog).queryByRole('list', { name: 'Cart items' })).not.toBeInTheDocument()
    expect(within(dialog).getByText('Your cart is empty.', { exact: false })).toBeInTheDocument()
    expect(within(dialog).getByText('RM 0.00')).toBeInTheDocument()
    expect(cartCount()).toBe('0')
  })

  it('shows a coming-soon toast for checkout', async () => {
    const { user } = renderShop()
    const dialog = await openCart(user)
    await user.click(within(dialog).getByRole('button', { name: 'Checkout' }))
    expect(screen.getByRole('status')).toHaveTextContent('Checkout is coming soon')
  })

  it('adds bundles with their strike-through price', async () => {
    const { user } = renderShop()
    const bundle = screen.getByRole('heading', { level: 3, name: 'Curry Night' }).closest('li')
    if (!bundle) throw new Error('No Curry Night bundle')
    expect(within(bundle).getByText('RM 14.80').closest('s')).toBeInTheDocument()

    await user.click(within(bundle).getByRole('button', { name: 'Add Curry Night bundle to cart' }))
    expect(cartCount()).toBe('1')
    expect(screen.getByRole('status')).toHaveTextContent('Added · Curry Night')

    const dialog = await openCart(user)
    const lines = within(dialog).getByRole('list', { name: 'Cart items' })
    expect(within(lines).getByRole('heading', { name: 'Curry Night' })).toBeInTheDocument()
    expect(within(lines).getByText('Bundle')).toBeInTheDocument()
    expect(within(lines).getByText('RM 12.90')).toBeInTheDocument()
  })

  it('persists the cart in localStorage across renders', async () => {
    const first = renderShop()
    await first.user.click(screen.getByRole('button', { name: 'Add Mala 520g to cart' }))
    await first.user.click(screen.getByRole('button', { name: 'Add Mala 520g to cart' }))
    expect(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? '[]')).toEqual([
      {
        key: 'flour|520g',
        name: 'Multipurpose Crispy Frying Flour Mix',
        variant: '520g',
        price: 7.9,
        img: '/assets/p-flour-mala-520g.png',
        qty: 2,
      },
    ])
    first.unmount()

    const { user } = renderShop()
    expect(cartCount()).toBe('2')
    const dialog = await openCart(user)
    expect(within(dialog).getByText('520g')).toBeInTheDocument()
    expect(within(dialog).getByText('RM 15.80', { selector: 'b' })).toBeInTheDocument()
  })

  it('ignores corrupt or invalid stored carts', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, '{not json')
    const corrupt = renderShop()
    expect(cartCount()).toBe('0')
    corrupt.unmount()

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([
        { key: 'salt|Pack', name: 'Iodised Himalayan Rock Salt', variant: 'Pack', price: 5.5, img: '/assets/p-salt.png', qty: 3 },
        { key: 'bad', name: 'Bad', variant: '', price: 'free', img: '', qty: 1 },
        null,
      ]),
    )
    renderShop()
    expect(cartCount()).toBe('3')
  })
})
