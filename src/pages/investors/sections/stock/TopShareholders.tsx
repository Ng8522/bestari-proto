import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { irPath } from '../../../../content/ir-nav'
import { IPO_TERMS, PROSPECTUS_SOURCE } from '../../content/prospectus'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel, StatGrid, type Stat } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { FIRST_RECORD, SHARES_IN_ISSUE, SUBSTANTIAL_ON_LISTING, TOP_HOLDERS, type TopHolder } from './content'
import { formatCount, formatPercent } from './format'

const MILLION = 1_000_000

const TOP_COLUMNS: readonly Column<TopHolder>[] = [
  { key: 'rank', header: 'No.', render: (holder) => holder.rank, align: 'center' },
  { key: 'name', header: 'Name', render: (holder) => holder.name, isRowHeader: true },
  { key: 'shares', header: 'No. of shares', render: (holder) => formatCount(holder.shares), align: 'right' },
  { key: 'percent', header: '% of issued shares', render: (holder) => formatPercent(holder.percent), align: 'right' },
]

/** Key figures for a holder named in the prospectus; the share count is derived from its rounded percentage. */
function holderStats(holding: { label: string; percent: number }): readonly Stat[] {
  const approxShares = (SHARES_IN_ISSUE * holding.percent) / 100 / MILLION
  return [
    { label: '% of issued shares', value: `${holding.percent}%`, detail: 'On listing, after the IPO' },
    {
      label: 'Shares held (approx.)',
      value: `${approxShares.toFixed(1)} million`,
      detail: `${holding.percent}% of ${formatCount(SHARES_IN_ISSUE)} shares`,
    },
    {
      label: 'Role in the IPO',
      value: 'Selling shareholder',
      detail: `Offer for sale: ${IPO_TERMS.offerForSale.toLowerCase()}`,
    },
  ]
}

type TopTab = 'top-30' | 'substantial'

/** Stock Info › Top 30 Shareholders: the largest holders from the record of depositors. */
export function TopShareholders(): ReactElement {
  return <SectionTabs tabs={TOP_TABS} />
}

function ThirtyLargest(): ReactElement {
  return (
    <Panel title="Thirty largest shareholders" sub={`As at: ${FIRST_RECORD.toLowerCase()}`}>
      <DataTable
        caption="Top 30 shareholders"
        columns={TOP_COLUMNS}
        rows={TOP_HOLDERS}
        rowKey={(holder) => `${holder.rank}-${holder.name}`}
        emptyMessage="Published from the first record of depositors after listing."
        minWidth={600}
      />
    </Panel>
  )
}

function SubstantialShareholders(): ReactElement {
  return (
    <>
      {SUBSTANTIAL_ON_LISTING.map((holding) => (
        <Panel key={holding.label} title="Substantial shareholder on listing" sub={holding.label}>
          <StatGrid stats={holderStats(holding)} label={`${holding.label} on listing`} />
          <p className="note">Source: {PROSPECTUS_SOURCE}. The exact number of shares is set out in the prospectus.</p>
        </Panel>
      ))}
      <Notice>
        A substantial shareholder holds an interest in 5% or more of a company’s voting shares. Changes in substantial
        shareholdings are announced to Bursa Malaysia; see{' '}
        <Link to={irPath('news', 'bursa-announcements')}>Bursa Announcements</Link>.
      </Notice>
    </>
  )
}

const TOP_TABS: readonly SectionTab<TopTab>[] = [
  { id: 'top-30', label: 'Thirty largest', content: <ThirtyLargest /> },
  { id: 'substantial', label: 'Substantial shareholder', content: <SubstantialShareholders /> },
]
