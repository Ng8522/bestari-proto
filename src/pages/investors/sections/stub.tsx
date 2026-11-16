import type { ComponentType } from 'react'
import { findSection } from '../../../content/ir-nav'
import { Notice } from '../ui/PageParts'

/** A section's sub-page components, keyed by the page slugs in IR_NAV. */
export type PageComponents = Readonly<Record<string, ComponentType>>

function ComingSoon() {
  return <Notice tone="pending">This page is being prepared.</Notice>
}

/** Placeholder components for every sub-page of a section, until its real pages are written. */
export function stubPages(sectionSlug: string): PageComponents {
  const pages = findSection(sectionSlug)?.pages ?? []
  return Object.fromEntries(pages.map((page) => [page.slug, ComingSoon]))
}
