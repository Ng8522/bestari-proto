import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { Ph } from '../../components/text'
import { LEADERS, type Leader } from './data'

/** Movement beyond this counts as a drag, and the click that ends it is swallowed. */
const DRAG_THRESHOLD_PX = 5

interface DragState {
  startX: number
  startScroll: number
  hasMoved: boolean
}

interface DragScrollHandlers {
  isDragging: boolean
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  onClickCapture: (event: ReactMouseEvent<HTMLElement>) => void
}

/** Mouse/pen drag sets scrollLeft (touch keeps native scrolling). Clicks right after a drag are suppressed. */
function useDragScroll(trackRef: RefObject<HTMLElement | null>): DragScrollHandlers {
  const dragRef = useRef<DragState | null>(null)
  const shouldSuppressClickRef = useRef(false)
  const [isDragging, setDragging] = useState(false)

  useEffect(() => {
    if (!isDragging) return
    const handleMove = (event: PointerEvent) => {
      const drag = dragRef.current
      const track = trackRef.current
      if (!drag || !track) return
      const delta = event.clientX - drag.startX
      if (!drag.hasMoved && Math.abs(delta) > DRAG_THRESHOLD_PX) dragRef.current = { ...drag, hasMoved: true }
      track.scrollLeft = drag.startScroll - delta
    }
    const handleUp = (event: PointerEvent) => {
      const endedInside = event.target instanceof Node && (trackRef.current?.contains(event.target) ?? false)
      shouldSuppressClickRef.current = endedInside && (dragRef.current?.hasMoved ?? false)
      dragRef.current = null
      setDragging(false)
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [isDragging, trackRef])

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    const track = trackRef.current
    if (!track || event.pointerType === 'touch' || event.button !== 0) return
    dragRef.current = { startX: event.clientX, startScroll: track.scrollLeft, hasMoved: false }
    shouldSuppressClickRef.current = false
    setDragging(true)
  }

  const onClickCapture = (event: ReactMouseEvent<HTMLElement>) => {
    if (!shouldSuppressClickRef.current) return
    shouldSuppressClickRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  return { isDragging, onPointerDown, onClickCapture }
}

interface LeaderCardProps {
  leader: Leader
}

function LeaderCard({ leader }: LeaderCardProps) {
  return (
    <div className="pc">
      <div className="por" style={{ background: leader.background }} aria-hidden="true">
        [ portrait ]
      </div>
      <h3>{leader.name}</h3>
      {leader.isRolePlaceholder ? <Ph>{leader.role}</Ph> : <span>{leader.role}</span>}
    </div>
  )
}

/** 09 Leadership: a drag-to-scroll strip that is also focusable and scrolls with the arrow keys. */
export function LeadershipSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { isDragging, onPointerDown, onClickCapture } = useDragScroll(trackRef)

  return (
    <section className="people" aria-labelledby="people-title">
      <div className="wrap wrap--wide">
        <div className="hd">
          <div>
            <div className="eyebrow">Meet the people</div>
            <h2 id="people-title">Leading the way.</h2>
          </div>
          <div className="hint" aria-hidden="true">
            <i>DRAG</i>to explore
          </div>
        </div>
      </div>
      <div
        className={isDragging ? 'ptrack is-dragging' : 'ptrack'}
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Leadership team, scrolls sideways"
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
      >
        {LEADERS.map((leader) => (
          <LeaderCard key={leader.name} leader={leader} />
        ))}
      </div>
    </section>
  )
}
