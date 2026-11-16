import { useState } from 'react'

export interface PageSlice<T> {
  /** 1-based, always within 1..pageCount. */
  page: number
  pageCount: number
  pageItems: readonly T[]
  setPage: (page: number) => void
}

/** Client-side paging; the current page is clamped when the list shrinks (e.g. after filtering). */
export function usePagination<T>(items: readonly T[], pageSize: number): PageSlice<T> {
  const [requestedPage, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(Math.max(1, requestedPage), pageCount)
  const start = (page - 1) * pageSize
  return { page, pageCount, pageItems: items.slice(start, start + pageSize), setPage }
}

interface PaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
  /** e.g. "Announcements pages". */
  label: string
}

/** Previous, numbered pages and next. Renders nothing for a single page. */
export function Pagination({ page, pageCount, onChange, label }: PaginationProps) {
  if (pageCount <= 1) return null
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)
  return (
    <nav className="pagination" aria-label={label}>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1}>
        <span aria-hidden="true">←</span> Previous
      </button>
      {pages.map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? 'page' : undefined}
          aria-label={`Page ${number}`}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount}>
        Next <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}
