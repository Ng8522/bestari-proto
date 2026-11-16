import { useState } from 'react'
import { Link } from 'react-router'
import { irPath } from '../../../../content/ir-nav'
import { InfoList } from '../../Tabs'
import { DocTable } from '../../ui/DataTable'
import { FilterBar, SelectField } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import { CIRCULARS, CIRCULAR_CATEGORIES, CIRCULAR_TOPICS, type CircularCategory } from './content'

const EMPTY_MESSAGES: Readonly<Record<CircularCategory, string>> = {
  all: 'No circulars or statements to shareholders have been issued yet.',
  circular: 'No circulars to shareholders have been issued yet.',
  statement: 'No statements to shareholders have been issued yet.',
}

/** Reports & Presentations › Circulars: circulars and statements to shareholders, by category. */
export function CircularsPage() {
  const [category, setCategory] = useState<CircularCategory>('all')
  const documents = CIRCULARS.filter((doc) => category === 'all' || doc.category === category)
  const count = documents.length

  return (
    <>
      <Panel title="Circulars & statements" sub="Newest first, with the date each was issued.">
        <FilterBar label="Filter circulars" onReset={() => setCategory('all')}>
          <SelectField id="ir-circulars-category" label="Category" value={category} options={CIRCULAR_CATEGORIES} onChange={setCategory} />
        </FilterBar>
        <p className="result-count" role="status">
          {count} {count === 1 ? 'document' : 'documents'}
        </p>
        <DocTable caption="Circulars and statements to shareholders" documents={documents} emptyMessage={EMPTY_MESSAGES[category]} />
      </Panel>
      <Notice title="When circulars are issued">
        A circular explains a proposal that shareholders vote on at a general meeting, and usually goes out with the
        notice of that meeting. Ours will be posted here when they are issued, after listing. Meeting papers are under{' '}
        <Link to={irPath('governance', 'shareholders-meeting')}>Shareholders Meeting</Link>.
      </Notice>
      <Panel title="What a circular can cover" sub="General examples for Main Market companies, not proposals we have made.">
        <InfoList entries={CIRCULAR_TOPICS} />
      </Panel>
    </>
  )
}
