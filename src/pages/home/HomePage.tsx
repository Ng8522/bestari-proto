import { SiteFooter } from '../../components/chrome'
import { useDocumentTitle } from '../../components/routing'
import { HomeHeader } from './HomeHeader'
import { RecipeVideos } from './RecipeVideos'
import { IntroBand, IpoBand, ProductRanges, PromiseBand } from './bands'
import { Latest } from './sections'
import { HeroSlider } from './HeroSlider'
import './home.css'

/** Home, ported from "Bestari Corporate & IPO.html". It draws its own header instead of using Layout. */
export function HomePage() {
  useDocumentTitle()

  return (
    <div className="home">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <HomeHeader />
      <main id="main">
        <HeroSlider />
        <IntroBand />
        <ProductRanges />
        <PromiseBand />
        <RecipeVideos />
        <IpoBand />
        <Latest />
      </main>
      <SiteFooter />
    </div>
  )
}
