import type { ReactElement } from 'react'
import { Ph } from '../../../../components/text'
import { COMPANY } from '../../../../content/site'
import { PROSPECTUS_SOURCE } from '../../content/prospectus'
import { InfoList } from '../../Tabs'
import { Notice, Panel, StatGrid } from '../../ui/PageParts'
import { COUNTER_INFO, NO_TRADE, TRADING_STARTS, TRADING_SUMMARY } from './content'

/** Stock Info › Price Ticker: the latest quote, the day's trading summary and the counter's details. */
export function PriceTicker(): ReactElement {
  return (
    <>
      <Notice tone="pending" title="Not trading yet">
        The Securities Commission Malaysia approved our listing on the Main Market of Bursa Malaysia on 23 Oct 2026.
        The quote below starts updating on the first day of trading.
      </Notice>

      <Panel
        className="ticker-card"
        title={COMPANY.name}
        sub={
          <>
            Bursa Malaysia · Main Market · Stock code <Ph>TBA</Ph>
          </>
        }
        actions={<TickerQuote />}
      >
        <StatGrid stats={TRADING_SUMMARY} label="Trading summary" />
        <p className="ticker-updated">
          <b>Last updated:</b> {TRADING_STARTS.toLowerCase()}
        </p>
      </Panel>

      <Panel title="Counter information" sub="How the shares will be quoted on Bursa Malaysia">
        <InfoList entries={COUNTER_INFO} className="info--grid ticker-info" />
        <p className="note">
          Source: {PROSPECTUS_SOURCE}. The stock code, ISIN and sector are assigned by Bursa Malaysia at listing.
        </p>
      </Panel>
    </>
  )
}

/** The large last-done price and the day's change. */
function TickerQuote(): ReactElement {
  return (
    <dl className="ticker-quote" aria-label="Latest quote">
      <div>
        <dt>Last done (RM)</dt>
        <dd className="ticker-price">{NO_TRADE}</dd>
      </div>
      <div>
        <dt>Change (RM / %)</dt>
        <dd className="ticker-change">
          {NO_TRADE} ({NO_TRADE}%)
        </dd>
      </div>
    </dl>
  )
}
