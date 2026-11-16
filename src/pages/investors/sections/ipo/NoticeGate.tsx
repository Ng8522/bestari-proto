import { useEffect, useId, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { Link } from 'react-router'
import { IR_BASE } from '../../../../content/ir-nav'
import { hasAgreedToIpoNotice, rememberIpoNoticeAgreement } from './consent'
import { IPO_NOTICE, IPO_NOTICE_CONFIRM } from './content'

/** "just-agreed" moves focus to the page content, so keyboard and screen-reader users land on what they unlocked. */
type GateStatus = 'pending' | 'agreed' | 'just-agreed'

interface IpoNoticeGateProps {
  children: ReactNode
}

/** Shows the important notice until the visitor agrees (remembered for the session), then the page itself. */
export function IpoNoticeGate({ children }: IpoNoticeGateProps) {
  const [status, setStatus] = useState<GateStatus>(() => (hasAgreedToIpoNotice() ? 'agreed' : 'pending'))
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'just-agreed') contentRef.current?.focus()
  }, [status])

  function agree() {
    rememberIpoNoticeAgreement()
    setStatus('just-agreed')
  }

  if (status === 'pending') return <ImportantNotice onAgree={agree} />
  return (
    <div className="ipo-content" ref={contentRef} tabIndex={-1}>
      {children}
    </div>
  )
}

interface ImportantNoticeProps {
  onAgree: () => void
}

function ImportantNotice({ onAgree }: ImportantNoticeProps) {
  const titleId = useId()
  return (
    <section className="card ipo-gate" aria-labelledby={titleId}>
      <p className="eyebrow">Before you continue</p>
      <h3 id={titleId}>Important notice</h3>
      <div className="ipo-gate-body">
        {IPO_NOTICE.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="ipo-gate-confirm">{IPO_NOTICE_CONFIRM}</p>
      <div className="ipo-gate-actions">
        <button type="button" className="btn btn-brand" onClick={onAgree}>
          I agree
        </button>
        <Link className="btn btn-ghost" to={IR_BASE}>
          I disagree
        </Link>
      </div>
    </section>
  )
}

/** The page behind the important notice, as a component for the section's page map. */
export function withIpoNoticeGate(Page: ComponentType): ComponentType {
  function GatedPage() {
    return (
      <IpoNoticeGate>
        <Page />
      </IpoNoticeGate>
    )
  }
  GatedPage.displayName = `WithIpoNoticeGate(${Page.displayName ?? Page.name})`
  return GatedPage
}
