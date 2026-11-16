import { Ph } from '../../../../components/text'
import { IPO_TERMS, PROCEEDS_TIMEFRAMES } from '../../content/prospectus'
import { PROCEEDS, PROCEEDS_SOURCE } from '../../data'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel } from '../../ui/PageParts'
import { SourceNote } from './parts'

interface ProceedsRow {
  number: string
  purpose: string
  description: string
  timeframe: string
}

/** The draft prospectus leaves the RM amounts and percentages blank ("RM[●]"). */
const AMOUNT_PLACEHOLDER = 'RM[●]'
const SHARE_PLACEHOLDER = '[●]%'

const timeframeFor = (title: string): string =>
  PROCEEDS_TIMEFRAMES.find((entry) => entry.title === title)?.timeframe ?? '—'

const descriptionOf = (title: string): string => PROCEEDS.find((use) => use.title === title)?.description ?? ''

const PROCEEDS_ROWS: readonly ProceedsRow[] = [
  ...PROCEEDS.map((use) => ({
    number: use.number,
    purpose: use.title,
    description: use.description,
    timeframe: timeframeFor(use.title),
  })),
  { number: '', purpose: 'Total', description: PROCEEDS_SOURCE, timeframe: '' },
]

const PROCEEDS_COLUMNS: readonly Column<ProceedsRow>[] = [
  { key: 'number', header: 'No.', render: (row) => row.number },
  { key: 'purpose', header: 'Purpose', render: (row) => row.purpose, isRowHeader: true },
  { key: 'description', header: 'Description', render: (row) => row.description },
  { key: 'timeframe', header: 'Estimated timeframe for use', render: (row) => row.timeframe },
  { key: 'amount', header: 'RM’000', render: () => <Ph>{AMOUNT_PLACEHOLDER}</Ph>, align: 'right' },
  { key: 'share', header: '%', render: () => <Ph>{SHARE_PLACEHOLDER}</Ph>, align: 'right' },
]

const STATUS_COLUMNS: readonly Column<ProceedsRow>[] = [
  { key: 'purpose', header: 'Purpose', render: (row) => row.purpose, isRowHeader: true },
  { key: 'proposed', header: 'Proposed (RM’000)', render: () => '—', align: 'right' },
  { key: 'used', header: 'Used to date (RM’000)', render: () => '—', align: 'right' },
  { key: 'balance', header: 'Balance (RM’000)', render: () => '—', align: 'right' },
  { key: 'deadline', header: 'Intended timeframe', render: (row) => row.timeframe },
]

/** Utilisation of Proceeds: the planned uses of the public issue money, and (after listing) progress against them. */
export function IpoProceedsPage() {
  return (
    <>
      <Panel title="Utilisation of proceeds" sub={PROCEEDS_SOURCE}>
        <div className="ipo-total-last">
          <DataTable
            caption="Planned utilisation of the public issue proceeds"
            columns={PROCEEDS_COLUMNS}
            rows={PROCEEDS_ROWS}
            rowKey={(row) => row.purpose}
            minWidth={820}
          />
        </div>
        <SourceNote>
          The draft leaves the amounts and percentages blank; they will be added from the registered prospectus.
        </SourceNote>
      </Panel>
      <div className="grid-2">
        <Panel title="The new production facility">
          <p>{descriptionOf('New production facility')}</p>
          <p>
            The new facility will support a planned move into ingredient processing and a wider product range. The
            machinery and equipment budget covers: {descriptionOf('Machinery & equipment').toLowerCase()}
          </p>
        </Panel>
        <Panel title="Offer for sale">
          <p>
            The offer for sale ({IPO_TERMS.offerForSale.toLowerCase()}) is made by the selling shareholder,{' '}
            {IPO_TERMS.sellingShareholder}. The money from those shares goes to the selling shareholder, not to the
            Group, so only the public issue ({IPO_TERMS.publicIssue}) funds the plans above.
          </p>
        </Panel>
      </div>
      <Panel title="Status of utilisation" sub="Proposed against actual use, RM’000">
        <Notice tone="pending">
          Progress on the use of proceeds is reported after listing, in our quarterly results. It will be shown here.
        </Notice>
        <DataTable
          caption="Status of utilisation of proceeds"
          columns={STATUS_COLUMNS}
          rows={PROCEEDS_ROWS.slice(0, PROCEEDS.length)}
          rowKey={(row) => row.purpose}
          minWidth={640}
        />
      </Panel>
    </>
  )
}
