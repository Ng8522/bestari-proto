import { SmartLink } from '../../components/routing'
import { asset, CERT_STRIP } from '../../content/site'
import { ALSO_LIKE, HQ_STATS, TRIO_ROWS, TRIO_WORDS } from './data'

/** 03 Green origin split: a giant "2004" with the flagship pack, beside the founding story. */
export function OriginSection() {
  return (
    <section className="origin" aria-labelledby="origin-title">
      <div className="grid">
        <div className="yr">
          <span className="chip">Where it all began</span>
          <b>2004</b>
          <img src={asset('p-flour-original-1kg.png')} alt="" />
        </div>
        <div className="tx">
          <div className="eyebrow">It all started with one mix</div>
          <h2 id="origin-title">A crispy idea that changed fried chicken night.</h2>
          <p>Bestari began as a maker of just one product: a Crispy Fried Chicken Coating Mix.</p>
          <p>
            Then we noticed something. Our customers found real joy in frying chicken at home, because a traditionally
            time-consuming dish had become simple. It saved families the cost of dining out, and it brought them closer
            together.
          </p>
          <div className="psst">
            <h3>Psst… why “Bestari”?</h3>
            <p>
              Our name inspires us to offer the <b>best</b> flavours with passionate recipes. That is where every Bestari
              meal begins.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 05 Green-deep "Mudah. Sedap. Bersama." with the labelled copy rows. */
export function TrioSection() {
  return (
    <section className="trio" aria-labelledby="trio-title">
      <div className="wrap wrap--wide grid">
        <div className="stack">
          {TRIO_WORDS.map((word) => (
            <div key={word}>{word}</div>
          ))}
        </div>
        <div>
          <div className="eyebrow">Our recipe for success</div>
          <h3 id="trio-title">We are the playful sous chefs.</h3>
          <p>
            We laugh with the chefs as they prepare their masterpieces, and smile with the families as they enjoy their
            food. We walk the tightrope between culinary convenience and taste.
          </p>
          <div className="rows">
            {TRIO_ROWS.map((row) => (
              <div key={row.label}>
                <b>{row.label}</b>
                {row.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** 08 HQ: photo placeholder tile and the info card with a 2×2 stats grid and the certification strip. */
export function HqSection() {
  return (
    <section className="hq" aria-labelledby="hq-title">
      <div className="wrap wrap--wide grid">
        <div className="tile">
          <div className="ph-img" aria-hidden="true">
            [ Bestari HQ / factory photo ]
          </div>
          <div className="lbl">
            <b>Bestari HQ</b>
            <span>Telok Panglima Garang, Kuala Langat, Selangor</span>
          </div>
        </div>
        <div className="info">
          <div>
            <div className="eyebrow">Made at home, in Selangor</div>
            <h2 id="hq-title">Where every pack is made.</h2>
            <p>
              Our headquarters has a 2-storey production factory, a 3-storey office building and a single-storey
              warehouse. Our factory follows strict food safety guidelines.
            </p>
            <div className="stats">
              {HQ_STATS.map((stat) => (
                <div key={stat.label}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="certs">
            <img src={CERT_STRIP.src} alt={CERT_STRIP.alt} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** 10 You may also like: two large link cards; the arrow turns −45° on hover. */
export function AlsoLikeSection() {
  return (
    <section className="next" aria-labelledby="next-title">
      <h2 id="next-title" className="visually-hidden">
        You may also like
      </h2>
      <div className="wrap wrap--wide grid">
        {ALSO_LIKE.map((card) => (
          <SmartLink key={card.href} href={card.href} className="nx" style={{ background: card.background }}>
            <div>
              <div className="eyebrow">{card.eyebrow}</div>
              <h3>{card.label}</h3>
            </div>
            <b aria-hidden="true">→</b>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}
