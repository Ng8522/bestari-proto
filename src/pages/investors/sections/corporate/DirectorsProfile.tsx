import type { ReactElement } from 'react'
import { DIRECTORS, PROSPECTUS_SOURCE } from '../../content/prospectus'
import { Notice, Panel, StatGrid } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { boardStats, directorProfile } from './content'
import { PersonGrid } from './PersonCard'

const PROFILES_NOTE =
  'Profiles are summarised from the draft prospectus. Full profiles, including other directorships and committee memberships, are in the registered prospectus.'

type DirectorsTab = 'composition' | 'directors'

/** Corporate Info › Directors' Profile: board composition, then one card per director. */
export function DirectorsProfile(): ReactElement {
  return <SectionTabs tabs={DIRECTORS_TABS} />
}

function BoardComposition() {
  return (
    <Panel title="Board composition" sub={`Computed from the Board in the draft prospectus. Source: ${PROSPECTUS_SOURCE}.`}>
      <StatGrid stats={boardStats(DIRECTORS)} label="Board composition" />
    </Panel>
  )
}

function Directors() {
  return (
    <>
      <PersonGrid label="Board of Directors" profiles={DIRECTORS.map(directorProfile)} />
      <Notice>{PROFILES_NOTE}</Notice>
    </>
  )
}

const DIRECTORS_TABS: readonly SectionTab<DirectorsTab>[] = [
  { id: 'directors', label: 'Directors', content: <Directors /> },
  { id: 'composition', label: 'Board composition', content: <BoardComposition /> },
]
