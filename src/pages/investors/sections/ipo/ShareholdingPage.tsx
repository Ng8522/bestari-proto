import { DIRECTORS, IPO_TERMS, KEY_MANAGEMENT, POST_IPO_HOLDINGS } from '../../content/prospectus'
import { CORE_PERPETUAL_OWNERS, POST_IPO_SHARES, type Owner } from '../../data'
import { DataTable, type Column } from '../../ui/DataTable'
import { Donut, type DonutSlice } from '../../ui/Donut'
import { Panel } from '../../ui/PageParts'
import { SourceNote } from './parts'

const HOLDING_COLOURS: readonly string[] = ['var(--brand)', 'var(--saffron)', 'var(--ink-2)']

const HOLDING_SLICES: readonly DonutSlice[] = POST_IPO_HOLDINGS.map((holding, index) => ({
  label: holding.label,
  percent: holding.percent,
  color: HOLDING_COLOURS[index % HOLDING_COLOURS.length],
}))

interface HoldingRow {
  label: string
  basis: string
  percent: number
}

/** How each holder comes to own its shares. */
const HOLDING_BASIS: Readonly<Record<string, string>> = {
  [IPO_TERMS.sellingShareholder]: 'Existing shareholder, and the selling shareholder in the offer for sale',
  'Institutional investors': 'Institutional offering',
  'Retail investors': 'Retail offering: Malaysian public and pink-form allocations',
}

const roundTo1dp = (value: number): number => Math.round(value * 10) / 10

const HOLDING_ROWS: readonly HoldingRow[] = [
  ...POST_IPO_HOLDINGS.map((holding) => ({ ...holding, basis: HOLDING_BASIS[holding.label] ?? '—' })),
  {
    label: 'Total',
    basis: `Enlarged share capital of ${IPO_TERMS.enlargedShares}`,
    percent: roundTo1dp(POST_IPO_HOLDINGS.reduce((sum, holding) => sum + holding.percent, 0)),
  },
]

const HOLDING_COLUMNS: readonly Column<HoldingRow>[] = [
  { key: 'label', header: 'Shareholder', render: (row) => row.label, isRowHeader: true },
  { key: 'basis', header: 'Basis', render: (row) => row.basis },
  { key: 'percent', header: '% after IPO', render: (row) => row.percent.toFixed(1), align: 'right' },
]

/** The owner's role in the Group, where the prospectus names them as a director or key manager. */
export function roleInGroup(name: string): string {
  const director = DIRECTORS.find((person) => person.name === name)
  if (director) return director.designation
  return KEY_MANAGEMENT.find((person) => person.name === name)?.designation ?? '—'
}

const OWNER_COLUMNS: readonly Column<Owner>[] = [
  { key: 'name', header: 'Shareholder', render: (owner) => owner.name, isRowHeader: true },
  { key: 'role', header: 'Role in the Group', render: (owner) => roleInGroup(owner.name) },
  { key: 'percent', header: '% of Core Perpetual', render: (owner) => owner.percent, align: 'right' },
]

/** Shareholding Structure: who owns Bestari Food Berhad after the IPO, and who owns the selling shareholder. */
export function IpoShareholdingPage() {
  return (
    <>
      <Panel title="Shareholding after the IPO" sub={`Percentage of the enlarged share capital of ${IPO_TERMS.enlargedShares}`}>
        <Donut
          label="Shareholding after the IPO"
          slices={HOLDING_SLICES}
          centre={
            <span>
              <b>{POST_IPO_SHARES}</b>shares post-IPO
            </span>
          }
        />
        <div className="ipo-total-last">
          <DataTable
            caption="Shareholding after the IPO"
            columns={HOLDING_COLUMNS}
            rows={HOLDING_ROWS}
            rowKey={(row) => row.label}
            minWidth={520}
          />
        </div>
        <SourceNote>Final figures will be in the registered prospectus.</SourceNote>
      </Panel>
      <Panel title={`Shareholders of ${IPO_TERMS.sellingShareholder}`} sub="The major shareholder and selling shareholder">
        <DataTable
          caption={`Shareholders of ${IPO_TERMS.sellingShareholder}`}
          columns={OWNER_COLUMNS}
          rows={CORE_PERPETUAL_OWNERS}
          rowKey={(owner) => owner.name}
          minWidth={520}
        />
        <SourceNote />
      </Panel>
    </>
  )
}
