import { useDocumentTitle } from '../../components/routing'
import { BusinessSection } from './BusinessSection'
import { FactsMarquee } from './FactsMarquee'
import { HeroSection } from './HeroSection'
import { HistorySection } from './HistorySection'
import { LeadershipSection } from './LeadershipSection'
import { PurposeSection } from './PurposeSection'
import { AlsoLikeSection, HqSection, OriginSection, TrioSection } from './StorySections'
import './about.css'

/** About Us, ported from the handoff's "Bestari About.html". Rendered inside Layout (header and footer). */
export function AboutPage() {
  useDocumentTitle('About Us')

  return (
    <div className="about">
      <HeroSection />
      <PurposeSection />
      <OriginSection />
      <HistorySection />
      <TrioSection />
      <BusinessSection />
      <FactsMarquee />
      <HqSection />
      <LeadershipSection />
      <AlsoLikeSection />
    </div>
  )
}
