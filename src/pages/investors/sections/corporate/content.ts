/**
 * Corporate Info content derived from the draft prospectus (content/prospectus.ts): board composition, the person
 * cards for directors and key management, and the group structure. Every figure here is computed, not typed in.
 */
import {
  DIRECTORS,
  IPO_TERMS,
  POST_IPO_HOLDINGS,
  SUBSIDIARIES,
  type Director,
  type DirectorCategory,
  type Manager,
  type Subsidiary,
} from '../../content/prospectus'
import { sharePct } from '../../home/keyFigures'
import type { Stat } from '../../ui/PageParts'

export const CATEGORY_LABELS: Readonly<Record<DirectorCategory, string>> = {
  executive: 'Executive',
  independent: 'Independent Non-Executive',
}

/* Board composition */

export interface BoardComposition {
  total: number
  executive: number
  independent: number
  women: number
  averageAge: number
  youngest: number
  oldest: number
}

export function boardComposition(directors: readonly Director[]): BoardComposition {
  const ages = directors.map((director) => director.age)
  const count = (test: (director: Director) => boolean): number => directors.filter(test).length
  return {
    total: directors.length,
    executive: count((director) => director.category === 'executive'),
    independent: count((director) => director.category === 'independent'),
    women: count((director) => director.gender === 'Female'),
    averageAge: ages.reduce((sum, age) => sum + age, 0) / Math.max(1, directors.length),
    youngest: Math.min(...ages),
    oldest: Math.max(...ages),
  }
}

/** The Chairman of the Board, found by designation. */
export function findChairman(directors: readonly Director[] = DIRECTORS): Director | undefined {
  return directors.find((director) => /\bchairman\b/i.test(director.designation))
}

/** Key figures for the Board: size, independence, gender balance and age. */
export function boardStats(directors: readonly Director[] = DIRECTORS): Stat[] {
  const board = boardComposition(directors)
  const isChairIndependent = findChairman(directors)?.category === 'independent'
  return [
    {
      label: 'Directors',
      value: String(board.total),
      detail: `${board.executive} executive, ${board.independent} independent non-executive`,
    },
    {
      label: 'Independent directors',
      value: `${board.independent} (${sharePct(board.independent, board.total)}%)`,
      detail: isChairIndependent ? 'Including the Chairman' : undefined,
    },
    {
      label: 'Women directors',
      value: `${board.women} (${sharePct(board.women, board.total)}%)`,
      detail: `Of ${board.total} directors`,
    },
    {
      label: 'Average age',
      value: `${board.averageAge.toFixed(1)} years`,
      detail: `Youngest ${board.youngest}, oldest ${board.oldest}`,
    },
  ]
}

/* Person cards */

export type ChipTone = 'independent' | 'executive' | 'neutral'

export interface PersonChip {
  label: string
  tone: ChipTone
}

export interface PersonFact {
  label: string
  value: string
  /** Shown as a dashed placeholder until the registered prospectus confirms it. */
  isPlaceholder?: boolean
  /** Spans the full width of the facts grid. */
  isWide?: boolean
}

export interface PersonProfile {
  name: string
  designation: string
  chips: readonly PersonChip[]
  facts: readonly PersonFact[]
  qualifications: readonly string[]
  notes: readonly string[]
}

const COMMITTEES_PLACEHOLDER = 'Per registered prospectus'

export function directorProfile(director: Director): PersonProfile {
  const committeeFact: PersonFact =
    director.committees.length > 0
      ? { label: 'Committee roles', value: director.committees.join('; '), isWide: true }
      : { label: 'Committee roles', value: COMMITTEES_PLACEHOLDER, isPlaceholder: true, isWide: true }
  return {
    name: director.name,
    designation: director.designation,
    chips: [{ label: CATEGORY_LABELS[director.category], tone: director.category }],
    facts: [
      { label: 'Age', value: String(director.age) },
      { label: 'Gender', value: director.gender },
      { label: 'Nationality', value: director.nationality },
      { label: 'Date appointed', value: director.appointed },
      committeeFact,
    ],
    qualifications: director.qualifications,
    notes: director.notes,
  }
}

