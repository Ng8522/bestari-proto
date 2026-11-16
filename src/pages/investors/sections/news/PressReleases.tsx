import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { MILESTONE_LABELS } from '../../data'
import { EmptyState } from '../../Tabs'
import { Panel } from '../../ui/PageParts'
import { formatIsoDate } from '../stock/format'
import { COMPLETED_MILESTONES, PRESS_RELEASES, type PressRelease } from './content'

/** News Centre › Press Releases: company-issued releases (none yet), then the listing milestones reached so far. */
export function PressReleases(): ReactElement {
  return (
    <>
      <Panel title="Company press releases" sub="Issued by Bestari Food Berhad, newest first">
        {PRESS_RELEASES.length === 0 ? (
          <EmptyState>
            We have not issued any press releases yet. Our releases will be posted here as they are issued. For press
            coverage so far, see <Link to={irPath('news', 'media-news')}>Media News</Link>.
          </EmptyState>
        ) : (
          <ReleaseList releases={PRESS_RELEASES} />
        )}
      </Panel>
      <Panel
        title="Corporate milestones"
        sub="Milestones in our listing so far. These are not press releases."
        className="milestones"
      >
        <ol className="tt" aria-label="Completed corporate milestones">
          {COMPLETED_MILESTONES.map((milestone) => (
            <li key={milestone.event}>
              <span className="tt-date">{milestone.isDatePlaceholder ? <Ph>{milestone.date}</Ph> : milestone.date}</span>
              <span>{milestone.event}</span>
              <span className={`chip chip--${milestone.status}`}>{MILESTONE_LABELS[milestone.status]}</span>
            </li>
          ))}
        </ol>
        <p className="note">
          The dates still to come are on the <Link to={irPath('ipo-centre', 'timetable')}>IPO Timetable</Link>.
        </p>
      </Panel>
    </>
  )
}

function ReleaseList({ releases }: { releases: readonly PressRelease[] }): ReactElement {
  return (
    <ul className="news-list">
      {releases.map((release) => (
        <li key={`${release.isoDate}-${release.title}`} className="news-item">
          <time className="news-date" dateTime={release.isoDate}>
            {formatIsoDate(release.isoDate)}
          </time>
          <b>{release.href ? <a href={release.href}>{release.title}</a> : release.title}</b>
        </li>
      ))}
    </ul>
  )
}
