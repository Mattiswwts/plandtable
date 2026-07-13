import { usePageMeta } from '../utils/usePageMeta'

function MentionsLegales() {
  usePageMeta('Mentions légales — plandtable', 'Mentions légales du site plandtable.fr.')

  return (
    <article className="legal-page">
      <h1>Mentions légales</h1>
      <p className="legal-updated">Dernière mise à jour : à compléter avant mise en ligne.</p>

      <h2>Éditeur du site</h2>
      <p>
        Le site plandtable.fr est édité par{' '}
        <span className="placeholder">[nom / raison sociale à compléter]</span>,{' '}
        <span className="placeholder">[statut : entrepreneur individuel, micro-entreprise...]</span>,
        immatriculé sous le numéro SIRET{' '}
        <span className="placeholder">[SIRET à compléter]</span>, dont le
        siège est situé au <span className="placeholder">[adresse à compléter]</span>.
      </p>
      <p>
        Contact : <a href="mailto:mattiswitschi252004@gmail.com">mattiswitschi252004@gmail.com</a>
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
        CA 91789, États-Unis —{' '}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
        .
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur plandtable.fr (textes, logo,
        interface) est la propriété de l'éditeur, sauf mention contraire.
        Toute reproduction sans autorisation est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        plandtable ne collecte aucune donnée personnelle sur ses serveurs :
        toutes les informations que vous saisissez (liste d'invités, tables,
        contraintes) restent stockées localement dans votre navigateur. Voir
        la <a href="/confidentialite">politique de confidentialité</a> pour
        le détail.
      </p>

      <h2>Paiement</h2>
      <p>
        Les paiements sont traités par Stripe Payments Europe, Ltd. plandtable
        ne stocke ni ne manipule directement vos données bancaires. Voir les{' '}
        <a href="/cgv">conditions générales de vente</a>.
      </p>
    </article>
  )
}

export default MentionsLegales
