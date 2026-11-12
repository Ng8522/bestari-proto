import { Link } from 'react-router'
import { useDocumentTitle } from '../components/routing'
import { ROUTES } from '../content/site'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <section className="wrap" style={{ padding: '120px 40px 140px' }}>
      <p className="eyebrow">Error 404</p>
      <h1 style={{ fontSize: 'clamp(48px, 6vw, 88px)', color: 'var(--maroon)', margin: '14px 0 18px' }}>
        Page not found.
      </h1>
      <p style={{ color: 'var(--ink-2)', maxWidth: '46ch', marginBottom: 32 }}>
        This page doesn’t exist or has moved. Let’s get you back to something sedap.
      </p>
      <Link className="btn btn-maroon" to={ROUTES.home}>
        Back to home <span className="arr" aria-hidden="true">→</span>
      </Link>
    </section>
  )
}
