import type { PageComponents } from '../stub'
import { IpoHowToApplyPage } from './HowToApplyPage'
import { withIpoNoticeGate } from './NoticeGate'
import { IpoOverviewPage } from './OverviewPage'
import { IpoProceedsPage } from './ProceedsPage'
import { IpoShareholdingPage } from './ShareholdingPage'
import { IpoStrengthsPage } from './StrengthsPage'
import { IpoTimetablePage } from './TimetablePage'
import './ipo.css'

/** IPO Centre pages by slug. Every page sits behind the important notice, as on a Bursa Malaysia IPO centre. */
export const IPO_PAGES: PageComponents = {
  overview: withIpoNoticeGate(IpoOverviewPage),
  timetable: withIpoNoticeGate(IpoTimetablePage),
  'use-of-proceeds': withIpoNoticeGate(IpoProceedsPage),
  shareholding: withIpoNoticeGate(IpoShareholdingPage),
  'competitive-strengths': withIpoNoticeGate(IpoStrengthsPage),
  'how-to-apply': withIpoNoticeGate(IpoHowToApplyPage),
}
