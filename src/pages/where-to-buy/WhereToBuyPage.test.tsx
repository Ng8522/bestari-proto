import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { DISTRIBUTOR_GROUPS } from '../../content/catalogue'
import { ROUTES } from '../../content/site'

const [RETAIL, FOOD_SERVICE, INTERNATIONAL] = DISTRIBUTOR_GROUPS

function renderPage() {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[ROUTES.whereToBuy]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user }
}

describe('Where to buy page', () => {
  it('shows retail distributors first, with tappable phone numbers', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Find Bestari near you.' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: new RegExp(RETAIL.title) })).toHaveAttribute('aria-selected', 'true')

    const panel = screen.getByRole('tabpanel')
    expect(within(panel).getAllByRole('heading', { level: 2 })).toHaveLength(RETAIL.distributors.length)
    expect(within(panel).getByRole('link', { name: '04-917 2714' })).toHaveAttribute('href', 'tel:+6049172714')
  })

  it('switches groups when a tab is clicked', async () => {
    const { user } = renderPage()
    await user.click(screen.getByRole('tab', { name: new RegExp(FOOD_SERVICE.title) }))

    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveAccessibleName(new RegExp(FOOD_SERVICE.title))
    FOOD_SERVICE.distributors.forEach((distributor) =>
      expect(within(panel).getByRole('heading', { name: distributor.name })).toBeInTheDocument(),
    )
    expect(within(panel).getByText(FOOD_SERVICE.note ?? '')).toBeInTheDocument()
  })

  it('moves between tabs with the arrow, Home and End keys', async () => {
    const { user } = renderPage()
    const retailTab = screen.getByRole('tab', { name: new RegExp(RETAIL.title) })
    retailTab.focus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: new RegExp(FOOD_SERVICE.title) })).toHaveFocus()

    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: new RegExp(INTERNATIONAL.title) })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Home}')
    expect(retailTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: new RegExp(INTERNATIONAL.title) })).toHaveFocus()
  })
})
