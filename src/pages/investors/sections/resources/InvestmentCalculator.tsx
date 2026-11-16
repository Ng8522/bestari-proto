import { calculateInvestment, parseCalculatorInput, type CalculatorFields, type InvestmentResult } from '../../calculator'
import { CALCULATOR_NOTE } from '../../content/sections'
import { formatCount, formatPercent, formatRinggit } from './format'

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

export const EMPTY_CALCULATOR_FIELDS: CalculatorFields = { lots: '', buyPrice: '', sellPrice: '', dividendSen: '' }

interface InvestmentCalculatorProps {
  fields: CalculatorFields
  onChange: (fields: CalculatorFields) => void
}

/** Works out the gross return on a holding as the visitor types; nothing leaves the page. */
export function InvestmentCalculator({ fields, onChange }: InvestmentCalculatorProps) {
  const input = parseCalculatorInput(fields)
  const result = input ? calculateInvestment(input) : null

  return (
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
              onChange={(event) => onChange({ ...fields, [field.key]: event.target.value })}
            />
          </div>
        ))}
      </div>
      {/* One short live summary, so screen readers are not re-read the whole result on every keystroke. */}
      <p className="visually-hidden" role="status">
        {result
          ? `${formatCount(result.shares)} shares: gain or loss ${formatRinggit(result.gain)}, return ${formatPercent(result.returnPct)}.`
          : ''}
      </p>
      <div className="calc-out">
        {result ? <ResultList result={result} /> : <p>Enter the number of lots and both prices to see your return.</p>}
      </div>
      <p className="note">{CALCULATOR_NOTE}</p>
    </form>
  )
}

function ResultList({ result }: { result: InvestmentResult }) {
  const items: readonly { label: string; value: string; isGain?: boolean }[] = [
    { label: 'Shares', value: `${formatCount(result.shares)} shares` },
    { label: 'Cost', value: formatRinggit(result.cost) },
    { label: 'Value', value: formatRinggit(result.value) },
    { label: 'Dividends', value: formatRinggit(result.dividends) },
    { label: 'Gain / loss', value: formatRinggit(result.gain), isGain: true },
    { label: 'Return', value: formatPercent(result.returnPct), isGain: true },
  ]
  return (
    <dl aria-label="Your result">
      {items.map((item) => (
        <div key={item.label} className={item.isGain ? 'calc-gain' : undefined}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
