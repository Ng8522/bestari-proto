import { SiteFooter } from '../../components/chrome'
import { useDocumentTitle } from '../../components/routing'
import { BrandCarousel } from './BrandCarousel'
import { HomeHeader } from './HomeHeader'
import { RecipeVideos } from './RecipeVideos'
import { IntroDoors, Latest, Purpose } from './sections'
import { SloganHero } from './SloganHero'
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
        <SloganHero />
        <IntroDoors />
        <BrandCarousel />
        <Purpose />
        <RecipeVideos />
        <Latest />
      </main>
      <SiteFooter />
    </div>
  )
}
