import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { TIMETABLE } from '../../data'
import { Notice, Panel } from '../../ui/PageParts'
import { APPLICATION_CHANNELS, BEFORE_YOU_APPLY, IPO_FAQ, ISSUING_HOUSE } from './content'

const applicationsOpen = TIMETABLE.find((milestone) => milestone.event.toLowerCase().includes('applications open'))

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
          The participating financial institutions, application fees and closing time for each channel are listed in
          the registered prospectus.
        </p>
      </Panel>
      <Panel title="Before you apply">
        <ul className="ipo-checklist">
          {BEFORE_YOU_APPLY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Panel>
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
    </>
  )
}
