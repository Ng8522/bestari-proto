/**
 * Governance & Meetings content. Bestari is pre-listing: no governance document is published and no general meeting
 * has been held, so the documents are "Coming soon" and the meetings archive is empty. Committee chairs come from the
 * draft prospectus (DIRECTORS); committee descriptions are generic and point to the terms of reference.
 */
import { DIRECTORS, type Director } from '../../content/prospectus'
import type { IrDocument } from '../../data'

/* Policy disclosures */

export type PolicyCategory = 'constitution' | 'terms' | 'policies'

export interface GovernanceDocument extends IrDocument {
  category: PolicyCategory
}

export const POLICY_CATEGORY_LABELS: Readonly<Record<PolicyCategory, string>> = {
  constitution: 'Constitution & Board Charter',
  terms: 'Committee terms of reference',
  policies: 'Codes & policies',
}

/** What each group of documents is for, in general terms. */
export const POLICY_CATEGORY_NOTES: Readonly<Record<PolicyCategory, string>> = {
  constitution: 'The company’s rules, and how the Board works: its role, powers and the matters reserved for it.',
  terms: 'What each Board committee does, who sits on it, and how it meets and reports to the Board.',
  policies: 'The standards the Group sets for directors, employees and business partners.',
}

/** Not yet published: renders as "Coming soon" in the document table. */
const comingSoon = (title: string, category: PolicyCategory): GovernanceDocument => ({
  title,
  category,
  meta: 'TBA',
  format: 'PDF',
})

export const GOVERNANCE_DOCUMENTS: readonly GovernanceDocument[] = [
  comingSoon('Constitution', 'constitution'),
  comingSoon('Board Charter', 'constitution'),
  comingSoon('Terms of Reference of the Audit and Risk Management Committee', 'terms'),
  comingSoon('Terms of Reference of the Nomination and Remuneration Committee', 'terms'),
  comingSoon('Code of Conduct & Business Ethics', 'policies'),
  comingSoon('Anti-Bribery & Anti-Corruption Policy', 'policies'),
  comingSoon('Whistleblowing Policy', 'policies'),
  comingSoon('Conflict of Interest Policy', 'policies'),
  comingSoon('Directors’ Fit & Proper Policy', 'policies'),
  comingSoon('Directors’ & Senior Management Remuneration Policy', 'policies'),
  comingSoon('Diversity Policy', 'policies'),
  comingSoon('Sustainability Policy', 'policies'),
  comingSoon('Corporate Disclosure Policy', 'policies'),
]

export type CategoryFilter = PolicyCategory | 'all'

export function filterDocuments(
  documents: readonly GovernanceDocument[],
  category: CategoryFilter,
): readonly GovernanceDocument[] {
  return category === 'all' ? documents : documents.filter((document) => document.category === category)
}

/* Board committees */

export interface Committee {
  name: string
  /** Generic: what a committee of this kind does. The terms of reference set out its actual remit. */
  role: string
  responsibilities: readonly string[]
}

export const COMMITTEES: readonly Committee[] = [
  {
    name: 'Audit and Risk Management Committee',
    role: 'Helps the Board oversee financial reporting, audit, risk management and internal control.',
    responsibilities: [
      'Reviews the quarterly results and annual financial statements before they go to the Board',
      'Oversees the external auditors and the internal audit function, including their independence',
      'Reviews related party transactions and conflicts of interest',
      'Oversees the risk management framework and the system of internal control',
    ],
  },
  {
    name: 'Nomination and Remuneration Committee',
    role: 'Helps the Board with its composition, succession, performance and pay.',
    responsibilities: [
      'Reviews the size, skills, experience and diversity of the Board and its committees',
      'Identifies and recommends candidates for the Board and for key senior management',
      'Leads the annual assessment of the Board, its committees and each director',
      'Recommends the remuneration framework for directors and key senior management',
    ],
  },
]

/** The director named in the prospectus as the committee's chair. */
export function committeeChair(committee: Committee, directors: readonly Director[] = DIRECTORS): Director | undefined {
  return directors.find((director) => director.committees.includes(`Chair, ${committee.name}`))
}

/* Shareholders meetings */

export type MeetingType = 'AGM' | 'EGM'

export const MEETING_TYPE_LABELS: Readonly<Record<MeetingType, string>> = {
  AGM: 'Annual general meeting',
  EGM: 'Extraordinary general meeting',
}

export interface GeneralMeeting {
  type: MeetingType
  title: string
  /** YYYY-MM-DD. */
  isoDate: string
  date: string
  time: string
  venue: string
  documents: readonly IrDocument[]
}

/** No general meeting has been held yet: the first AGM is held after listing. */
export const GENERAL_MEETINGS: readonly GeneralMeeting[] = []

export interface MeetingDocumentType {
  title: string
  description: string
}

/** The papers posted for each general meeting, in general terms. */
export const MEETING_DOCUMENT_TYPES: readonly MeetingDocumentType[] = [
  { title: 'Notice of meeting', description: 'The date, time and venue, and the resolutions to be voted on.' },
  { title: 'Form of proxy', description: 'For appointing a proxy to attend, speak and vote on your behalf.' },
  { title: 'Administrative guide', description: 'How to register, take part in the meeting and vote.' },
  { title: 'Minutes', description: 'The record of the meeting’s proceedings, including questions raised.' },
  { title: 'Poll results', description: 'The votes cast for and against each resolution, and the outcome.' },
]

/** The first year the archive can hold: the year the IPO was approved. */
export const ARCHIVE_START_YEAR = 2026

/** Years for the year filter, newest first: every year from the archive start, plus any year with a meeting. */
export function meetingYears(meetings: readonly GeneralMeeting[], currentYear: number): string[] {
  const span = Math.max(0, currentYear - ARCHIVE_START_YEAR)
  const range = Array.from({ length: span + 1 }, (_value, index) => String(ARCHIVE_START_YEAR + index))
  const fromMeetings = meetings.map((meeting) => meeting.isoDate.slice(0, 4))
  return [...new Set([...range, ...fromMeetings])].sort().reverse()
}

export type TypeFilter = MeetingType | 'all'

export function filterMeetings(
  meetings: readonly GeneralMeeting[],
  year: string,
  type: TypeFilter,
): readonly GeneralMeeting[] {
  return meetings.filter(
    (meeting) => (year === 'all' || meeting.isoDate.startsWith(year)) && (type === 'all' || meeting.type === type),
  )
}
