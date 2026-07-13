import { FREE_GUEST_LIMIT } from '../models/project'
import { usePageMeta } from '../utils/usePageMeta'

function CGV() {
  usePageMeta('Conditions générales de vente — plandtable', 'Conditions générales de vente du service plandtable.')

  return (
    <article className="legal-page">
      <h1>Conditions générales de vente</h1>
      <p className="legal-updated">Dernière mise à jour : à compléter avant mise en ligne.</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent la vente du service de
        déblocage plandtable, proposé par{' '}
        <span className="placeholder">[nom / raison sociale à compléter]</span>{' '}
        (ci-après "l'éditeur") aux utilisateurs du site plandtable.fr
        (ci-après "l'utilisateur").
      </p>

      <h2>2. Description du service</h2>
      <p>
        plandtable est un outil de création de plan de table de mariage,
        utilisable gratuitement et sans inscription jusqu'à {FREE_GUEST_LIMIT}{' '}
        invités. Au-delà de cette limite, l'ajustement manuel du placement,
        la régénération du placement automatique et l'export PDF nécessitent
        un déblocage payant.
      </p>

      <h2>3. Prix et paiement</h2>
      <p>
        Le déblocage est proposé au prix unique de 19€ TTC, sans abonnement
        ni reconduction. Le paiement est traité par Stripe via un lien de
        paiement sécurisé. L'éditeur ne collecte ni ne stocke aucune donnée
        bancaire.
      </p>

      <h2>4. Livraison et accès</h2>
      <p>
        Le service est un contenu numérique fourni immédiatement après
        confirmation du paiement, sans support physique. Le déblocage est
        rattaché au navigateur et à l'appareil sur lesquels le plan de table
        a été créé (le projet étant stocké localement, sans compte
        utilisateur), et reste valable jusqu'au jour du mariage renseigné par
        l'utilisateur.
      </p>

      <h2>5. Droit de rétractation</h2>
      <p>
        Conformément à l'article L221-28 du Code de la consommation, le
        droit de rétractation ne peut être exercé pour la fourniture d'un
        contenu numérique non fourni sur un support matériel dont
        l'exécution a commencé après accord préalable exprès du consommateur
        et renoncement exprès à son droit de rétractation. En procédant au
        paiement, l'utilisateur reconnaît demander l'accès immédiat au
        service débloqué et renonce expressément à son droit de
        rétractation.
      </p>

      <h2>6. Responsabilité</h2>
      <p>
        L'éditeur s'efforce d'assurer la disponibilité et le bon
        fonctionnement du service, sans garantie de résultat. Les données du
        projet (invités, tables, contraintes) étant stockées uniquement dans
        le navigateur de l'utilisateur, l'éditeur ne peut être tenu
        responsable de leur perte en cas de suppression du stockage local,
        de changement d'appareil ou de navigateur.
      </p>

      <h2>7. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit français. En cas de
        litige, une solution amiable sera recherchée avant toute action
        judiciaire.
      </p>

      <h2>8. Contact</h2>
      <p>
        Pour toute question relative à une commande :{' '}
        <a href="mailto:mattiswitschi252004@gmail.com">mattiswitschi252004@gmail.com</a>
      </p>
    </article>
  )
}

export default CGV
