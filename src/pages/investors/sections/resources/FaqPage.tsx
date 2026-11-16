import { useState } from 'react'
import { Link } from 'react-router'
import { irPath } from '../../../../content/ir-nav'
import { EmptyState } from '../../Tabs'
import { FilterBar, InputField } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import { FAQ_ITEMS, searchFaq } from './faqContent'

/** Investor Resources › Investor FAQ: a searchable accordion of common investor questions. */
export function FaqPage() {
  const [query, setQuery] = useState('')
  const items = searchFaq(FAQ_ITEMS, query)

  return (
    <>
      <Panel title="Frequently asked questions" sub="Select a question to show its answer.">
        <FilterBar label="Search the FAQ" onReset={() => setQuery('')}>
          <InputField id="ir-faq-search" label="Search questions" type="search" value={query} onChange={setQuery} placeholder="e.g. dividend" />
        </FilterBar>
        <p className="result-count" role="status">
          {items.length === FAQ_ITEMS.length
            ? `${FAQ_ITEMS.length} questions`
            : `${items.length} of ${FAQ_ITEMS.length} questions`}
        </p>
        {items.length === 0 ? (
          <EmptyState>No questions match “{query.trim()}”. Try another word, or ask our IR team.</EmptyState>
        ) : (
          <div className="faq">
            {items.map((item) => (
              <details key={item.id} className="faq-item">
                <summary>{item.question}</summary>
                <div className="faq-answer">{item.answer}</div>
              </details>
            ))}
          </div>
        )}
      </Panel>
      <Notice title="Still have a question?">
        Our IR team is happy to help: use the enquiry form on the <Link to={irPath('contact')}>IR Contact</Link> page.
        Answers here are general information, not investment advice; for the IPO, read the registered prospectus.
      </Notice>
    </>
  )
}
