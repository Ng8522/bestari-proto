import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Ph } from '../../components/text'
import type { InfoEntry } from './content/sections'

const KEY_STEPS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_index, count) => count - 1,
}

export interface TabItem<T extends string> {
  id: T
  label: string
  content: ReactNode
}

/** 'pill' switches views inside a card; 'line' is the underlined strip that splits a whole page into sections. */
export type TabsVariant = 'pill' | 'line'

interface TabsProps<T extends string> {
  /** Unique per tab group on the page; prefixes the tab and panel ids. */
  idPrefix: string
  /** Id of the heading that names the tab list. */
  labelledBy: string
  tabs: readonly TabItem<T>[]
  variant?: TabsVariant
  /** Set to control the selected tab from outside; otherwise the tabs keep their own state. */
  activeId?: T
  /** Called whenever the visitor picks a tab. */
  onActiveChange?: (id: T) => void
}

/** Id of a tab's panel, e.g. to find which tab holds an element. */
export function tabPanelId(idPrefix: string, id: string): string {
  return `${idPrefix}-panel-${id}`
}

/** WAI-ARIA tabs (automatic activation): arrow keys, Home and End move between tabs. */
export function Tabs<T extends string>({
  idPrefix,
  labelledBy,
  tabs,
  variant = 'pill',
  activeId: controlledId,
  onActiveChange,
}: TabsProps<T>) {
  const [ownActiveId, setOwnActiveId] = useState<T>(tabs[0].id)
  const activeId = controlledId ?? ownActiveId
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const tabId = (id: T) => `${idPrefix}-tab-${id}`
  const panelId = (id: T) => tabPanelId(idPrefix, id)

  function setActiveId(id: T) {
    setOwnActiveId(id)
    onActiveChange?.(id)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = KEY_STEPS[event.key]
    if (!step) return
    event.preventDefault()
    const nextIndex = step(index, tabs.length)
    setActiveId(tabs[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <>
      <div className={variant === 'line' ? 'tabs-line' : 'tabs'} role="tablist" aria-labelledby={labelledBy}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={isActive}
              aria-controls={panelId(tab.id)}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={variant === 'line' ? 'tab-panel tab-panel--line' : 'tab-panel'}
          role="tabpanel"
          id={panelId(tab.id)}
          aria-labelledby={tabId(tab.id)}
          hidden={tab.id !== activeId}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </>
  )
}

/** Shown where nothing is published yet (Bestari is pre-listing). */
export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>
}

interface InfoListProps {
  entries: readonly InfoEntry[]
  className?: string
}

/** Label / value pairs; placeholder values render dashed until confirmed. */
export function InfoList({ entries, className }: InfoListProps) {
  return (
    <dl className={className ? `info ${className}` : 'info'}>
      {entries.map((entry) => (
        <div key={entry.label}>
          <dt>{entry.label}</dt>
          <dd>{entry.isPlaceholder ? <Ph>{entry.value}</Ph> : entry.value}</dd>
        </div>
      ))}
    </dl>
  )
}
