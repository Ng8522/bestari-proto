/** SVG geometry for the commitment ring: equal arcs around a circle, each carrying a label along it. */

export interface RingGeometry {
  cx: number
  cy: number
  radius: number
  /** Empty space between neighbouring arcs, in degrees. */
  gapDegrees: number
}

export interface RingSegment {
  /** Arc path for both the stroke and the label's <textPath>. */
  path: string
  /** Bottom-half arcs run right to left, so text along them stays upright. */
  isReversed: boolean
}

const FULL_TURN = 360
const HALF_TURN = 180
const QUARTER_TURN = 90
const THREE_QUARTER_TURN = 270

function round(value: number): number {
  return Math.round(value * 100) / 100
}

/** Point on the circle at `degrees` clockwise from 12 o'clock. */
function pointAt(degrees: number, { cx, cy, radius }: RingGeometry): string {
  const radians = (degrees * Math.PI) / HALF_TURN
  return `${round(cx + radius * Math.sin(radians))} ${round(cy - radius * Math.cos(radians))}`
}

/** Splits the ring into `count` equal arcs, the first centred at 12 o'clock, going clockwise. */
export function ringSegments(count: number, geometry: RingGeometry): RingSegment[] {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError(`A ring needs a whole number of segments, got ${count}`)
  }
  const step = FULL_TURN / count
  const span = step - geometry.gapDegrees
  if (span <= 0 || span >= FULL_TURN) {
    throw new RangeError(`A ${geometry.gapDegrees}° gap leaves no drawable ${step}° segment`)
  }

  const { radius } = geometry
  const largeArc = span > HALF_TURN ? 1 : 0

  return Array.from({ length: count }, (_, index) => {
    const middle = index * step
    const start = pointAt(middle - span / 2, geometry)
    const end = pointAt(middle + span / 2, geometry)
    const isReversed = middle > QUARTER_TURN && middle < THREE_QUARTER_TURN
    const path = isReversed
      ? `M ${end} A ${radius} ${radius} 0 ${largeArc} 0 ${start}`
      : `M ${start} A ${radius} ${radius} 0 ${largeArc} 1 ${end}`
    return { path, isReversed }
  })
}
