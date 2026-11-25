import { SmartLink } from '../../components/routing'
import { CERT_STRIP, ROUTES } from '../../content/site'
import { IPO_GLANCE } from '../investors/data'
import { INTRO_PHOTO, PILLARS, PRODUCT_RANGES } from './data'

/** Only the settled IPO figures; the price and listing date stay on the IR pages until they are set. */
const IPO_FIGURES = IPO_GLANCE.filter((figure) => !figure.isPlaceholder)

/*
 * The home page's one-message bands: each is full width, with one centred title, a line or two of
 * text, one button or one row of links, and one big visual. Styles are in styles/bands.css.
 */

/** 02 Intro: who Bestari is, one button and one big photo. */
export function IntroBand() {
  return (
    <section className="band band--white" id="about" aria-labelledby="intro-title">
      <div className="wrap">
        <div className="eyebrow">Bestari Food Berhad</div>
        <h2 id="intro-title">Mudah &amp; sedap since 2004.</h2>
        <p className="lead">Food premixes and ingredients made in Malaysia. HACCP, ISO 22000 and JAKIM Halal certified.</p>
        <SmartLink className="btn btn-brand" href={ROUTES.about}>
          Our story <span className="arr" aria-hidden="true">→</span>
        </SmartLink>
        <img className="band__photo" src={INTRO_PHOTO.src} alt={INTRO_PHOTO.alt} width={1024} height={445} loading="lazy" />
      </div>
    </section>
  )
}

/** 03 Our products: the four ranges as big pack tiles. */
export function ProductRanges() {
  return (
    <section className="band band--light" id="products" aria-labelledby="ranges-title">
      <div className="wrap">
        <div className="eyebrow">Our products</div>
        <h2 id="ranges-title">Kitchen essentials, from batter to seasoning.</h2>
        <p className="lead">Frying flours, seasonings, desserts and pantry staples, all Halal and made in Malaysia.</p>
        <ul className="ranges">
          {PRODUCT_RANGES.map((range) => (
            <li key={range.id}>
              <SmartLink className="range" href={range.href}>
                <img src={range.image} alt="" loading="lazy" draggable={false} />
                <h3>{range.label}</h3>
                <span className="go">
                  See more <span aria-hidden="true">→</span>
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** 04 Our purpose (342C green): the statement, the three promises and the certification strip. */
export function PromiseBand() {
  return (
    <section className="band band--brand" aria-labelledby="purpose-title">
      <div className="wrap">
        <div className="eyebrow">Our purpose</div>
        <h2 id="purpose-title">Good food brings people together.</h2>
        <p className="lead">
          We are the playful sous chefs, balancing culinary convenience and taste so families can spend less time
          preparing and more time enjoying great meals together.
        </p>
        <ul className="promises">
          {PILLARS.map((pillar) => (
            <li key={pillar.number}>
              <b aria-hidden="true">{pillar.number}</b>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </li>
          ))}
        </ul>
        <div className="cert">
          <img src={CERT_STRIP.src} alt={CERT_STRIP.alt} loading="lazy" />
        </div>
      </div>
    </section>
  )
}

/** 06 Going public (deep green): the IPO headline, its settled figures and one way into Investor Relations. */
export function IpoBand() {
  return (
    <section className="band band--deep" id="ipo" aria-labelledby="ipo-title">
      <div className="wrap">
        <div className="eyebrow">Investor relations · SC approved 23 Oct 2026</div>
        <h2 id="ipo-title">Bestari Food Berhad is going public.</h2>
        <p className="lead">
          We have the Securities Commission Malaysia’s approval to list on the Main Market of Bursa Malaysia, and are
          classified Shariah-compliant by the SC’s Shariah Advisory Council.
        </p>
        <dl className="figures">
          {IPO_FIGURES.map((figure) => (
            <div key={figure.label}>
              <dt>{figure.label}</dt>
              <dd>{figure.value}</dd>
            </div>
          ))}
        </dl>
        <SmartLink className="btn btn-saffron" href={ROUTES.investors}>
          Go to Investor Relations <span className="arr" aria-hidden="true">→</span>
        </SmartLink>
      </div>
    </section>
  )
}
