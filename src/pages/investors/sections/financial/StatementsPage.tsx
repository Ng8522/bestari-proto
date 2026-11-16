import { useState, type ReactNode } from 'react'
import { Ph } from '../../../../components/text'
import { EPS_SEN, INCOME_STATEMENT, SC_EXPOSURE_URL } from '../../content/prospectus'
import { DataTable, DocTable, type Column } from '../../ui/DataTable'
import { Segmented, type Option } from '../../ui/Filters'
import { Panel } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { ExternalLink, SourceNote } from '../ipo/parts'
import {
  CASH_FLOW_LINES,
  FINANCIAL_POSITION_LINES,
  PBT_LINE,
  POST_LISTING_STATEMENTS,
  STATEMENT_PLACEHOLDER,
  type StatementLine,
} from './content'
import { COST_OF_SALES, TAXATION, YEARS, YEAR_RANGE } from './figures'
import { formatThousands } from './metrics'

type StatementId = 'income' | 'position' | 'cashflow'

const STATEMENT_OPTIONS: readonly Option<StatementId>[] = [
  { value: 'income', label: 'Income statement' },
  { value: 'position', label: 'Financial position' },
  { value: 'cashflow', label: 'Cash flows' },
]

type StatementsTab = 'statements' | 'sources'

/** Financial Statements: the income statement from the prospectus, and the layouts of the other two statements. */
export function FinancialStatementsPage() {
  return (
    <div className="fin-page">
      <SectionTabs tabs={STATEMENTS_TABS} />
    </div>
  )
}

function StatementsTabContent() {
  const [statement, setStatement] = useState<StatementId>('income')
  return (
    <>
      <div className="fin-switch">
        <Segmented label="Statement" options={STATEMENT_OPTIONS} value={statement} onChange={setStatement} />
      </div>
      {statement === 'income' && <IncomeStatement />}
      {statement === 'position' && (
        <LayoutStatement title="Statement of financial position" sub="RM’000, as at 31 December" lines={FINANCIAL_POSITION_LINES} />
      )}
      {statement === 'cashflow' && (
        <LayoutStatement title="Statement of cash flows" sub="RM’000, financial years ended 31 December" lines={CASH_FLOW_LINES} />
      )}
    </>
  )
}

interface FigureRow {
  label: string
  /** One cell per year, already formatted. */
  cells: readonly ReactNode[]
  kind?: StatementLine['kind']
}

const rowLabel = (row: FigureRow): ReactNode =>
  row.kind === 'total' || row.kind === 'heading' ? <span className={`fin-row-${row.kind}`}>{row.label}</span> : row.label

const FIGURE_COLUMNS: readonly Column<FigureRow>[] = [
  { key: 'label', header: 'Item', render: rowLabel, isRowHeader: true },
  ...YEARS.map((year, index) => ({
    key: year,
    header: year,
    render: (row: FigureRow) => row.cells[index],
    align: 'right' as const,
  })),
]

const negative = (values: readonly number[]): string[] => values.map((value) => formatThousands(-value))

const INCOME_ROWS: readonly FigureRow[] = [
  { label: 'Revenue', cells: INCOME_STATEMENT.revenue.map(formatThousands) },
  { label: 'Cost of sales (derived)', cells: negative(COST_OF_SALES) },
  { label: 'Gross profit', cells: INCOME_STATEMENT.grossProfit.map(formatThousands), kind: 'total' },
  { label: 'Profit before tax', cells: INCOME_STATEMENT.pbt.map(formatThousands), kind: 'total' },
  { label: 'Taxation (derived)', cells: negative(TAXATION) },
  { label: 'Profit after tax', cells: INCOME_STATEMENT.pat.map(formatThousands), kind: 'total' },
  { label: 'Other financial data', cells: YEARS.map(() => ''), kind: 'heading' },
  { label: 'EBITDA', cells: INCOME_STATEMENT.ebitda.map(formatThousands) },
  { label: 'Earnings per share (sen)', cells: EPS_SEN.map((value) => value.toFixed(1)) },
]

function IncomeStatement() {
  return (
    <Panel title="Income statement" sub="RM’000, financial years ended 31 December">
      <DataTable caption={`Income statement, ${YEAR_RANGE}`} columns={FIGURE_COLUMNS} rows={INCOME_ROWS} rowKey={(row) => row.label} />
      <SourceNote>
        Cost of sales is revenue less gross profit, and taxation is profit before tax less profit after tax. Other
        income, operating expenses and finance costs are set out in the accountants’ report.
      </SourceNote>
    </Panel>
  )
}

/** A statement's standard lines; values are placeholders, except profit before tax, which is in our data. */
function layoutRows(lines: readonly StatementLine[]): FigureRow[] {
  return lines.map((line) => {
    if (line.kind === 'heading') return { label: line.label, kind: line.kind, cells: YEARS.map(() => '') }
    if (line.label === PBT_LINE) return { label: line.label, kind: line.kind, cells: INCOME_STATEMENT.pbt.map(formatThousands) }
    return { label: line.label, kind: line.kind, cells: YEARS.map(() => <Ph>{STATEMENT_PLACEHOLDER}</Ph>) }
  })
}

interface LayoutStatementProps {
  title: string
  sub: string
  lines: readonly StatementLine[]
}

function LayoutStatement({ title, sub, lines }: LayoutStatementProps) {
  return (
    <Panel title={title} sub={sub}>
      <DataTable caption={`${title}, ${YEAR_RANGE}`} columns={FIGURE_COLUMNS} rows={layoutRows(lines)} rowKey={(row) => row.label} minWidth={640} />
      <SourceNote>
        These are the statement’s standard lines. The figures will be added from the accountants’ report in the
        registered prospectus.
      </SourceNote>
    </Panel>
  )
}

function SourceDocuments() {
  return (
    <Panel title="Source documents">
      <p>
        The full audited figures, with notes, are in the accountants’ report in the prospectus.{' '}
        <ExternalLink href={SC_EXPOSURE_URL}>Read the accountants’ report in the draft prospectus (SC prospectus exposure)</ExternalLink>
      </p>
      <DocTable caption="Financial statements published after listing" documents={POST_LISTING_STATEMENTS} />
    </Panel>
  )
}

const STATEMENTS_TABS: readonly SectionTab<StatementsTab>[] = [
  { id: 'statements', label: 'Statements', content: <StatementsTabContent /> },
  { id: 'sources', label: 'Source documents', content: <SourceDocuments /> },
]
