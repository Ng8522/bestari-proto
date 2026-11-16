import { useState, type ReactElement } from 'react'
import { DocTable } from '../../ui/DataTable'
import { FilterBar, SelectField, type Option } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import {
  GOVERNANCE_DOCUMENTS,
  POLICY_CATEGORY_LABELS,
  POLICY_CATEGORY_NOTES,
  filterDocuments,
  type CategoryFilter,
  type PolicyCategory,
} from './content'

const CATEGORIES = Object.keys(POLICY_CATEGORY_LABELS) as PolicyCategory[]

const CATEGORY_OPTIONS: readonly Option<CategoryFilter>[] = [
  { value: 'all', label: 'All documents' },
  ...CATEGORIES.map((category) => ({ value: category, label: POLICY_CATEGORY_LABELS[category] })),
]

const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`

/** Governance › Policy Disclosures: every governance document, filterable by category. None is published yet. */
export function PolicyDisclosures(): ReactElement {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const documents = filterDocuments(GOVERNANCE_DOCUMENTS, category)
  return (
    <>
      <Notice tone="pending" title="Posted on listing">
        Our governance documents will be posted here when Bestari Food Berhad is listed on the Main Market of Bursa
        Malaysia. Companies listed on the Main Market publish their constitution, board charter, committee terms of
        reference and key governance policies on their website. The list below shows the documents such a company
        typically publishes; the final set is the one our Board adopts.
      </Notice>
      <Panel title="Governance documents" sub="View or download each document once it is published.">
        <FilterBar label="Filter governance documents" onReset={() => setCategory('all')}>
          <SelectField id="gov-category" label="Category" value={category} options={CATEGORY_OPTIONS} onChange={setCategory} />
        </FilterBar>
        <p className="result-count" aria-live="polite">
          Showing {documents.length} of {plural(GOVERNANCE_DOCUMENTS.length, 'document')}
        </p>
        <DocTable
          caption="Governance documents"
          documents={documents}
          emptyMessage="No documents in this category yet."
        />
      </Panel>
      <ul className="grid-3 gov-categories" aria-label="Document categories">
        {CATEGORIES.map((entry) => (
          <li key={entry} className="card gov-category">
            <h3>{POLICY_CATEGORY_LABELS[entry]}</h3>
            <p>{POLICY_CATEGORY_NOTES[entry]}</p>
            <small>{plural(filterDocuments(GOVERNANCE_DOCUMENTS, entry).length, 'document')}</small>
          </li>
        ))}
      </ul>
    </>
  )
}
