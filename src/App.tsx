import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/chrome'
import { ScrollManager } from './components/routing'
import { ROUTES } from './content/site'
import { AboutPage } from './pages/about/AboutPage'
import { HomePage } from './pages/home/HomePage'
import { InvestorsPage } from './pages/investors/InvestorsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ShopPage } from './pages/shop/ShopPage'
import { SustainabilityPage } from './pages/sustainability/SustainabilityPage'
import { WhereToBuyPage } from './pages/where-to-buy/WhereToBuyPage'

/** Route table only, so tests can render it inside a MemoryRouter. */
export function AppRoutes() {
  return (
    <>
      <ScrollManager />
      <Routes>
        {/* Home and Shop draw their own chrome: the transparent home header, and the shop's own bars. */}
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.shop} element={<ShopPage />} />
        <Route element={<Layout />}>
          <Route path={ROUTES.about} element={<AboutPage />} />
          <Route path={ROUTES.investors} element={<InvestorsPage />} />
          <Route path={ROUTES.onsiteOutlets} element={<WhereToBuyPage />} />
          <Route path={ROUTES.legacyWhereToBuy} element={<Navigate to={ROUTES.onsiteOutlets} replace />} />
          <Route path={ROUTES.sustainability} element={<SustainabilityPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  )
}
