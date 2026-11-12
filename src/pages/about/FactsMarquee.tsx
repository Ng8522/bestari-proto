import { usePrefersReducedMotion } from '../../components/motion'
import { MARQUEE_FACTS } from './data'

/**
 * 07 Maroon marquee of facts separated by ✺. The list is drawn twice for a seamless loop;
 * the copy is hidden from assistive tech. With reduced motion it is a single, static, wrapping row.
 */
export function FactsMarquee() {
  const isReducedMotion = usePrefersReducedMotion()

  return (
    <div className={isReducedMotion ? 'mq mq--static' : 'mq'}>
      <ul className="t" aria-label="Bestari at a glance">
        {MARQUEE_FACTS.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
        {isReducedMotion
          ? null
          : MARQUEE_FACTS.map((fact) => (
              <li key={`loop-${fact}`} aria-hidden="true">
                {fact}
              </li>
            ))}
      </ul>
    </div>
  )
}
