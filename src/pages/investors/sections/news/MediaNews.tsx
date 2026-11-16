import { useState, type ReactElement } from 'react'
import { MEDIA_ARTICLES, type MediaArticle } from '../../content/prospectus'
import { EmptyState } from '../../Tabs'
import { FilterBar, InputField, SelectField, type Option } from '../../ui/Filters'
import { Panel } from '../../ui/PageParts'
import { Pagination, usePagination } from '../../ui/Pagination'
import { LANGUAGE_CODES, MEDIA_LANGUAGES, MEDIA_PAGE_SIZE } from './content'
import { ALL, ALL_MEDIA, articleYears, filterMediaArticles, showingText, type MediaCriteria } from './filters'

const NOUN = { one: 'article', many: 'articles' } as const

type LanguageFilter = MediaCriteria['language']

const LANGUAGE_OPTIONS: readonly Option<LanguageFilter>[] = [
  { value: ALL, label: 'All languages' },
  ...MEDIA_LANGUAGES.map((language) => ({ value: language, label: language })),
]

const YEAR_OPTIONS: readonly Option[] = [
  { value: ALL, label: 'All years' },
  ...articleYears(MEDIA_ARTICLES).map((year) => ({ value: year, label: year })),
]

/** News Centre › Media News: press coverage of Bestari, by language, year and keyword. */
export function MediaNews(): ReactElement {
  const [criteria, setCriteria] = useState<MediaCriteria>(ALL_MEDIA)
  const results = filterMediaArticles(MEDIA_ARTICLES, criteria)
  const { page, pageCount, pageItems, setPage } = usePagination(results, MEDIA_PAGE_SIZE)

  const update = (next: MediaCriteria): void => {
    setCriteria(next)
    setPage(1)
  }

  return (
    <Panel title="In the press" sub={`${MEDIA_ARTICLES.length} articles, newest first`}>
      <MediaFilters criteria={criteria} onChange={update} />
      <p className="result-count" aria-live="polite">
        {showingText(page, MEDIA_PAGE_SIZE, results.length, NOUN)}
      </p>
      {results.length === 0 ? (
        <EmptyState>No articles match these filters. Try another language, year or keyword.</EmptyState>
      ) : (
        <ul className="media-list" aria-label="Media articles">
          {pageItems.map((article) => (
            <MediaItem key={article.href} article={article} />
          ))}
        </ul>
      )}
      <Pagination page={page} pageCount={pageCount} onChange={setPage} label="Media news pages" />
      <p className="note">
        Headlines link to the publishers’ websites and open in a new tab. Bestari Food Berhad is not responsible for
        the content of third-party websites.
      </p>
    </Panel>
  )
}

interface MediaFiltersProps {
  criteria: MediaCriteria
  onChange: (next: MediaCriteria) => void
}

function MediaFilters({ criteria, onChange }: MediaFiltersProps): ReactElement {
  return (
    <FilterBar label="Filter media news" onReset={() => onChange(ALL_MEDIA)}>
      <SelectField<LanguageFilter>
        id="media-language"
        label="Language"
        value={criteria.language}
        options={LANGUAGE_OPTIONS}
        onChange={(language) => onChange({ ...criteria, language })}
      />
      <SelectField
        id="media-year"
        label="Year"
        value={criteria.year}
        options={YEAR_OPTIONS}
        onChange={(year) => onChange({ ...criteria, year })}
      />
      <InputField
        id="media-keyword"
        label="Keyword"
        type="search"
        placeholder="e.g. listing"
        value={criteria.keyword}
        onChange={(keyword) => onChange({ ...criteria, keyword })}
      />
    </FilterBar>
  )
}

function MediaItem({ article }: { article: MediaArticle }): ReactElement {
  return (
    <li className="media-item">
      <time className="news-date" dateTime={article.isoDate}>
        {article.date}
      </time>
      <div>
        <a
          className="media-headline"
          href={article.href}
          target="_blank"
          rel="noopener noreferrer"
          lang={LANGUAGE_CODES[article.language]}
        >
          {article.title}
          <span className="visually-hidden" lang="en">
            {' '}
            (opens in a new tab)
          </span>
          <span aria-hidden="true"> ↗</span>
        </a>
        <p className="media-meta">
          <span>{article.source}</span>
          <span className="chip">{article.language}</span>
        </p>
      </div>
    </li>
  )
}
