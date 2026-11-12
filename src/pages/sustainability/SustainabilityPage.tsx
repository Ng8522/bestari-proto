import { useRef } from 'react'
import { useScrollReveal } from '../../components/motion'
import { useDocumentTitle } from '../../components/routing'
import { PILLARS } from './data'
import { PillarSection } from './PillarSection'
import { CommitmentSection, HeroSection, ReportsSection } from './sections'
import './sustainability.css'

/** Sustainability, laid out after the Farm Fresh page the client referenced. Rendered inside Layout. */
export function SustainabilityPage() {
  useDocumentTitle('Sustainability')
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollReveal(rootRef)

  return (
    <div className="sus" ref={rootRef}>
      <HeroSection />
      <CommitmentSection />
      {PILLARS.map((pillar) => (
        <PillarSection key={pillar.id} pillar={pillar} />
      ))}
      <ReportsSection />
    </div>
  )
}
