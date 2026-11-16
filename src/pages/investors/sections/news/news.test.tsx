import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../../../../App'
import { irPath } from '../../../../content/ir-nav'
import { MEDIA_ARTICLES, type MediaArticle } from '../../content/prospectus'
import {
  ANNOUNCEMENT_CATEGORIES,
  CATEGORY_GUIDE,
  COMPLETED_MILESTONES,
  MEDIA_PAGE_SIZE,
  type Announcement,
} from './content'
import {
  ALL_ANNOUNCEMENTS,
  ALL_MEDIA,
  articleYears,
  filterAnnouncements,
  filterMediaArticles,
  matchesKeyword,
  showingText,
} from './filters'

function renderPage(page: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[irPath('news', page)]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return { user, main: within(screen.getByRole('article')) }
}

const ARTICLES = { one: 'article', many: 'articles' }

describe('News Centre › Bursa Announcements', () => {
  it('shows the filters, the announcement columns and the start-on-listing empty state', async () => {
    const { user, main } = renderPage('bursa-announcements')

    expect(main.getByRole('heading', { level: 2, name: 'Bursa Announcements' })).toBeInTheDocument()
    const tabList = main.getByRole('tablist', { name: 'Bursa Announcements' })
    expect(within(tabList).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Announcements', 'Categories'])
    expect(main.queryByRole('region', { name: 'What each category covers' })).not.toBeInTheDocument()
    expect(main.getByRole('note')).toHaveTextContent('Announcements start on listing')
    const table = main.getByRole('table', { name: 'Announcements to Bursa Malaysia' })
    expect(within(table).getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Date',
      'Category',
      'Title',
    ])
    expect(within(table).getByText('Our announcements to Bursa Malaysia start on the listing date.')).toBeInTheDocument()
    expect(main.getByText('No announcements found')).toBeInTheDocument()
    const category = main.getByLabelText('Category')
    expect(within(category).getAllByRole('option').map((option) => option.textContent)).toEqual([
      'All',
      ...ANNOUNCEMENT_CATEGORIES,
    ])
    await user.click(main.getByRole('tab', { name: 'Categories' }))
    const guide = within(main.getByRole('region', { name: 'What each category covers' }))
    ANNOUNCEMENT_CATEGORIES.forEach((name) => {
      expect(guide.getByText(name)).toBeInTheDocument()
      expect(guide.getByText(CATEGORY_GUIDE[name])).toBeInTheDocument()
    })
  })

  it('filters by category, dates and keyword, flags a reversed range and resets', async () => {
    const { user, main } = renderPage('bursa-announcements')
    const filters = within(main.getByRole('search', { name: 'Filter announcements' }))

    await user.selectOptions(filters.getByLabelText('Category'), 'Financial Results')
    await user.type(filters.getByLabelText('Keyword'), 'quarterly')
    fireEvent.change(filters.getByLabelText('From'), { target: { value: '2027-03-01' } })
    expect(filters.getByLabelText('Category')).toHaveValue('Financial Results')
    expect(filters.getByLabelText('Keyword')).toHaveValue('quarterly')
    expect(main.queryByRole('alert')).not.toBeInTheDocument()

    fireEvent.change(filters.getByLabelText('To'), { target: { value: '2027-01-01' } })
    expect(main.getByRole('alert')).toHaveTextContent('The From date must be on or before the To date.')

    await user.click(filters.getByRole('button', { name: 'Reset' }))
    expect(filters.getByLabelText('Category')).toHaveValue('all')
    expect(filters.getByLabelText('Keyword')).toHaveValue('')
    expect(filters.getByLabelText('From')).toHaveValue('')
    expect(main.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('News Centre › Press Releases', () => {
  it('shows that no press releases are out yet, then the completed milestones', async () => {
    const { user, main } = renderPage('press-releases')

    expect(main.getByRole('heading', { level: 2, name: 'Press Releases' })).toBeInTheDocument()
    const tabList = main.getByRole('tablist', { name: 'Press Releases' })
    expect(within(tabList).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Press releases',
      'Corporate milestones',
    ])
    expect(main.getByText(/We have not issued any press releases yet/)).toBeVisible()
    expect(main.getByRole('link', { name: 'Media News' })).toHaveAttribute('href', irPath('news', 'media-news'))
    expect(main.queryByRole('list', { name: 'Completed corporate milestones' })).not.toBeInTheDocument()
    await user.click(main.getByRole('tab', { name: 'Corporate milestones' }))
    expect(main.getByRole('heading', { level: 3, name: 'Corporate milestones' })).toBeInTheDocument()
    expect(main.getByText(/These are not press releases/)).toBeInTheDocument()

    const items = within(main.getByRole('list', { name: 'Completed corporate milestones' })).getAllByRole('listitem')
    expect(items).toHaveLength(COMPLETED_MILESTONES.length)
    expect(items[0]).toHaveTextContent('23 Oct 2026')
    expect(items[0]).toHaveTextContent('SC approval')
    items.forEach((item) => expect(item).toHaveTextContent('Done'))
    expect(main.getByRole('link', { name: 'IPO Timetable' })).toHaveAttribute('href', irPath('ipo-centre', 'timetable'))
  })
})

describe('News Centre › Media News', () => {
  const articleItems = (main: ReturnType<typeof renderPage>['main']): HTMLElement[] =>
    within(main.getByRole('list', { name: 'Media articles' })).getAllByRole('listitem')

  it('lists the first five articles with date, source, language and an external headline link', () => {
    const { main } = renderPage('media-news')
    const [first] = filterMediaArticles(MEDIA_ARTICLES, ALL_MEDIA)

    expect(main.getByRole('heading', { level: 2, name: 'Media News' })).toBeInTheDocument()
    expect(articleItems(main)).toHaveLength(MEDIA_PAGE_SIZE)
    expect(main.getByText(showingText(1, MEDIA_PAGE_SIZE, MEDIA_ARTICLES.length, ARTICLES))).toBeInTheDocument()
    const item = within(articleItems(main)[0])
    const link = item.getByRole('link', { name: new RegExp(first.title) })
    expect(link).toHaveAttribute('href', first.href)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(item.getByText(first.date)).toBeInTheDocument()
    expect(item.getByText(first.source)).toBeInTheDocument()
    expect(item.getByText(first.language)).toHaveClass('chip')
  })

  it('pages through the articles five at a time', async () => {
    const { user, main } = renderPage('media-news')
    expect(MEDIA_ARTICLES.length).toBeGreaterThan(MEDIA_PAGE_SIZE)

    await user.click(main.getByRole('button', { name: 'Page 2' }))
    expect(articleItems(main)).toHaveLength(MEDIA_ARTICLES.length - MEDIA_PAGE_SIZE)
    expect(main.getByText(showingText(2, MEDIA_PAGE_SIZE, MEDIA_ARTICLES.length, ARTICLES))).toBeInTheDocument()
  })

  it('filters by language, year and keyword, back to page one, and resets', async () => {
    const { user, main } = renderPage('media-news')
    const filters = within(main.getByRole('search', { name: 'Filter media news' }))
    const malay = MEDIA_ARTICLES.filter((article) => article.language === 'Malay')

    await user.click(main.getByRole('button', { name: 'Page 2' }))
    await user.selectOptions(filters.getByLabelText('Language'), 'Malay')
    expect(articleItems(main)).toHaveLength(malay.length)
    articleItems(main).forEach((item) => expect(within(item).getByText('Malay')).toHaveClass('chip'))

    await user.selectOptions(filters.getByLabelText('Year'), articleYears(MEDIA_ARTICLES)[0])
    await user.type(filters.getByLabelText('Keyword'), 'no-such-headline')
    expect(main.getByText(/No articles match these filters/)).toBeInTheDocument()
    expect(main.getByText('No articles found')).toBeInTheDocument()

    await user.click(filters.getByRole('button', { name: 'Reset' }))
    expect(articleItems(main)).toHaveLength(MEDIA_PAGE_SIZE)
    expect(filters.getByLabelText('Language')).toHaveValue('all')
  })
})

describe('news filters', () => {
  const announcement = (id: string, isoDate: string, category: Announcement['category'], title: string): Announcement => ({
    id,
    isoDate,
    category,
    title,
  })
  const announcements = [
    announcement('a', '2027-02-25', 'Financial Results', 'Quarterly report for the period ended 31 Dec 2026'),
    announcement('b', '2027-05-20', 'Entitlements', 'First interim dividend'),
    announcement('c', '2027-01-10', 'General Announcement', 'Change of address of share registrar'),
  ]

  it('matches every keyword word, ignoring case', () => {
    expect(matchesKeyword(['Bestari Food gets SC approval'], 'sc APPROVAL')).toBe(true)
    expect(matchesKeyword(['Bestari Food gets SC approval'], 'approval prospectus')).toBe(false)
    expect(matchesKeyword(['anything'], '  ')).toBe(true)
  })

  it('filters announcements by category, date range and keyword, newest first', () => {
    expect(filterAnnouncements(announcements, ALL_ANNOUNCEMENTS).map((item) => item.id)).toEqual(['b', 'a', 'c'])
    expect(filterAnnouncements(announcements, { ...ALL_ANNOUNCEMENTS, category: 'Entitlements' })).toHaveLength(1)
    const inRange = filterAnnouncements(announcements, { ...ALL_ANNOUNCEMENTS, from: '2027-01-01', to: '2027-03-31' })
    expect(inRange.map((item) => item.id)).toEqual(['a', 'c'])
    expect(filterAnnouncements(announcements, { ...ALL_ANNOUNCEMENTS, keyword: 'registrar' })[0].id).toBe('c')
    expect(filterAnnouncements(announcements, { ...ALL_ANNOUNCEMENTS, keyword: 'financial' })[0].id).toBe('a')
  })

  it('filters media articles by language, year and headline or publisher', () => {
    const byLanguage = filterMediaArticles(MEDIA_ARTICLES, { ...ALL_MEDIA, language: 'Chinese' })
    expect(byLanguage.every((article: MediaArticle) => article.language === 'Chinese')).toBe(true)
    expect(byLanguage.length).toBeGreaterThan(0)
    expect(filterMediaArticles(MEDIA_ARTICLES, { ...ALL_MEDIA, year: '1999' })).toHaveLength(0)
    const byPublisher = filterMediaArticles(MEDIA_ARTICLES, { ...ALL_MEDIA, keyword: 'the edge' })
    expect(byPublisher.every((article) => article.source === 'The Edge Malaysia')).toBe(true)
    const dates = filterMediaArticles(MEDIA_ARTICLES, ALL_MEDIA).map((article) => article.isoDate)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it('lists article years once each, and describes the visible slice', () => {
    expect(articleYears(MEDIA_ARTICLES)).toEqual([...new Set(MEDIA_ARTICLES.map((a) => a.isoDate.slice(0, 4)))])
    expect(showingText(2, 5, 7, ARTICLES)).toBe('Showing 6–7 of 7 articles')
    expect(showingText(1, 5, 1, ARTICLES)).toBe('Showing 1 article')
    expect(showingText(1, 5, 0, ARTICLES)).toBe('No articles found')
  })
})
