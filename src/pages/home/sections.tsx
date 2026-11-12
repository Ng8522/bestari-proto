import type { CSSProperties } from 'react'
import { SmartLink } from '../../components/routing'
import { CERT_STRIP } from '../../content/site'
import { DOORS, NEWS, PILLARS, PLACEHOLDER_LINKS, type Door, type NewsItem } from './data'

interface DoorCardProps {
  door: Door
}

function DoorCard({ door }: DoorCardProps) {
  const backgroundStyle: CSSProperties | undefined = door.background ? { background: door.background } : undefined
  return (
    <SmartLink className="door" href={door.href}>
      <div className={door.background ? 'bg prod' : 'bg'} style={backgroundStyle}>
        <img src={door.image.src} alt={door.image.alt} loading="lazy" draggable={false} />
      </div>
      <div className="eyebrow">{door.eyebrow}</div>
      <h3>{door.title}</h3>
      <span className="go">
        {door.cta} <b aria-hidden="true">→</b>
      </span>
    </SmartLink>
  )
}

/** 02 Intro line and the three doors (About, Investor Relations, Shop). */
export function IntroDoors() {
  return (
    <section className="intro" id="about">
      <div className="wrap">
        <div className="line">
          <h2>
            Mudah &amp; sedap since 2004. <em>Let’s makan together.</em>
          </h2>
          <p>Food premixes and ingredients made in Malaysia. HACCP, ISO 22000 and JAKIM Halal certified.</p>
        </div>
        <div className="doors">
          {DOORS.map((door) => (
            <DoorCard key={door.href} door={door} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** 04 Our Purpose (green): statement, certification strip and the three pillars. */
export function Purpose() {
  return (
    <section className="purpose">
      <div className="wrap">
        <div>
          <div className="eyebrow">Our Purpose</div>
          <h2>
            Good food brings people <em>together.</em>
          </h2>
          <p>
            We are the playful sous chefs, balancing culinary convenience and taste so families can spend less time
            preparing and more time enjoying great meals together.
          </p>
          <div className="cert">
            <img src={CERT_STRIP.src} alt={CERT_STRIP.alt} loading="lazy" />
          </div>
        </div>
        <div className="pillars">
          {PILLARS.map((pillar) => (
            <div className="pillar" key={pillar.number}>
              <b>{pillar.number}</b>
              <div>
                <h3>{pillar.title}</h3>
                <span>{pillar.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface NewsCardProps {
  item: NewsItem
}

function NewsCard({ item }: NewsCardProps) {
  return (
    <SmartLink className={item.kind === 'badge' ? 'lc ipo' : 'lc'} href={item.href}>
      <div className="im">
        {item.kind === 'badge' ? item.badge : <img src={item.image} alt="" loading="lazy" />}
      </div>
      <div>
        <span className="label">{item.label}</span>
        <h3>{item.title}</h3>
      </div>
    </SmartLink>
  )
}

/** 06 Latest: three horizontal news cards, the IPO story first. */
export function Latest() {
  return (
    <section className="latest" id="latest">
      <div className="wrap">
        <div className="head">
          <h2>Latest</h2>
          <a className="all" href={PLACEHOLDER_LINKS.allNews}>
            View all <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="lrow">
          {NEWS.map((item) => (
            <NewsCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
