import { Link } from 'react-router-dom'
import { usePageMeta } from '../utils/usePageMeta'

function SeoCommentPlacerInvites() {
  usePageMeta(
    'Comment placer les invités à un mariage sans embrouilles — plandtable',
    'Les règles de base pour placer ses invités de mariage : familles recomposées, collègues, tables d\'enfants, conflits connus. Méthode concrète, pas de théorie.',
  )

  return (
    <article className="seo-page">
      <h1>Comment placer les invités à un mariage sans créer d'embrouilles</h1>

      <p>
        Placer ses invités, ce n'est pas juste remplir des tables — c'est
        gérer des dizaines de relations en même temps : familles
        recomposées, collègues qui ne se connaissent pas, ami·es d'enfance
        dispersé·es, grands-parents qui n'entendent plus bien dans le bruit.
        Voici une méthode concrète, dans l'ordre où on la fait vraiment.
      </p>

      <h2>1. Commencez par les contraintes fortes, pas par les tables</h2>
      <p>
        L'erreur classique : dessiner les tables en premier, puis essayer
        d'y faire rentrer les gens. Faites l'inverse. Listez d'abord vos
        contraintes non négociables : les couples et familles qui doivent
        rester ensemble, les personnes qui ne doivent absolument pas se
        retrouver côte à côte (ex-conjoints, brouilles familiales connues).
        Ce sont ces règles qui doivent piloter le placement, pas la forme des
        tables.
      </p>

      <h2>2. Groupez par affinité réelle, pas par catégorie sociale</h2>
      <p>
        "Tous les collègues ensemble" semble logique, mais si la moitié ne
        se parle jamais en dehors du bureau, vous créez une table silencieuse.
        Préférez des groupes qui ont vraiment quelque chose à se dire :
        un mélange d'amis de fac et de collègues proches vaut souvent mieux
        qu'un regroupement par étiquette.
      </p>

      <h2>3. Traitez les familles recomposées avec soin</h2>
      <p>
        Beaux-parents, ex-belles-familles, demi-frères et sœurs : ce sont
        souvent les placements les plus sensibles. La règle générale est de
        garder chaque parent avec son foyer actuel, tout en évitant les
        face-à-face prolongés entre personnes en tension. Une contrainte
        "séparés" ne veut pas forcément dire "à l'autre bout de la salle" —
        souvent, "pas côte à côte" à la même table suffit largement.
      </p>

      <h2>4. Pensez aux enfants comme à un groupe à part entière</h2>
      <p>
        Une table d'enfants (avec un ou deux adultes de confiance à
        proximité) fonctionne presque toujours mieux que de disperser les
        enfants entre les tables d'adultes. Placez cette table loin de la
        sonorisation et près d'une sortie facile.
      </p>

      <h2>5. Réservez les meilleures places, pas les plus grandes tables</h2>
      <p>
        La proximité de la piste de danse, du bar ou de la table d'honneur
        compte souvent plus que la taille de la table elle-même. Identifiez
        qui a vraiment intérêt à être "près de" quelque chose (les témoins,
        les grands-parents qui bougent peu) plutôt que d'y penser en dernier.
      </p>

      <h2>6. Acceptez qu'un placement parfait n'existe pas</h2>
      <p>
        Avec suffisamment d'invités, certaines contraintes se contredisent
        forcément (deux personnes que tout le monde veut à sa table, par
        exemple). L'objectif réaliste n'est pas zéro compromis, mais de
        satisfaire un maximum de règles importantes et de repérer vite
        celles qui restent en tension, pour les arbitrer en connaissance de
        cause.
      </p>

      <h2>Laisser un algorithme faire les calculs</h2>
      <p>
        C'est exactement ce que fait plandtable : vous décrivez ces règles
        ("ensemble", "séparés", "près de" une table, "loin de" une table),
        et l'algorithme cherche automatiquement la répartition qui en
        satisfait le plus possible — puis vous montre clairement celles qui
        restent en conflit, avec les noms concernés, pour que vous tranchiez
        vous-même en dernier ressort.
      </p>
      <p>
        <Link to="/" className="seo-cta">
          Tester le placement automatique →
        </Link>
      </p>
    </article>
  )
}

export default SeoCommentPlacerInvites
