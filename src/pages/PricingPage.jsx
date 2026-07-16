import { Link } from 'react-router-dom'
import { FREE_GUEST_LIMIT } from '../models/project'
import { usePageMeta } from '../utils/usePageMeta'

function PricingPage() {
  usePageMeta(
    'Tarifs — plandtable',
    `Gratuit et complet jusqu'à ${FREE_GUEST_LIMIT} invités. Au-delà, déblocage à 19€ en une seule fois, valable jusqu'au jour du mariage.`,
  )

  return (
    <article className="pricing-page">
      <h1>Un seul palier, aucune surprise</h1>
      <p className="pricing-intro">
        Pas d'abonnement, pas de compte à créer pour tester. Vous voyez
        exactement ce que ça donne avant de sortir la carte bancaire.
      </p>

      <div className="pricing-cards">
        <div className="pricing-card">
          <h2>Démo</h2>
          <p className="pricing-price">
            0€ <span>jusqu'à {FREE_GUEST_LIMIT} invités</span>
          </p>
          <ul>
            <li>Liste d'invités (saisie ou collage)</li>
            <li>Création de tables illimitée</li>
            <li>Contraintes (ensemble, séparés, près/loin d'une table)</li>
            <li>Placement automatique</li>
            <li>Ajustement manuel du plan</li>
            <li>Export PDF (plan, liste, marque-places)</li>
          </ul>
        </div>

        <div className="pricing-card highlight">
          <h2>Débloqué</h2>
          <p className="pricing-price">
            19€ <span>paiement unique, jusqu'au jour J</span>
          </p>
          <ul>
            <li>Tout ce qui est dans la démo</li>
            <li>Au-delà de {FREE_GUEST_LIMIT} invités</li>
            <li>Régénérations illimitées</li>
            <li>Ajustements manuels illimités</li>
            <li>Exports PDF illimités</li>
            <li>Valable jusqu'au mariage, sans date limite</li>
          </ul>
          <Link to="/" className="pricing-cta">
            Essayer d'abord, gratuitement →
          </Link>
        </div>
      </div>

      <div className="pricing-faq">
        <h2>Questions fréquentes</h2>

        <div className="pricing-faq-item">
          <h3>Pourquoi 30 invités et pas un autre chiffre ?</h3>
          <p>
            Parce qu'un petit mariage doit pouvoir être organisé de bout en
            bout sans jamais payer. Au-delà, l'algorithme continue de
            fonctionner (jusqu'à 200 invités environ) — c'est seulement les
            ajustements et les exports qui se débloquent.
          </p>
        </div>

        <div className="pricing-faq-item">
          <h3>C'est un abonnement ?</h3>
          <p>
            Non. Un paiement unique de 19€, valable jusqu'à votre mariage. Pas
            de reconduction, pas de prélèvement récurrent.
          </p>
        </div>

        <div className="pricing-faq-item">
          <h3>Que se passe-t-il si je repasse sous {FREE_GUEST_LIMIT} invités ?</h3>
          <p>
            Rien à faire : l'outil reste utilisable normalement, avec ou sans
            déblocage, tant que votre liste ne dépasse pas la limite gratuite.
          </p>
        </div>

        <div className="pricing-faq-item">
          <h3>Mes données sont-elles envoyées quelque part ?</h3>
          <p>
            Non. Tout reste dans le stockage local de votre navigateur.
            Aucune inscription, aucun compte, aucune base de données. Voir
            notre <Link to="/confidentialite">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </article>
  )
}

export default PricingPage
