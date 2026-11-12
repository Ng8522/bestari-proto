import { useId } from 'react'
import { COMMITMENT, PILLARS } from './data'
import { ringSegments } from './ring'

const CENTRE = 200
const GEOMETRY = { cx: CENTRE, cy: CENTRE, radius: 150, gapDegrees: 2.5 }
const CORE_RADIUS = 106
const SEGMENTS = ringSegments(PILLARS.length, GEOMETRY)

/** useId output contains characters that are awkward inside an SVG href fragment. */
function toFragmentSafe(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '')
}

/**
 * The commitment diagram: one coloured arc per pillar around "Sustainable outcomes".
 * Decorative only; the pillar links beside it carry the same content for assistive tech.
 */
export function PillarRing() {
  const idPrefix = toFragmentSafe(useId())

  return (
    <svg className="sus-ring" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      {PILLARS.map((pillar, index) => {
        const pathId = `${idPrefix}-arc-${pillar.id}`
        return (
          <g key={pillar.id} className={`sus-ring__seg sus-tone--${pillar.tone}`}>
            <path id={pathId} className="sus-ring__arc" d={SEGMENTS[index].path} />
            <text className="sus-ring__label" dominantBaseline="central">
              <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                {pillar.short}
              </textPath>
            </text>
          </g>
        )
      })}
      <circle className="sus-ring__core" cx={CENTRE} cy={CENTRE} r={CORE_RADIUS} />
      <text className="sus-ring__centre" x={CENTRE} y={CENTRE} textAnchor="middle">
        {COMMITMENT.ringCentre.map((line, index) => (
          <tspan key={line} x={CENTRE} dy={index === 0 ? '-0.15em' : '1.15em'}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  )
}
