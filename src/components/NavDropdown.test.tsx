import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../App'
import { IR_SECTIONS, ROUTES } from '../content/site'

function renderAt(path: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user, nav: screen.getByRole('navigation', { name: 'Main' }) }
}

describe('Investor Relations header dropdown', () => {
  it.each([
    ['inner-page header', ROUTES.about],
    ['home header', ROUTES.home],
  ])('lists every IR section in the %s', (_header, path) => {
    const { nav } = renderAt(path)
    const toggle = within(nav).getByRole('button', { name: 'Investor Relations sections' })
    const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '')
    expect(panel).not.toBeNull()

    const links = within(panel as HTMLElement).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(IR_SECTIONS.map((section) => section.label))
    IR_SECTIONS.forEach((section, index) =>
      expect(links[index]).toHaveAttribute('href', `${ROUTES.investors}#${section.id}`),
    )
    expect(within(nav).getByRole('link', { name: 'Investor Relations' })).toHaveAttribute('href', ROUTES.investors)
  })

  it('opens from the chevron and closes on Escape without closing the mobile menu', async () => {
    const { user, nav } = renderAt(ROUTES.about)
    const menuToggle = screen.getByRole('button', { name: 'Menu' })
    await user.click(menuToggle)
    const toggle = within(nav).getByRole('button', { name: 'Investor Relations sections' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
    expect(menuToggle).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the panel and the mobile menu once a section is chosen', async () => {
    const { user, nav } = renderAt(ROUTES.about)
    const menuToggle = screen.getByRole('button', { name: 'Menu' })
    await user.click(menuToggle)
    const toggle = within(nav).getByRole('button', { name: 'Investor Relations sections' })
    await user.click(toggle)

    await user.click(within(nav).getByRole('link', { name: 'Financials' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
    expect(document.title).toBe('Investor Relations | Bestari Food Berhad')
  })

  it('closes when the page is clicked elsewhere', async () => {
    const { user, nav } = renderAt(ROUTES.about)
    const toggle = within(nav).getByRole('button', { name: 'Investor Relations sections' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(document.body)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
