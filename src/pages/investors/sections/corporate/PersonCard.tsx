import { useId, type ReactElement } from 'react'
import { Ph } from '../../../../components/text'
import { initials, type ChipTone, type PersonFact, type PersonProfile } from './content'

const CHIP_CLASS: Readonly<Record<ChipTone, string>> = {
  independent: 'chip chip--done',
  executive: 'chip chip--exec',
  neutral: 'chip',
}

interface PersonCardProps {
  profile: PersonProfile
}

/** A director or manager: initials avatar, name, role, category chips, key facts and an expandable full profile. */
export function PersonCard({ profile }: PersonCardProps): ReactElement {
  const nameId = useId()
  return (
    <article className="card person" aria-labelledby={nameId}>
      <div className="person-head">
        <span className="person-avatar" aria-hidden="true">
          {initials(profile.name)}
        </span>
        <div>
          <h3 id={nameId} className="person-name">
            {profile.name}
          </h3>
          <p className="person-role">{profile.designation}</p>
          {profile.chips.length > 0 && (
            <ul className="person-chips" aria-label={`About ${profile.name}`}>
              {profile.chips.map((chip) => (
                <li key={chip.label} className={CHIP_CLASS[chip.tone]}>
                  {chip.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <dl className="person-facts">
        {profile.facts.map((fact) => (
          <FactItem key={fact.label} fact={fact} />
        ))}
      </dl>
      <ProfileDetails profile={profile} />
    </article>
  )
}

function FactItem({ fact }: { fact: PersonFact }) {
  return (
    <div className={fact.isWide ? 'person-fact person-fact--wide' : 'person-fact'}>
      <dt>{fact.label}</dt>
      <dd>{fact.isPlaceholder ? <Ph>{fact.value}</Ph> : fact.value}</dd>
    </div>
  )
}

/** Qualifications and background, folded away under "Full profile". */
function ProfileDetails({ profile }: PersonCardProps) {
  return (
    <details className="person-more">
      <summary>
        Full profile<span className="visually-hidden"> of {profile.name}</span>
      </summary>
      <div className="person-more-body">
        <ProfileList title="Qualifications" items={profile.qualifications} />
        {profile.notes.length > 0 && <ProfileList title="Background" items={profile.notes} />}
      </div>
    </details>
  )
}

interface ProfileListProps {
  title: string
  items: readonly string[]
}

function ProfileList({ title, items }: ProfileListProps) {
  return (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

interface PersonGridProps {
  /** Accessible name of the list, e.g. "Board of Directors". */
  label: string
  profiles: readonly PersonProfile[]
}

/** Person cards in a responsive grid. */
export function PersonGrid({ label, profiles }: PersonGridProps): ReactElement {
  return (
    <ul className="person-grid" aria-label={label}>
      {profiles.map((profile) => (
        <li key={profile.name}>
          <PersonCard profile={profile} />
        </li>
      ))}
    </ul>
  )
}
