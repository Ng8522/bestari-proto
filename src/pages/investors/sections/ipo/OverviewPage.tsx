import { Link } from 'react-router'
import { irPath } from '../../../../content/ir-nav'
import { IPO_TERMS, SC_EXPOSURE_URL } from '../../content/prospectus'
import { ALLOCATION, ALLOCATION_TOTAL, IPO_GLANCE } from '../../data'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel, StatGrid } from '../../ui/PageParts'
import { directoryLines, KEY_PARTY_LABELS, OFFER_STRUCTURE, type OfferRow } from './content'
import { ExternalLink, SourceNote } from './parts'

const OFFER_COLUMNS: readonly Column<OfferRow>[] = [
  { key: 'component', header: 'Component', render: (row) => row.component, isRowHeader: true },
  { key: 'shares', header: 'Number of shares', render: (row) => row.shares },
  { key: 'detail', header: 'Details', render: (row) => row.detail },
]

/** IPO Overview: the IPO at a glance, its structure, the allocation, the parties and the approval. */
export function IpoOverviewPage() {
  return (
    <>
      <Panel title="IPO at a glance" sub="Main Market of Bursa Malaysia Securities Berhad">
        <StatGrid stats={IPO_GLANCE} label="IPO key figures" />
        <SourceNote>The retail price and listing date will be in the registered prospectus.</SourceNote>
      </Panel>
      <Panel title="Offer structure" sub="How the IPO shares are made up and who they are offered to">
        <div className="ipo-total-last">
          <DataTable
            caption="Offer structure of the IPO"
            columns={OFFER_COLUMNS}
            rows={OFFER_STRUCTURE}
            rowKey={(row) => row.component}
            minWidth={640}
          />
        </div>
        <SourceNote />
      </Panel>
      <div className="grid-2">
        <AllocationPanel />
        <KeyPartiesPanel />
      </div>
      <Notice title="Approval">
        <p>
          The Securities Commission Malaysia (SC) approved the IPO on 23 Oct 2026, and Bestari Food Berhad’s shares are
          classified as Shariah-compliant by the SC’s Shariah Advisory Council. {IPO_TERMS.approvalNote}
        </p>
      </Notice>
      <ProspectusPanel />
    </>
  )
}

const ALLOCATION_SUMMARY = `Allocation of IPO shares: ${ALLOCATION.map((tranche) => `${tranche.barLabel} ${tranche.amount}`).join(', ')}`

function AllocationPanel() {
  return (
    <Panel title="Allocation of IPO shares" sub={ALLOCATION_TOTAL} className="ipo-alloc">
      <div className="alloc-bar" role="img" aria-label={ALLOCATION_SUMMARY}>
        {ALLOCATION.map((tranche) => (
          <div key={tranche.id} style={{ flex: tranche.weight, background: tranche.color, color: tranche.textColor }}>
            <span>{tranche.barLabel}</span>
          </div>
        ))}
      </div>
      <ul className="legend">
        {ALLOCATION.map((tranche) => (
          <li key={tranche.id}>
            <span className="swatch" style={{ background: tranche.color }} aria-hidden="true" />
            {tranche.description}
            <b>{tranche.amount}</b>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function KeyPartiesPanel() {
  return (
    <Panel title="Key parties" sub="Advisers and agents for the IPO">
      <dl className="info ipo-parties">
        {KEY_PARTY_LABELS.map((label) => (
          <div key={label}>
            <dt>{label}</dt>
            {directoryLines(label).map((line) => (
              <dd key={line}>{line}</dd>
            ))}
          </div>
        ))}
      </dl>
      <p className="note">
        The full corporate directory is under{' '}
        <Link to={irPath('corporate-info', 'general-information')}>General Information</Link>.
      </p>
    </Panel>
  )
}

function ProspectusPanel() {
  return (
    <Panel title="Prospectus" sub="Draft prospectus on the SC’s prospectus exposure page">
      <p>
        The draft prospectus gives early access to information about the IPO. It is not the registered prospectus, and
        its contents may change. Applications can only be made on the basis of the registered prospectus, once it is
        issued.
      </p>
      <p className="ipo-links">
        <ExternalLink className="btn btn-brand" href={SC_EXPOSURE_URL}>
          Read the draft prospectus <span aria-hidden="true">↗</span>
        </ExternalLink>
        <Link className="btn btn-ghost" to={irPath('ipo-centre', 'how-to-apply')}>
          How to apply
        </Link>
      </p>
    </Panel>
  )
}
