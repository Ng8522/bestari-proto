import type { ReactNode } from 'react'

export interface DonutSlice {
  label: string
  percent: number
  color: string
}

interface GradientStops {
  stops: readonly string[]
  end: number
}

/** conic-gradient with one segment per slice, e.g. "var(--brand) 0% 70.4%, var(--saffron) 70.4% 100%". */
export function donutGradient(slices: readonly DonutSlice[]): string {
  const { stops } = slices.reduce<GradientStops>(
    (acc, slice) => {
      const end = acc.end + slice.percent
      return { stops: [...acc.stops, `${slice.color} ${acc.end}% ${end}%`], end }
    },
    { stops: [], end: 0 },
  )
  return `conic-gradient(${stops.join(', ')})`
}

interface DonutProps {
  /** Screen-reader summary, e.g. "Shareholding after the IPO". */
  label: string
  slices: readonly DonutSlice[]
  /** Text in the hole. */
  centre?: ReactNode
  /** How shares read in the legend and summary; defaults to "70.4%". */
  formatPercent?: (percent: number) => string
}

const plainPercent = (percent: number): string => `${percent}%`

/** A conic-gradient donut with a legend of each slice and its share. */
export function Donut({ label, slices, centre, formatPercent = plainPercent }: DonutProps) {
  const summary = `${label}: ${slices.map((slice) => `${slice.label} ${formatPercent(slice.percent)}`).join(', ')}`
  return (
    <div className="donut-wrap">
      <div className="donut" role="img" aria-label={summary} style={{ background: donutGradient(slices) }}>
        {centre && <div className="donut-label">{centre}</div>}
      </div>
      <ul className="legend donut-legend">
        {slices.map((slice) => (
          <li key={slice.label}>
            <span className="swatch" style={{ background: slice.color }} aria-hidden="true" />
            {slice.label}
            <b>{formatPercent(slice.percent)}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}
