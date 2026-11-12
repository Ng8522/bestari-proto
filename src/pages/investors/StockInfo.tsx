import {
  DIVIDEND_POLICY,
  ENTITLEMENT_COLUMNS,
  HOLDINGS_NOTE,
  NO_ENTITLEMENTS,
  PRICE_HISTORY_NOTE,
  STOCK_CHARTS_NOTE,
  TICKER,
  TRADING_NOTE,
} from './content/sections'
import { headingId } from './data'
import { IrSection, SectionHead } from './Section'
import { EmptyState, InfoList, Tabs, type TabItem } from './Tabs'

type StockTabId = 'ticker' | 'history' | 'charts' | 'holdings' | 'entitlements'

const STOCK_TABS: readonly TabItem<StockTabId>[] = [
  { id: 'ticker', label: 'Price ticker', content: <InfoList entries={TICKER} className="info--grid info--ticker" /> },
  { id: 'history', label: 'Price & volume', content: <EmptyState>{PRICE_HISTORY_NOTE}</EmptyState> },
  { id: 'charts', label: 'Stock charts', content: <EmptyState>{STOCK_CHARTS_NOTE}</EmptyState> },
  {
    id: 'holdings',
    label: 'Shareholdings',
    content: (
      <EmptyState>
        {HOLDINGS_NOTE} <a href="#shareholding">See the post-IPO shareholding</a>
      </EmptyState>
    ),
  },
  { id: 'entitlements', label: 'Entitlements', content: <Entitlements /> },
]

/** Stock information: ticker, trading history, charts, shareholdings and entitlements (empty until listing). */
export function StockInfo() {
  return (
    <IrSection id="stock" className="sec--tinted">
      <SectionHead sectionId="stock" eyebrow="Stock info" title="Stock information." intro={TRADING_NOTE} />
      <div className="card reveal">
        <Tabs idPrefix="ir-stock" labelledBy={headingId('stock')} tabs={STOCK_TABS} />
      </div>
    </IrSection>
  )
}

function Entitlements() {
  return (
    <>
      <p className="ent-policy">
        <b>Dividend policy:</b> {DIVIDEND_POLICY}
      </p>
      <div className="table-scroll" role="region" aria-label="Entitlements table" tabIndex={0}>
        <table className="data-table">
          <caption className="visually-hidden">Dividends and other entitlements</caption>
          <thead>
            <tr>
              {ENTITLEMENT_COLUMNS.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={ENTITLEMENT_COLUMNS.length} className="data-table-empty">
                {NO_ENTITLEMENTS}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
