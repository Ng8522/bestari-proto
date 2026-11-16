/**
 * News Centre content. Bursa announcements start on listing and Bestari has issued no press releases yet, so those
 * lists are empty, typed arrays; media coverage comes from MEDIA_ARTICLES (content/prospectus.ts) and the listing
 * milestones from TIMETABLE (data.ts).
 */
import type { MediaArticle } from '../../content/prospectus'
import { TIMETABLE, type Milestone } from '../../data'

/* Bursa announcements */

export const ANNOUNCEMENT_CATEGORIES = [
  'General Announcement',
  'Financial Results',
  'Entitlements',
  'Changes in Shareholdings',
  'Annual Report',
  'Circulars',
  'Prospectus',
  'Others',
] as const

export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number]

export interface Announcement {
  /** Bursa reference number, unique per announcement. */
  id: string
  /** YYYY-MM-DD. */
  isoDate: string
  category: AnnouncementCategory
  title: string
  /** The announcement on Bursa Malaysia's website. */
  href?: string
}

/** Our announcements to Bursa Malaysia, newest first. Empty until listing. */
export const ANNOUNCEMENTS: readonly Announcement[] = []

/** What each category usually holds, in general terms. */
export const CATEGORY_GUIDE: Readonly<Record<AnnouncementCategory, string>> = {
  'General Announcement': 'Corporate developments the company discloses to the market.',
  'Financial Results': 'Quarterly reports on the Group’s consolidated results.',
  Entitlements: 'Dividends and other entitlements, with their key dates.',
  'Changes in Shareholdings': 'Notices of changes in the interests of substantial shareholders and directors.',
  'Annual Report': 'The annual report, with the audited financial statements.',
  Circulars: 'Circulars and statements to shareholders.',
  Prospectus: 'The IPO prospectus and related notices.',
  Others: 'Announcements outside the categories above.',
}

/* Press releases */

export interface PressRelease {
  /** YYYY-MM-DD. */
  isoDate: string
  title: string
  href?: string
}

/** Press releases issued by Bestari Food Berhad, newest first. None yet. */
export const PRESS_RELEASES: readonly PressRelease[] = []

/** Completed listing milestones, newest first. These are milestones, not press releases. */
export const COMPLETED_MILESTONES: readonly Milestone[] = TIMETABLE.filter(
  (milestone) => milestone.status === 'done',
).reverse()

/* Media news */

export type MediaLanguage = MediaArticle['language']

export const MEDIA_PAGE_SIZE = 5

export const MEDIA_LANGUAGES: readonly MediaLanguage[] = ['English', 'Malay', 'Chinese']

/** BCP 47 codes, so screen readers read each headline in its own language. */
export const LANGUAGE_CODES: Readonly<Record<MediaLanguage, string>> = { English: 'en', Malay: 'ms', Chinese: 'zh' }
