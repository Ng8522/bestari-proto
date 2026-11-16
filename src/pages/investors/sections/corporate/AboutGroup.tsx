import type { ReactElement } from 'react'
import { SEGMENTS } from '../../content/financials'

/** What the Group does, in three short paragraphs (the IR company overview copy). */
export function AboutGroup(): ReactElement {
  return (
    <div className="corp-prose">
      <p>
        <b>Bestari Food Berhad</b> is an investment holding company. Through its subsidiaries, the Group sells food
        premixes, supplies food ingredients and food processing and production equipment, and provides spare parts and
        maintenance services.
      </p>
      <p>
        Food premixes are blends of ingredients formulated in specific proportions for food preparation and processing.
        Our products are sold mainly under the <b>Bestari</b> brand, in retail and commercial packs. Retail packs go
        through supermarkets and other retail channels. Larger packs go to food manufacturers and food service operators
        such as hotels, restaurants, cafés and caterers.
      </p>
      <p>
        Our flagship <b>Crispy Fried Chicken Coating Mix</b>, the Multipurpose Crispy Frying Flour Mix, has been sold
        since 2004 and leads its category in Malaysia.
      </p>
    </div>
  )
}

/** The Group's four business activities, numbered. */
export function BusinessActivities(): ReactElement {
  return (
    <ol className="corp-activities">
      {SEGMENTS.map((segment) => (
        <li key={segment.name}>
          <b>{segment.name}</b>
          <span>{segment.description}</span>
        </li>
      ))}
    </ol>
  )
}
