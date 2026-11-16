import type { PageComponents } from '../stub'
import { Entitlements } from './Entitlements'
import { PriceTicker } from './PriceTicker'
import { PriceVolume } from './PriceVolume'
import { ShareholdingsDistribution } from './ShareholdingsDistribution'
import { StockCharts } from './StockCharts'
import { TopShareholders } from './TopShareholders'
import './stock.css'

/** Stock Info sub-pages, keyed by the page slugs in IR_NAV ('stock-info'). */
export const STOCK_PAGES: PageComponents = {
  'price-ticker': PriceTicker,
  'price-volume': PriceVolume,
  'stock-charts': StockCharts,
  'shareholdings-distribution': ShareholdingsDistribution,
  'top-30-shareholders': TopShareholders,
  entitlements: Entitlements,
}
