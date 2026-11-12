import { Fragment, useCallback, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../components/motion'
import { PURPOSE_SEGMENTS, type PurposeSegment } from './data'
import { clamp, useScrollFrame } from './useScrollFrame'

type PurposeToken = { kind: 'space'; text: string } | { kind: 'word'; text: string; index: number }

interface PurposeGroup {
  isHighlight: boolean
  tokens: PurposeToken[]
}

interface TokenizedStatement {
  groups: PurposeGroup[]
  wordCount: number
}

/** Splits each run on whitespace, numbering the words across the whole statement. */
function tokenize(segments: readonly PurposeSegment[]): TokenizedStatement {
  let wordCount = 0
  const groups = segments.map((segment) => {
    const tokens = segment.text
      .split(/(\s+)/)
      .filter((part) => part !== '')
      .map((part): PurposeToken => {
        if (/^\s+$/.test(part)) return { kind: 'space', text: part }
        wordCount += 1
        return { kind: 'word', text: part, index: wordCount - 1 }
      })
    return { isHighlight: segment.isHighlight ?? false, tokens }
  })
  return { groups, wordCount }
}

const STATEMENT = tokenize(PURPOSE_SEGMENTS)
/** The handoff's mapping: lighting starts when the top reaches 85% of the viewport. */
const START_AT = 0.85
const EXTRA_TRAVEL = 0.35

function renderTokens(tokens: PurposeToken[], litCount: number) {
  return tokens.map((token) =>
    token.kind === 'space' ? (
      token.text
    ) : (
      <span key={token.index} className={token.index < litCount ? 'word on' : 'word'}>
        {token.text}
      </span>
    ),
  )
}

/** 02 Purpose statement: words light up in reading order as the paragraph scrolls through the viewport. */
export function PurposeSection() {
  const isReducedMotion = usePrefersReducedMotion()
  const lineRef = useRef<HTMLParagraphElement>(null)
  const [litCount, setLitCount] = useState(0)

  const updateLitCount = useCallback(() => {
    const line = lineRef.current
    if (!line) return
    const rect = line.getBoundingClientRect()
    const viewport = window.innerHeight
    const progress = clamp((viewport * START_AT - rect.top) / (rect.height + viewport * EXTRA_TRAVEL), 0, 1)
    setLitCount(Math.round(progress * STATEMENT.wordCount))
  }, [])

  useScrollFrame(updateLitCount, !isReducedMotion)
  const shownCount = isReducedMotion ? STATEMENT.wordCount : litCount

  return (
    <section className="purpose" aria-label="Our purpose">
      <div className="wrap wrap--wide">
        <div className="eyebrow">Our purpose</div>
        <p className="big" ref={lineRef}>
          {STATEMENT.groups.map((group, groupIndex) =>
            group.isHighlight ? (
              <span key={groupIndex} className="hl">
                {renderTokens(group.tokens, shownCount)}
              </span>
            ) : (
              <Fragment key={groupIndex}>{renderTokens(group.tokens, shownCount)}</Fragment>
            ),
          )}
        </p>
      </div>
    </section>
  )
}
