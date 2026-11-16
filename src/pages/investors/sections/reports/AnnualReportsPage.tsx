import { useId } from 'react'
import { Link } from 'react-router'
import { Ph } from '../../../../components/text'
import { irPath } from '../../../../content/ir-nav'
import { CORPORATE_DIRECTORY, FINANCIAL_YEAR_LABELS, PROSPECTUS_SOURCE } from '../../content/prospectus'
import { DocActions } from '../../ui/DataTable'
import { Notice, Panel, Pending } from '../../ui/PageParts'
import { ANNUAL_REPORT_YEARS, type AnnualReportYear } from './content'
import { ANNUAL_REPORT_MONTHS, FINANCIAL_YEAR_END, deadlineAfterYearEnd } from './reporting'

const AUDITORS = CORPORATE_DIRECTORY.find((entry) => entry.label.startsWith('Auditors'))?.lines[0]
const FIRST_AUDITED_YEAR = FINANCIAL_YEAR_LABELS[0]
const LATEST_AUDITED_YEAR = FINANCIAL_YEAR_LABELS[FINANCIAL_YEAR_LABELS.length - 1]
const REPORT_DUE = deadlineAfterYearEnd(ANNUAL_REPORT_MONTHS)

/** Reports & Presentations › Annual Reports: one card per financial year, each with its set of documents. */
export function AnnualReportsPage() {
  return (
    <>
      <Notice tone="pending" title="No annual report published yet">
        Our first annual report as a listed company will be published here after our listing on Bursa Malaysia.
        Main Market companies issue their annual report within {ANNUAL_REPORT_MONTHS} months of the financial year
        end; ours is {FINANCIAL_YEAR_END}, so each report is due by the end of {REPORT_DUE.month}
        {REPORT_DUE.isFollowingYear ? ' of the following year' : ''}.
      </Notice>
      <ul className="ar-years" aria-label="Annual reports by financial year">
        {ANNUAL_REPORT_YEARS.map((year) => (
          <AnnualReportCard key={year.id} year={year} />
        ))}
      </ul>
      <Panel title="Audited figures before listing" sub={`Source: ${PROSPECTUS_SOURCE}.`}>
        <p>
          Until our first annual report, the Group’s audited financial information for {FIRST_AUDITED_YEAR} to{' '}
          {LATEST_AUDITED_YEAR} is in the prospectus
          {AUDITORS ? `, reported on by ${AUDITORS} as reporting accountants` : ''}.
        </p>
        <p className="ar-links">
          <Link to={irPath('financial-info', 'highlights')}>Financial highlights</Link>
          <Link to={irPath('reports', 'prospectus')}>Prospectus documents</Link>
        </p>
      </Panel>
    </>
  )
}

function AnnualReportCard({ year }: { year: AnnualReportYear }) {
  const titleId = useId()
  return (
    <li className="card ar-card">
      <article aria-labelledby={titleId}>
        <AnnualReportCover yearLabel={year.yearLabel} />
        <div className="ar-body">
          <div className="ar-head">
            <div>
              <h3 id={titleId}>{year.yearLabel ? `Annual Report ${year.yearLabel}` : 'First annual report after listing'}</h3>
              <p className="card-sub">
                Financial year ended {FINANCIAL_YEAR_END}{' '}
                {year.yearLabel ? year.yearLabel.replace('FY', '') : <Ph>year to be confirmed</Ph>}
              </p>
            </div>
            {!year.yearLabel && <Pending />}
          </div>
          <ul className="ar-docs" aria-label="Documents in this annual report">
            {year.documents.map((doc) => (
              <li key={doc.title}>
                <div>
                  <b>{doc.title}</b>
                  <small>{doc.description}</small>
                </div>
                <span className="ar-format">{doc.format}</span>
                <DocActions doc={doc} />
              </li>
            ))}
          </ul>
        </div>
      </article>
    </li>
  )
}

/** Decorative cover in CSS until the real cover artwork exists. */
function AnnualReportCover({ yearLabel }: { yearLabel?: string }) {
  return (
    <div className="ar-cover" aria-hidden="true">
      <span className="ar-cover-brand">Bestari Food Berhad</span>
      <span className="ar-cover-title">Annual Report</span>
      <span className="ar-cover-year">{yearLabel ?? 'FY ——'}</span>
    </div>
  )
}
