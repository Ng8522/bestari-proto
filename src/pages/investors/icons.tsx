import type { IrIconName } from '../../content/ir-nav'

/** Stroke paths on a 24×24 grid, one per IR section. */
const PATHS: Record<IrIconName, readonly string[]> = {
  home: ['M3 11l9-7 9 7', 'M5 10v10h5v-6h4v6h5V10'],
  building: ['M4 21V5l8-3 8 3v16', 'M9 21v-4h6v4', 'M8 8h2M14 8h2M8 12h2M14 12h2', 'M2 21h20'],
  rocket: ['M12 3c3 2 5 6 5 10l-2 3H9l-2-3c0-4 2-8 5-10z', 'M9 16l-2 4 3-1M15 16l2 4-3-1', 'M12 9.5v.01'],
  gavel: ['M14 4l6 6', 'M11 7l6 6', 'M12.5 5.5l5 5-3 3-5-5z', 'M9.5 11.5L3 18l2 2 6.5-6.5', 'M13 21h8'],
  chart: ['M3 21h18', 'M6 17v-5M11 17V8M16 17v-8M21 17V5'],
  ticker: ['M3 17l5-6 4 3 6-8 3 3', 'M3 21h18'],
  news: ['M4 5h13v14H6a2 2 0 01-2-2z', 'M17 9h3v8a2 2 0 01-2 2', 'M7 9h7M7 13h7M7 16h4'],
  report: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h6M10 17h6'],
  toolbox: ['M3 9h18v10H3z', 'M8 9V6h8v3', 'M3 13h18', 'M11 12v3h2v-3'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
}

/** A decorative section icon; the link text names the section. */
export function IrIcon({ name }: { name: IrIconName }) {
  return (
    <svg className="ir-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
