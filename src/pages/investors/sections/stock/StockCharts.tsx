import { useState, type ReactElement } from 'react'
import { Segmented } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import { CHART_RANGES, CHART_TITLES, CHART_VIEWS, EMPTY_CHART, type ChartView } from './content'
import { rangeStart, todayIso, type ChartRange } from './dates'
import { describeRange } from './format'

const DEFAULT_RANGE: ChartRange = '1Y'

/** Stock Info › Interactive Stock Charts: closing price or volume over a chosen range. */
export function StockCharts(): ReactElement {
  const [today] = useState(todayIso)
  const [range, setRange] = useState<ChartRange>(DEFAULT_RANGE)
  const [view, setView] = useState<ChartView>('price')
  const period = range === 'All' ? 'Since listing' : describeRange(rangeStart(range, today), today)
  const title = CHART_TITLES[view]

  return (
    <>
      <Panel
        title={title}
        sub={period}
        actions={
          <div className="chart-controls">
            <Segmented label="Chart range" options={CHART_RANGES} value={range} onChange={setRange} />
            <Segmented label="Chart view" options={CHART_VIEWS} value={view} onChange={setView} />
          </div>
        }
      >
        <ChartFrame title={title} period={period} view={view} />
      </Panel>
      <Notice tone="pending" title="Charts start on the first trading day">
        Bestari Food Berhad is not listed yet. From the listing date the chart plots the daily closing price or
        volume for the range you choose.
      </Notice>
    </>
  )
}

const VIEW_W = 640
const VIEW_H = 300
const PAD = { top: 16, right: 16, bottom: 32, left: 48 }
const PLOT_W = VIEW_W - PAD.left - PAD.right
const PLOT_H = VIEW_H - PAD.top - PAD.bottom
const ROWS = 5
const COLUMNS = 6
const AXIS_LABELS: Readonly<Record<ChartView, string>> = { price: 'RM', volume: 'Volume' }

interface ChartFrameProps {
  title: string
  period: string
  view: ChartView
}

/** Empty plot area with gridlines, ready for the price or volume series. */
function ChartFrame({ title, period, view }: ChartFrameProps): ReactElement {
  const rowYs = Array.from({ length: ROWS + 1 }, (_, index) => PAD.top + (PLOT_H / ROWS) * index)
  const columnXs = Array.from({ length: COLUMNS + 1 }, (_, index) => PAD.left + (PLOT_W / COLUMNS) * index)
  const midY = PAD.top + PLOT_H / 2

  return (
    <figure className={`chart-frame chart-frame--${view}`}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label={`${title}, ${period}: ${EMPTY_CHART}.`}>
        <g className="cf-grid">
          {rowYs.map((y) => (
            <line key={`row-${y}`} x1={PAD.left} x2={VIEW_W - PAD.right} y1={y} y2={y} />
          ))}
          {columnXs.map((x) => (
            <line key={`col-${x}`} x1={x} x2={x} y1={PAD.top} y2={PAD.top + PLOT_H} />
          ))}
        </g>
        <text className="cf-axis" x={16} y={midY} textAnchor="middle" transform={`rotate(-90 16 ${midY})`}>
          {AXIS_LABELS[view]}
        </text>
        <text className="cf-axis" x={PAD.left + PLOT_W / 2} y={VIEW_H - 8} textAnchor="middle">
          {period}
        </text>
        <text className="cf-message" x={PAD.left + PLOT_W / 2} y={midY + 6} textAnchor="middle">
          {EMPTY_CHART}
        </text>
      </svg>
    </figure>
  )
}
