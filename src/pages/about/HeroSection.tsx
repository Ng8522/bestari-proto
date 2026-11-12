import { LetterReveal } from '../../components/text'
import { asset } from '../../content/site'
import { HERO_CAPTIONS, HERO_LINES, HERO_PACKS } from './data'

/** The second line continues the first line's 50ms letter stagger (the handoff's data-d=".3"). */
const SECOND_LINE_START = Array.from(HERO_LINES.first).length

/** 01 Saffron hero: "We are / Bestari." rises letter by letter while six packs pop in and bob. */
export function HeroSection() {
  return (
    <section className="ah" aria-labelledby="about-hero-title">
      {HERO_PACKS.map((pack) => (
        <div key={pack.id} className={`pk ${pack.id}`} aria-hidden="true">
          <img src={asset(pack.file)} alt="" />
        </div>
      ))}
      <h1 id="about-hero-title">
        <span className="s1">
          <LetterReveal text={HERO_LINES.first} />
        </span>{' '}
        <span className="s2">
          <LetterReveal text={HERO_LINES.second} startIndex={SECOND_LINE_START} />
        </span>
      </h1>
      <div className="sub">
        <div className="wrap wrap--wide">
          {HERO_CAPTIONS.map((caption) => (
            <span key={caption}>{caption}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
