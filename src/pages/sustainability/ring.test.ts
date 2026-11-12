import { describe, expect, it } from 'vitest'
import { ringSegments } from './ring'

const SQUARE = { cx: 200, cy: 200, radius: 100, gapDegrees: 0 }

describe('ringSegments', () => {
  it('returns one segment per item, the first centred at 12 o’clock', () => {
    const segments = ringSegments(4, SQUARE)

    expect(segments).toHaveLength(4)
    expect(segments[0]).toEqual({
      path: 'M 129.29 129.29 A 100 100 0 0 1 270.71 129.29',
      isReversed: false,
    })
  })

  it('draws bottom-half segments right to left so their labels read upright', () => {
    const [, right, bottom] = ringSegments(4, SQUARE)

    expect(right.isReversed).toBe(false)
    expect(bottom).toEqual({
      path: 'M 129.29 270.71 A 100 100 0 0 0 270.71 270.71',
      isReversed: true,
    })
  })

  it('leaves a gap between neighbouring segments', () => {
    const [first] = ringSegments(4, { ...SQUARE, gapDegrees: 10 })

    expect(first.path).toBe('M 135.72 123.4 A 100 100 0 0 1 264.28 123.4')
  })

  it('uses the large-arc flag when a segment spans more than 180°', () => {
    const [only] = ringSegments(1, { ...SQUARE, gapDegrees: 20 })

    expect(only.path).toBe('M 182.64 298.48 A 100 100 0 1 1 217.36 298.48')
  })

  it('rejects counts and gaps that leave no drawable arc', () => {
    expect(() => ringSegments(0, SQUARE)).toThrow(RangeError)
    expect(() => ringSegments(2.5, SQUARE)).toThrow(RangeError)
    expect(() => ringSegments(1, SQUARE)).toThrow(RangeError)
    expect(() => ringSegments(4, { ...SQUARE, gapDegrees: 90 })).toThrow(RangeError)
  })
})
