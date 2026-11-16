import type { PageComponents } from '../stub'
import { BursaAnnouncements } from './BursaAnnouncements'
import { MediaNews } from './MediaNews'
import { PressReleases } from './PressReleases'
import './news.css'

/** News Centre sub-pages, keyed by the page slugs in IR_NAV ('news'). */
export const NEWS_PAGES: PageComponents = {
  'bursa-announcements': BursaAnnouncements,
  'press-releases': PressReleases,
  'media-news': MediaNews,
}
