import { Link } from 'react-router-dom'
import { usePageMeta } from '../utils/usePageMeta'

function SeoLogicielGratuit() {
  usePageMeta(
    'Logiciel plan de table gratuit : ce qui est vraiment gratuit — plandtable',
    'plandtable est gratuit et complet jusqu\'à 30 invités, sans inscription. Voici exactement ce qui est gratuit, ce qui ne l\'est pas, et pourquoi.',
  )

  return (
    <article className="seo-page">
      <h1>Logiciel plan de table gratuit : ce qui est vraiment gratuit</h1>

      <p>
        Beaucoup d'outils de plan de table se disent "gratuits" puis
        demandent une inscription, un email, parfois une carte bancaire
        "juste pour vérifier", avant de vous laisser voir quoi que ce soit.
        On préfère être direct sur ce que propose plandtable, sans lettres
        petites.
      </p>

      <h2>Ce qui est gratuit, sans limite de temps ni inscription</h2>
      <ul>
        <li>Saisir ou coller votre liste d'invités</li>
        <li>Créer vos tables (rondes ou rectangulaires, capacité libre)</li>
        <li>Poser vos contraintes ("ensemble", "séparés", "près de", "loin de")</li>
        <li>Lancer l'algorithme de placement automatique</li>
        <li>
          Ajuster le placement à la main et exporter en PDF — tant que vous
          restez à 30 invités ou moins
        </li>
      </ul>
      <p>
        Aucun compte à créer. Tout reste dans votre navigateur : rien n'est
        envoyé sur un serveur, vous pouvez fermer l'onglet et revenir plus
        tard, votre plan est toujours là.
      </p>

      <h2>Ce qui devient payant au-delà de 30 invités</h2>
      <p>
        Au-delà de 30 invités, le placement automatique fonctionne encore
        une fois gratuitement — vous voyez le résultat concret avant de
        payer quoi que ce soit. Mais ajuster ce placement à la main,
        relancer l'algorithme, ou exporter en PDF nécessite un déblocage à
        19€, payé une seule fois, valable jusqu'au jour du mariage.
      </p>
      <p>
        Ce n'est pas un abonnement, et ce n'est pas un PDF figé qu'on vous
        vend une fois : c'est l'accès à l'outil complet jusqu'à ce que votre
        plan soit définitif, y compris si vos invités changent la semaine
        d'avant.
      </p>

      <h2>Pourquoi cette limite à 30 invités</h2>
      <p>
        Parce qu'un mariage de 30 invités ou moins doit pouvoir être organisé
        de bout en bout sans sortir la carte bancaire — c'est une démo
        honnête, pas un piège à 3 tables verrouillées. Au-delà, l'outil
        continue de tourner pour beaucoup plus de monde (jusqu'à 200
        invités), et 19€ reste largement en dessous du prix des outils
        équivalents avec abonnement mensuel.
      </p>

      <h2>En quoi c'est différent des sites de mariage généralistes</h2>
      <p>
        Des plateformes comme Mariages.net ou des outils de dessin comme
        Canva proposent surtout du glisser-déposer manuel : à vous de
        décider qui va où, invité par invité, souvent après avoir créé un
        compte. plandtable calcule le placement pour vous à partir de vos
        règles — vous partez d'un plan déjà cohérent, que vous affinez,
        plutôt que d'une page blanche.
      </p>

      <p>
        <Link to="/" className="seo-cta">
          Essayer gratuitement, sans inscription →
        </Link>
      </p>
    </article>
  )
}

export default SeoLogicielGratuit
