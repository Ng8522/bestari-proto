import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { DIRECTORS, PROSPECTUS_SOURCE, type Director } from '../../content/prospectus'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel, Pending } from '../../ui/PageParts'
import { CATEGORY_LABELS, boardComposition } from '../corporate/content'
import { COMMITTEES, committeeChair, type Committee } from './content'

const MEMBERS_PLACEHOLDER = 'Per prospectus'

const BOARD_COLUMNS: readonly Column<Director>[] = [
  { key: 'name', header: 'Director', render: (director) => director.name, isRowHeader: true },
  { key: 'designation', header: 'Designation', render: (director) => director.designation },
  {
    key: 'category',
    header: 'Category',
    render: (director) => (
      <span className={director.category === 'independent' ? 'chip chip--done' : 'chip chip--exec'}>
        {CATEGORY_LABELS[director.category]}
      </span>
    ),
  },
  { key: 'appointed', header: 'Date appointed', render: (director) => director.appointed },
]

/** Governance › Board Committees: a card per committee, then the Board's composition. */
export function BoardCommittees(): ReactElement {
  const board = boardComposition(DIRECTORS)
  return (
    <>
      <div className="grid-2">
        {COMMITTEES.map((committee) => (
          <CommitteeCard key={committee.name} committee={committee} />
        ))}
      </div>
      <Notice>
        Committee members are confirmed in the registered prospectus. The responsibilities listed are what such a
        committee typically does; each committee’s own terms of reference will be
        published under <Link to={irPath('governance', 'policy-disclosures')}>Policy Disclosures</Link> on listing.
      </Notice>
      <Panel
        title="Board composition"
        sub={`${board.independent} of ${board.total} directors are independent non-executive directors. Source: ${PROSPECTUS_SOURCE}.`}
      >
        <DataTable caption="Board of Directors" columns={BOARD_COLUMNS} rows={DIRECTORS} rowKey={(director) => director.name} />
      </Panel>
    </>
  )
}

interface CommitteeCardProps {
  committee: Committee
}

function CommitteeCard({ committee }: CommitteeCardProps) {
  const chair = committeeChair(committee)
  return (
    <Panel title={committee.name} sub={committee.role}>
      <dl className="gov-facts">
        <div>
          <dt>Chair</dt>
          <dd>
            {chair ? (
              <>
                {chair.name}
                <small>{chair.designation}</small>
              </>
            ) : (
              <Ph>{MEMBERS_PLACEHOLDER}</Ph>
            )}
          </dd>
        </div>
        <div>
          <dt>Members</dt>
          <dd>
            <Ph>{MEMBERS_PLACEHOLDER}</Ph>
          </dd>
        </div>
        <div>
          <dt>Terms of reference</dt>
          <dd>
            <Pending>Coming soon</Pending>
          </dd>
        </div>
      </dl>
      <div>
        <h4 className="gov-subhead">Typical responsibilities</h4>
        <ul className="gov-bullets">
          {committee.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="note">Described in general terms; the terms of reference set out the committee’s full remit.</p>
    </Panel>
  )
}
