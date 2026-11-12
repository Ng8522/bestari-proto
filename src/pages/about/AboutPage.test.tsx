import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { ROUTES } from '../../content/site'
import { BUSINESS_PANELS, HISTORY_CARDS, LEADERS, MARQUEE_FACTS } from './data'

function renderPage() {
  const user = userEvent.setup()
  const view = render(
    <MemoryRouter initialEntries={[ROUTES.about]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user, ...view }
}

function stubReducedMotion() {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

function panelButton(title: string) {
  return screen.getByRole('button', { name: title })
}

function journeySection(container: HTMLElement) {
  const section = container.querySelector<HTMLElement>('#journey')
  if (!section) throw new Error('journey section missing')
  return section
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('About page', () => {
  it('shows the hero heading and sets the document title', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'We are Bestari.' })).toBeInTheDocument()
    expect(screen.getByText('Mudah dan sedap · Since 2004')).toBeInTheDocument()
    expect(document.title).toBe('About Us | Bestari Food Berhad')
  })

  it('renders the purpose statement word by word, with the key phrases highlighted', () => {
    const { container } = renderPage()
    const statement = container.querySelector('.purpose .big')
    expect(statement).toHaveTextContent(
      'Every great meal starts with incredible ingredients, and ours begins with our name. We make super easy, ready-to-cook, Halal food products so that everyone can cook delicious food easily, and families can spend more time together.',
    )
    const highlights = Array.from(statement?.querySelectorAll('.hl') ?? []).map((node) => node.textContent)
    expect(highlights).toEqual(['Halal', 'everyone can cook delicious food easily'])
    // jsdom reports a zero-size box at the top of the viewport, so scroll progress is complete.
    const words = statement?.querySelectorAll('.word') ?? []
    expect(words.length).toBeGreaterThan(30)
    expect(statement?.querySelectorAll('.word.on')).toHaveLength(words.length)
  })

  it('tells the founding story', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 2, name: 'A crispy idea that changed fried chicken night.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Psst… why “Bestari”?' })).toBeInTheDocument()
  })

  it('lists the six history cards on the pinned journey rail, ending with the dashed future card', () => {
    const { container } = renderPage()
    const journey = journeySection(container)
    expect(within(journey).getByRole('heading', { level: 2, name: 'The crispy history of Bestari.' })).toBeInTheDocument()

    const cards = within(journey).getAllByRole('article')
    expect(cards).toHaveLength(HISTORY_CARDS.length)
    HISTORY_CARDS.forEach((card, index) => expect(cards[index]).toHaveTextContent(card.title))
    expect(cards[cards.length - 1]).toHaveClass('fut')
    expect(journey).not.toHaveClass('hist--static')
  })

  it('expands a business panel on click and on hover', async () => {
    const { user } = renderPage()
    const [premixes, ingredients, equipment] = BUSINESS_PANELS
    expect(panelButton(premixes.title)).toHaveAttribute('aria-expanded', 'true')
    expect(panelButton(ingredients.title)).toHaveAttribute('aria-expanded', 'false')

    await user.click(panelButton(ingredients.title))
    expect(panelButton(ingredients.title)).toHaveAttribute('aria-expanded', 'true')
    expect(panelButton(premixes.title)).toHaveAttribute('aria-expanded', 'false')

    await user.hover(panelButton(equipment.title))
    expect(panelButton(equipment.title)).toHaveAttribute('aria-expanded', 'true')
    expect(panelButton(ingredients.title)).toHaveAttribute('aria-expanded', 'false')
  })

  it('expands a business panel from the keyboard', async () => {
    const { user } = renderPage()
    const [premixes, , equipment, maintenance] = BUSINESS_PANELS

    panelButton(equipment.title).focus()
    await user.keyboard('{Enter}')
    expect(panelButton(equipment.title)).toHaveAttribute('aria-expanded', 'true')
    expect(panelButton(premixes.title)).toHaveAttribute('aria-expanded', 'false')

    await user.tab()
    expect(panelButton(maintenance.title)).toHaveFocus()
    await user.keyboard(' ')
    expect(panelButton(maintenance.title)).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(maintenance.body)).toHaveAttribute('id', panelButton(maintenance.title).getAttribute('aria-controls'))
  })

  it('shows every marquee fact once to assistive tech, with a hidden copy for the loop', () => {
    renderPage()
    const list = screen.getByRole('list', { name: 'Bestari at a glance' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(MARQUEE_FACTS.length)
    expect(list.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(MARQUEE_FACTS.length)
  })

  it('shows HQ stats and the certification strip', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 2, name: 'Where every pack is made.' })).toBeInTheDocument()
    expect(screen.getByText('67,465')).toBeInTheDocument()
    expect(screen.getByText('~10 acres')).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /ISO 22000, HACCP/ }).length).toBeGreaterThan(0)
  })

  it('renders a focusable leadership strip with placeholder titles', () => {
    renderPage()
    const strip = screen.getByRole('region', { name: /leadership team/i })
    expect(strip).toHaveAttribute('tabindex', '0')
    LEADERS.forEach((leader) => expect(within(strip).getByRole('heading', { name: leader.name })).toBeInTheDocument())
    expect(within(strip).getAllByText('Title per prospectus')).toHaveLength(2)
    within(strip)
      .getAllByText('Title per prospectus')
      .forEach((node) => expect(node).toHaveClass('ph'))
  })

  it('drags the leadership strip with the mouse and swallows the click that ends the drag', () => {
    renderPage()
    const strip = screen.getByRole('region', { name: /leadership team/i })
    const card = within(strip).getByRole('heading', { name: LEADERS[0].name })
    const onClick = vi.fn()
    strip.parentElement?.addEventListener('click', onClick)

    fireEvent.pointerDown(card, { clientX: 400, button: 0, pointerType: 'mouse' })
    expect(strip).toHaveClass('is-dragging')
    fireEvent.pointerMove(window, { clientX: 250 })
    expect(strip.scrollLeft).toBe(150)
    fireEvent.pointerUp(card)
    expect(strip).not.toHaveClass('is-dragging')

    fireEvent.click(card)
    expect(onClick).not.toHaveBeenCalled()
    fireEvent.click(card)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('links on to investor relations and the shop', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /IPO, board & financials/ })).toHaveAttribute('href', ROUTES.investors)
    expect(screen.getByRole('link', { name: /Shop our products/ })).toHaveAttribute('href', ROUTES.shop)
  })

  it('swaps scroll-driven motion for static layouts when reduced motion is preferred', () => {
    stubReducedMotion()
    const { container } = renderPage()

    const journey = journeySection(container)
    expect(journey).toHaveClass('hist--static')
    expect(within(journey).getByRole('region', { name: /history timeline/i })).toHaveAttribute('tabindex', '0')
    expect(journey.style.height).toBe('')

    const list = screen.getByRole('list', { name: 'Bestari at a glance' })
    expect(list.querySelectorAll('li')).toHaveLength(MARQUEE_FACTS.length)
    expect(list.parentElement).toHaveClass('mq--static')

    const statement = container.querySelector('.purpose .big')
    expect(statement?.querySelectorAll('.word.on')).toHaveLength(statement?.querySelectorAll('.word').length ?? -1)
  })
})
