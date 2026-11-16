/**
 * Investor FAQ. Answers come from data.ts, content/*.ts and the draft prospectus; anything not yet known
 * (stock code, listing date, IR mailbox) is a <Ph> placeholder. How-to answers describe the general Malaysian
 * process and point to the prospectus or our IR team for specifics.
 */
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { COMPANY } from '../../../../content/site'
import { SHARES_PER_LOT } from '../../calculator'
import { CORPORATE_DIRECTORY, IPO_TERMS } from '../../content/prospectus'
import { DIVIDEND_POLICY } from '../../content/sections'
import { IR_EMAIL_PLACEHOLDER } from '../../data'
import { SC_APPROVAL_DATE } from '../reports/content'
import { ANNUAL_REPORT_MONTHS, FINANCIAL_YEAR_END, QUARTERLY_REPORT_MONTHS } from '../reports/reporting'

export interface FaqItem {
  id: string
  question: string
  /** Extra words the search box matches, besides the question. */
  keywords: string
  answer: ReactNode
}

const REGISTRAR = CORPORATE_DIRECTORY.find((entry) => entry.label === 'Share registrar')?.lines[0] ?? 'our share registrar'

const BUYING: FaqItem = {
  id: 'buy-shares',
  question: 'How can I buy Bestari shares after listing?',
  keywords: 'trade broker CDS account purchase invest',
  answer: (
    <>
      <p>
        Once we are listed on the Main Market of Bursa Malaysia, you can buy and sell our shares through any
        stockbroking firm that is a participating organisation of Bursa Malaysia. You need a Central Depository
        System (CDS) account, which holds your shares, and a trading account with the broker.
      </p>
      <p>
        To apply for shares in the IPO itself, see <Link to={irPath('ipo-centre', 'how-to-apply')}>How to Apply</Link>.
      </p>
    </>
  ),
}

const STOCK_CODE: FaqItem = {
  id: 'stock-code',
  question: 'What is the stock code?',
  keywords: 'ticker stock name symbol',
  answer: (
    <p>
      Our stock name and code are assigned by Bursa Malaysia at listing: <Ph>assigned at listing</Ph>. We will show
      them on the <Link to={irPath('stock-info', 'price-ticker')}>Price Ticker</Link> page.
    </p>
  ),
}

const LISTING_DATE: FaqItem = {
  id: 'listing-date',
  question: 'When will Bestari list on Bursa Malaysia?',
  keywords: 'listing date IPO timetable when',
  answer: (
    <p>
      The Securities Commission Malaysia approved our listing on {SC_APPROVAL_DATE}. {IPO_TERMS.approvalNote} The
      listing date is <Ph>TBA</Ph> and will be set out in the registered prospectus; see the{' '}
      <Link to={irPath('ipo-centre', 'timetable')}>IPO Timetable</Link>.
    </p>
  ),
}

const BOARD_LOT: FaqItem = {
  id: 'board-lot',
  question: 'What is a board lot?',
  keywords: 'lot units minimum shares',
  answer: (
    <p>
      Shares on Bursa Malaysia trade in board lots of {SHARES_PER_LOT} shares, so an order for 10 lots is an order
      for {10 * SHARES_PER_LOT} shares. Try the <Link to={irPath('resources', 'investment-calculator')}>Investment Calculator</Link>.
    </p>
  ),
}

const DIVIDENDS: FaqItem = {
  id: 'dividend-policy',
  question: 'What is the dividend policy?',
  keywords: 'dividend payout income',
  answer: (
    <p>
      Our dividend policy, as set out in the prospectus: {DIVIDEND_POLICY} Declared dividends and their dates
      will be listed under <Link to={irPath('stock-info', 'entitlements')}>Entitlements</Link>.
    </p>
  ),
}

const REGISTRAR_ITEM: FaqItem = {
  id: 'share-registrar',
  question: 'Who is the share registrar, and how do I update my details?',
  keywords: 'registrar address bank account change details Boardroom',
  answer: (
    <p>
      Our share registrar is {REGISTRAR}. Shares on Bursa Malaysia are held in CDS accounts, so you update your
      address or bank account details through the broker (authorised depository agent) where your CDS account is
      kept. For other questions about your shareholding, contact the share registrar, or see our{' '}
      <Link to={irPath('contact')}>IR Contact</Link> page.
    </p>
  ),
}

const ALERTS: FaqItem = {
  id: 'alerts',
  question: 'How do I receive news and announcements by email?',
  keywords: 'email alerts subscribe newsletter notifications',
  answer: (
    <p>
      Sign up on the <Link to={irPath('resources', 'news-alerts')}>News Alerts</Link> page and choose the alerts you
      want: Bursa announcements, financial results, press releases or the corporate calendar.
    </p>
  ),
}

const REPORTS: FaqItem = {
  id: 'reports',
  question: 'Where can I find annual and quarterly reports?',
  keywords: 'annual report quarterly results financial statements',
  answer: (
    <p>
      Under <Link to={irPath('reports', 'annual-reports')}>Reports & Presentations</Link>, from listing. Our
      financial year ends on {FINANCIAL_YEAR_END}: quarterly results come within {QUARTERLY_REPORT_MONTHS} months of
      each quarter end, and the annual report within {ANNUAL_REPORT_MONTHS} months of the year end. Until then, our
      audited figures are in the <Link to={irPath('reports', 'prospectus')}>prospectus</Link>.
    </p>
  ),
}

const CONTACT: FaqItem = {
  id: 'ir-contact',
  question: 'How do I contact Investor Relations?',
  keywords: 'contact email phone IR team enquiry',
  answer: (
    <p>
      Use the enquiry form on our <Link to={irPath('contact')}>IR Contact</Link> page, email{' '}
      <Ph>{IR_EMAIL_PLACEHOLDER}</Ph> or call <a href={COMPANY.phone.href}>{COMPANY.phone.label}</a>.
    </p>
  ),
}

const SHARIAH: FaqItem = {
  id: 'shariah',
  question: 'Are Bestari shares Shariah-compliant?',
  keywords: 'shariah islamic halal compliant SAC',
  answer: (
    <p>
      Yes. Our shares were classified as Shariah-compliant by the Shariah Advisory Council of the Securities
      Commission Malaysia, with the SC’s approval on {SC_APPROVAL_DATE}. The Council reviews its list of
      Shariah-compliant securities twice a year.
    </p>
  ),
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  BUYING,
  STOCK_CODE,
  LISTING_DATE,
  BOARD_LOT,
  DIVIDENDS,
  REGISTRAR_ITEM,
  ALERTS,
  REPORTS,
  CONTACT,
  SHARIAH,
]

/** Items whose question or keywords contain every word of the query (case-insensitive). */
export function searchFaq(items: readonly FaqItem[], query: string): readonly FaqItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return items
  return items.filter((item) => {
    const haystack = `${item.question} ${item.keywords}`.toLowerCase()
    return words.every((word) => haystack.includes(word))
  })
}
