/**
 * Computation helpers for the Financial Info pages: growth, margins and segment shares, worked out from the RM'000
 * figures in content/prospectus.ts so that nothing derived is typed in by hand. Percentages are rounded to one
 * decimal place, as in the prospectus.
 */
import type { SegmentRevenue } from '../../content/prospectus'

const THOUSANDS_PER_MILLION = 1000
const PERCENT = 100
const ONE_DECIMAL = 10

const roundTo1dp = (value: number): number => Math.round(value * ONE_DECIMAL) / ONE_DECIMAL

/** RM'000 → RM million, unrounded (charts and labels round for display). */
export function toMillions(thousands: number): number {
  return thousands / THOUSANDS_PER_MILLION
}

/** Change from `previous` to `current` (%), or null when there is no positive base to compare with. */
export function growthPct(current: number, previous: number): number | null {
  if (previous <= 0) return null
  return roundTo1dp(((current - previous) / previous) * PERCENT)
}

/** Year-on-year growth for every year; the first year has nothing before it, so it is null. */
export function growthSeries(values: readonly number[]): (number | null)[] {
  return values.map((value, index) => (index === 0 ? null : growthPct(value, values[index - 1])))
}

/** Compound annual growth rate (%) from the first to the last value, or null without a positive start and end. */
export function cagrPct(values: readonly number[]): number | null {
  const first = values[0]
  const last = values[values.length - 1]
  const years = values.length - 1
  if (years < 1 || first <= 0 || last <= 0) return null
  return roundTo1dp(((last / first) ** (1 / years) - 1) * PERCENT)
}

/** `part` as a percentage of `whole` (a margin or a share), or 0 when the whole is 0. */
export function percentOf(part: number, whole: number): number {
  if (whole === 0) return 0
  return roundTo1dp((part / whole) * PERCENT)
}

/** Year-by-year margins: each `parts` value over the `wholes` value for the same year. */
export function marginSeries(parts: readonly number[], wholes: readonly number[]): number[] {
  return parts.map((part, index) => percentOf(part, wholes[index] ?? 0))
}

/** Change between two percentages, in percentage points (one decimal place). */
export function pointChange(from: number, to: number): number {
  return roundTo1dp(to - from)
}

/** Year-by-year differences, e.g. revenue less gross profit = cost of sales. */
export function differenceSeries(minuends: readonly number[], subtrahends: readonly number[]): number[] {
  return minuends.map((value, index) => value - (subtrahends[index] ?? 0))
}

/** The business segments themselves, without the breakdown lines inside them. */
export function mainSegments(segments: readonly SegmentRevenue[]): SegmentRevenue[] {
  return segments.filter((segment) => !segment.isSubLine)
}

/** Total revenue of the main segments for one year (sub-lines are already inside their segment). */
export function segmentTotal(segments: readonly SegmentRevenue[], yearIndex: number): number {
  return mainSegments(segments).reduce((sum, segment) => sum + (segment.values[yearIndex] ?? 0), 0)
}

export interface SegmentShare {
  name: string
  description: string
  /** RM'000. */
  value: number
  percent: number
}

/** Each main segment's revenue and share of the year's total. */
export function segmentShares(segments: readonly SegmentRevenue[], yearIndex: number): SegmentShare[] {
  const total = segmentTotal(segments, yearIndex)
  return mainSegments(segments).map((segment) => {
    const value = segment.values[yearIndex] ?? 0
    return { name: segment.name, description: segment.description, value, percent: percentOf(value, total) }
  })
}

/* Formatting */

const THOUSANDS_FORMAT = new Intl.NumberFormat('en-MY', { maximumFractionDigits: 0 })

/** 137865 → "137,865"; negatives in brackets, as in financial statements: -88951 → "(88,951)". */
export function formatThousands(value: number): string {
  const digits = THOUSANDS_FORMAT.format(Math.abs(value))
  return value < 0 ? `(${digits})` : digits
}

/** RM'000 → "RM175.3m". */
export function formatRmMillion(thousands: number): string {
  return `RM${toMillions(thousands).toFixed(1)}m`
}

/** 46.76 → "46.8%"; null → "—". */
export function formatPct(value: number | null): string {
  return value === null ? '—' : `${value.toFixed(1)}%`
}

const signed = (value: number): string => (value === 0 ? '0.0' : `${value > 0 ? '+' : '−'}${Math.abs(value).toFixed(1)}`)

/** Growth with its sign: 9.1 → "+9.1%", -3 → "−3.0%", null → "—". */
export function formatGrowth(value: number | null): string {
  return value === null ? '—' : `${signed(value)}%`
}

/** A percentage-point change with its sign: 11.3 → "+11.3 pts". */
export function formatPoints(value: number): string {
  return `${signed(value)} pts`
}
