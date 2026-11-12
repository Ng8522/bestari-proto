import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Ph } from '../../components/text'
import { emailError } from './Contact'
import { ALERTS_THANK_YOU, CALENDAR, LEGAL_DOCUMENTS } from './content/sections'
import { InvestmentCalculator } from './InvestmentCalculator'
import { IrSection, SectionHead } from './Section'
import { DocList } from './Tabs'

const CALENDAR_HEADING_ID = 'ir-calendar-title'
/** Anchor for the IR home "News alerts" highlight. */
export const ALERTS_ID = 'ir-alerts'

/** Investor resources: corporate calendar, news alerts, investment calculator, and IR terms & privacy. */
export function Resources() {
  return (
    <IrSection id="resources">
      <SectionHead
        sectionId="resources"
        eyebrow="Investor resources"
        title="Investor resources."
        intro="Key dates, email alerts and a calculator for working out returns."
      />
      <div className="res-grid">
        <div className="card reveal">
          <h3 id={CALENDAR_HEADING_ID}>Corporate calendar</h3>
          <ul className="tt" aria-labelledby={CALENDAR_HEADING_ID}>
            {CALENDAR.map((item) => (
              <li key={item.event}>
                <span className="tt-date">{item.isDatePlaceholder ? <Ph>{item.date}</Ph> : item.date}</span>
                <span>{item.event}</span>
              </li>
            ))}
          </ul>
        </div>
        <NewsAlerts />
        <InvestmentCalculator />
        <div className="card reveal">
          <h3>Terms & privacy</h3>
          <DocList documents={LEGAL_DOCUMENTS} label="IR website terms and privacy" />
        </div>
      </div>
    </IrSection>
  )
}

export interface AlertValues {
  name: string
  email: string
  hasConsent: boolean
}

export type AlertErrors = Partial<Record<'email' | 'consent', string>>

/** Email and consent are required; the name is optional. */
export function validateAlerts(values: AlertValues): AlertErrors {
  const email = emailError(values.email)
  return {
    ...(email ? { email } : {}),
    ...(values.hasConsent ? {} : { consent: 'Please agree to the IR privacy notice.' }),
  }
}

const EMPTY_ALERTS: AlertValues = { name: '', email: '', hasConsent: false }

/** Prototype sign-up: validates locally and confirms; in production, post to the mailing-list provider. */
function NewsAlerts() {
  const [values, setValues] = useState<AlertValues>(EMPTY_ALERTS)
  const [hasTriedSubmit, setTriedSubmit] = useState(false)
  const [isSent, setSent] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const thanksRef = useRef<HTMLParagraphElement>(null)
  const errors = hasTriedSubmit ? validateAlerts(values) : {}

  useEffect(() => {
    if (isSent) thanksRef.current?.focus()
  }, [isSent])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateAlerts(values)
    setTriedSubmit(true)
    if (nextErrors.email) emailRef.current?.focus()
    else if (nextErrors.consent) consentRef.current?.focus()
    else setSent(true)
  }

  return (
    <div className="card alerts reveal" id={ALERTS_ID}>
      <h3>News alerts</h3>
      <p className="card-sub">Get our announcements and news by email.</p>
      {isSent ? (
        <p className="alerts-thanks" ref={thanksRef} tabIndex={-1}>
          {ALERTS_THANK_YOU}
        </p>
      ) : (
        <form className="mini-form" onSubmit={handleSubmit} noValidate aria-label="News alerts sign-up">
          <label htmlFor="ir-alerts-name">Name</label>
          <input
            id="ir-alerts-name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setValues((previous) => ({ ...previous, name: event.target.value }))}
          />
          <label htmlFor="ir-alerts-email">Email</label>
          <input
            ref={emailRef}
            id="ir-alerts-email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'ir-alerts-email-error' : undefined}
            onChange={(event) => setValues((previous) => ({ ...previous, email: event.target.value }))}
          />
          {errors.email && (
            <p className="field-error" id="ir-alerts-email-error">
              {errors.email}
            </p>
          )}
          <label className="check">
            <input
              ref={consentRef}
              type="checkbox"
              checked={values.hasConsent}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? 'ir-alerts-consent-error' : undefined}
              onChange={(event) => setValues((previous) => ({ ...previous, hasConsent: event.target.checked }))}
            />
            <span>I agree to the IR privacy notice and to receive emails from Bestari Food Berhad.</span>
          </label>
          {errors.consent && (
            <p className="field-error" id="ir-alerts-consent-error">
              {errors.consent}
            </p>
          )}
          <button type="submit" className="btn btn-saffron">
            Subscribe <span className="arr" aria-hidden="true">→</span>
          </button>
        </form>
      )}
    </div>
  )
}
