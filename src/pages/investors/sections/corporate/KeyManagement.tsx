import type { ReactElement } from 'react'
import { KEY_MANAGEMENT, PROSPECTUS_SOURCE } from '../../content/prospectus'
import { Notice, Panel, StatGrid } from '../../ui/PageParts'
import { managementStats, managerProfile } from './content'
import { PersonGrid } from './PersonCard'

/** Corporate Info › Key Management Team: the team at a glance, then one card per manager. */
export function KeyManagement(): ReactElement {
  return (
    <>
      <Panel title="The team at a glance" sub={`Source: ${PROSPECTUS_SOURCE}.`}>
        <StatGrid stats={managementStats(KEY_MANAGEMENT)} label="Key senior management at a glance" />
      </Panel>
      <PersonGrid label="Key senior management" profiles={KEY_MANAGEMENT.map((manager) => managerProfile(manager))} />
      <Notice>
        Profiles are summarised from the draft prospectus and will be updated from the registered prospectus.
      </Notice>
    </>
  )
}
