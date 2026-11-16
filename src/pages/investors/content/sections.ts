/**
 * Shared IR copy used by several sections: competitive strengths, the dividend policy, the corporate calendar and
 * investor-resource notes. Bestari is not listed yet: anything unconfirmed is `isPlaceholder` / `isDatePlaceholder`.
 */
import { KPIS, TIMETABLE, type IrDocument } from '../data'

export interface InfoEntry {
  label: string
  value: string
  isPlaceholder?: boolean
}

/* IPO centre */

export interface Advantage {
  title: string
  description: string
}

/** Summarised from the company overview; check the wording against the prospectus before launch. */
export const COMPETITIVE_ADVANTAGES: readonly Advantage[] = [
  { title: 'Category-leading flagship', description: 'Our Crispy Fried Chicken Coating Mix, sold since 2004, leads its category in Malaysia.' },
  { title: 'An established brand', description: 'Products sell mainly under the Bestari brand, in retail and commercial packs.' },
  { title: 'Two routes to market', description: 'Supermarkets and retail, plus food manufacturers, hotels, restaurants, cafés and caterers.' },
  { title: 'An integrated offering', description: 'Premixes, ingredients, processing equipment, spare parts and maintenance from one group.' },
  { title: 'Room to grow', description: 'A new facility in Banting will support ingredient processing and a wider range.' },
]

export const ADVANTAGES_PLACEHOLDER = 'check against prospectus wording'

/* Stock info */

const dividendKpi = KPIS.find((kpi) => kpi.label === 'Dividend policy')

export const DIVIDEND_POLICY = dividendKpi ? `${dividendKpi.value} ${dividendKpi.detail.toLowerCase()}.` : ''

/* Investor resources */

export interface CalendarEvent {
  date: string
  isDatePlaceholder?: boolean
  event: string
}

export const CALENDAR: readonly CalendarEvent[] = [
  ...TIMETABLE.filter((milestone) => milestone.status === 'upcoming').map((milestone) => ({
    date: milestone.date,
    isDatePlaceholder: milestone.isDatePlaceholder,
    event: milestone.event,
  })),
  { date: 'TBA', isDatePlaceholder: true, event: 'First annual general meeting' },
  { date: '31 Dec', event: 'Financial year end' },
]

const pending = (title: string): IrDocument => ({ title, meta: 'TBA', format: 'PDF' })

export const LEGAL_DOCUMENTS: readonly IrDocument[] = [pending('IR website terms of use'), pending('IR privacy notice')]

export const ALERTS_THANK_YOU = 'You’re on the list. We’ll email you our latest announcements.'

export const CALCULATOR_NOTE = 'Illustration only. Excludes brokerage, clearing fees and stamp duty.'
