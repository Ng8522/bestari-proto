import { useRef, useState } from 'react'
import { SHARES_PER_LOT, calculateInvestment, type CalculatorFields, type InvestmentInput } from '../../calculator'
import { DataTable, type Column } from '../../ui/DataTable'
import { Notice, Panel } from '../../ui/PageParts'
import { formatCount, formatPercent, formatPrice, formatRinggit } from './format'
import { EMPTY_CALCULATOR_FIELDS, InvestmentCalculator } from './InvestmentCalculator'

const SEN_PER_RINGGIT = 100

/** Hypothetical figures for the worked example: not our IPO price, which is not fixed yet, nor a forecast. */
const EXAMPLE: InvestmentInput = { lots: 10, buyPrice: 1, sellPrice: 1.1, dividendSen: 3 }

const EXAMPLE_FIELDS: CalculatorFields = {
  lots: String(EXAMPLE.lots),
  buyPrice: EXAMPLE.buyPrice.toFixed(2),
  sellPrice: EXAMPLE.sellPrice.toFixed(2),
  dividendSen: String(EXAMPLE.dividendSen),
}

interface Step {
  label: string
  working: string
  result: string
}

function exampleSteps(input: InvestmentInput): readonly Step[] {
  const result = calculateInvestment(input)
  const shares = `${formatCount(result.shares)} shares`
  return [
    { label: 'Shares', working: `${input.lots} lots × ${SHARES_PER_LOT} shares`, result: shares },
    { label: 'Cost', working: `${shares} × ${formatPrice(input.buyPrice)}`, result: formatRinggit(result.cost) },
    { label: 'Value', working: `${shares} × ${formatPrice(input.sellPrice)}`, result: formatRinggit(result.value) },
    {
      label: 'Dividends',
      working: `${shares} × ${input.dividendSen} sen ÷ ${SEN_PER_RINGGIT}`,
      result: formatRinggit(result.dividends),
    },
    {
      label: 'Gain / loss',
      working: `${formatRinggit(result.value)} + ${formatRinggit(result.dividends)} − ${formatRinggit(result.cost)}`,
      result: formatRinggit(result.gain),
    },
    {
      label: 'Return',
      working: `${formatRinggit(result.gain)} ÷ ${formatRinggit(result.cost)} × 100`,
      result: formatPercent(result.returnPct),
    },
  ]
}

const STEP_COLUMNS: readonly Column<Step>[] = [
  { key: 'label', header: 'Step', render: (step) => step.label, isRowHeader: true },
  { key: 'working', header: 'Working', render: (step) => step.working },
  { key: 'result', header: 'Result', render: (step) => step.result, align: 'right' },
]

const ASSUMPTIONS: readonly string[] = [
  `One board lot on Bursa Malaysia is ${SHARES_PER_LOT} shares, so shares = lots × ${SHARES_PER_LOT}.`,
  'Prices are in RM per share: what you paid, and what you sold at (or the price today).',
  `Dividends are the total you received per share while you held the shares, in sen (${SEN_PER_RINGGIT} sen = RM1).`,
  'Return = (value + dividends − cost) ÷ cost × 100. It is not annualised, so it ignores how long you held the shares.',
  'Figures are gross: they exclude brokerage, clearing fees, stamp duty and any tax.',
  'Nothing you type is sent anywhere; the sums are worked out in your browser.',
]

/** Investor Resources › Investment Calculator: the calculator, its assumptions and a worked example. */
export function InvestmentCalculatorPage() {
  const [fields, setFields] = useState<CalculatorFields>(EMPTY_CALCULATOR_FIELDS)
  const calculatorRef = useRef<HTMLDivElement>(null)

  function applyExample(): void {
    setFields(EXAMPLE_FIELDS)
    calculatorRef.current?.querySelector('input')?.focus()
  }

  return (
    <>
      <div className="grid-2">
        <Panel title="Calculate your return" sub="Enter your holding to see the gross gain or loss.">
          <div ref={calculatorRef}>
            <InvestmentCalculator fields={fields} onChange={setFields} />
          </div>
        </Panel>
        <Panel title="Assumptions">
          <ul className="rs-bullets">
            {ASSUMPTIONS.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel
        title="Worked example"
        sub={`${EXAMPLE.lots} lots bought at ${formatPrice(EXAMPLE.buyPrice)}, sold at ${formatPrice(EXAMPLE.sellPrice)}, with ${EXAMPLE.dividendSen} sen of dividends per share.`}
        actions={
          <button type="button" className="filter-reset" onClick={applyExample}>
            Use these figures
          </button>
        }
      >
        <DataTable caption="Worked example" columns={STEP_COLUMNS} rows={exampleSteps(EXAMPLE)} rowKey={(step) => step.label} minWidth={520} />
        <Notice tone="pending">
          These prices are hypothetical, for illustration only. They are not our IPO price, which has not been fixed,
          nor a forecast of our share price or dividends. This calculator is not investment advice.
        </Notice>
      </Panel>
    </>
  )
}
