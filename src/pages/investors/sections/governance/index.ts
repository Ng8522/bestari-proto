import type { PageComponents } from '../stub'
import { BoardCommittees } from './BoardCommittees'
import { PolicyDisclosures } from './PolicyDisclosures'
import { ShareholdersMeeting } from './ShareholdersMeeting'
import './governance.css'

/** Governance & Meetings sub-pages, keyed by the page slugs in IR_NAV. */
export const GOVERNANCE_PAGES: PageComponents = {
  'policy-disclosures': PolicyDisclosures,
  'board-committees': BoardCommittees,
  'shareholders-meeting': ShareholdersMeeting,
}
