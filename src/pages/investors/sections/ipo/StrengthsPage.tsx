import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { PROCEEDS_TIMEFRAMES, SEGMENT_REVENUE } from '../../content/prospectus'
import { ADVANTAGES_PLACEHOLDER, COMPETITIVE_ADVANTAGES } from '../../content/sections'
import { PROCEEDS } from '../../data'
import { Panel } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { LATEST_INDEX, LATEST_YEAR } from '../financial/figures'
import { formatPct, segmentShares } from '../financial/metrics'
import { ROUTES_TO_MARKET } from './content'
import { SourceNote } from './parts'

type StrengthsTab = 'strengths' | 'model' | 'growth'

/** Competitive Strengths: what sets the Group apart, how it sells, and the growth plans the IPO pays for. */
export function IpoStrengthsPage() {
  return <SectionTabs tabs={STRENGTHS_TABS} />
}

function StrengthsPanel() {
  return (
    <Panel title="Our competitive strengths" sub={<>Summarised from the company overview: <Ph>{ADVANTAGES_PLACEHOLDER}</Ph></>}>
      <ol className="ipo-cards">
        {COMPETITIVE_ADVANTAGES.map((advantage, index) => (
          <li key={advantage.title} className="ipo-card">
            <span className="ipo-card-num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h4>{advantage.title}</h4>
            <p>{advantage.description}</p>
          </li>
        ))}
      </ol>
    </Panel>
  )
}

function BusinessModel() {
  return (
    <div className="grid-2">
      <BusinessModelPanel />
      <WhatWeSellPanel />
    </div>
  )
}

function BusinessModelPanel() {
  return (
    <Panel title="Business model" sub="Two routes to market, mainly under the Bestari brand">
      <ul className="ipo-routes">
        {ROUTES_TO_MARKET.map((route) => (
          <li key={route.title}>
            <h4>{route.title}</h4>
            <p className="ipo-route-channel">{route.channel}</p>
            <p>{route.customers}</p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function WhatWeSellPanel() {
  const shares = segmentShares(SEGMENT_REVENUE, LATEST_INDEX)
  return (
    <Panel title="What we sell" sub={`Share of ${LATEST_YEAR} revenue by business segment`}>
      <ul className="ipo-segments">
        {shares.map((share) => (
          <li key={share.name}>
            <div>
              <b>{share.name}</b>
              <small>{share.description}</small>
            </div>
            <span className="ipo-segment-pct">{formatPct(share.percent)}</span>
          </li>
        ))}
      </ul>
      <SourceNote>
        More in <Link to={irPath('financial-info', 'segmental-analysis')}>Segmental Analysis</Link>.
      </SourceNote>
    </Panel>
  )
}

const timeframeFor = (title: string): string =>
  PROCEEDS_TIMEFRAMES.find((entry) => entry.title === title)?.timeframe ?? '—'

function GrowthPlansPanel() {
  return (
    <Panel title="Growth plans" sub="Funded by the public issue proceeds">
      <p>
        A new production facility in Banting will add capacity and support a planned move into ingredient processing
        and a wider product range. The public issue proceeds are earmarked as follows:
      </p>
      <ol className="ipo-steps">
        {PROCEEDS.map((use) => (
          <li key={use.number}>
            <b>
              {use.title} <span className="ipo-step-meta">{timeframeFor(use.title)}</span>
            </b>
            <p>{use.description}</p>
          </li>
        ))}
      </ol>
      <p className="note">
        Amounts and timeframes: see <Link to={irPath('ipo-centre', 'use-of-proceeds')}>Utilisation of Proceeds</Link>.
      </p>
    </Panel>
  )
}

const STRENGTHS_TABS: readonly SectionTab<StrengthsTab>[] = [
  { id: 'strengths', label: 'Strengths', content: <StrengthsPanel /> },
  { id: 'model', label: 'Business model', content: <BusinessModel /> },
  { id: 'growth', label: 'Growth plans', content: <GrowthPlansPanel /> },
]
