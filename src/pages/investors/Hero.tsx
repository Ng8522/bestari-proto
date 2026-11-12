import { Ph } from '../../components/text'
import { HERO_BADGES, IPO_GLANCE, headingId } from './data'

/** Green-deep hero: headline, SC approval copy, badges and the "IPO at a glance" glass panel. */
export function IrHero() {
  return (
    <section className="irh" aria-labelledby={headingId('hero')}>
      <div className="wrap wrap--wide irh-grid">
        <div className="irh-copy">
          <p className="eyebrow">Investor Relations</p>
          <h1 id={headingId('hero')}>Bestari Food Berhad is going public.</h1>
          <p className="irh-lede">
            We have the Securities Commission Malaysia’s approval to list on the Main Market of Bursa Malaysia. We are
            also classified Shariah-compliant by the SC’s Shariah Advisory Council.
          </p>
          <ul className="badges">
            {HERO_BADGES.map((badge) => (
              <li key={badge.label} className={badge.isHighlighted ? 'is-highlight' : undefined}>
                {badge.label}
              </li>
            ))}
          </ul>
        </div>
        <Glance />
      </div>
    </section>
  )
}

function Glance() {
  return (
    <section className="glance reveal" aria-labelledby={headingId('glance')}>
      <h2 className="glance-title" id={headingId('glance')}>
        IPO at a glance
      </h2>
      <dl className="glance-grid">
        {IPO_GLANCE.map((figure) => (
          <div key={figure.label}>
            <dt>{figure.label}</dt>
            <dd>{figure.isPlaceholder ? <Ph>{figure.value}</Ph> : figure.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
