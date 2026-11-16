import { Link } from 'react-router'
import { irPath } from '../../../../content/ir-nav'
import { DocTable } from '../../ui/DataTable'
import { Notice, Panel } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { INVESTOR_PRESENTATIONS, RESULTS_BRIEFINGS } from './content'
import { QUARTERLY_REPORT_MONTHS } from './reporting'

type PresentationTab = 'investor' | 'briefings'

/** Reports & Presentations › Corporate Presentations: investor presentations and results briefing slides. */
export function PresentationsPage() {
  return (
    <>
      <Notice tone="pending" title="Briefings start after listing">
        We report quarterly results within {QUARTERLY_REPORT_MONTHS} months of each quarter end; any briefing on those
        results will be listed here with its slides. To hear about new presentations, sign up for{' '}
        <Link to={irPath('resources', 'news-alerts')}>news alerts</Link>.
      </Notice>
      <SectionTabs tabs={PRESENTATION_TABS} />
    </>
  )
}

function InvestorPresentations() {
  return (
    <Panel title="Investor presentations" sub="Slides about the Group and our IPO, for investors and analysts.">
      <DocTable caption="Investor presentations" documents={INVESTOR_PRESENTATIONS} />
    </Panel>
  )
}

function ResultsBriefings() {
  return (
    <Panel title="Results briefings" sub="Slides from our briefings on each set of quarterly results.">
      <DocTable
        caption="Results briefing presentations"
        documents={RESULTS_BRIEFINGS}
        emptyMessage="No results briefings yet. Slides will be posted here after each briefing, starting after listing."
      />
    </Panel>
  )
}

const PRESENTATION_TABS: readonly SectionTab<PresentationTab>[] = [
  { id: 'investor', label: 'Investor presentations', content: <InvestorPresentations /> },
  { id: 'briefings', label: 'Results briefings', content: <ResultsBriefings /> },
]
