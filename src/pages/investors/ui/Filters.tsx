import type { ReactNode } from 'react'

export interface Option<T extends string = string> {
  value: T
  label: string
}

interface SelectFieldProps<T extends string> {
  id: string
  label: string
  value: T
  options: readonly Option<T>[]
  onChange: (value: T) => void
}

/** Labelled <select>, e.g. "Financial year" or "Category". */
export function SelectField<T extends string>({ id, label, value, options, onChange }: SelectFieldProps<T>) {
  return (
    <div className="filter-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface InputFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'date' | 'search'
  placeholder?: string
}

/** Labelled text, search or date input. Dates use the native picker (value is YYYY-MM-DD). */
export function InputField({ id, label, value, onChange, type = 'text', placeholder }: InputFieldProps) {
  return (
    <div className="filter-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

interface FilterBarProps {
  /** Accessible name of the search landmark, e.g. "Filter announcements". */
  label: string
  onReset: () => void
  children: ReactNode
}

/** A row of filter fields that apply as you change them, with a Reset button. */
export function FilterBar({ label, onReset, children }: FilterBarProps) {
  return (
    <form className="filters" role="search" aria-label={label} onSubmit={(event) => event.preventDefault()}>
      {children}
      <button type="button" className="filter-reset" onClick={onReset}>
        Reset
      </button>
    </form>
  )
}

interface SegmentedProps<T extends string> {
  label: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
}

/** Two or three mutually exclusive choices as a pill switch, e.g. Annual / Quarterly. */
export function Segmented<T extends string>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** True when an ISO date (YYYY-MM-DD) is inside an optional from / to range (inclusive). */
export function isWithinRange(isoDate: string, from: string, to: string): boolean {
  if (from && isoDate < from) return false
  if (to && isoDate > to) return false
  return true
}
