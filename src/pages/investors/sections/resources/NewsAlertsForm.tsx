import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react'
import { Link } from 'react-router'
import { irPath } from '../../../../content/ir-nav'
import { ALERTS_THANK_YOU } from '../../content/sections'
import {
  ALERT_TYPES,
  EMPTY_ALERTS,
  firstInvalidField,
  toggleType,
  validateAlerts,
  type AlertErrors,
  type AlertField,
  type AlertType,
  type AlertValues,
} from './alerts'
import { PRIVACY_SECTION_ID } from './terms'

const ERROR_IDS: Readonly<Record<AlertField, string>> = {
  email: 'ir-alerts-email-error',
  types: 'ir-alerts-types-error',
  consent: 'ir-alerts-consent-error',
}

function FieldError({ field, errors }: { field: AlertField; errors: AlertErrors }) {
  const message = errors[field]
  if (!message) return null
  return (
    <p className="field-error" id={ERROR_IDS[field]}>
      {message}
    </p>
  )
}

/**
 * Prototype sign-up: validates in the browser and shows a thank-you, but sends nothing. In production, post the
 * values to the mailing-list provider instead of only setting `isSent`.
 */
export function NewsAlertsForm() {
  const [values, setValues] = useState<AlertValues>(EMPTY_ALERTS)
  const [hasTriedSubmit, setTriedSubmit] = useState(false)
  const [isSent, setSent] = useState(false)
  const refs: Record<AlertField, RefObject<HTMLInputElement | null>> = {
    email: useRef<HTMLInputElement>(null),
    types: useRef<HTMLInputElement>(null),
    consent: useRef<HTMLInputElement>(null),
  }
  const errors = hasTriedSubmit ? validateAlerts(values) : {}

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const invalidField = firstInvalidField(validateAlerts(values))
    setTriedSubmit(true)
    if (invalidField) refs[invalidField].current?.focus()
    else setSent(true)
  }

  if (isSent) return <AlertsThanks types={values.types} />

  return (
    <form className="mini-form" onSubmit={handleSubmit} noValidate aria-label="News alerts sign-up">
      <ContactFields
        emailRef={refs.email}
        values={values}
        errors={errors}
        onChange={(key, value) => setValues((previous) => ({ ...previous, [key]: value }))}
      />
      <AlertTypesField
        firstRef={refs.types}
        selected={values.types}
        errors={errors}
        onToggle={(type, isChecked) =>
          setValues((previous) => ({ ...previous, types: toggleType(previous.types, type, isChecked) }))
        }
      />
      <ConsentField
        inputRef={refs.consent}
        isChecked={values.hasConsent}
        errors={errors}
        onChange={(hasConsent) => setValues((previous) => ({ ...previous, hasConsent }))}
      />
      <button type="submit" className="btn btn-saffron">
        Subscribe <span className="arr" aria-hidden="true">→</span>
      </button>
    </form>
  )
}

interface ContactFieldsProps {
  emailRef: RefObject<HTMLInputElement | null>
  values: AlertValues
  errors: AlertErrors
  onChange: (key: 'name' | 'email', value: string) => void
}

function ContactFields({ emailRef, values, errors, onChange }: ContactFieldsProps) {
  return (
    <>
      <label htmlFor="ir-alerts-name">Name (optional)</label>
      <input id="ir-alerts-name" autoComplete="name" value={values.name} onChange={(event) => onChange('name', event.target.value)} />
      <label htmlFor="ir-alerts-email">Email</label>
      <input
        ref={emailRef}
        id="ir-alerts-email"
        type="email"
        autoComplete="email"
        required
        value={values.email}
        aria-invalid={Boolean(errors.email)}
        aria-describedby={errors.email ? ERROR_IDS.email : undefined}
        onChange={(event) => onChange('email', event.target.value)}
      />
      <FieldError field="email" errors={errors} />
    </>
  )
}

interface AlertTypesFieldProps {
  firstRef: RefObject<HTMLInputElement | null>
  selected: readonly AlertType[]
  errors: AlertErrors
  onToggle: (type: AlertType, isChecked: boolean) => void
}

function AlertTypesField({ firstRef, selected, errors, onToggle }: AlertTypesFieldProps) {
  return (
    <fieldset className="alert-types" aria-describedby={errors.types ? ERROR_IDS.types : undefined}>
      <legend>Alerts to receive</legend>
      {ALERT_TYPES.map((type, index) => (
        <label key={type.id} className="check">
          <input
            ref={index === 0 ? firstRef : undefined}
            type="checkbox"
            checked={selected.includes(type.id)}
            onChange={(event) => onToggle(type.id, event.target.checked)}
          />
          <span>{type.label}</span>
        </label>
      ))}
      <FieldError field="types" errors={errors} />
    </fieldset>
  )
}

interface ConsentFieldProps {
  inputRef: RefObject<HTMLInputElement | null>
  isChecked: boolean
  errors: AlertErrors
  onChange: (isChecked: boolean) => void
}

function ConsentField({ inputRef, isChecked, errors, onChange }: ConsentFieldProps) {
  return (
    <>
      <label className="check">
        <input
          ref={inputRef}
          type="checkbox"
          checked={isChecked}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? ERROR_IDS.consent : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>I agree to receive these emails from Bestari Food Berhad, and to the use of my details for them.</span>
      </label>
      <p className="alerts-privacy">
        How we handle your details: see{' '}
        <Link to={{ pathname: irPath('resources', 'terms-of-use'), hash: PRIVACY_SECTION_ID }}>
          Privacy and personal data
        </Link>{' '}
        in our IR website terms of use.
      </p>
      <FieldError field="consent" errors={errors} />
    </>
  )
}

function AlertsThanks({ types }: { types: readonly AlertType[] }) {
  const thanksRef = useRef<HTMLParagraphElement>(null)
  const labels = ALERT_TYPES.filter((type) => types.includes(type.id)).map((type) => type.label)

  useEffect(() => {
    thanksRef.current?.focus()
  }, [])

  return (
    <div className="alerts-done">
      <p className="alerts-thanks" ref={thanksRef} tabIndex={-1}>
        {ALERTS_THANK_YOU}
      </p>
      <p className="card-sub">Your alerts: {labels.join(', ')}.</p>
    </div>
  )
}
