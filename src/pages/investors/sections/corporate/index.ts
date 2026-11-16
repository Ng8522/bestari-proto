import type { PageComponents } from '../stub'
import { ChairmansStatement } from './ChairmansStatement'
import { CorporateStructure } from './CorporateStructure'
import { DirectorsProfile } from './DirectorsProfile'
import { GeneralInformation } from './GeneralInformation'
import { KeyManagement } from './KeyManagement'
import { ManagementDiscussion } from './ManagementDiscussion'
import './corporate.css'
import './org-chart.css'

/** Corporate Info sub-pages, keyed by the page slugs in IR_NAV. */
export const CORPORATE_PAGES: PageComponents = {
  'general-information': GeneralInformation,
  'directors-profile': DirectorsProfile,
  'key-management': KeyManagement,
  'corporate-structure': CorporateStructure,
  'chairmans-statement': ChairmansStatement,
  'management-discussion': ManagementDiscussion,
}
