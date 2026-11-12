import { useEffect, useLayoutEffect, type AnchorHTMLAttributes } from 'react'
import { Link, useLocation } from 'react-router'

/** In-site paths start with "/": route them client-side. Everything else is a normal link. */
export function isRoute(href: string): boolean {
  return href.startsWith('/')
}

interface SmartLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
}

export function SmartLink({ href, ...props }: SmartLinkProps) {
  if (isRoute(href)) return <Link to={href} {...props} />
  return <a href={href} {...props} />
}

/**
 * Router navigation keeps the old scroll position by default. Start each new page at the top,
 * or at the section named in the hash (e.g. "/#recipes" from another page).
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target && typeof target.scrollIntoView === 'function') target.scrollIntoView({ block: 'start' })
  }, [pathname, hash])

  return null
}

const SITE_NAME = 'Bestari Food Berhad'

export function useDocumentTitle(pageTitle?: string): void {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${SITE_NAME}` : `${SITE_NAME} | Mudah dan Sedap!`
  }, [pageTitle])
}
