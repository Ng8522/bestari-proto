import { useState, type ReactElement } from 'react'
import { DataTable, type Column } from '../../ui/DataTable'
import { FilterBar, InputField, SelectField, type Option } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { Pagination, usePagination } from '../../ui/Pagination'
import { dateRangeError } from '../stock/dates'
import { formatIsoDate } from '../stock/format'
import { ANNOUNCEMENT_CATEGORIES, ANNOUNCEMENTS, CATEGORY_GUIDE, type Announcement } from './content'
import { ALL, ALL_ANNOUNCEMENTS, filterAnnouncements, showingText, type AnnouncementCriteria } from './filters'

type AnnouncementTab = 'announcements' | 'categories'

const PAGE_SIZE = 10
const NOUN = { one: 'announcement', many: 'announcements' } as const

type CategoryFilter = AnnouncementCriteria['category']

const CATEGORY_OPTIONS: readonly Option<CategoryFilter>[] = [
  { value: ALL, label: 'All' },
  ...ANNOUNCEMENT_CATEGORIES.map((category) => ({ value: category, label: category })),
]

const ANNOUNCEMENT_COLUMNS: readonly Column<Announcement>[] = [
  { key: 'date', header: 'Date', render: (item) => formatIsoDate(item.isoDate) },
  { key: 'category', header: 'Category', render: (item) => item.category },
  { key: 'title', header: 'Title', render: (item) => <AnnouncementTitle item={item} />, isRowHeader: true },
]

/** News Centre › Bursa Announcements: every announcement to Bursa Malaysia, by category, date and keyword. */
export function BursaAnnouncements(): ReactElement {
  return (
    <>
      <Notice tone="pending" title="Announcements start on listing">
        Bestari Food Berhad is not listed yet. From the listing date, every announcement we make to Bursa Malaysia is
        posted here on the day it is released.
      </Notice>
      <SectionTabs tabs={ANNOUNCEMENT_TABS} />
    </>
  )
}

function AnnouncementList(): ReactElement {
  const [criteria, setCriteria] = useState<AnnouncementCriteria>(ALL_ANNOUNCEMENTS)
  const error = dateRangeError(criteria.from, criteria.to)
  const results = error ? [] : filterAnnouncements(ANNOUNCEMENTS, criteria)
  const { page, pageCount, pageItems, setPage } = usePagination(results, PAGE_SIZE)

  const update = (next: AnnouncementCriteria): void => {
    setCriteria(next)
    setPage(1)
  }

  return (
    <Panel title="Announcements to Bursa Malaysia" sub="Newest first">
      <AnnouncementFilters criteria={criteria} onChange={update} />
      {error ? (
        <p className="range-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="result-count" aria-live="polite">
          {showingText(page, PAGE_SIZE, results.length, NOUN)}
        </p>
      )}
      <DataTable
        caption="Announcements to Bursa Malaysia"
        columns={ANNOUNCEMENT_COLUMNS}
        rows={pageItems}
        rowKey={(item) => item.id}
        emptyMessage={
          ANNOUNCEMENTS.length === 0
            ? 'Our announcements to Bursa Malaysia start on the listing date.'
            : 'No announcements match these filters.'
        }
        minWidth={640}
      />
      <Pagination page={page} pageCount={pageCount} onChange={setPage} label="Announcement pages" />
    </Panel>
  )
}

function CategoryGuide(): ReactElement {
  return (
    <Panel title="What each category covers">
      <dl className="cat-guide">
        {ANNOUNCEMENT_CATEGORIES.map((category) => (
          <div key={category}>
            <dt>{category}</dt>
            <dd>{CATEGORY_GUIDE[category]}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}

interface AnnouncementFiltersProps {
  criteria: AnnouncementCriteria
  onChange: (next: AnnouncementCriteria) => void
}

function AnnouncementFilters({ criteria, onChange }: AnnouncementFiltersProps): ReactElement {
  return (
    <FilterBar label="Filter announcements" onReset={() => onChange(ALL_ANNOUNCEMENTS)}>
      <SelectField<CategoryFilter>
        id="ann-category"
        label="Category"
        value={criteria.category}
        options={CATEGORY_OPTIONS}
        onChange={(category) => onChange({ ...criteria, category })}
      />
      <InputField
        id="ann-from"
        label="From"
        type="date"
        value={criteria.from}
        onChange={(from) => onChange({ ...criteria, from })}
      />
      <InputField
        id="ann-to"
        label="To"
        type="date"
        value={criteria.to}
        onChange={(to) => onChange({ ...criteria, to })}
      />
      <InputField
        id="ann-keyword"
        label="Keyword"
        type="search"
        placeholder="e.g. dividend"
        value={criteria.keyword}
        onChange={(keyword) => onChange({ ...criteria, keyword })}
      />
    </FilterBar>
  )
}

function AnnouncementTitle({ item }: { item: Announcement }): ReactElement {
  if (!item.href) return <>{item.title}</>
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer">
      {item.title}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}

const ANNOUNCEMENT_TABS: readonly SectionTab<AnnouncementTab>[] = [
  { id: 'announcements', label: 'Announcements', content: <AnnouncementList /> },
  { id: 'categories', label: 'Categories', content: <CategoryGuide /> },
]
