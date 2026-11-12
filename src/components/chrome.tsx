import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { SmartLink } from './routing'
import { CERT_STRIP, COMPANY, FOOTER_COLUMNS, LEGAL, LOGO, MAIN_NAV, SHOP_CTA } from '../content/site'

/** Closes a disclosure on Escape (returning focus to its toggle) or on a click outside `containerRef`. */
export function useDismiss(
  isOpen: boolean,
  close: () => void,
  containerRef: React.RefObject<HTMLElement | null>,
  toggleRef: React.RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      close()
      toggleRef.current?.focus()
    }
    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) close()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen, close, containerRef, toggleRef])
}

/** Sticky inner-page header from the handoff's site.js: logo, centred links, maroon "Shop online". */
export function SiteHeader() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const closeMenu = () => setMenuOpen(false)
  useDismiss(isMenuOpen, closeMenu, headerRef, toggleRef)

  return (
    <header className="nav" ref={headerRef}>
      <div className="wrap wrap--wide nav__bar">
        <Link className="nav__logo" to="/" onClick={closeMenu}>
          <img src={LOGO.src} alt={LOGO.alt} width="89" height="50" />
        </Link>
        <button
          type="button"
          className="nav__toggle"
          ref={toggleRef}
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
        <nav className="nav__menu" id={menuId} aria-label="Main" data-open={isMenuOpen}>
          <ul className="nav__links">
            {MAIN_NAV.map((link) => (
              <li key={link.href}>
                <NavLink to={link.href} end onClick={closeMenu}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link className="btn btn-maroon nav__shop" to={SHOP_CTA.href} onClick={closeMenu}>
            {SHOP_CTA.label} <span className="arr" aria-hidden="true">→</span>
          </Link>
        </nav>
        <Link className="btn btn-maroon nav__shop" to={SHOP_CTA.href}>
          {SHOP_CTA.label} <span className="arr" aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  )
}

/** Dark footer shared by the corporate pages: logo, address, certifications and three link columns. */
export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap wrap--wide">
        <div className="foot__grid">
          <div>
            <div className="foot__logo">
              <img src={LOGO.src} alt={LOGO.alt} width="93" height="52" />
            </div>
            <p className="foot__address">
              {COMPANY.name}
              <br />
              {COMPANY.addressLines.join(' ')}
              <br />
              <a href={COMPANY.phone.href}>{COMPANY.phone.label}</a> ·{' '}
              <a href={COMPANY.email.href}>{COMPANY.email.label}</a>
            </p>
            <div className="foot__certs">
              <img src={CERT_STRIP.src} alt={CERT_STRIP.alt} loading="lazy" />
            </div>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="foot__heading">{column.title}</h2>
              <ul className="foot__links">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink href={link.href}>{link.label}</SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="foot__bottom">
          <span>{LEGAL.copyright}</span>
          <span>{LEGAL.links}</span>
        </div>
      </div>
    </footer>
  )
}

/** Frame for the inner corporate pages (About, Investor Relations, Where to buy, 404). */
export function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}
