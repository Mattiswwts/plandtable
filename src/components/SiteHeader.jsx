import { NavLink } from 'react-router-dom'

function SiteHeader() {
  return (
    <header className="site-header">
      <NavLink to="/" className="site-logo">
        plandtable
      </NavLink>
      <nav className="site-nav">
        <NavLink to="/plan-de-table-mariage">Plan de table</NavLink>
        <NavLink to="/comment-placer-invites-mariage">Placer ses invités</NavLink>
        <NavLink to="/tarifs">Tarifs</NavLink>
      </nav>
    </header>
  )
}

export default SiteHeader
