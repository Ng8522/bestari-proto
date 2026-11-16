import { Link, Navigate, useParams } from 'react-router'
import { IR_BASE, findPage, findSection, sectionHref } from '../../content/ir-nav'
import { getPageComponent } from './registry'
import { PAGE_TITLE_ID, PageHeader } from './ui/PageParts'

/** /investor-relations/:section/:page — the sub-page's title and intro, then its content. */
export function IrSubPage() {
  const params = useParams()
  const section = findSection(params.section)
  if (!section?.slug) return <IrNotFound />

  const page = findPage(section, params.page)
  if (!page) return section.pages.length > 0 ? <Navigate to={sectionHref(section)} replace /> : <IrNotFound />

  const Page = getPageComponent(section.slug, page.slug)
  if (!Page) return <IrNotFound />

  return (
    <article className="wrap wrap--wide ir-page" aria-labelledby={PAGE_TITLE_ID}>
      <PageHeader title={page.label} intro={page.intro} />
      <Page />
    </article>
  )
}

/** /investor-relations/:section — goes to the section's first sub-page. */
export function IrSectionIndex() {
  const section = findSection(useParams().section)
  if (!section?.slug || section.pages.length === 0) return <IrNotFound />
  return <Navigate to={sectionHref(section)} replace />
}

function IrNotFound() {
  return (
    <article className="wrap wrap--wide ir-page" aria-labelledby={PAGE_TITLE_ID}>
      <PageHeader title="Page not found" intro="We could not find that Investor Relations page." />
      <p>
        <Link className="btn btn-saffron" to={IR_BASE}>
          Go to IR Home <span className="arr" aria-hidden="true">→</span>
        </Link>
      </p>
    </article>
  )
}
