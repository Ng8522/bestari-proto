import { useRef } from 'react'
import { useScrollReveal } from '../../components/motion'
import { useDocumentTitle } from '../../components/routing'
import { Board } from './Board'
import { Contact } from './Contact'
import { Corporate } from './Corporate'
import { Documents } from './Documents'
import { Financials } from './Financials'
import { Governance } from './Governance'
import { IrHero } from './Hero'
import { IpoSection } from './Ipo'
import { NewsCentre } from './NewsCentre'
import { Overview } from './Overview'
import { Resources } from './Resources'
import { Shareholding } from './Shareholding'
import { StockInfo } from './StockInfo'
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
      <Corporate />
      <Board />
      <IpoSection />
      <Governance />
      <Financials />
      <StockInfo />
      <Shareholding />
      <NewsCentre />
      <Documents />
      <Resources />
      <Contact />
    </div>
  )
}
