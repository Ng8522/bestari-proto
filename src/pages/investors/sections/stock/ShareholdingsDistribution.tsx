import type { ReactElement } from 'react'
import { POST_IPO_HOLDINGS, PROSPECTUS_SOURCE, IPO_TERMS } from '../../content/prospectus'
import { CORE_PERPETUAL_OWNERS, POST_IPO_SHARES, type Owner } from '../../data'
import { DataTable, type Column } from '../../ui/DataTable'
import { Donut, type DonutSlice } from '../../ui/Donut'
import { Notice, Panel, Pending } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { distributionTotal } from './calc'
import { DISTRIBUTION, FIRST_RECORD, FIVE_PERCENT_SHARES, SHARES_IN_ISSUE, type DistributionRow } from './content'
import { formatCount, formatPercent, orDash } from './format'

const DISTRIBUTION_CAPTION = 'Distribution of shareholdings by size of holdings'
const HEADERS = ['Size of holdings', 'No. of holders', '% of holders', 'No. of shares', '% of shares'] as const
const SLICE_COLORS = ['var(--brand)', 'var(--saffron)', 'var(--brand-deep)'] as const

const LISTING_SLICES: readonly DonutSlice[] = POST_IPO_HOLDINGS.map((holding, index) => ({
  label: holding.label,
  percent: holding.percent,
  color: SLICE_COLORS[index % SLICE_COLORS.length],
}))

const OWNER_COLUMNS: readonly Column<Owner>[] = [
  { key: 'name', header: 'Shareholder', render: (owner) => owner.name, isRowHeader: true },
  { key: 'percent', header: '% of Core Perpetual', render: (owner) => `${owner.percent}%`, align: 'right' },
]

type DistributionTab = 'size' | 'listing'

/** Stock Info › Distribution of Shareholdings: holders by size of holding, and the shareholding on listing. */
export function ShareholdingsDistribution(): ReactElement {
  return <SectionTabs tabs={DISTRIBUTION_TABS} />
}

function SizeOfHoldings(): ReactElement {
  return (
    <>
      <Panel title="Analysis by size of holdings" sub="From the record of depositors">
        <p className="as-at">
          As at: <Pending>{FIRST_RECORD}</Pending>
        </p>
        <DistributionTable rows={DISTRIBUTION} />
        <p className="note">
          On {formatCount(SHARES_IN_ISSUE)} shares in issue on listing, 5% of issued shares is{' '}
          {formatCount(FIVE_PERCENT_SHARES)} shares.
        </p>
      </Panel>
      <Notice tone="pending">
        We publish this analysis after the first record of depositors following listing, and in every annual report.
      </Notice>
    </>
  )
}

function ShareholdingOnListing(): ReactElement {
  return (
    <div className="grid-2">
      <Panel title="Shareholding on listing" sub={`Of ${POST_IPO_SHARES} shares, after the IPO`}>
        <Donut label="Shareholding on listing" slices={LISTING_SLICES} centre={`${POST_IPO_SHARES} shares`} />
        <p className="note">Source: {PROSPECTUS_SOURCE}.</p>
      </Panel>
      <Panel title={`Shareholders of ${IPO_TERMS.sellingShareholder}`} sub="Our substantial shareholder on listing">
        <DataTable
          caption={`Shareholders of ${IPO_TERMS.sellingShareholder}`}
          columns={OWNER_COLUMNS}
          rows={CORE_PERPETUAL_OWNERS}
          rowKey={(owner) => owner.name}
          minWidth={320}
        />
        <p className="note">Source: {PROSPECTUS_SOURCE}.</p>
      </Panel>
    </div>
  )
}

function DistributionTable({ rows }: { rows: readonly DistributionRow[] }): ReactElement {
  return (
    <div className="table-scroll" role="region" aria-label={DISTRIBUTION_CAPTION} tabIndex={0}>
      <table className="data-table ir-table" style={{ minWidth: 640 }}>
        <caption className="visually-hidden">{DISTRIBUTION_CAPTION}</caption>
        <thead>
          <tr>
            {HEADERS.map((header, index) => (
              <th key={header} scope="col" className={index === 0 ? 'al-left' : 'al-right'}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <DistributionLine key={row.band} row={row} />
          ))}
        </tbody>
        <tfoot>
          <DistributionLine row={distributionTotal(rows)} isTotal />
        </tfoot>
      </table>
    </div>
  )
}

function DistributionLine({ row, isTotal = false }: { row: DistributionRow; isTotal?: boolean }): ReactElement {
  return (
    <tr className={isTotal ? 'is-total' : undefined}>
      <th scope="row" className="al-left">
        {row.band}
      </th>
      <td className="al-right">{orDash(row.holders, formatCount)}</td>
      <td className="al-right">{orDash(row.holdersPct, formatPercent)}</td>
      <td className="al-right">{orDash(row.shares, formatCount)}</td>
      <td className="al-right">{orDash(row.sharesPct, formatPercent)}</td>
    </tr>
  )
}

const DISTRIBUTION_TABS: readonly SectionTab<DistributionTab>[] = [
  { id: 'size', label: 'Size of holdings', content: <SizeOfHoldings /> },
  { id: 'listing', label: 'Shareholding on listing', content: <ShareholdingOnListing /> },
]
