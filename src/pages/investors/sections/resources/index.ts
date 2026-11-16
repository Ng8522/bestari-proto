import type { PageComponents } from '../stub'
import { CorporateCalendarPage } from './CorporateCalendarPage'
import { FaqPage } from './FaqPage'
import { InvestmentCalculatorPage } from './InvestmentCalculatorPage'
import { NewsAlertsPage } from './NewsAlertsPage'
import { TermsOfUsePage } from './TermsOfUsePage'
import './resources.css'

/** Investor Resources sub-pages, keyed by the page slugs in IR_NAV. */
export const RESOURCES_PAGES: PageComponents = {
  'corporate-calendar': CorporateCalendarPage,
  'news-alerts': NewsAlertsPage,
  'investment-calculator': InvestmentCalculatorPage,
  faq: FaqPage,
  'terms-of-use': TermsOfUsePage,
}
