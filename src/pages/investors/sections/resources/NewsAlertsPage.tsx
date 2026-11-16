import { Link } from 'react-router'
import { irPath } from '../../../../content/ir-nav'
import { Notice, Panel } from '../../ui/PageParts'
import { ALERT_TYPES } from './alerts'
import { NewsAlertsForm } from './NewsAlertsForm'

/** Investor Resources › News Alerts: the email sign-up and what each alert covers. */
export function NewsAlertsPage() {
  return (
    <>
      <div className="grid-2">
        <Panel title="Sign up for alerts" sub="Choose what you want to hear about. Fields are required unless marked optional." className="alerts">
          <NewsAlertsForm />
        </Panel>
        <Panel title="What you can receive">
          <dl className="alert-list">
            {ALERT_TYPES.map((type) => (
              <div key={type.id}>
                <dt>{type.label}</dt>
                <dd>{type.description}</dd>
              </div>
            ))}
          </dl>
          <p className="note rs-note">
            We use your name and email only to send the alerts you choose. You can withdraw your consent at any time by
            contacting our <Link to={irPath('contact')}>IR team</Link>.
          </p>
        </Panel>
      </div>
      <Notice tone="pending" title="Announcements start at listing">
        Bursa announcements and financial results start from our listing date on Bursa Malaysia. Everything we
        announce is also listed under <Link to={irPath('news', 'bursa-announcements')}>Bursa Announcements</Link>.
      </Notice>
    </>
  )
}
