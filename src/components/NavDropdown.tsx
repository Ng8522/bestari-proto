import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react'
import type { LinkItem } from '../content/site'
import { SmartLink } from './routing'
import './nav-dropdown.css'

interface NavDropdownProps {
  /** The top-level link's text; it names the chevron button ("<label> sections"). */
  label: string
  links: readonly LinkItem[]
  /** The top-level link itself, rendered by the header so it keeps that header's link styling and active state. */
  children: ReactNode
  /** Runs after a sub-link is followed (the headers use it to close their mobile menu). */
  onNavigate?: () => void
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Closes the panel on a pointer press outside `containerRef` (blur alone misses Safari, which never focuses buttons on click). */
function useCloseOnOutsidePress(
  isOpen: boolean,
  close: () => void,
  containerRef: React.RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!isOpen) return
    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) close()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen, close, containerRef])
}

/**
 * A header link with a disclosure of sub-links (e.g. Investor Relations and its page sections).
 * Desktop: a card under the link that opens on hover or from the chevron button. At 900px and below it
 * expands in place inside the hamburger menu. Escape closes the panel first and returns focus to the
 * chevron, so a second Escape still closes the mobile menu.
 */
export function NavDropdown({ label, links, children, onNavigate }: NavDropdownProps) {
  const [isOpen, setOpen] = useState(false)
  // Desktop hover also shows the panel; after it is dismissed (section chosen, Escape, chevron) hover
  // stays off until the pointer leaves, or the card would linger under the cursor.
  const [isHoverSuppressed, setHoverSuppressed] = useState(false)
  const itemRef = useRef<HTMLLIElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const close = useCallback(() => setOpen(false), [])
  useCloseOnOutsidePress(isOpen, close, itemRef)

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key !== 'Escape' || !isOpen) return
    // The headers listen for Escape on document; stopping here keeps the mobile menu open.
    event.stopPropagation()
    close()
    setHoverSuppressed(true)
    toggleRef.current?.focus()
  }

  function handleToggle() {
    setHoverSuppressed(isOpen)
    setOpen(!isOpen)
  }

  function handleBlur(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) close()
  }

  function handleNavigate() {
    close()
    setHoverSuppressed(true)
    onNavigate?.()
  }

  return (
    <li
      className="dd"
      ref={itemRef}
      data-open={isOpen}
      data-hover={isHoverSuppressed ? 'off' : undefined}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onMouseLeave={() => setHoverSuppressed(false)}
    >
      <div className="dd__row">
        {children}
        <button
          type="button"
          className="dd__toggle"
          ref={toggleRef}
          aria-label={`${label} sections`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={handleToggle}
        >
          <ChevronIcon />
        </button>
      </div>
      <ul className="dd__menu" id={panelId}>
        {links.map((link) => (
          <li key={link.href}>
            <SmartLink href={link.href} onClick={handleNavigate}>
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </li>
  )
}
