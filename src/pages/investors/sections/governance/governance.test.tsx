import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../../../../App'
import { findPage, findSection, irPath } from '../../../../content/ir-nav'
import { DIRECTORS } from '../../content/prospectus'
import {
  ARCHIVE_START_YEAR,
  COMMITTEES,
  GOVERNANCE_DOCUMENTS,
  committeeChair,
  filterDocuments,
  filterMeetings,
  meetingYears,
  type GeneralMeeting,
} from './content'

const SECTION = 'governance'

function pageLabel(pageSlug: string): string {
  const section = findSection(SECTION)
  const page = section ? findPage(section, pageSlug) : undefined
  if (!page) throw new Error(`No IR page ${SECTION}/${pageSlug}`)
  return page.label
}

function renderPage(pageSlug: string): void {
  render(
    <MemoryRouter initialEntries={[irPath(SECTION, pageSlug)]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { level: 2, name: pageLabel(pageSlug) })).toBeInTheDocument()
}

const SAMPLE_MEETINGS: readonly GeneralMeeting[] = [
  { type: 'AGM', title: 'First AGM', isoDate: '2027-06-01', date: '1 Jun 2027', time: '10.00am', venue: 'Online', documents: [] },
  { type: 'EGM', title: 'EGM', isoDate: '2028-02-01', date: '1 Feb 2028', time: '10.00am', venue: 'Online', documents: [] },
]

describe('Governance content', () => {
  it('filters documents by category', () => {
    expect(filterDocuments(GOVERNANCE_DOCUMENTS, 'all')).toHaveLength(13)
    expect(filterDocuments(GOVERNANCE_DOCUMENTS, 'terms').map((doc) => doc.title)).toEqual([
      'Terms of Reference of the Audit and Risk Management Committee',
      'Terms of Reference of the Nomination and Remuneration Committee',
    ])
  })

  it('finds each committee chair among the directors', () => {
    expect(COMMITTEES.map((committee) => committeeChair(committee)?.name)).toEqual([
      'Ow Yin Yee',
      'Low Chin Ann @ Han Chin Ann',
    ])
    expect(committeeChair(COMMITTEES[0], [])).toBeUndefined()
  })

  it('lists archive years newest first, and filters meetings by year and type', () => {
    expect(meetingYears([], ARCHIVE_START_YEAR)).toEqual([String(ARCHIVE_START_YEAR)])
    expect(meetingYears(SAMPLE_MEETINGS, 2027)).toEqual(['2028', '2027', '2026'])
    expect(filterMeetings(SAMPLE_MEETINGS, '2027', 'all').map((meeting) => meeting.title)).toEqual(['First AGM'])
    expect(filterMeetings(SAMPLE_MEETINGS, 'all', 'EGM').map((meeting) => meeting.title)).toEqual(['EGM'])
    expect(filterMeetings(SAMPLE_MEETINGS, '2027', 'EGM')).toEqual([])
  })
})

describe('Governance pages', () => {
  it('Policy Disclosures lists every document as coming soon and filters by category', async () => {
    renderPage('policy-disclosures')
    expect(screen.getByText('Posted on listing')).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Governance documents' })
    expect(within(table).getAllByRole('row')).toHaveLength(GOVERNANCE_DOCUMENTS.length + 1)
    expect(within(table).getAllByText('Coming soon')).toHaveLength(GOVERNANCE_DOCUMENTS.length)
    expect(within(table).getByRole('rowheader', { name: 'Anti-Bribery & Anti-Corruption Policy' })).toBeInTheDocument()
    expect(within(table).queryByRole('link')).not.toBeInTheDocument()

    const category = screen.getByLabelText('Category')
    await userEvent.selectOptions(category, 'terms')
    expect(within(table).getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('Showing 2 of 13 documents')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(category).toHaveValue('all')
    expect(within(table).getAllByRole('row')).toHaveLength(GOVERNANCE_DOCUMENTS.length + 1)
  })

  it('Board Committees shows each committee with its chair, and the board composition', () => {
    renderPage('board-committees')
    const audit = screen.getByRole('region', { name: 'Audit and Risk Management Committee' })
    expect(within(audit).getByText('Ow Yin Yee')).toBeInTheDocument()
    expect(within(audit).getByText('Per prospectus')).toHaveClass('ph')
    expect(within(audit).getByText('Terms of reference')).toBeInTheDocument()
    expect(within(audit).getByText('Coming soon')).toHaveClass('pending')

    const nomination = screen.getByRole('region', { name: 'Nomination and Remuneration Committee' })
    expect(within(nomination).getByText('Low Chin Ann @ Han Chin Ann')).toBeInTheDocument()

    const board = screen.getByRole('table', { name: 'Board of Directors' })
    expect(within(board).getAllByRole('row')).toHaveLength(DIRECTORS.length + 1)
    const chairRow = within(board).getByRole('row', { name: /Badrulnizam Bin Bahaman/ })
    expect(chairRow).toHaveTextContent('Independent Non-Executive Chairman')
    expect(screen.getByText(/4 of 6 directors are independent/)).toBeInTheDocument()
  })

  it('Shareholders Meeting has an empty archive with year and type filters, and the meeting papers', async () => {
    renderPage('shareholders-meeting')
    expect(screen.getByText('First AGM after listing')).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'General meetings' })
    for (const header of ['Meeting', 'Date', 'Time', 'Venue', 'Documents']) {
      expect(within(table).getByRole('columnheader', { name: header })).toBeInTheDocument()
    }
    expect(within(table).getByText(/No general meetings have been held yet/)).toBeInTheDocument()

    const year = screen.getByLabelText('Year')
    expect(within(year).getByRole('option', { name: String(ARCHIVE_START_YEAR) })).toBeInTheDocument()
    await userEvent.selectOptions(year, String(ARCHIVE_START_YEAR))
    expect(within(table).getByText(`No general meetings in ${ARCHIVE_START_YEAR} yet.`)).toBeInTheDocument()

    await userEvent.selectOptions(screen.getByLabelText('Meeting type'), 'AGM')
    expect(within(table).getByText(`No annual general meetings in ${ARCHIVE_START_YEAR} yet.`)).toBeInTheDocument()
    expect(screen.getByText('0 meetings found')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(year).toHaveValue('all')
    expect(screen.getByLabelText('Meeting type')).toHaveValue('all')

    const papers = screen.getByRole('region', { name: 'Papers for each meeting' })
    for (const paper of ['Notice of meeting', 'Form of proxy', 'Administrative guide', 'Minutes', 'Poll results']) {
      expect(within(papers).getByText(paper)).toBeInTheDocument()
    }
  })
})
