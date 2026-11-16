import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { PROCEEDS_TIMEFRAMES, PROSPECTUS_SOURCE } from '../../content/prospectus'
import { KPIS, PROCEEDS, PROCEEDS_SOURCE, type ProceedsUse } from '../../data'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel, StatGrid } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { AboutGroup, BusinessActivities } from './AboutGroup'
import { FinancialReview } from './FinancialReview'
import { SegmentReview } from './SegmentReview'

const timeframeOf = (use: ProceedsUse): string | undefined =>
  PROCEEDS_TIMEFRAMES.find((entry) => entry.title === use.title)?.timeframe

const PLAN_COLUMNS: readonly Column<ProceedsUse>[] = [
  { key: 'title', header: 'Use of proceeds', render: (use) => use.title, isRowHeader: true },
  { key: 'description', header: 'What it is for', render: (use) => use.description },
  { key: 'timeframe', header: 'Expected timeframe', render: (use) => timeframeOf(use) ?? <Ph>Per prospectus</Ph> },
  { key: 'amount', header: 'Amount (RM)', render: () => <Ph>Per prospectus</Ph>, align: 'right' },
]

type MdaTab = 'overview' | 'financial' | 'segments' | 'dividend' | 'plans'

/** Corporate Info › Management Discussion & Analysis, prepared from the draft prospectus until the first annual report. */
export function ManagementDiscussion(): ReactElement {
  return (
    <>
      <Notice title="Prepared from the draft prospectus">
        This review is prepared from the draft prospectus and covers the financial years it reports. Our full management
        discussion and analysis will be published with our first annual report after listing.
      </Notice>
      <SectionTabs tabs={MDA_TABS} />
    </>
  )
}

function BusinessOverview() {
  return (
    <div className="grid-2">
      <Panel title="Business overview">
        <AboutGroup />
      </Panel>
      <Panel title="Business activities" sub="Revenue by activity is set out under Segment review">
        <BusinessActivities />
      </Panel>
    </div>
  )
}

function DividendPolicy() {
  const policy = KPIS.find((kpi) => kpi.label === 'Dividend policy')
  return (
    <Panel title="Dividend policy">
      {policy ? (
        <StatGrid stats={[{ label: 'Target payout', value: policy.value, detail: policy.detail }]} label="Dividend policy" />
      ) : (
        <Ph>Dividend policy per prospectus</Ph>
      )}
      <p className="corp-text">
        Any dividend is at the discretion of the Board. The prospectus sets out the factors the Board will take into
        account, and dividends declared after listing will be listed under{' '}
        <Link to={irPath('stock-info', 'entitlements')}>Entitlements</Link>.
      </p>
    </Panel>
  )
}

function Plans() {
  return (
    <Panel title="Plans and use of IPO proceeds" sub={`${PROCEEDS_SOURCE}. Source: ${PROSPECTUS_SOURCE}.`}>
      <p className="corp-text">
        The Group plans to use the proceeds of the public issue to build a new production facility in Banting, equip it
        with new machinery, grow the Bestari brand and pay the costs of the listing.
      </p>
      <DataTable
        caption="Planned use of IPO proceeds"
        columns={PLAN_COLUMNS}
        rows={PROCEEDS}
        rowKey={(use) => use.title}
        minWidth={680}
      />
      <Link className="corp-more" to={irPath('ipo-centre', 'use-of-proceeds')}>
        Utilisation of proceeds in the IPO Centre <span aria-hidden="true">→</span>
      </Link>
    </Panel>
  )
}

const MDA_TABS: readonly SectionTab<MdaTab>[] = [
  { id: 'overview', label: 'Business overview', content: <BusinessOverview /> },
  { id: 'financial', label: 'Financial review', content: <FinancialReview /> },
  { id: 'segments', label: 'Segment review', content: <SegmentReview /> },
  { id: 'dividend', label: 'Dividend policy', content: <DividendPolicy /> },
  { id: 'plans', label: 'Plans & proceeds', content: <Plans /> },
]
