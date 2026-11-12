import { useRef, useState, type KeyboardEvent } from 'react'
import { useScrollReveal } from '../../components/motion'
import { useDocumentTitle } from '../../components/routing'
import { DISTRIBUTOR_GROUPS, type Distributor, type DistributorGroup } from '../../content/catalogue'
import { COMPANY } from '../../content/site'
import './where-to-buy.css'

type GroupId = DistributorGroup['id']

const KEY_STEPS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_index, count) => count - 1,
}

/** Distributor finder (real data from the current site), styled in the handoff's visual language. */
export function WhereToBuyPage() {
  useDocumentTitle('Onsite Outlets')
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollReveal(rootRef)
  const [activeId, setActiveId] = useState<GroupId>(DISTRIBUTOR_GROUPS[0].id)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  // WAI-ARIA tabs: arrow keys move between tabs and show their panel straight away.
  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = KEY_STEPS[event.key]
    if (!step) return
    event.preventDefault()
    const nextIndex = step(index, DISTRIBUTOR_GROUPS.length)
    setActiveId(DISTRIBUTOR_GROUPS[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="wtb" ref={rootRef}>
      <section className="wtb__hero">
        <div className="wrap">
          <p className="eyebrow reveal">Onsite Outlets</p>
          <h1 className="reveal">Find Bestari near you.</h1>
          <p className="wtb__lede reveal">
            Bestari reaches shops and kitchens through distributors across Malaysia and abroad. Choose how you buy.
          </p>
        </div>
      </section>

      <section className="wtb__list" aria-label="Distributors">
        <div className="wrap">
          <div className="wtb__tabs" role="tablist" aria-label="How you buy">
            {DISTRIBUTOR_GROUPS.map((group, index) => {
              const isActive = group.id === activeId
              return (
                <button
                  key={group.id}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  className="wtb__tab"
                  id={`tab-${group.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${group.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(group.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {group.title}
                  <span className="wtb__count">{group.distributors.length}</span>
                </button>
              )
            })}
          </div>

          {DISTRIBUTOR_GROUPS.map((group) => (
            <div
              key={group.id}
              className="wtb__panel"
              role="tabpanel"
              id={`panel-${group.id}`}
              aria-labelledby={`tab-${group.id}`}
              hidden={group.id !== activeId}
              tabIndex={0}
            >
              <p className="wtb__description">{group.description}</p>
              <ul className="wtb__cards">
                {group.distributors.map((distributor) => (
                  <DistributorCard key={`${group.id}-${distributor.name}`} distributor={distributor} />
                ))}
              </ul>
              {group.note && <p className="wtb__note">{group.note}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" aria-label="Stock Bestari">
        <div className="wtb__cta reveal">
          <h2>Want to stock Bestari?</h2>
          <p>Retailers, restaurants and resellers: tell us where you are and we’ll connect you with a distributor.</p>
          <a className="btn btn-saffron" href={COMPANY.email.href}>
            Email {COMPANY.email.label} <span className="arr" aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  )
}

function DistributorCard({ distributor }: { distributor: Distributor }) {
  return (
    <li className="wtb__card">
      <p className="eyebrow">{distributor.region}</p>
      <h2 className="wtb__name">{distributor.name}</h2>
      <p className="wtb__address">{distributor.address}</p>
      {distributor.phones.length > 0 && (
        <p className="wtb__phones">
          {distributor.phones.map((phone) => (
            <a key={phone.href} href={phone.href}>
              {phone.label}
            </a>
          ))}
        </p>
      )}
    </li>
  )
}
