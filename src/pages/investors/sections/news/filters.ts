/** Filtering for the News Centre lists (pure, unit-tested). */
import type { MediaArticle } from '../../content/prospectus'
import { isWithinRange } from '../../ui/Filters'
import type { Announcement, AnnouncementCategory, MediaLanguage } from './content'

export const ALL = 'all'

/** True when every word of the keyword appears in the texts, ignoring case; an empty keyword matches everything. */
export function matchesKeyword(texts: readonly string[], keyword: string): boolean {
  const words = keyword.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const haystack = texts.join(' ').toLowerCase()
  return words.every((word) => haystack.includes(word))
}

function newestFirst<T extends { isoDate: string }>(items: readonly T[]): readonly T[] {
  return [...items].sort((a, b) => b.isoDate.localeCompare(a.isoDate))
}

export interface AnnouncementCriteria {
  category: AnnouncementCategory | typeof ALL
  /** YYYY-MM-DD or ''. */
  from: string
  to: string
  keyword: string
}

export const ALL_ANNOUNCEMENTS: AnnouncementCriteria = { category: ALL, from: '', to: '', keyword: '' }

/** Announcements in the category and date range whose title or category contains the keyword, newest first. */
export function filterAnnouncements(
  items: readonly Announcement[],
  { category, from, to, keyword }: AnnouncementCriteria,
): readonly Announcement[] {
  return newestFirst(
    items.filter(
      (item) =>
        (category === ALL || item.category === category) &&
        isWithinRange(item.isoDate, from, to) &&
        matchesKeyword([item.title, item.category], keyword),
    ),
  )
}

export interface MediaCriteria {
  language: MediaLanguage | typeof ALL
  /** 'all' or a year ("2026"). */
  year: string
  keyword: string
}

export const ALL_MEDIA: MediaCriteria = { language: ALL, year: ALL, keyword: '' }

/** Articles in the language and year whose headline or publisher contains the keyword, newest first. */
export function filterMediaArticles(
  items: readonly MediaArticle[],
  { language, year, keyword }: MediaCriteria,
): readonly MediaArticle[] {
  return newestFirst(
    items.filter(
      (item) =>
        (language === ALL || item.language === language) &&
        (year === ALL || item.isoDate.slice(0, 4) === year) &&
        matchesKeyword([item.title, item.source], keyword),
    ),
  )
}

/** Every year with an article, newest first. */
export function articleYears(items: readonly MediaArticle[]): readonly string[] {
  return [...new Set(items.map((item) => item.isoDate.slice(0, 4)))].sort((a, b) => b.localeCompare(a))
}

export interface Noun {
  one: string
  many: string
}

/** "Showing 6–7 of 7 articles", "Showing 1 article" or "No articles found". */
export function showingText(page: number, pageSize: number, total: number, noun: Noun): string {
  if (total === 0) return `No ${noun.many} found`
  if (total === 1) return `Showing 1 ${noun.one}`
  const first = (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)
  return `Showing ${first}–${last} of ${total} ${noun.many}`
}
