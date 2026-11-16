import type { ComponentType } from 'react'
import { CORPORATE_PAGES } from './sections/corporate'
import { FINANCIAL_PAGES } from './sections/financial'
import { GOVERNANCE_PAGES } from './sections/governance'
import { IPO_PAGES } from './sections/ipo'
import { NEWS_PAGES } from './sections/news'
import { REPORTS_PAGES } from './sections/reports'
import { RESOURCES_PAGES } from './sections/resources'
import { STOCK_PAGES } from './sections/stock'
import type { PageComponents } from './sections/stub'

/** Sub-page components by section slug, then page slug (the slugs in IR_NAV). */
const SECTION_PAGES: Readonly<Record<string, PageComponents>> = {
  'corporate-info': CORPORATE_PAGES,
  'ipo-centre': IPO_PAGES,
  governance: GOVERNANCE_PAGES,
  'financial-info': FINANCIAL_PAGES,
  'stock-info': STOCK_PAGES,
  news: NEWS_PAGES,
  reports: REPORTS_PAGES,
  resources: RESOURCES_PAGES,
}

export function getPageComponent(sectionSlug: string, pageSlug: string): ComponentType | undefined {
  return SECTION_PAGES[sectionSlug]?.[pageSlug]
}
