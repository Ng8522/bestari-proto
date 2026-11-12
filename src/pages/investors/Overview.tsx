import { Ph } from '../../components/text'
import { HIGHLIGHTS } from './content/sections'
import { MD_QUOTE } from './data'
import { IrSection, SectionHead } from './Section'

/** Company description beside the green Managing Director quote card. */
export function Overview() {
  return (
    <IrSection id="overview">
      <SectionHead sectionId="overview" eyebrow="Company overview" title="A leading Malaysian food premix maker." />
      <div className="ov">
        <div className="card ov-text reveal">
          <p>
            <b>Bestari Food Berhad</b> is an investment holding company. Through its subsidiaries, the Group sells food
            premixes, supplies food ingredients and food processing and production equipment, and provides spare parts
            and maintenance services.
          </p>
          <p>
            Food premixes are blends of ingredients formulated in specific proportions for food preparation and
            processing. Our products are sold mainly under the <b>Bestari</b> brand, in retail and commercial packs.
            Retail packs go through supermarkets and other retail channels. Larger packs go to food manufacturers and
            food service operators such as hotels, restaurants, cafés and caterers.
          </p>
          <p>
            Our flagship <b>Crispy Fried Chicken Coating Mix</b>, the Multipurpose Crispy Frying Flour Mix, has been
            sold since 2004 and leads its category in Malaysia.
          </p>
        </div>
        <figure className="card quote reveal">
          <blockquote>{MD_QUOTE.text}</blockquote>
          <figcaption>
            <b>{MD_QUOTE.name}</b>
            <span>{MD_QUOTE.title}</span>
          </figcaption>
        </figure>
      </div>
      <ul className="hl" aria-label="IR highlights">
        {HIGHLIGHTS.map((highlight) => (
          <li key={highlight.label} className="hl-card reveal">
            <p className="eyebrow">{highlight.label}</p>
            <b className="hl-title">{highlight.title}</b>
            <span className="hl-meta">{highlight.isMetaPlaceholder ? <Ph>{highlight.meta}</Ph> : highlight.meta}</span>
            <a className="hl-link" href={highlight.href}>
              {highlight.cta} <span aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
    </IrSection>
  )
}
