/** News alerts sign-up: the alert types and the form's validation (shared email rule from ui/validation). */
import { emailError } from '../../ui/validation'

export type AlertType = 'announcements' | 'results' | 'press' | 'calendar'

export interface AlertTypeOption {
  id: AlertType
  label: string
  description: string
}

export const ALERT_TYPES: readonly AlertTypeOption[] = [
  {
    id: 'announcements',
    label: 'Bursa announcements',
    description: 'Every announcement we make to Bursa Malaysia, from the listing date.',
  },
  { id: 'results', label: 'Financial results', description: 'Quarterly results and the annual report when they are published.' },
  { id: 'press', label: 'Press releases', description: 'News from Bestari Food Berhad.' },
  { id: 'calendar', label: 'Corporate calendar', description: 'Reminders of results dates, general meetings and entitlements.' },
]

export interface AlertValues {
  name: string
  email: string
  types: readonly AlertType[]
  hasConsent: boolean
}

export type AlertField = 'email' | 'types' | 'consent'

export type AlertErrors = Partial<Record<AlertField, string>>

export const EMPTY_ALERTS: AlertValues = { name: '', email: '', types: [], hasConsent: false }

/** Email, at least one alert type and consent are required; the name is optional. */
export function validateAlerts(values: AlertValues): AlertErrors {
  const email = emailError(values.email)
  return {
    ...(email ? { email } : {}),
    ...(values.types.length > 0 ? {} : { types: 'Please choose at least one type of alert.' }),
    ...(values.hasConsent ? {} : { consent: 'Please agree to receive emails from us.' }),
  }
}

/** The first field with an error, in form order, so focus can move to it. */
export function firstInvalidField(errors: AlertErrors): AlertField | undefined {
  const order: readonly AlertField[] = ['email', 'types', 'consent']
  return order.find((field) => errors[field])
}

/** A new list with `type` added or removed. */
export function toggleType(types: readonly AlertType[], type: AlertType, isChecked: boolean): readonly AlertType[] {
  const others = types.filter((entry) => entry !== type)
  return isChecked ? [...others, type] : others
}
