import type { CSSProperties, ReactNode } from 'react'

interface LetterRevealProps {
  text: string
  /** Stagger index of the first letter, so several pieces can animate as one sequence. */
  startIndex?: number
  className?: string
}

/**
 * Splits text into letters that rise in one after another (50ms stagger, see .lr__ch in theme.css).
 * Screen readers get the plain text once; the animated letters are hidden from them.
 */
export function LetterReveal({ text, startIndex = 0, className }: LetterRevealProps) {
  const letters = Array.from(text)
  return (
    <span className={className ? `lr ${className}` : 'lr'}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {letters.map((letter, index) =>
          letter === ' ' ? (
            ' '
          ) : (
            <span
              key={`${letter}-${index}`}
              className="lr__ch"
              style={{ '--i': startIndex + index } as CSSProperties}
            >
              {letter}
            </span>
          ),
        )}
      </span>
    </span>
  )
}

/** Dashed marker for content that must be replaced before launch (the handoff's .ph style). */
export function Ph({ children }: { children: ReactNode }) {
  return <span className="ph">{children}</span>
}
