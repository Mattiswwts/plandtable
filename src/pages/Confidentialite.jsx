import { usePageMeta } from '../utils/usePageMeta'

function Confidentialite() {
  usePageMeta(
    'Politique de confidentialité — plandtable',
    'plandtable ne collecte aucune donnée personnelle : tout reste dans votre navigateur.',
  )

  return (
    <article className="legal-page">
      <h1>Politique de confidentialité</h1>
      <p className="legal-updated">Dernière mise à jour : à compléter avant mise en ligne.</p>

      <h2>Ce que nous ne collectons pas</h2>
      <p>
        plandtable n'a pas de backend et pas de base de données. Votre liste
        d'invités, vos tables, vos contraintes et votre plan de table sont
        stockés uniquement dans le stockage local (<em>localStorage</em>) de
        votre navigateur, sur votre appareil. Ces informations ne sont
        jamais envoyées à un serveur, ni consultées par l'éditeur du site.
      </p>

      <h2>Ce que cela implique concrètement</h2>
      <ul>
        <li>Aucun compte, aucune inscription, aucun mot de passe</li>
        <li>Aucun email collecté pour utiliser l'outil</li>
        <li>
          Si vous videz le cache de votre navigateur ou changez d'appareil,
          votre plan de table est perdu — pensez à exporter en PDF les
          versions importantes
        </li>
        <li>
          Si vous partagez votre appareil, toute personne y ayant accès peut
          voir votre plan de table
        </li>
      </ul>

      <h2>Paiement</h2>
      <p>
        Le déblocage à 19€ est traité par Stripe, qui agit en tant que
        responsable de traitement indépendant pour les données de paiement.
        plandtable ne reçoit et ne stocke aucune information bancaire.
        Consultez la{' '}
        <a
          href="https://stripe.com/fr/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          politique de confidentialité de Stripe
        </a>
        .
      </p>

      <h2>Mesure d'audience</h2>
      <p>
        Le site utilise Vercel Analytics pour compter les visites et les
        pages consultées. Cet outil ne dépose pas de cookie et n'utilise
        aucun identifiant permettant de vous reconnaître individuellement ou
        de vous suivre d'un site à l'autre : les données (page visitée,
        pays, type d'appareil) sont agrégées et anonymes. Aucun traceur
        publicitaire n'est utilisé.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc. (États-Unis). La navigation sur
        le site génère des journaux techniques standards (adresse IP,
        navigateur) traités par cet hébergeur à des fins de sécurité et de
        performance.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question sur vos données :{' '}
        <a href="mailto:mattiswitschi252004@gmail.com">mattiswitschi252004@gmail.com</a>
      </p>
    </article>
  )
}

export default Confidentialite
