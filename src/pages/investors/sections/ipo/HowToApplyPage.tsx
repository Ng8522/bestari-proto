import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { TIMETABLE } from '../../data'
import { Notice, Panel } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { APPLICATION_CHANNELS, BEFORE_YOU_APPLY, IPO_FAQ, ISSUING_HOUSE } from './content'

const applicationsOpen = TIMETABLE.find((milestone) => milestone.event.toLowerCase().includes('applications open'))

type ApplyTab = 'ways' | 'before' | 'faq'

/** How to Apply: the usual ways to apply for Malaysian IPO shares, a checklist and common questions. */
export function IpoHowToApplyPage() {
  return (
    <>
      <Notice title="Applications are not open yet" tone="pending">
        <p>
          Applications open when the registered prospectus is issued:{' '}
          {applicationsOpen?.isDatePlaceholder ? <Ph>{applicationsOpen.date}</Ph> : applicationsOpen?.date}. What
          follows is a general guide to how Malaysian IPO applications usually work.{' '}
          <b>See the registered prospectus for the exact procedures and dates.</b>
        </p>
      </Notice>
      <SectionTabs tabs={APPLY_TABS} />
    </>
  )
}

function WaysToApply() {
  return (
    <Panel title="Ways to apply" sub={`Applications are handled by the issuing house, ${ISSUING_HOUSE}`}>
      <ul className="grid-3 ipo-channels">
        {APPLICATION_CHANNELS.map((channel) => (
          <li key={channel.title} className="ipo-channel">
            <h4>{channel.title}</h4>
            <p className="ipo-route-channel">For: {channel.who}</p>
            <p>{channel.how}</p>
          </li>
        ))}
      </ul>
      <p className="note">
        The participating financial institutions, application fees and closing time for each channel are listed in the
        registered prospectus.
      </p>
    </Panel>
  )
}

function BeforeYouApply() {
  return (
    <Panel title="Before you apply">
      <ul className="ipo-checklist">
        {BEFORE_YOU_APPLY.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Panel>
  )
}

function Faq() {
  return (
    <Panel title="Frequently asked questions">
      <div className="ipo-faq">
        {IPO_FAQ.map((entry) => (
          <details key={entry.question}>
            <summary>{entry.question}</summary>
            <p>{entry.answer}</p>
          </details>
        ))}
      </div>
      <p className="note">
        Still have a question? <Link to={irPath('contact')}>Contact Investor Relations</Link>, or see the{' '}
        <Link to={irPath('ipo-centre', 'timetable')}>IPO timetable</Link>.
      </p>
    </Panel>
  )
}

const APPLY_TABS: readonly SectionTab<ApplyTab>[] = [
  { id: 'ways', label: 'Ways to apply', content: <WaysToApply /> },
  { id: 'before', label: 'Before you apply', content: <BeforeYouApply /> },
  { id: 'faq', label: 'FAQ', content: <Faq /> },
]
