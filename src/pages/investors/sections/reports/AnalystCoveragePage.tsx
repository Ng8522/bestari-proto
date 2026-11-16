import { useState } from 'react'
import { DataTable, type Column } from '../../ui/DataTable'
import { FilterBar, SelectField } from '../../ui/Filters'
import { Notice, Panel, Pending, StatGrid, type Stat } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { ANALYST_REPORTS, RECOMMENDATION_OPTIONS, type AnalystReport, type Recommendation } from './content'

const NO_VALUE = '—'

const RECOMMENDATION_LABELS: Readonly<Record<AnalystReport['recommendation'], string>> = {
  buy: 'Buy',
  hold: 'Hold',
  sell: 'Sell',
}

function countOf(recommendation: AnalystReport['recommendation']): number {
  return ANALYST_REPORTS.filter((report) => report.recommendation === recommendation).length
}

function coverageStats(): readonly Stat[] {
  const houses = new Set(ANALYST_REPORTS.map((report) => report.house)).size
  const hasCoverage = houses > 0
  return [
    { label: 'Research houses', value: hasCoverage ? String(houses) : 'None yet' },
    { label: 'Buy / Hold / Sell', value: hasCoverage ? `${countOf('buy')} / ${countOf('hold')} / ${countOf('sell')}` : NO_VALUE },
    { label: 'Latest report', value: ANALYST_REPORTS[0]?.date ?? NO_VALUE },
  ]
}

const COLUMNS: readonly Column<AnalystReport>[] = [
  { key: 'house', header: 'Research house', render: (report) => report.house, isRowHeader: true },
  { key: 'analyst', header: 'Analyst', render: (report) => report.analyst },
  { key: 'date', header: 'Date', render: (report) => report.date },
  { key: 'call', header: 'Recommendation', render: (report) => RECOMMENDATION_LABELS[report.recommendation] },
  { key: 'target', header: 'Target price (RM)', render: (report) => report.targetPrice, align: 'right' },
  {
    key: 'report',
    header: 'Report',
    align: 'right',
    render: (report) =>
      report.href ? (
        <a href={report.href} target="_blank" rel="noopener noreferrer" aria-label={`${report.house} report, ${report.date} (opens in a new tab)`}>
          View
        </a>
      ) : (
        <Pending>On request</Pending>
      ),
  },
]

type AnalystTab = 'summary' | 'reports'

/** Reports & Presentations › Analyst Coverage: research houses that cover us and their latest calls. */
export function AnalystCoveragePage() {
  return (
    <>
      <Notice title="How coverage is listed">
        We list research reports on Bestari Food Berhad from research houses and investment banks that tell us they
        cover us, newest first, with the recommendation and target price as at the date of each report. Where a
        research house allows it, we link to the report. The recommendations, target prices and forecasts are the
        analysts’ own: they are not ours, and we do not endorse or confirm them.
      </Notice>
      <SectionTabs tabs={ANALYST_TABS} />
    </>
  )
}

function CoverageSummary() {
  return (
    <Panel title="Coverage summary">
      <StatGrid stats={coverageStats()} label="Analyst coverage summary" />
    </Panel>
  )
}

function ResearchReports() {
  const [recommendation, setRecommendation] = useState<Recommendation>('all')
  const reports = ANALYST_REPORTS.filter((report) => recommendation === 'all' || report.recommendation === recommendation)

  return (
    <Panel title="Research reports" sub="Newest first. Target prices in RM per share.">
      <FilterBar label="Filter research reports" onReset={() => setRecommendation('all')}>
        <SelectField id="ir-analyst-call" label="Recommendation" value={recommendation} options={RECOMMENDATION_OPTIONS} onChange={setRecommendation} />
      </FilterBar>
      <DataTable
        caption="Analyst research reports on Bestari Food Berhad"
        columns={COLUMNS}
        rows={reports}
        rowKey={(report) => `${report.house}-${report.date}`}
        emptyMessage="No research house covers Bestari Food Berhad yet. Reports will be listed here once coverage starts."
        minWidth={720}
      />
    </Panel>
  )
}

const ANALYST_TABS: readonly SectionTab<AnalystTab>[] = [
  { id: 'summary', label: 'Coverage summary', content: <CoverageSummary /> },
  { id: 'reports', label: 'Research reports', content: <ResearchReports /> },
]
