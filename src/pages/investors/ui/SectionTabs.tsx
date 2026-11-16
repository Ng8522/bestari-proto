import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useLocation } from 'react-router'
import { safeDecode } from '../../../components/routing'
import { Tabs, tabPanelId, type TabItem } from '../Tabs'
import { PAGE_TITLE_ID } from './PageParts'

/** Prefix of the tab and panel ids; a page has one set of section tabs. */
const SECTION_TABS_PREFIX = 'ir-section'

export type SectionTab<T extends string = string> = TabItem<T>

interface SectionTabsProps<T extends string> {
  tabs: readonly SectionTab<T>[]
  /** Id of the heading that names the tabs; defaults to the sub-page title. */
  labelledBy?: string
  /** Set (with onActiveChange) when the page itself needs to switch tabs, e.g. after a button in another tab. */
  activeId?: T
  onActiveChange?: (id: T) => void
}

/**
 * Shows one section of a page at a time under an underlined tab strip, so pages stay short instead of stacking
 * every section. Page-wide notices go above the tabs; everything else goes in a tab. A link to an element inside
 * a hidden tab (e.g. /terms-of-use#terms-privacy) opens that tab and scrolls to the element.
 */
export function SectionTabs<T extends string>({
  tabs,
  labelledBy = PAGE_TITLE_ID,
  activeId,
  onActiveChange,
}: SectionTabsProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [ownActiveId, setOwnActiveId] = useState<T>(tabs[0].id)
  const select = (id: T) => {
    setOwnActiveId(id)
    onActiveChange?.(id)
  }
  useOpenTabForHash(rootRef, tabs, select)
  useStripOverflowHint(rootRef)

  return (
    <div ref={rootRef} className="section-tabs">
      <Tabs
        idPrefix={SECTION_TABS_PREFIX}
        labelledBy={labelledBy}
        tabs={tabs}
        variant="line"
        activeId={activeId ?? ownActiveId}
        onActiveChange={select}
      />
    </div>
  )
}

/** Room left beside a tab brought into view, so the faded edge never covers it. */
const STRIP_EDGE_PX = 48

const stripOf = (root: HTMLElement | null) => root?.querySelector<HTMLElement>('[role="tablist"]') ?? null

/** Scrolls the strip sideways (never the page) so the tab is fully in view, clear of the faded edges. */
function revealTab(strip: HTMLElement, tab: Element): void {
  if (typeof strip.scrollBy !== 'function') return
  const box = strip.getBoundingClientRect()
  const { left, right } = tab.getBoundingClientRect()
  if (left < box.left) strip.scrollBy({ left: left - box.left - STRIP_EDGE_PX })
  else if (right > box.right) strip.scrollBy({ left: right - box.right + STRIP_EDGE_PX })
}

/**
 * On phones the tab strip scrolls sideways. Marks which edges have more tabs (CSS fades them, so visitors can tell
 * there is more) and scrolls a tab fully into view when it gets focus (clicked, or reached with the arrow keys).
 */
function useStripOverflowHint(rootRef: RefObject<HTMLDivElement | null>): void {
  useEffect(() => {
    const strip = stripOf(rootRef.current)
    if (!strip) return
    const update = () => {
      const end = strip.scrollWidth - strip.clientWidth
      strip.toggleAttribute('data-more-start', strip.scrollLeft > 1)
      strip.toggleAttribute('data-more-end', strip.scrollLeft < end - 1)
    }
    const reveal = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) revealTab(strip, event.target)
    }
    update()
    strip.addEventListener('scroll', update, { passive: true })
    strip.addEventListener('focusin', reveal)
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    resizeObserver?.observe(strip)
    return () => {
      strip.removeEventListener('scroll', update)
      strip.removeEventListener('focusin', reveal)
      resizeObserver?.disconnect()
    }
  }, [rootRef])
}

/** When the URL hash names an element in a hidden tab, selects that tab, then scrolls the element into view. */
function useOpenTabForHash<T extends string>(
  rootRef: RefObject<HTMLDivElement | null>,
  tabs: readonly SectionTab<T>[],
  select: (id: T) => void,
): void {
  // `key` changes on every navigation, so following the same #link again (after switching tabs) still works.
  const { hash, key } = useLocation()
  const pendingScrollId = useRef<string | null>(null)
  // Read through a ref so the effect below runs only on navigation, not on every tab click.
  const latest = useRef({ tabs, select })
  useLayoutEffect(() => {
    latest.current = { tabs, select }
  })

  useLayoutEffect(() => {
    pendingScrollId.current = null
    const id = hash ? safeDecode(hash.slice(1)) : ''
    const panel = id ? document.getElementById(id)?.closest<HTMLElement>('.tab-panel--line') : null
    if (!panel || !panel.hidden || !rootRef.current?.contains(panel)) return
    const tab = latest.current.tabs.find((entry) => panel.id === tabPanelId(SECTION_TABS_PREFIX, entry.id))
    if (!tab) return
    pendingScrollId.current = id
    latest.current.select(tab.id)
  }, [hash, key, rootRef])

  // Runs after the re-render that shows the tab; the page-level scroll ran while the element was still hidden.
  useLayoutEffect(() => {
    const id = pendingScrollId.current
    const target = id ? document.getElementById(id) : null
    if (!target || target.closest('[hidden]')) return
    pendingScrollId.current = null
    const strip = stripOf(rootRef.current)
    const selected = strip?.querySelector('[aria-selected="true"]')
    if (strip && selected) revealTab(strip, selected)
    // Jump (not the site's smooth scroll): the visitor followed a link here, so land on the target straight away.
    if (typeof target.scrollIntoView === 'function') target.scrollIntoView({ block: 'start', behavior: 'instant' })
  })
}
