import type { PageComponents } from '../stub'
import { FinancialHighlightsPage } from './HighlightsPage'
import { FinancialPerformancePage } from './PerformancePage'
import { SegmentalAnalysisPage } from './SegmentalPage'
import { FinancialStatementsPage } from './StatementsPage'
import './financial.css'

/** Financial Info pages by slug. */
export const FINANCIAL_PAGES: PageComponents = {
  highlights: FinancialHighlightsPage,
  performance: FinancialPerformancePage,
  statements: FinancialStatementsPage,
  'segmental-analysis': SegmentalAnalysisPage,
}
