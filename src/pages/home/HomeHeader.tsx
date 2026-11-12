import { useCallback, useId, useRef, useState } from 'react'
import { useDismiss } from '../../components/chrome'
import { SmartLink } from '../../components/routing'
import { LOGO, SHOP_CTA } from '../../content/site'
import { HEADER_LINKS, HEADER_SCRIM_OFFSET_PX, HEADER_SOLID_RATIO } from './data'
import { useScrolledPast } from './useHomeMotion'

/**
 * The home page's own fixed header: transparent at the very top of the slogan hero, a maroon bar
 * once the page starts scrolling (so the slogan slides under the links), and solid cream past 85%
 * of the viewport. At 900px and below the links fold into a "Menu" disclosure.
 */
export function HomeHeader() {
  const isScrolled = useScrolledPast(0, HEADER_SCRIM_OFFSET_PX)
  const isSolid = useScrolledPast(HEADER_SOLID_RATIO)
  const [isMenuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useDismiss(isMenuOpen, closeMenu, headerRef, toggleRef)

  const className = ['hdr', isScrolled ? 'scrolled' : '', isSolid ? 'solid' : '', isMenuOpen ? 'open' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <header className={className} ref={headerRef}>
      <div className="wrap">
        <a className="logo" href="#top" onClick={closeMenu}>
          <img src={LOGO.src} alt={LOGO.alt} width="77" height="46" />
        </a>
        <button
          type="button"
          className="toggle"
          ref={toggleRef}
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
        <nav className="menu" id={menuId} aria-label="Main" data-open={isMenuOpen}>
          <ul>
            {HEADER_LINKS.map((link) => (
              <li key={link.href}>
                <SmartLink href={link.href} onClick={closeMenu}>
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <SmartLink className="btn shop shop--menu" href={SHOP_CTA.href} onClick={closeMenu}>
            {SHOP_CTA.label} <span className="arr" aria-hidden="true">→</span>
          </SmartLink>
        </nav>
        <SmartLink className="btn shop shop--bar" href={SHOP_CTA.href}>
          {SHOP_CTA.label} <span className="arr" aria-hidden="true">→</span>
        </SmartLink>
      </div>
    </header>
  )
}
