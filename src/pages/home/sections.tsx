import { SmartLink } from '../../components/routing'
import { NEWS, PLACEHOLDER_LINKS, type NewsItem } from './data'

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
