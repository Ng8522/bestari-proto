import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import type { InfoEntry } from '../../content/sections'
import { CORPORATE_DIRECTORY, IPO_TERMS, PROSPECTUS_SOURCE } from '../../content/prospectus'
import { InfoList } from '../../Tabs'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel, Pending } from '../../ui/PageParts'
import {
  DRAFT_POSTED,
  DRAFT_UPDATED,
  PROSPECTUS_ROWS,
  SC_APPROVAL_DATE,
  type ProspectusAction,
  type ProspectusRow,
} from './content'

function directoryValue(labelStart: string): string {
  return CORPORATE_DIRECTORY.find((entry) => entry.label.startsWith(labelStart))?.lines.join('; ') ?? '—'
}

const DRAFT_FACTS: readonly InfoEntry[] = [
  { label: 'Draft posted', value: DRAFT_POSTED },
  { label: 'Draft updated', value: DRAFT_UPDATED },
  { label: 'SC approval', value: SC_APPROVAL_DATE },
  { label: 'Registered prospectus', value: 'Date TBA', isPlaceholder: true },
  { label: 'Principal adviser', value: directoryValue('Principal adviser') },
  { label: 'Issuing house', value: directoryValue('Issuing house') },
]

function ActionCell({ action, title }: { action: ProspectusAction; title: string }) {
  if (action.kind === 'pending') return <Pending>{action.label}</Pending>
  if (action.kind === 'internal') {
    return (
      <Link className="pr-action" to={action.to}>
        {action.label} <span aria-hidden="true">→</span>
      </Link>
    )
  }
  return (
    <a className="pr-action" href={action.href} target="_blank" rel="noopener noreferrer" aria-label={`${action.label}: ${title} (opens in a new tab)`}>
      {action.label} <span aria-hidden="true">↗</span>
    </a>
  )
}

const COLUMNS: readonly Column<ProspectusRow>[] = [
  {
    key: 'title',
    header: 'Document',
    isRowHeader: true,
    render: (row) => (
      <span className="pr-doc">
        {row.title}
        <small>{row.description}</small>
      </span>
    ),
  },
  { key: 'date', header: 'Date', render: (row) => (row.isDatePlaceholder ? <Ph>{row.date}</Ph> : row.date) },
  { key: 'source', header: 'Format / source', render: (row) => row.source },
  { key: 'action', header: 'View', render: (row) => <ActionCell action={row.action} title={row.title} />, align: 'right' },
]

/** Reports & Presentations › Prospectus: the registered prospectus (at launch), the SC approval and the draft. */
export function ProspectusPage() {
  return (
    <>
      <Notice title="Read the registered prospectus before you invest">
        Only the prospectus registered with the Securities Commission Malaysia is the basis for applying for our IPO
        shares. The exposure draft is unregistered and incomplete: its figures and terms may change, and it is not an
        offer or invitation to buy securities. {IPO_TERMS.approvalNote}
      </Notice>
      <Panel title="Prospectus documents" sub="Newest first.">
        <DataTable caption="Prospectus documents" columns={COLUMNS} rows={PROSPECTUS_ROWS} rowKey={(row) => row.title} minWidth={680} />
        <p className="note">
          The draft opens on the SC’s prospectus exposure page in a new tab; we do not host a copy. The registered
          prospectus will be available to view and download here when applications open.
        </p>
      </Panel>
      <Panel title="Key dates & parties" sub={`Source: ${PROSPECTUS_SOURCE}.`}>
        <InfoList entries={DRAFT_FACTS} className="info--grid" />
      </Panel>
    </>
  )
}
