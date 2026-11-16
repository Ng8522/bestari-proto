import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { ROUTES } from '../../content/site'
import { linesInCategory, productPath } from './catalogue'
import { PRODUCT_LINES } from './data'

const FLOUR_PATH = productPath('crispy-frying-flour-mix')

function renderAt(path: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user }
}

const mainNav = () => screen.getByRole('navigation', { name: 'Main' })
const specValue = (label: string) => screen.getByText(label, { selector: 'dt' }).nextElementSibling

describe('Products page', () => {
  it('is linked from the header and marked as the current page', () => {
    renderAt(ROUTES.products)
    expect(within(mainNav()).getByRole('link', { name: 'Products' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { level: 1, name: 'Mudah dan sedap, in every pack.' })).toBeInTheDocument()
    expect(document.title).toBe('Products | Bestari Food Berhad')
  })

  it('shows every product first, each card linking to its product page', () => {
    renderAt(ROUTES.products)
    expect(screen.getByRole('tab', { name: 'All products' })).toHaveAttribute('aria-selected', 'true')
    const cards = within(screen.getByRole('tabpanel')).getAllByRole('link')
    expect(cards).toHaveLength(PRODUCT_LINES.length)
    expect(cards[0]).toHaveAttribute('href', FLOUR_PATH)
    expect(cards[0]).toHaveTextContent('12 packs')
  })

  it('narrows the range to one category', async () => {
    const { user } = renderAt(ROUTES.products)
    await user.click(screen.getByRole('tab', { name: 'Pantry staples' }))
    const panel = screen.getByRole('tabpanel')
    const names = within(panel).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    expect(names).toEqual(linesInCategory('pantry').map((line) => line.name))
  })

  it('opens a product page from its card', async () => {
    const { user } = renderAt(ROUTES.products)
    await user.click(within(screen.getByRole('tabpanel')).getByRole('link', { name: /Chicken Stock/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'Chicken Stock' })).toBeInTheDocument()
  })
})

describe('Product page', () => {
  it('names the product in English, Malay and Chinese, under a breadcrumb', () => {
    renderAt(FLOUR_PATH)
    expect(screen.getByRole('heading', { level: 1, name: 'Multipurpose Crispy Frying Flour Mix' })).toBeInTheDocument()
    expect(screen.getByText('Campuran Tepung Goreng Rangup Serbaguna')).toHaveAttribute('lang', 'ms')
    expect(screen.getByText('多用途香脆炸粉', { selector: '.pd__names span' })).toHaveAttribute('lang', 'zh-Hans')
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(within(crumbs).getByRole('link', { name: 'Products' })).toHaveAttribute('href', ROUTES.products)
    expect(document.title).toBe('Multipurpose Crispy Frying Flour Mix | Bestari Food Berhad')
  })

  it('opens on the first pack with its photo and trade details', () => {
    renderAt(FLOUR_PATH)
    expect(screen.getByRole('radio', { name: 'Original 1 kg' })).toBeChecked()
    expect(screen.getAllByRole('radio')).toHaveLength(12)
    expect(screen.getByRole('heading', { level: 2, name: 'Original 1 kg' })).toBeInTheDocument()
    expect(specValue('Barcode')).toHaveTextContent('955 527910 0018')
    expect(specValue('Carton')).toHaveTextContent('20 × 1 kg')
    expect(screen.getByRole('img', { name: /Original 1 kg pack/ })).toBeInTheDocument()
    expect(screen.queryByText(/Photo shows/)).not.toBeInTheDocument()
  })

  it('switches the details when another pack is chosen, and says when the photo is another pack', async () => {
    const { user } = renderAt(FLOUR_PATH)
    await user.click(screen.getByRole('radio', { name: 'Garlic 150 g' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Garlic 150 g' })).toBeInTheDocument()
    expect(specValue('Barcode')).toHaveTextContent('955 527910 3286')
    expect(specValue('Pack size')).toHaveTextContent('150 g')
    expect(screen.getByText('Photo shows the Original 1 kg pack.')).toBeInTheDocument()
  })

  it('moves between packs with the arrow keys', async () => {
    const { user } = renderAt(FLOUR_PATH)
    await user.click(screen.getByRole('radio', { name: 'Original 1 kg' }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Hot & Spicy 1 kg' })).toBeChecked()
    expect(specValue('Barcode')).toHaveTextContent('955 527910 0063')
  })

  it('says which details are still to be confirmed', async () => {
    const { user } = renderAt(FLOUR_PATH)
    await user.click(screen.getByRole('radio', { name: 'Kaw Kaw 1 kg' }))
    expect(screen.queryByText('Barcode', { selector: 'dt' })).not.toBeInTheDocument()
    expect(
      screen.getByText('Still to be confirmed for this pack: barcode, shelf life, dimensions (cm), carton.'),
    ).toBeInTheDocument()
  })

  it('links to the shop in a new tab and to the outlet finder', () => {
    renderAt(FLOUR_PATH)
    const main = screen.getByRole('main')
    const shop = within(main).getByRole('link', { name: /Shop online/ })
    expect(shop).toHaveAttribute('href', ROUTES.shop)
    expect(shop).toHaveAttribute('target', '_blank')
    expect(within(main).getByRole('link', { name: 'Find an outlet' })).toHaveAttribute('href', ROUTES.onsiteOutlets)
  })

  it('suggests more products and starts the next one on its first pack', async () => {
    const { user } = renderAt(FLOUR_PATH)
    await user.click(screen.getByRole('radio', { name: 'Mala 520 g' }))
    const more = screen.getByRole('region', { name: 'More from Bestari' })
    expect(within(more).getAllByRole('link', { name: /\d+ packs?/ })).toHaveLength(4)
    await user.click(within(more).getByRole('link', { name: /Tempura Flour/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'Tempura Flour' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '500 g' })).toBeChecked()
  })

  it('shows the 404 page for an unknown product', () => {
    renderAt(productPath('no-such-product'))
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found.' })).toBeInTheDocument()
  })
})
