import { useState } from 'react'
import { calculateInvestment, parseCalculatorInput, type CalculatorFields } from './calculator'
import { CALCULATOR_NOTE } from './content/sections'

interface FieldSpec {
  key: keyof CalculatorFields
  label: string
  step: string
  min: string
}

const FIELDS: readonly FieldSpec[] = [
  { key: 'lots', label: 'Lots (1 lot = 100 shares)', step: '1', min: '1' },
  { key: 'buyPrice', label: 'Purchase price (RM per share)', step: '0.005', min: '0' },
  { key: 'sellPrice', label: 'Selling price (RM per share)', step: '0.005', min: '0' },
  { key: 'dividendSen', label: 'Dividends received (sen per share)', step: '0.01', min: '0' },
]

const EMPTY_FIELDS: CalculatorFields = { lots: '', buyPrice: '', sellPrice: '', dividendSen: '' }

const MONEY = { minimumFractionDigits: 2, maximumFractionDigits: 2 } as const

/** "RM1,000.00", or "−RM50.00" for a loss. */
export function formatRinggit(amount: number): string {
  const sign = amount < 0 ? '−' : ''
  return `${sign}RM${Math.abs(amount).toLocaleString('en-MY', MONEY)}`
}

/** Works out the gross return on a holding as the visitor types; nothing leaves the page. */
export function InvestmentCalculator() {
  const [fields, setFields] = useState<CalculatorFields>(EMPTY_FIELDS)
  const input = parseCalculatorInput(fields)
  const result = input ? calculateInvestment(input) : null

  return (
    <div className="card calc reveal">
      <h3>Investment calculator</h3>
      <form className="calc-form" aria-label="Investment calculator" onSubmit={(event) => event.preventDefault()}>
        <div className="calc-fields">
          {FIELDS.map((field) => (
            <div key={field.key} className="calc-field">
              <label htmlFor={`ir-calc-${field.key}`}>{field.label}</label>
              <input
                id={`ir-calc-${field.key}`}
                type="number"
                inputMode="decimal"
                min={field.min}
                step={field.step}
                value={fields[field.key]}
                onChange={(event) => setFields((previous) => ({ ...previous, [field.key]: event.target.value }))}
              />
            </div>
          ))}
        </div>
        {/* One short live summary, so screen readers are not re-read the whole table on every keystroke. */}
        <p className="visually-hidden" role="status">
          {result
            ? `${result.shares.toLocaleString('en-MY')} shares: gain or loss ${formatRinggit(result.gain)}, return ${result.returnPct.toFixed(2)}%.`
            : ''}
        </p>
        <div className="calc-out">
          {result ? (
            <dl>
              <div>
                <dt>Shares</dt>
                <dd>{result.shares.toLocaleString('en-MY')} shares</dd>
              </div>
              <div>
                <dt>Cost</dt>
                <dd>{formatRinggit(result.cost)}</dd>
              </div>
              <div>
                <dt>Value</dt>
                <dd>{formatRinggit(result.value)}</dd>
              </div>
              <div>
                <dt>Dividends</dt>
                <dd>{formatRinggit(result.dividends)}</dd>
              </div>
              <div className="calc-gain">
                <dt>Gain / loss</dt>
                <dd>{formatRinggit(result.gain)}</dd>
              </div>
              <div className="calc-gain">
                <dt>Return</dt>
                <dd>{result.returnPct.toFixed(2)}%</dd>
              </div>
            </dl>
          ) : (
            <p>Enter the number of lots and both prices to see your return.</p>
          )}
        </div>
      </form>
      <p className="note">{CALCULATOR_NOTE}</p>
    </div>
  )
}
