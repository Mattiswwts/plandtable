import { STRIPE_PAYMENT_LINK } from '../config'

function Paywall({ open, onClose }) {
  if (!open) return null

  return (
    <div className="paywall-overlay" onClick={onClose}>
      <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="paywall-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2>Débloquez plandtable</h2>
        <p>
          Gratuit et complet jusqu'à 30 invités. Au-delà, débloquez les
          ajustements, régénérations et exports PDF pour 19€, en une seule
          fois, jusqu'au jour J.
        </p>
        <a
          className="paywall-cta"
          href={STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          Débloquer pour 19€
        </a>
      </div>
    </div>
  )
}

export default Paywall
