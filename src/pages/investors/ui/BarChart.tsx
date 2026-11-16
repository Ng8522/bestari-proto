export interface BarDatum {
  label: string
  /** null while the figure is not confirmed: drawn as a dashed "TBA" bar. */
  value: number | null
}

const VIEW_W = 640
const VIEW_H = 300
const PAD = { top: 28, right: 12, bottom: 36, left: 52 }
const PLOT_H = VIEW_H - PAD.top - PAD.bottom
const GRID_LINES = 4
/** Height of the dashed placeholder bar, as a share of the plot. */
const PLACEHOLDER_SHARE = 0.18
const BAR_SHARE = 0.56

/** A round axis maximum at or above `max`, e.g. 175.3 → 200, 31 → 40, 0 → 1 (4 gridlines stay round). */
export function niceMax(max: number): number {
  if (max <= 0) return 1
  const magnitude = 10 ** Math.floor(Math.log10(max))
  const step = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((candidate) => candidate * magnitude >= max) ?? 10
  return step * magnitude
}

interface BarChartProps {
  /** e.g. "Revenue (RM million)"; also names the chart for screen readers. */
  title: string
  data: readonly BarDatum[]
  color?: string
  formatValue?: (value: number) => string
}

const defaultFormat = (value: number): string => value.toFixed(2)

/** A responsive SVG bar chart with value labels; screen readers get every value in its accessible name. */
export function BarChart({ title, data, color = 'var(--brand)', formatValue = defaultFormat }: BarChartProps) {
  const known = data.flatMap((datum) => (datum.value === null ? [] : [datum.value]))
  const axisMax = niceMax(Math.max(0, ...known))
  const slot = (VIEW_W - PAD.left - PAD.right) / Math.max(1, data.length)
  const barW = slot * BAR_SHARE
  const y = (value: number) => PAD.top + PLOT_H - (value / axisMax) * PLOT_H

  return (
    <figure className="bar-chart">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label={summarise(title, data, formatValue)}>
        {Array.from({ length: GRID_LINES + 1 }, (_, index) => {
          const value = (axisMax / GRID_LINES) * index
          return (
            <g key={index} className="bc-grid">
              <line x1={PAD.left} x2={VIEW_W - PAD.right} y1={y(value)} y2={y(value)} />
              <text x={PAD.left - 8} y={y(value) + 4} textAnchor="end">
                {Number(value.toFixed(2))}
              </text>
            </g>
          )
        })}
        {data.map((datum, index) => (
          <Bar
            key={datum.label}
            datum={datum}
            x={PAD.left + slot * index + (slot - barW) / 2}
            width={barW}
            axisMax={axisMax}
            color={color}
            formatValue={formatValue}
          />
        ))}
      </svg>
    </figure>
  )
}

interface BarProps {
  datum: BarDatum
  x: number
  width: number
  axisMax: number
  color: string
  formatValue: (value: number) => string
}

function Bar({ datum, x, width, axisMax, color, formatValue }: BarProps) {
  const { value } = datum
  const height = value === null ? PLOT_H * PLACEHOLDER_SHARE : (value / axisMax) * PLOT_H
  const top = PAD.top + PLOT_H - height
  return (
    <g className={value === null ? 'bc-bar bc-bar--tba' : 'bc-bar'}>
      <rect x={x} y={top} width={width} height={height} rx={6} style={value === null ? undefined : { fill: color }} />
      <text className="bc-value" x={x + width / 2} y={top - 8} textAnchor="middle">
        {value === null ? 'TBA' : formatValue(value)}
      </text>
      <text className="bc-label" x={x + width / 2} y={VIEW_H - 12} textAnchor="middle">
        {datum.label}
      </text>
    </g>
  )
}

function summarise(title: string, data: readonly BarDatum[], format: (value: number) => string): string {
  const points = data.map((datum) => `${datum.label} ${datum.value === null ? 'to be announced' : format(datum.value)}`)
  return `${title}: ${points.join(', ')}`
}
