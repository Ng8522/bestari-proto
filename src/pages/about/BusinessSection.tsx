import { useState } from 'react'
import { asset } from '../../content/site'
import { BUSINESS_PANELS, type BusinessPanel } from './data'

interface PanelProps {
  panel: BusinessPanel
  isActive: boolean
  onActivate: () => void
}

/**
 * One expanding panel. The title is a real button whose hit area stretches over the whole panel,
 * so a click anywhere, Enter or Space activates it; hovering the panel activates it too.
 */
function Panel({ panel, isActive, onActivate }: PanelProps) {
  const bodyId = `biz-panel-${panel.id}`
  return (
    <div className={isActive ? 'pn on' : 'pn'} style={{ background: panel.background }} onMouseEnter={onActivate}>
      {panel.image ? <img src={asset(panel.image)} alt="" /> : null}
      {panel.photoPlaceholder ? (
        <div className="ph-i" aria-hidden="true">
          {panel.photoPlaceholder}
        </div>
      ) : null}
      <span className="k">{panel.number}</span>
      <div>
        <h3>
          <button type="button" className="pn__btn" aria-expanded={isActive} aria-controls={bodyId} onClick={onActivate}>
            {panel.title}
          </button>
        </h3>
        <p id={bodyId}>{panel.body}</p>
      </div>
    </div>
  )
}

/** 06 What we do: four panels; the active one grows to flex 2.6 and reveals its copy and image. */
export function BusinessSection() {
  const [activeId, setActiveId] = useState(BUSINESS_PANELS[0].id)

  return (
    <section className="biz" aria-labelledby="biz-title">
      <div className="wrap wrap--wide">
        <div className="hd">
          <div>
            <div className="eyebrow">What we do</div>
            <h2 id="biz-title">
              More than a<br />
              flour mix.
            </h2>
          </div>
          <p>Bestari Food Berhad is an investment holding company. Its subsidiaries cover four business activities.</p>
        </div>
        <div className="panels">
          {BUSINESS_PANELS.map((panel) => (
            <Panel
              key={panel.id}
              panel={panel}
              isActive={panel.id === activeId}
              onActivate={() => setActiveId(panel.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