/** Names of the directors, to mark managers who also sit on the Board. */
export const DIRECTOR_NAMES: ReadonlySet<string> = new Set(DIRECTORS.map((director) => director.name))

export function managerProfile(manager: Manager, directorNames: ReadonlySet<string> = DIRECTOR_NAMES): PersonProfile {
  return {
    name: manager.name,
    designation: manager.designation,
    chips: directorNames.has(manager.name) ? [{ label: 'Board member', tone: 'neutral' }] : [],
    facts: [
      { label: 'Age', value: String(manager.age) },
      { label: 'Tenure', value: manager.since },
    ],
    qualifications: manager.qualifications,
    notes: manager.notes,
  }
}

/** "Low Chin Ann @ Han Chin Ann" → "LA": the first and last word of the name before any "@" alias. */
export function initials(name: string): string {
  const words = (name.split('@')[0] ?? '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = words[0].charAt(0)
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : ''
  return `${first}${last}`.toUpperCase()
}

/** Key figures for the key senior management team. */
export function managementStats(managers: readonly Manager[], directorNames: ReadonlySet<string> = DIRECTOR_NAMES): Stat[] {
  const ages = managers.map((manager) => manager.age)
  const averageAge = ages.reduce((sum, age) => sum + age, 0) / Math.max(1, managers.length)
  const onBoard = managers.filter((manager) => directorNames.has(manager.name)).length
  return [
    { label: 'Key senior management', value: String(managers.length) },
    { label: 'Average age', value: `${averageAge.toFixed(1)} years`, detail: `Youngest ${Math.min(...ages)}, oldest ${Math.max(...ages)}` },
    { label: 'Also on the Board', value: String(onBoard), detail: 'Executive directors in the team' },
  ]
}

/* Group structure */

export type ActivityGroupId = 'premixes' | 'ingredients' | 'services'

export interface SubsidiaryGroup {
  id: ActivityGroupId
  label: string
  subsidiaries: readonly Subsidiary[]
}

const GROUP_LABELS: Readonly<Record<ActivityGroupId, string>> = {
  premixes: 'Food premixes',
  ingredients: 'Ingredients, equipment & maintenance',
  services: 'Management services',
}

const GROUP_ORDER: readonly ActivityGroupId[] = ['premixes', 'ingredients', 'services']

/** Which business activity a subsidiary belongs to, from its principal activity in the prospectus. */
export function activityGroupOf(activity: string): ActivityGroupId {
  if (/premix/i.test(activity)) return 'premixes'
  if (/management/i.test(activity)) return 'services'
  return 'ingredients'
}

export function groupSubsidiaries(subsidiaries: readonly Subsidiary[] = SUBSIDIARIES): SubsidiaryGroup[] {
  return GROUP_ORDER.map((id) => ({
    id,
    label: GROUP_LABELS[id],
    subsidiaries: subsidiaries.filter((subsidiary) => activityGroupOf(subsidiary.activity) === id),
  })).filter((group) => group.subsidiaries.length > 0)
}

export interface StructureOwner {
  label: string
  percent: number
  detail: string
  isPublic: boolean
}

const PERCENT_SCALE = 10

/** The holding company's shareholders after the IPO: the selling shareholder, then the public as one box. */
export function structureOwners(): StructureOwner[] {
  const major = POST_IPO_HOLDINGS.find((holding) => holding.label === IPO_TERMS.sellingShareholder)
  const others = POST_IPO_HOLDINGS.filter((holding) => holding !== major)
  const publicPercent = Math.round(others.reduce((sum, holding) => sum + holding.percent, 0) * PERCENT_SCALE) / PERCENT_SCALE
  const owners: StructureOwner[] = major
    ? [{ label: major.label, percent: major.percent, detail: 'Major shareholder', isPublic: false }]
    : []
  return [
    ...owners,
    {
      label: 'Public shareholders',
      percent: publicPercent,
      detail: others.map((holding) => `${holding.label} ${holding.percent}%`).join(', '),
      isPublic: true,
    },
  ]
}
