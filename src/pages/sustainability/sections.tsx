import { COMMITMENT, CONTACT, HERO, PILLARS, REPORTS, REPORTS_SECTION, type SustainabilityReport } from './data'
import { PillarRing } from './PillarRing'

/** Photo on the left, brand-green panel on the right with the title and a jump to the reports. */
export function HeroSection() {
  return (
    <section className="sus-hero" aria-labelledby="sus-hero-title">
      <img className="sus-hero__photo" src={HERO.image.src} alt={HERO.image.alt} />
      <div className="sus-hero__panel">
        <p className="eyebrow sus-hero__eyebrow">{HERO.eyebrow}</p>
        <h1 id="sus-hero-title">{HERO.title}</h1>
        <p className="sus-hero__lede">{HERO.lede}</p>
        <div className="sus-hero__actions">
          <a className="btn btn-saffron" href={`#${REPORTS_SECTION.id}`}>
            Our sustainability reporting <span className="arr" aria-hidden="true">↓</span>
          </a>
          <a className="btn btn-ghost" href={`#${PILLARS[0].id}`}>
            Explore our pillars
          </a>
        </div>
      </div>
    </section>
  )
}

/** Commitment copy and pillar links, beside the ring diagram. */
export function CommitmentSection() {
  return (
    <section className="sus-commit" aria-labelledby="sus-commit-title">
      <div className="wrap sus-commit__grid">
        <div className="sus-commit__copy">
          <h2 id="sus-commit-title" className="reveal">
            {COMMITMENT.title}
          </h2>
          {COMMITMENT.body.map((paragraph) => (
            <p key={paragraph} className="reveal">
              {paragraph}
            </p>
          ))}
          <nav aria-label="Sustainability pillars">
            <ol className="sus-commit__pillars">
              {PILLARS.map((pillar) => (
                <li key={pillar.id} className="reveal">
                  <a className={`sus-chip sus-tone--${pillar.tone}`} href={`#${pillar.id}`}>
                    <span className="sus-chip__num">{pillar.number}</span>
                    {pillar.short}
                    <span className="arr" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className="sus-commit__ring reveal">
          <PillarRing />
        </div>
      </div>
    </section>
  )
}

/** Report downloads (or "coming soon" until published), then the enquiry email. */
export function ReportsSection() {
  return (
    <section id={REPORTS_SECTION.id} className="sus-reports" aria-labelledby="sus-reports-title">
      <div className="wrap">
        <div className="sus-reports__grid">
          <div className="reveal">
            <p className="eyebrow">Reports</p>
            <h2 id="sus-reports-title">{REPORTS_SECTION.title}</h2>
            <p className="sus-reports__lede">{REPORTS_SECTION.lede}</p>
          </div>
          <ul className="sus-reports__list">
            {REPORTS.map((report) => (
              <li key={report.title} className="reveal">
                <ReportItem report={report} />
              </li>
            ))}
          </ul>
        </div>
        <div className="sus-contact reveal">
          <div>
            <h3>{CONTACT.title}</h3>
            <p>{CONTACT.text}</p>
          </div>
          <a className="btn btn-brand" href={CONTACT.link.href}>
            Email {CONTACT.link.label} <span className="arr" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function ReportItem({ report }: { report: SustainabilityReport }) {
  if (!report.href) {
    return (
      <div className="sus-report sus-report--pending">
        <span className="sus-report__title">{report.title}</span>
        <span className="sus-report__note">{report.note}</span>
        <span className="sus-report__status">Coming soon</span>
      </div>
    )
  }
  return (
    <a className="sus-report" href={report.href} target="_blank" rel="noopener noreferrer">
      <span className="sus-report__title">{report.title}</span>
      <span className="sus-report__note">{report.note}</span>
      <span className="sus-report__status">
        Download PDF <span aria-hidden="true">↓</span>
      </span>
    </a>
  )
}
