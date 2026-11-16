import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { IR_THANK_YOU } from '../../data'
import { emailError } from '../../ui/validation'

export interface EnquiryValues {
  name: string
  email: string
  subject: string
  enquiry: string
}

export type EnquiryErrors = Partial<Record<'name' | 'email', string>>

const EMPTY_ENQUIRY: EnquiryValues = { name: '', email: '', subject: 'general', enquiry: '' }

export const ENQUIRY_SUBJECTS = [
  { value: 'general', label: 'General investor enquiry' },
  { value: 'ipo', label: 'IPO and listing' },
  { value: 'financial', label: 'Financial results' },
  { value: 'meetings', label: 'General meetings' },
  { value: 'media', label: 'Media enquiry' },
] as const

/** Name and email are required; the subject has a default and the message is optional. */
export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const email = emailError(values.email)
  return {
    ...(values.name.trim() ? {} : { name: 'Please enter your name.' }),
    ...(email ? { email } : {}),
  }
}

type FieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

/**
 * Prototype form state: validates locally, focuses the first invalid field, and on success moves focus to the
 * thank-you message. Nothing is sent; in production, post to the IR mailbox or CRM in `handleSubmit`.
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
    if (nextErrors.name) nameRef.current?.focus()
    else if (nextErrors.email) emailRef.current?.focus()
    else setSent(true)
  }

  return { values, errors, isSent, nameRef, emailRef, thanksRef, update, handleSubmit }
}

export function EnquiryForm() {
  const { values, errors, isSent, nameRef, emailRef, thanksRef, update, handleSubmit } = useEnquiryForm()

  if (isSent) {
    return (
      <p className="contact-thanks" ref={thanksRef} tabIndex={-1}>
        {IR_THANK_YOU}
      </p>
    )
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} noValidate aria-label="Investor enquiry">
      <Field id="ir-enquiry-name" label="Name" error={errors.name}>
        <input
          ref={nameRef}
          id="ir-enquiry-name"
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
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={update('email')}
          {...errorProps('ir-enquiry-email', errors.email)}
        />
      </Field>
      <SubjectField value={values.subject} onChange={update('subject')} />
      <Field id="ir-enquiry-text" label="Your enquiry">
        <textarea id="ir-enquiry-text" rows={4} value={values.enquiry} onChange={update('enquiry')} />
      </Field>
      <button type="submit" className="btn btn-saffron contact-submit">
        Send enquiry <span className="arr" aria-hidden="true">→</span>
      </button>
    </form>
  )
}

interface SubjectFieldProps {
  value: string
  onChange: (event: FieldChangeEvent) => void
}

function SubjectField({ value, onChange }: SubjectFieldProps) {
  return (
    <Field id="ir-enquiry-subject" label="Subject">
      <select id="ir-enquiry-subject" value={value} onChange={onChange}>
        {ENQUIRY_SUBJECTS.map((subject) => (
          <option key={subject.value} value={subject.value}>
            {subject.label}
          </option>
        ))}
      </select>
    </Field>
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

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
