import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Ph } from '../../components/text'
import { COMPANY } from '../../content/site'
import { IR_DISCLAIMER, IR_EMAIL_PLACEHOLDER, IR_THANK_YOU, headingId } from './data'
import { IrSection } from './Section'

export interface EnquiryValues {
  name: string
  email: string
  enquiry: string
}

export type EnquiryErrors = Partial<Record<'name' | 'email', string>>

const EMPTY_ENQUIRY: EnquiryValues = { name: '', email: '', enquiry: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Shared by the enquiry form and the news alerts sign-up. */
export function emailError(email: string): string | undefined {
  const value = email.trim()
  if (!value) return 'Please enter your email address.'
  return EMAIL_PATTERN.test(value) ? undefined : 'Please enter a valid email address.'
}

/** Name and email are required; the enquiry text is optional (as in the handoff). */
export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const email = emailError(values.email)
  return {
    ...(values.name.trim() ? {} : { name: 'Please enter your name.' }),
    ...(email ? { email } : {}),
  }
}

/** Green IR contact block with the enquiry form, then the legal disclaimer. */
export function Contact() {
  return (
    <IrSection id="contact" className="sec--flush">
      <div className="contact reveal">
        <div>
          <p className="eyebrow">Investor enquiries</p>
          <h2 id={headingId('contact')}>Talk to our IR team.</h2>
          <p className="contact-lede">
            <a href={COMPANY.phone.href}>{COMPANY.phone.label}</a> · <Ph>{IR_EMAIL_PLACEHOLDER}</Ph>
          </p>
        </div>
        <EnquiryForm />
      </div>
      <p className="disc" id="ir-disclaimer">
        {IR_DISCLAIMER}
      </p>
    </IrSection>
  )
}

type FieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

/**
 * Form state for the prototype: validates locally, focuses the first invalid field, and on success
 * moves focus to the thank-you message. Nothing is sent anywhere; in production, post to the CRM or IR
 * mailbox endpoint in `handleSubmit`.
 */
function useEnquiryForm() {
  const [values, setValues] = useState<EnquiryValues>(EMPTY_ENQUIRY)
  const [hasTriedSubmit, setTriedSubmit] = useState(false)
  const [isSent, setSent] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const thanksRef = useRef<HTMLParagraphElement>(null)
  const errors = hasTriedSubmit ? validateEnquiry(values) : {}

  useEffect(() => {
    if (isSent) thanksRef.current?.focus()
  }, [isSent])

  const update = (field: keyof EnquiryValues) => (event: FieldChangeEvent) => {
    const { value } = event.target
    setValues((previous) => ({ ...previous, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateEnquiry(values)
    setTriedSubmit(true)
    if (nextErrors.name) {
      nameRef.current?.focus()
    } else if (nextErrors.email) {
      emailRef.current?.focus()
    } else {
      setSent(true)
    }
  }

  return { values, errors, isSent, nameRef, emailRef, thanksRef, update, handleSubmit }
}

function EnquiryForm() {
  const { values, errors, isSent, nameRef, emailRef, thanksRef, update, handleSubmit } = useEnquiryForm()

  if (isSent) {
    return (
      <p className="contact-thanks" ref={thanksRef} tabIndex={-1}>
        {IR_THANK_YOU}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Investor enquiry">
      <Field id="ir-enquiry-name" label="Name" error={errors.name}>
        <input
          ref={nameRef}
          id="ir-enquiry-name"
          name="name"
          placeholder="Name"
          autoComplete="name"
          required
          value={values.name}
          onChange={update('name')}
          {...errorProps('ir-enquiry-name', errors.name)}
        />
      </Field>
      <Field id="ir-enquiry-email" label="Email" error={errors.email}>
        <input
          ref={emailRef}
          id="ir-enquiry-email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          value={values.email}
          onChange={update('email')}
          {...errorProps('ir-enquiry-email', errors.email)}
        />
      </Field>
      <Field id="ir-enquiry-text" label="Your enquiry">
        <textarea
          id="ir-enquiry-text"
          name="enquiry"
          rows={3}
          placeholder="Your enquiry"
          value={values.enquiry}
          onChange={update('enquiry')}
        />
      </Field>
      <button type="submit" className="btn btn-saffron contact-submit">
        Send enquiry <span className="arr" aria-hidden="true">→</span>
      </button>
    </form>
  )
}

function errorProps(id: string, error: string | undefined) {
  return { 'aria-invalid': Boolean(error), 'aria-describedby': error ? `${id}-error` : undefined }
}

interface FieldProps {
  id: string
  label: string
  error?: string
  children: ReactNode
}

/** Visually hidden label (the design shows placeholders only), the control, and its error message. */
function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="field">
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
