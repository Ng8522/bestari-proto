import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../App'
import { ROUTES } from '../../content/site'
import { CONTACT, HERO, PILLARS, REPORTS, REPORTS_SECTION } from './data'

function renderAt(path: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user }
}

describe('Sustainability page', () => {
  it('opens with the hero title and a link down to the reports', () => {
    renderAt(ROUTES.sustainability)

    expect(document.title).toBe('Sustainability | Bestari Food Berhad')
    expect(screen.getByRole('heading', { level: 1, name: HERO.title })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: HERO.image.alt })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Our sustainability reporting/ })).toHaveAttribute(
      'href',
      `#${REPORTS_SECTION.id}`,
    )
  })

  it('marks Sustainability as the current page in the header', () => {
    renderAt(ROUTES.sustainability)

    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).getByRole('link', { name: 'Sustainability' })).toHaveAttribute('aria-current', 'page')
  })

  it('links every pillar in the commitment to its own section', () => {
    renderAt(ROUTES.sustainability)

    const pillarNav = screen.getByRole('navigation', { name: 'Sustainability pillars' })
    PILLARS.forEach((pillar) => {
      expect(within(pillarNav).getByRole('link', { name: new RegExp(pillar.short) })).toHaveAttribute(
        'href',
        `#${pillar.id}`,
      )
      const section = screen.getByRole('region', { name: pillar.title })
      expect(section).toHaveAttribute('id', pillar.id)
      pillar.highlights.forEach((highlight) =>
        expect(within(section).getByRole('heading', { level: 3, name: highlight.title })).toBeInTheDocument(),
      )
    })
  })

  it('flags figures that are still being measured', () => {
    renderAt(ROUTES.sustainability)

    const environment = screen.getByRole('region', { name: PILLARS[1].title })
    const stats = within(environment).getAllByRole('listitem').filter((item) => item.querySelector('.ph'))
    expect(stats).toHaveLength(PILLARS[1].stats?.length ?? 0)
  })

  it('shows unpublished reports as coming soon, and offers the enquiry email', () => {
    renderAt(ROUTES.sustainability)

    const reports = screen.getByRole('region', { name: REPORTS_SECTION.title })
    REPORTS.forEach((report) => {
      expect(within(reports).getByText(report.title)).toBeInTheDocument()
      expect(within(reports).queryByRole('link', { name: new RegExp(report.title) })).not.toBeInTheDocument()
    })
    expect(within(reports).getByText('Coming soon')).toBeInTheDocument()
    expect(within(reports).getByRole('link', { name: new RegExp(CONTACT.link.label) })).toHaveAttribute(
      'href',
      CONTACT.link.href,
    )
  })

  it('is linked from the footer of the other corporate pages', async () => {
    const { user } = renderAt(ROUTES.about)
    const footerLink = within(screen.getByRole('contentinfo')).getByRole('link', { name: 'Sustainability' })
    expect(footerLink).toHaveAttribute('href', ROUTES.sustainability)

    await user.click(footerLink)
    expect(screen.getByRole('heading', { level: 1, name: HERO.title })).toBeInTheDocument()
  })
})
