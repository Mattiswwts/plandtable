import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { loadProject, saveProject } from '../models/project'
import { usePageMeta } from '../utils/usePageMeta'

function PaymentSuccessPage() {
  usePageMeta(
    'Déblocage réussi — plandtable',
    'Votre accès plandtable est débloqué jusqu\'au jour J.',
    { noindex: true },
  )

  useEffect(() => {
    const project = loadProject()
    if (!project.unlocked) {
      saveProject({ ...project, unlocked: true })
    }
  }, [])

  return (
    <section className="confirmation-page">
      <div className="confirmation-icon">🎉</div>
      <h1>C'est débloqué !</h1>
      <p>
        Merci. Votre plan de table est maintenant modifiable, régénérable et
        exportable en PDF sans limite, jusqu'au jour de votre mariage.
      </p>
      <Link to="/" className="hero-cta">
        Retourner à mon plan de table →
      </Link>
    </section>
  )
}

export default PaymentSuccessPage
