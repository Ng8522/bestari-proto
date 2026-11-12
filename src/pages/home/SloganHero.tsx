import { useRef } from 'react'
import { usePrefersReducedMotion } from '../../components/motion'
import { LetterReveal } from '../../components/text'
import { FLOATING_PACKS, SLOGAN } from './data'
import { useMouseParallax } from './useHomeMotion'

const PACK_DEPTHS: readonly number[] = FLOATING_PACKS.map((pack) => pack.depth)

/** 01 Slogan hero: "Mudah dan Sedap!" letter by letter, two packshot chips and four floating packs. */
export function SloganHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const packRefs = useRef<Array<HTMLDivElement | null>>([])
  const isReducedMotion = usePrefersReducedMotion()
  useMouseParallax(sectionRef, packRefs, PACK_DEPTHS, !isReducedMotion)

  return (
    <section className="slogan" id="top" ref={sectionRef}>
      {FLOATING_PACKS.map((pack, index) => (
        <div
          key={pack.slot}
          className={`fl ${pack.slot}`}
          ref={(node) => {
            packRefs.current[index] = node
          }}
        >
          <img src={pack.image} alt="" draggable={false} />
        </div>
      ))}
      <h1 className="words" aria-label={`${SLOGAN.first} ${SLOGAN.middle} ${SLOGAN.last}`}>
        <LetterReveal text={SLOGAN.first} className="w" />
        <span className="mid">
          <span className="chip">
            <img src={SLOGAN.chipLeft} alt="" draggable={false} />
          </span>
          <em>{SLOGAN.middle}</em>
          <span className="chip g">
            <img src={SLOGAN.chipRight} alt="" draggable={false} />
          </span>
        </span>
        <LetterReveal text={SLOGAN.last} startIndex={SLOGAN.lastStartIndex} className="w" />
      </h1>
      <div className="foot-l">
        <div className="wrap">
          <span className="tag">{SLOGAN.captionLeft}</span>
          <span className="tag">{SLOGAN.captionRight}</span>
        </div>
      </div>
    </section>
  )
}
