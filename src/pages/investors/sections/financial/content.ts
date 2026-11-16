/**
 * Financial Info copy and statement layouts. The draft prospectus summary gives only the income statement lines in
 * content/prospectus.ts; the financial position and cash flow lines are the standard ones, and their values stay
 * placeholders until they are taken from the accountants' report.
 */
import type { IrDocument } from '../../data'

export type StatementRowKind = 'heading' | 'item' | 'total'

export interface StatementLine {
  label: string
  kind: StatementRowKind
}

const heading = (label: string): StatementLine => ({ label, kind: 'heading' })
const item = (label: string): StatementLine => ({ label, kind: 'item' })
const total = (label: string): StatementLine => ({ label, kind: 'total' })

export const FINANCIAL_POSITION_LINES: readonly StatementLine[] = [
  heading('Assets'),
  item('Non-current assets'),
  item('Inventories'),
  item('Trade and other receivables'),
  item('Cash and bank balances'),
  total('Total assets'),
  heading('Equity and liabilities'),
  item('Share capital'),
  item('Retained earnings'),
  total('Total equity'),
  item('Borrowings and lease liabilities'),
  item('Trade and other payables'),
  item('Other liabilities'),
  total('Total liabilities'),
  total('Total equity and liabilities'),
]

/** "Profit before tax" is the only line here with a value in our data (from the income statement). */
export const PBT_LINE = 'Profit before tax'

export const CASH_FLOW_LINES: readonly StatementLine[] = [
  heading('Operating activities'),
  item(PBT_LINE),
  item('Adjustments for non-cash items'),
  item('Changes in working capital'),
  item('Tax paid'),
  total('Net cash from / (used in) operating activities'),
  heading('Investing activities'),
  item('Purchase of property, plant and equipment'),
  total('Net cash from / (used in) investing activities'),
  heading('Financing activities'),
  item('Borrowings and lease payments'),
  total('Net cash from / (used in) financing activities'),
  total('Net change in cash and cash equivalents'),
  item('Cash and cash equivalents at the start of the year'),
  total('Cash and cash equivalents at the end of the year'),
]

export const STATEMENT_PLACEHOLDER = 'per accountants’ report'

export const POST_LISTING_STATEMENTS: readonly IrDocument[] = [
  { title: 'Audited financial statements', meta: 'In each annual report, after listing', format: 'PDF' },
  { title: 'Quarterly financial reports', meta: 'Each quarter, after listing', format: 'PDF' },
]

export const QUARTERS: readonly string[] = ['Q1', 'Q2', 'Q3', 'Q4']

export const QUARTERLY_NOTICE =
  'Quarterly results start after listing. Main Market companies announce their results for each quarter within two months of the quarter’s end; ours will appear here, with the annual figures alongside.'

export const NO_QUARTERLY_RESULTS = 'No quarterly results yet. Our first quarterly report will be published after listing.'
