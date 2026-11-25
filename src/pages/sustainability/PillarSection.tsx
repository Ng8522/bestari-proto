import type { Pillar, PillarStat } from './data'

interface PillarSectionProps {
  pillar: Pillar
}

/** One coloured band per pillar: heading, story, three highlight cards, and the figures we report on. */
export function PillarSection({ pillar }: PillarSectionProps) {
  const titleId = `${pillar.id}-title`

  return (
    <section id={pillar.id} className={`sus-pillar sus-tone--${pillar.tone}`} aria-labelledby={titleId}>
      {pillar.image && <img className="sus-pillar__pack" src={pillar.image.src} alt={pillar.image.alt} loading="lazy" />}
      <div className="wrap">
        <p className="sus-pillar__eyebrow reveal">
          <span className="sus-pillar__num">{pillar.number}</span> {pillar.area}
        </p>
        <h2 id={titleId} className="sus-pillar__title reveal">
          {pillar.title}
        </h2>
        <div className="sus-pillar__grid">
          <div className="sus-pillar__copy reveal">
            <p className="sus-pillar__intro">{pillar.intro}</p>
            {pillar.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="sus-pillar__cards">
            {pillar.highlights.map((highlight) => (
              <li key={highlight.title} className="sus-card reveal">
                <h3>{highlight.title}</h3>
                <p>{highlight.text}</p>
              </li>
            ))}
          </ul>
        </div>
        {pillar.stats && <StatList stats={pillar.stats} />}
      </div>
    </section>
  )
}

function StatList({ stats }: { stats: readonly PillarStat[] }) {
  return (
    <ul className="sus-stats" aria-label="What we measure">
      {stats.map((stat) => (
        <li key={stat.label} className="sus-stat reveal">
          {stat.value ? <strong className="sus-stat__value">{stat.value}</strong> : <FigurePlaceholder />}
          <span className="sus-stat__label">{stat.label}</span>
        </li>
      ))}
    </ul>
  )
}

/** Reserved slot for a figure we have not published yet; replace with the real value before launch. */
function FigurePlaceholder() {
  return (
    <span className="sus-stat__ph">
      <svg className="sus-stat__ph-icon" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3 17h14M5 14V9M10 14V4M15 14v-7" />
      </svg>
      Figure
      <span className="visually-hidden"> to be confirmed</span>
    </span>
  )
}
