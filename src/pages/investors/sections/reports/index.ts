import type { PageComponents } from '../stub'
import { AnalystCoveragePage } from './AnalystCoveragePage'
import { AnnualReportsPage } from './AnnualReportsPage'
import { CircularsPage } from './CircularsPage'
import { PresentationsPage } from './PresentationsPage'
import { ProspectusPage } from './ProspectusPage'
import { QuarterlyReportsPage } from './QuarterlyReportsPage'
import './reports.css'

/** Reports & Presentations sub-pages, keyed by the page slugs in IR_NAV. */
export const REPORTS_PAGES: PageComponents = {
  'annual-reports': AnnualReportsPage,
  'quarterly-reports': QuarterlyReportsPage,
  circulars: CircularsPage,
  prospectus: ProspectusPage,
  'analyst-coverage': AnalystCoveragePage,
  presentations: PresentationsPage,
}
