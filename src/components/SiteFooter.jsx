import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-links">
        <Link to="/">Accueil</Link>
        <Link to="/plan-de-table-mariage">Plan de table mariage</Link>
        <Link to="/comment-placer-invites-mariage">Comment placer ses invités</Link>
        <Link to="/logiciel-plan-de-table-gratuit">Logiciel gratuit</Link>
        <Link to="/tarifs">Tarifs</Link>
      </div>
      <div className="site-footer-legal">
        <Link to="/mentions-legales">Mentions légales</Link>
        <Link to="/cgv">CGV</Link>
        <Link to="/confidentialite">Confidentialité</Link>
      </div>
      <p className="site-footer-note">
        Gratuit jusqu'à 30 invités. Au-delà, déblocage à 19€ en une fois,
        jusqu'au jour J. Aucune inscription requise.
      </p>
    </footer>
  )
}

export default SiteFooter
