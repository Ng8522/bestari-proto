import { useState, type ReactElement } from 'react'
import { DataTable, DocActions, type Column } from '../../ui/DataTable'
import { FilterBar, SelectField, type Option } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import {
  GENERAL_MEETINGS,
  MEETING_DOCUMENT_TYPES,
  MEETING_TYPE_LABELS,
  filterMeetings,
  meetingYears,
  type GeneralMeeting,
  type MeetingType,
  type TypeFilter,
} from './content'

const ALL = 'all'

const TYPE_OPTIONS: readonly Option<TypeFilter>[] = [
  { value: ALL, label: 'All meetings' },
  ...(Object.keys(MEETING_TYPE_LABELS) as MeetingType[]).map((type) => ({ value: type, label: MEETING_TYPE_LABELS[type] })),
]

const YEAR_OPTIONS: readonly Option[] = [
  { value: ALL, label: 'All years' },
  ...meetingYears(GENERAL_MEETINGS, new Date().getFullYear()).map((year) => ({ value: year, label: year })),
]

const MEETING_COLUMNS: readonly Column<GeneralMeeting>[] = [
  {
    key: 'meeting',
    header: 'Meeting',
    isRowHeader: true,
    render: (meeting) => (
      <>
        {meeting.title}
        <small className="gov-cell-sub">{MEETING_TYPE_LABELS[meeting.type]}</small>
      </>
    ),
  },
  { key: 'date', header: 'Date', render: (meeting) => <time dateTime={meeting.isoDate}>{meeting.date}</time> },
  { key: 'time', header: 'Time', render: (meeting) => meeting.time },
  { key: 'venue', header: 'Venue', render: (meeting) => meeting.venue },
  {
    key: 'documents',
    header: 'Documents',
    render: (meeting) => (
      <ul className="gov-meeting-docs">
        {meeting.documents.map((doc) => (
          <li key={doc.title}>
            <span>{doc.title}</span>
            <DocActions doc={doc} />
          </li>
        ))}
      </ul>
    ),
  },
]

function emptyMessage(year: string, type: TypeFilter): string {
  if (year === ALL && type === ALL) {
    return 'No general meetings have been held yet. Our first annual general meeting will be held after listing.'
  }
  const kind = type === ALL ? 'general meetings' : `${MEETING_TYPE_LABELS[type].toLowerCase()}s`
  return `No ${kind}${year === ALL ? '' : ` in ${year}`} yet.`
}

/** Governance › Shareholders Meeting: the meetings archive with year and type filters, and what each meeting posts. */
export function ShareholdersMeeting(): ReactElement {
  const [year, setYear] = useState<string>(ALL)
  const [type, setType] = useState<TypeFilter>(ALL)
  const meetings = filterMeetings(GENERAL_MEETINGS, year, type)
  const reset = (): void => {
    setYear(ALL)
    setType(ALL)
  }

  return (
    <>
      <Notice tone="pending" title="First AGM after listing">
        Our first annual general meeting will be held after listing. The notice, form of proxy and other papers for
        each meeting will be posted here, and announced to Bursa Malaysia.
      </Notice>
      <Panel title="General meetings" sub="Annual and extraordinary general meetings of Bestari Food Berhad">
        <FilterBar label="Filter general meetings" onReset={reset}>
          <SelectField id="gm-year" label="Year" value={year} options={YEAR_OPTIONS} onChange={setYear} />
          <SelectField id="gm-type" label="Meeting type" value={type} options={TYPE_OPTIONS} onChange={setType} />
        </FilterBar>
        <p className="result-count" aria-live="polite">
          {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'} found
        </p>
        <DataTable
          caption="General meetings"
          columns={MEETING_COLUMNS}
          rows={meetings}
          rowKey={(meeting) => `${meeting.isoDate}-${meeting.type}`}
          emptyMessage={emptyMessage(year, type)}
          minWidth={720}
        />
      </Panel>
      <div className="grid-2">
        <MeetingPapers />
        <TakingPart />
      </div>
    </>
  )
}

function MeetingPapers() {
  return (
    <Panel title="Papers for each meeting" sub="Posted here for every general meeting">
      <dl className="gov-papers">
        {MEETING_DOCUMENT_TYPES.map((paper) => (
          <div key={paper.title}>
            <dt>{paper.title}</dt>
            <dd>{paper.description}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}

const STEPS: readonly { title: string; text: string }[] = [
  {
    title: 'Read the notice',
    text: 'It sets out the date, time and venue (or online platform), the resolutions and who may take part.',
  },
  {
    title: 'Attend or appoint a proxy',
    text: 'Shareholders entitled to attend may vote themselves, or appoint a proxy by lodging the form of proxy by the deadline in the notice.',
  },
  {
    title: 'Vote',
    text: 'Resolutions at general meetings of companies listed on Bursa Malaysia are voted on by poll. The results are announced to Bursa Malaysia and posted here.',
  },
]

function TakingPart() {
  return (
    <Panel title="Taking part in a general meeting" sub="In general terms; each notice gives the details">
      <ol className="gov-steps">
        {STEPS.map((step) => (
          <li key={step.title}>
            <b>{step.title}</b>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>
    </Panel>
  )
}
