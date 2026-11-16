import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { LEGAL_DOCUMENTS } from '../../content/sections'
import { DocTable } from '../../ui/DataTable'
import { Notice, Panel } from '../../ui/PageParts'
import { TERMS_SECTIONS } from './terms'

/** Investor Resources › IR Website Terms of Use: the terms in numbered sections, with a contents list. */
export function TermsOfUsePage() {
  return (
    <>
      <Notice tone="pending" title="Draft pending legal review">
        These terms are a draft and are not yet in force. They will be reviewed by our legal advisers and may change
        before this website goes live.
      </Notice>
      <div className="terms-layout">
        <nav className="card terms-toc" aria-label="Terms of use contents">
          <p className="eyebrow">Contents</p>
          <ol>
            {TERMS_SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="card terms">
          <p className="card-sub">
            Last updated: <Ph>date to be confirmed</Ph>
          </p>
          <ol className="terms-list">
            {TERMS_SECTIONS.map((section) => (
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
          <p className="note rs-note">
            Questions about these terms? Contact our <Link to={irPath('contact')}>IR team</Link>.
          </p>
        </div>
      </div>
      <Panel title="Printable versions" sub="PDF copies will be posted when the terms are final.">
        <DocTable caption="IR website terms and privacy notice" documents={LEGAL_DOCUMENTS} />
      </Panel>
    </>
  )
}
