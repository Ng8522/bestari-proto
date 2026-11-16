import type { ReactElement } from 'react'
import { COMPANY } from '../../../../content/site'
import { PROSPECTUS_SOURCE, SUBSIDIARIES, type Subsidiary } from '../../content/prospectus'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { groupSubsidiaries, structureOwners, type SubsidiaryGroup } from './content'

const INTEREST_NOTE =
  'Effective interests apply once the pre-IPO acquisitions of the subsidiaries are completed, as set out in the draft prospectus. Shareholdings in the holding company are after the IPO.'

const SUBSIDIARY_COLUMNS: readonly Column<Subsidiary>[] = [
  { key: 'name', header: 'Subsidiary', render: (subsidiary) => subsidiary.name, isRowHeader: true },
  { key: 'country', header: 'Country of incorporation', render: (subsidiary) => subsidiary.country },
  { key: 'activity', header: 'Principal activity', render: (subsidiary) => subsidiary.activity },
  { key: 'interest', header: 'Effective interest', render: (subsidiary) => `${subsidiary.interest}%`, align: 'right' },
]

/** Corporate Info › Corporate Structure: the group chart, then every subsidiary in a table. */
export function CorporateStructure(): ReactElement {
  return <SectionTabs tabs={STRUCTURE_TABS} />
}

type StructureTab = 'chart' | 'subsidiaries'

const InterestNotice = () => <Notice title="About these interests">{INTEREST_NOTE}</Notice>

function GroupStructure() {
  return (
    <>
      <Panel title="Group structure" sub="After the IPO and the pre-IPO acquisitions">
        <OrgChart groups={groupSubsidiaries()} />
      </Panel>
      <InterestNotice />
    </>
  )
}

function Subsidiaries() {
  return (
    <>
      <Panel title="Subsidiaries" sub={`Source: ${PROSPECTUS_SOURCE}.`}>
        <DataTable
          caption={`Subsidiaries of ${COMPANY.name}`}
          columns={SUBSIDIARY_COLUMNS}
          rows={SUBSIDIARIES}
          rowKey={(subsidiary) => subsidiary.name}
          minWidth={620}
        />
      </Panel>
      <InterestNotice />
    </>
  )
}

const STRUCTURE_TABS: readonly SectionTab<StructureTab>[] = [
  { id: 'chart', label: 'Group structure', content: <GroupStructure /> },
  { id: 'subsidiaries', label: 'Subsidiaries', content: <Subsidiaries /> },
]

interface OrgChartProps {
  groups: readonly SubsidiaryGroup[]
}

/** Shareholders → holding company → subsidiaries by activity. Boxes stack in one column on phones. */
function OrgChart({ groups }: OrgChartProps) {
  return (
    <figure className="org-chart">
      <figcaption className="visually-hidden">
        Group structure: {COMPANY.name} and its {SUBSIDIARIES.length} subsidiaries, by business activity.
      </figcaption>
      <ul className="oc-tier" aria-label="Shareholders after the IPO">
        {structureOwners().map((owner) => (
          <li key={owner.label} className={owner.isPublic ? 'oc-box oc-box--public' : 'oc-box oc-box--owner'}>
            <b>{owner.label}</b>
            <span className="oc-pct">{owner.percent}%</span>
            <small>{owner.detail}</small>
          </li>
        ))}
      </ul>
      <span className="oc-link" aria-hidden="true" />
      <div className="oc-box oc-box--root">
        <b>{COMPANY.name}</b>
        <small>Investment holding company, seeking listing on the Main Market of Bursa Malaysia</small>
      </div>
      <span className="oc-link" aria-hidden="true" />
      <ul className="oc-groups" aria-label="Subsidiaries by business activity">
        {groups.map((group) => (
          <li key={group.id} className="oc-group">
            <h4>{group.label}</h4>
            <ul className="oc-subs">
              {group.subsidiaries.map((subsidiary) => (
                <SubsidiaryBox key={subsidiary.name} subsidiary={subsidiary} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </figure>
  )
}

function SubsidiaryBox({ subsidiary }: { subsidiary: Subsidiary }) {
  return (
    <li className="oc-sub">
      <b>{subsidiary.name}</b>
      <small>{subsidiary.activity}</small>
      <span className="oc-sub-meta">
        <span>{subsidiary.interest}%</span>
        <span>{subsidiary.country}</span>
      </span>
    </li>
  )
}
