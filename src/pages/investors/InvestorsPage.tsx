import { useRef } from 'react'
import { useScrollReveal } from '../../components/motion'
import { useDocumentTitle } from '../../components/routing'
import { Board } from './Board'
import { Contact } from './Contact'
import { Documents } from './Documents'
import { Financials } from './Financials'
import { IrHero } from './Hero'
import { IpoSection } from './Ipo'
import { Overview } from './Overview'
import { Shareholding } from './Shareholding'
import { SubNav } from './SubNav'
import './investors.css'

/** Investor Relations, ported from "Bestari Investors.html". Rendered inside Layout (header + footer provided). */
export function InvestorsPage() {
  useDocumentTitle('Investor Relations')
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollReveal(rootRef)

  return (
    <div className="ir" ref={rootRef}>
      <IrHero />
      <SubNav />
      <Overview />
      <IpoSection />
      <Financials />
      <Shareholding />
      <Board />
      <Documents />
      <Contact />
    </div>
  )
}
