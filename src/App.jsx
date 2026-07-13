import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import HomePage from './pages/HomePage'
import SeoPlanDeTableMariage from './pages/SeoPlanDeTableMariage'
import SeoCommentPlacerInvites from './pages/SeoCommentPlacerInvites'
import SeoLogicielGratuit from './pages/SeoLogicielGratuit'
import PricingPage from './pages/PricingPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import MentionsLegales from './pages/MentionsLegales'
import CGV from './pages/CGV'
import Confidentialite from './pages/Confidentialite'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan-de-table-mariage" element={<SeoPlanDeTableMariage />} />
        <Route path="/comment-placer-invites-mariage" element={<SeoCommentPlacerInvites />} />
        <Route path="/logiciel-plan-de-table-gratuit" element={<SeoLogicielGratuit />} />
        <Route path="/tarifs" element={<PricingPage />} />
        <Route path="/deblocage-reussi" element={<PaymentSuccessPage />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
      </Routes>
      <SiteFooter />
      <Analytics />
    </>
  )
}

export default App
