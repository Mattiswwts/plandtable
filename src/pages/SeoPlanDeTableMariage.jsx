import { Link } from 'react-router-dom'
import { usePageMeta } from '../utils/usePageMeta'

function SeoPlanDeTableMariage() {
  usePageMeta(
    'Plan de table mariage : le guide complet — plandtable',
    'Comment organiser le plan de table de votre mariage sans y passer un week-end entier : méthode, erreurs à éviter, et l\'outil qui place vos invités automatiquement.',
  )

  return (
    <article className="seo-page">
      <h1>Plan de table mariage : le guide complet</h1>

      <p>
        Le plan de table est souvent la dernière grosse tâche avant le jour
        J — et paradoxalement l'une des plus longues. Contrairement au choix
        du traiteur ou de la robe, il dépend de dizaines de petites décisions
        interdépendantes : qui s'entend avec qui, qui ne doit surtout pas
        être à côté de qui, où mettre les enfants, comment équilibrer les
        tables. Changer une seule personne de place peut obliger à tout
        reprendre.
      </p>

      <h2>Pourquoi le plan de table prend autant de temps</h2>
      <p>
        Avec 80 invités et 10 tables, il existe un nombre astronomique de
        façons de les répartir. Le cerveau humain n'est pas fait pour
        explorer cet espace de solutions à la main : on avance par
        tâtonnements, on colle des post-it, on efface, on recommence — et on
        finit souvent par accepter un plan "pas parfait mais qui suffira"
        après plusieurs heures.
      </p>

      <h2>La méthode classique (glisser-déposer)</h2>
      <p>
        La plupart des outils de plan de table en ligne fonctionnent de la
        même façon : vous dessinez vos tables, puis vous faites glisser
        chaque invité un par un jusqu'à sa chaise. C'est visuel, mais ça ne
        fait gagner du temps que sur le dessin — tout le travail de
        réflexion (qui va où) reste entièrement à votre charge.
      </p>

      <h2>Une autre approche : décrire les règles, laisser l'algorithme placer</h2>
      <p>
        plandtable inverse le problème. Plutôt que de placer chaque invité
        à la main, vous décrivez vos contraintes en langage simple : "les
        parents de Julie et les parents de Thomas ensemble", "tante Michèle
        loin de l'oncle Paul", "les cousins près de la piste de danse". Un
        algorithme de placement sous contraintes (un recuit simulé, la même
        famille de technique utilisée pour l'optimisation d'itinéraires ou
        d'emplois du temps) calcule ensuite une répartition qui respecte le
        maximum de ces règles en quelques secondes.
      </p>
      <p>
        Vous n'avez plus qu'à ajuster les quelques détails qui comptent
        vraiment, au lieu de placer 80 personnes une par une.
      </p>

      <h2>Ce qu'il faut préparer avant de commencer</h2>
      <ul>
        <li>Une liste d'invités confirmés (même approximative pour commencer)</li>
        <li>Le nombre et la capacité de vos tables (rondes ou rectangulaires)</li>
        <li>
          Vos contraintes principales : qui doit être ensemble, qui doit
          être séparé, qui doit être près (ou loin) d'une table particulière
          (la table d'honneur, la piste de danse, la sortie)
        </li>
      </ul>

      <h2>Essayer sans s'inscrire</h2>
      <p>
        Pas besoin de créer un compte pour tester : collez votre liste
        d'invités, posez vos tables et vos contraintes, et laissez l'algorithme
        proposer un premier placement. C'est gratuit et complet jusqu'à 30
        invités.
      </p>
      <p>
        <Link to="/" className="seo-cta">
          Essayer plandtable gratuitement →
        </Link>
      </p>
    </article>
  )
}

export default SeoPlanDeTableMariage
