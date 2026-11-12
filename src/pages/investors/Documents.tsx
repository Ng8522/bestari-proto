import { useRef, useState, type KeyboardEvent } from 'react'
import { DIRECTORY, DOCUMENT_TABS, type DocumentTabId, type IrDocument } from './data'
import { IrSection, SectionHead } from './Section'

const KEY_STEPS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_index, count) => count - 1,
}

const DOCS_HEADING_ID = 'ir-docs-heading'

/** Tabbed document list beside the corporate directory. */
export function Documents() {
  return (
    <IrSection id="documents">
      <SectionHead sectionId="documents" eyebrow="Resources" title="Documents & corporate directory." />
      <div className="docs-grid">
        <DocumentTabs />
        <div className="card dir reveal">
          <h3>Corporate directory</h3>
          <dl>
            {DIRECTORY.map((entry) => (
              <div key={entry.label}>
                <dt>{entry.label}</dt>
                <dd>{entry.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </IrSection>
  )
}

const tabId = (id: DocumentTabId) => `ir-doc-tab-${id}`
const panelId = (id: DocumentTabId) => `ir-doc-panel-${id}`

/** WAI-ARIA tabs (automatic activation): arrow keys, Home and End move between tabs. */
function DocumentTabs() {
  const [activeId, setActiveId] = useState<DocumentTabId>(DOCUMENT_TABS[0].id)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = KEY_STEPS[event.key]
    if (!step) return
    event.preventDefault()
    const nextIndex = step(index, DOCUMENT_TABS.length)
    setActiveId(DOCUMENT_TABS[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="card reveal">
      <h3 id={DOCS_HEADING_ID}>Documents</h3>
      <div className="tabs" role="tablist" aria-labelledby={DOCS_HEADING_ID}>
        {DOCUMENT_TABS.map((tab, index) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={isActive}
              aria-controls={panelId(tab.id)}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {DOCUMENT_TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelId(tab.id)}
          aria-labelledby={tabId(tab.id)}
          hidden={tab.id !== activeId}
          tabIndex={0}
        >
          <ul className="doc-list">
            {tab.documents.map((doc) => (
              <DocumentRow key={doc.title} doc={doc} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

interface DocumentRowProps {
  doc: IrDocument
}

function DocumentRow({ doc }: DocumentRowProps) {
  const label = (
    <>
      {doc.format} <span aria-hidden="true">↓</span>
    </>
  )
  return (
    <li className="doc">
      <div>
        {doc.title}
        <small>{doc.meta}</small>
      </div>
      {doc.href ? (
        <a className="doc-link" href={doc.href} aria-label={`Download ${doc.title} (${doc.format})`}>
          {label}
        </a>
      ) : (
        // No file is published yet: same pill, but not a dead link.
        <span className="doc-link">
          {label}
          <span className="visually-hidden"> (not yet available)</span>
        </span>
      )}
    </li>
  )
}
