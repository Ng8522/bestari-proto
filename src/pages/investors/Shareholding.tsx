import { Fragment } from 'react'
import { CORE_PERPETUAL_OWNERS, HOLDERS, POST_IPO_SHARES, headingId, type Holder } from './data'
import { IrSection } from './Section'

interface GradientStops {
  stops: readonly string[]
  end: number
}

/** conic-gradient with one segment per holder, e.g. "var(--brand) 0% 70.4%, var(--saffron) 70.4% 100%". */
export function donutGradient(holders: readonly Holder[]): string {
  const { stops } = holders.reduce<GradientStops>(
    (acc, holder) => {
      const end = acc.end + holder.percent
      return { stops: [...acc.stops, `${holder.chartColor} ${acc.end}% ${end}%`], end }
    },
    { stops: [], end: 0 },
  )
  return `conic-gradient(${stops.join(', ')})`
}

const DONUT_LABEL = `Shareholding after the IPO: ${HOLDERS.map((holder) => `${holder.name} ${holder.percent}%`).join(', ')} of ${POST_IPO_SHARES} shares`

/** Post-IPO shareholding donut, with the owners of the selling shareholder. */
export function Shareholding() {
  return (
    <IrSection id="shareholding" className="sec--flush">
      <div className="card reveal">
        <div className="sharegrid">
          <div className="donut" role="img" aria-label={DONUT_LABEL} style={{ background: donutGradient(HOLDERS) }}>
            <div className="donut-label">
              <span>
                <b>{POST_IPO_SHARES}</b>shares post-IPO
              </span>
            </div>
          </div>
          <div>
            <p className="eyebrow">Shareholding after IPO</p>
            <h2 className="share-title" id={headingId('shareholding')}>
              {HOLDERS.map((holder, index) => (
                <Fragment key={holder.name}>
                  {index > 0 && ' · '}
                  {holder.name} <span style={{ color: holder.textColor }}>{holder.percent}%</span>
                </Fragment>
              ))}
            </h2>
            <p className="share-intro">The selling shareholder, Core Perpetual Sdn Bhd, is owned by:</p>
            <ul className="owners">
              {CORE_PERPETUAL_OWNERS.map((owner) => (
                <li key={owner.name}>
                  <b>{owner.percent}%</b>
                  <span>{owner.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </IrSection>
  )
}
