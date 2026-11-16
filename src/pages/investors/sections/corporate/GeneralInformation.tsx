import type { ReactElement, ReactNode } from 'react'
import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { COMPANY } from '../../../../content/site'
import { CORPORATE_DIRECTORY, PROSPECTUS_SOURCE, type DirectoryEntry } from '../../content/prospectus'
import { Panel } from '../../ui/PageParts'
import { AboutGroup, BusinessActivities } from './AboutGroup'

interface DirectoryRow {
  label: string
  value: ReactNode
}

const LISTING_ROWS: readonly DirectoryRow[] = [
  { label: 'Company name', value: COMPANY.name },
  { label: 'Stock name / code', value: <Ph>Assigned at listing</Ph> },
  { label: 'Listing sought', value: 'Main Market, Bursa Malaysia Securities Berhad' },
  { label: 'Sector', value: <Ph>Per Bursa classification</Ph> },
  { label: 'Shariah status', value: 'Shariah-compliant (SC Shariah Advisory Council)' },
]

function entryValue(entry: DirectoryEntry): ReactNode {
  const lines = entry.lines.map((line) => (
    <span key={line} className="corp-dir-line">
      {entry.isPlaceholder ? <Ph>{line}</Ph> : line}
    </span>
  ))
  return <>{lines}</>
}

const CONTACT_ROWS: readonly DirectoryRow[] = [
  { label: 'Head office telephone', value: <a href={COMPANY.phone.href}>{COMPANY.phone.label}</a> },
  { label: 'Head office email', value: <a href={COMPANY.email.href}>{COMPANY.email.label}</a> },
]

const DIRECTORY_ROWS: readonly DirectoryRow[] = [
  ...LISTING_ROWS,
  ...CORPORATE_DIRECTORY.map((entry) => ({ label: entry.label, value: entryValue(entry) })),
  ...CONTACT_ROWS,
]

/** Corporate Info › General Information: the corporate directory, what the Group does and its activities. */
export function GeneralInformation(): ReactElement {
  return (
    <>
      <Panel title="Corporate directory" sub={`Source: ${PROSPECTUS_SOURCE}.`}>
        <dl className="corp-dir">
          {DIRECTORY_ROWS.map((row) => (
            <div key={row.label} className="corp-dir-row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="note">
          Dashed values are confirmed at listing or in the registered prospectus, and will be updated here.
        </p>
      </Panel>
      <div className="grid-2">
        <Panel title="About the Group">
          <AboutGroup />
        </Panel>
        <Panel title="Business activities" sub="Through the Group’s subsidiaries">
          <BusinessActivities />
          <Link className="corp-more" to={irPath('corporate-info', 'corporate-structure')}>
            See the corporate structure <span aria-hidden="true">→</span>
          </Link>
        </Panel>
      </div>
    </>
  )
}
