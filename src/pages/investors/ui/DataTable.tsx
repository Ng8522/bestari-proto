import type { ReactNode } from 'react'
import type { IrDocument } from '../data'
import { Pending } from './PageParts'

type Align = 'left' | 'right' | 'center'

export interface Column<Row> {
  key: string
  header: string
  render: (row: Row) => ReactNode
  /** Text alignment; numbers read best right-aligned. Defaults to left. */
  align?: Align
  /** Marks the cell as the row's header (<th scope="row">), e.g. the name column. */
  isRowHeader?: boolean
}

interface DataTableProps<Row> {
  /** Names the table for screen readers (and the scroll region). Shown when `isCaptionVisible`. */
  caption: string
  columns: readonly Column<Row>[]
  rows: readonly Row[]
  rowKey: (row: Row, index: number) => string
  /** Shown in a single full-width row when there are no rows. */
  emptyMessage?: ReactNode
  isCaptionVisible?: boolean
  /** Below this width (px) the table scrolls sideways instead of squashing. */
  minWidth?: number
  /** Extra class for a row, e.g. 'is-total' for a bold total line. */
  rowClassName?: (row: Row) => string | undefined
}

const DEFAULT_MIN_WIDTH = 560

/** An accessible data table in a horizontally scrolling region, with an empty-state row. */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
  emptyMessage = 'Nothing to show yet.',
  isCaptionVisible = false,
  minWidth = DEFAULT_MIN_WIDTH,
  rowClassName,
}: DataTableProps<Row>) {
  return (
    <div className="table-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table className="data-table ir-table" style={{ minWidth }}>
        <caption className={isCaptionVisible ? 'table-caption' : 'visually-hidden'}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={`al-${column.align ?? 'left'}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="data-table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <TableRow key={rowKey(row, index)} row={row} columns={columns} className={rowClassName?.(row)} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

interface TableRowProps<Row> {
  row: Row
  columns: readonly Column<Row>[]
  className?: string
}

function TableRow<Row>({ row, columns, className }: TableRowProps<Row>) {
  return (
    <tr className={className}>
      {columns.map((column) => {
        const className = `al-${column.align ?? 'left'}`
        return column.isRowHeader ? (
          <th key={column.key} scope="row" className={className}>
            {column.render(row)}
          </th>
        ) : (
          <td key={column.key} className={className}>
            {column.render(row)}
          </td>
        )
      })}
    </tr>
  )
}

/** "View" and "Download" links for a published file, or a muted pill until it is published. */
export function DocActions({ doc }: { doc: IrDocument }) {
  if (!doc.href) return <Pending>{doc.meta === 'TBA' ? 'Coming soon' : 'Not yet published'}</Pending>
  return (
    <span className="doc-actions">
      <a href={doc.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${doc.title}`}>
        View
      </a>
      <a href={doc.href} download aria-label={`Download ${doc.title} (${doc.format})`}>
        Download
      </a>
    </span>
  )
}

const DOC_COLUMNS: readonly Column<IrDocument>[] = [
  { key: 'title', header: 'Document', render: (doc) => doc.title, isRowHeader: true },
  { key: 'meta', header: 'Date', render: (doc) => doc.meta },
  { key: 'format', header: 'Format', render: (doc) => doc.format, align: 'center' },
  { key: 'actions', header: 'View / download', render: (doc) => <DocActions doc={doc} />, align: 'right' },
]

interface DocTableProps {
  caption: string
  documents: readonly IrDocument[]
  emptyMessage?: ReactNode
}

/** Documents with their date, format and View / Download links (the Bursa IR "policy disclosures" layout). */
export function DocTable({ caption, documents, emptyMessage }: DocTableProps) {
  return (
    <DataTable
      caption={caption}
      columns={DOC_COLUMNS}
      rows={documents}
      rowKey={(doc, index) => `${index}-${doc.title}`}
      emptyMessage={emptyMessage}
    />
  )
}
