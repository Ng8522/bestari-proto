import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { LEGAL_DOCUMENTS } from '../../content/sections'
import { DocTable } from '../../ui/DataTable'
import { Notice, Panel } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { TERMS_SECTIONS, type TermsSection } from './terms'

type TermsTab = 'using' | 'liability' | 'legal' | 'printable'

/** Clause ranges (indexes into TERMS_SECTIONS) shown under each tab; together they cover every clause in order. */
const USING_END = 3
const LIABILITY_END = 7

interface TermsGroupProps {
  /** The clauses in this tab; numbering continues from the clauses in earlier tabs. */
  sections: readonly TermsSection[]
  firstNumber: number
  hasLastUpdated?: boolean
  hasContactNote?: boolean
}

/** Investor Resources › IR Website Terms of Use: the numbered clauses in tabs, then the printable versions. */
export function TermsOfUsePage() {
  return (
    <>
      <Notice tone="pending" title="Draft pending legal review">
        These terms are a draft and are not yet in force. They will be reviewed by our legal advisers and may change
        before this website goes live.
      </Notice>
      <SectionTabs tabs={TERMS_TABS} />
    </>
  )
}

function TermsGroup({ sections, firstNumber, hasLastUpdated = false, hasContactNote = false }: TermsGroupProps) {
  return (
    <div className="card terms">
      {hasLastUpdated && (
        <p className="card-sub">
          Last updated: <Ph>date to be confirmed</Ph>
        </p>
      )}
      <ol className="terms-list" start={firstNumber}>
        {sections.map((section) => (
          <li key={section.id}>
            <section id={section.id} aria-labelledby={`${section.id}-title`}>
              <h3 id={`${section.id}-title`}>{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          </li>
        ))}
      </ol>
      {hasContactNote && (
        <p className="note rs-note">
          Questions about these terms? Contact our <Link to={irPath('contact')}>IR team</Link>.
        </p>
      )}
    </div>
  )
}

function PrintableVersions() {
  return (
    <Panel title="Printable versions" sub="PDF copies will be posted when the terms are final.">
      <DocTable caption="IR website terms and privacy notice" documents={LEGAL_DOCUMENTS} />
    </Panel>
  )
}

const TERMS_TABS: readonly SectionTab<TermsTab>[] = [
  {
    id: 'using',
    label: 'Using this site',
    content: <TermsGroup sections={TERMS_SECTIONS.slice(0, USING_END)} firstNumber={1} hasLastUpdated />,
  },
  {
    id: 'liability',
    label: 'Information & liability',
    content: (
      <TermsGroup sections={TERMS_SECTIONS.slice(USING_END, LIABILITY_END)} firstNumber={USING_END + 1} />
    ),
  },
  {
    id: 'legal',
    label: 'Privacy & legal',
    content: <TermsGroup sections={TERMS_SECTIONS.slice(LIABILITY_END)} firstNumber={LIABILITY_END + 1} hasContactNote />,
  },
  { id: 'printable', label: 'Printable versions', content: <PrintableVersions /> },
]
