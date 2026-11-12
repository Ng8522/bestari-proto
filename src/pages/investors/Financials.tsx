import { useEffect, useRef, useState, type RefObject } from 'react'
import { useInView, usePrefersReducedMotion } from '../../components/motion'
import { Ph } from '../../components/text'
import {
  FINANCIAL_STATEMENTS,
  HIGHLIGHT_YEAR_LABELS,
  SEGMENTS,
  SEGMENT_SHARE_PLACEHOLDER,
  buildHighlightRows,
} from './content/financials'
import { FINANCIAL_SERIES, FINANCIAL_YEARS, KPIS } from './data'
import { IrSection, SectionHead } from './Section'
import { DocList, Tabs, type TabItem } from './Tabs'

/** Bars grow once the chart top is 85% of the way down the viewport. */
const CHART_ROOT_MARGIN = '0px 0px -15% 0px'
/** The handoff's safety net: grow the bars anyway after 3s. */
const GROW_FALLBACK_MS = 3000

function formatAmount(amount: number): string {
  return amount.toFixed(2)
}

/** True once the bars should show their values (in view, reduced motion, or the fallback timer). */
function useBarsGrown(chartRef: RefObject<HTMLDivElement | null>): boolean {
  const isInView = useInView(chartRef, CHART_ROOT_MARGIN)
  const isReducedMotion = usePrefersReducedMotion()
  const [isFallbackDue, setFallbackDue] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setFallbackDue(true), GROW_FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return isInView || isReducedMotion || isFallbackDue
}

/** Revenue vs net profit bar chart plus three KPI cards. */
export function Financials() {
  return (
    <IrSection id="financials">
      <SectionHead
        sectionId="financials"
        eyebrow="Financial highlights"
        title="Growing, profitably."
        intro="Financial years ended 31 December. Source: draft prospectus."
      />
      <div className="fin">
        <div className="card reveal">
          <h3>Revenue vs net profit (RM million)</h3>
          <BarChart />
          <ChartTable />
        </div>
        <div className="kpis">
          {KPIS.map((kpi) => (
            <div key={kpi.label} className={`kpi kpi--${kpi.tone} reveal`}>
              <span className="kpi-label">{kpi.label}</span>
              <b className="kpi-value">{kpi.value}</b>
              <p>{kpi.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <FinancialDetails />
    </IrSection>
  )
}

/** The visual chart. Screen readers get the same numbers from ChartTable. */
function BarChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const isGrown = useBarsGrown(chartRef)

  return (
    <div aria-hidden="true">
      <div className="chart" ref={chartRef}>
        {FINANCIAL_YEARS.map((year) => (
          <div key={year.label} className="chart-col">
            {FINANCIAL_SERIES.map((series) => {
              const value = year.values[series.key]
              return (
                <div
                  key={series.key}
                  className="chart-bar"
                  data-series={series.key}
                  style={{ height: isGrown ? `${value.heightPct}%` : 0, background: series.color }}
                >
                  <span>{formatAmount(value.amount)}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="chart-x">
        {FINANCIAL_YEARS.map((year) => (
          <span key={year.label}>{year.label}</span>
        ))}
      </div>
      <div className="chart-key">
        {FINANCIAL_SERIES.map((series) => (
          <span key={series.key}>
            <i style={{ background: series.color }} />
            {series.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function ChartTable() {
  return (
    <div className="visually-hidden">
      <table>
        <caption>Revenue and net profit, RM million, financial years ended 31 December</caption>
        <thead>
          <tr>
            <th scope="col">Financial year</th>
            {FINANCIAL_SERIES.map((series) => (
              <th key={series.key} scope="col">
                {series.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FINANCIAL_YEARS.map((year) => (
            <tr key={year.label}>
              <th scope="row">{year.label}</th>
              {FINANCIAL_SERIES.map((series) => (
                <td key={series.key}>{formatAmount(year.values[series.key].amount)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type FinanceTabId = 'highlights' | 'segments' | 'statements'

const DETAILS_HEADING_ID = 'ir-fin-details-title'
const HIGHLIGHT_ROWS = buildHighlightRows(FINANCIAL_YEARS, HIGHLIGHT_YEAR_LABELS)

const FINANCE_TABS: readonly TabItem<FinanceTabId>[] = [
  { id: 'highlights', label: 'Financial highlights', content: <HighlightsTable /> },
  { id: 'segments', label: 'Segmental analysis', content: <SegmentList /> },
  { id: 'statements', label: 'Financial statements', content: <DocList documents={FINANCIAL_STATEMENTS} /> },
]

/** Multi-year highlights, segmental analysis and financial statements, as tabs under the chart. */
function FinancialDetails() {
  return (
    <div className="card fin-details reveal">
      <h3 id={DETAILS_HEADING_ID}>Financial information</h3>
      <Tabs idPrefix="ir-fin" labelledBy={DETAILS_HEADING_ID} tabs={FINANCE_TABS} />
    </div>
  )
}

function HighlightsTable() {
  return (
    <>
      <div className="table-scroll" role="region" aria-label="Financial highlights table" tabIndex={0}>
        <table className="data-table">
          <caption className="visually-hidden">Financial highlights, RM million, FY2022 to FY2025</caption>
          <thead>
            <tr>
              <th scope="col">RM million</th>
              {HIGHLIGHT_YEAR_LABELS.map((label) => (
                <th key={label} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HIGHLIGHT_ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={HIGHLIGHT_YEAR_LABELS[index]}>{value ?? <Ph>TBA</Ph>}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Figures marked TBA are added from the accountants’ report in the registered prospectus.</p>
    </>
  )
}

function SegmentList() {
  return (
    <ul className="seg-list">
      {SEGMENTS.map((segment) => (
        <li key={segment.name}>
          <div>
            <b>{segment.name}</b>
            <small>{segment.description}</small>
          </div>
          <Ph>{SEGMENT_SHARE_PLACEHOLDER}</Ph>
        </li>
      ))}
    </ul>
  )
}
