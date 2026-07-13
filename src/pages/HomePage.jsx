import PlannerApp from '../components/PlannerApp'
import BotanicalSprig from '../components/BotanicalSprig'
import { usePageMeta } from '../utils/usePageMeta'

function HomePage() {
  usePageMeta(
    'plandtable — Plan de table de mariage à placement automatique',
    "L'outil qui place vos invités à votre place, pas l'inverse. Collez votre liste, posez vos contraintes, l'algorithme fait le placement. Gratuit jusqu'à 30 invités, sans inscription.",
  )

  function scrollToTool() {
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <BotanicalSprig className="hero-ornament hero-ornament-left" />
        <BotanicalSprig className="hero-ornament hero-ornament-right" mirrored />
        <span className="hero-eyebrow">Placement automatique sous contraintes</span>
        <h1>Le plan de table qui se remplit tout seul</h1>
        <p className="hero-subtitle">
          Les autres outils vous laissent glisser-déposer 150 invités un par
          un. plandtable place tout le monde automatiquement selon vos
          contraintes — vous ajustez seulement ce qui compte.
        </p>
        <button type="button" className="hero-cta" onClick={scrollToTool}>
          Essayer gratuitement ↓
        </button>
        <ul className="hero-points">
          <li>Aucune inscription, aucune carte bancaire</li>
          <li>Gratuit et complet jusqu'à 30 invités</li>
          <li>Tout reste dans votre navigateur</li>
        </ul>
      </section>

      <PlannerApp />
    </>
  )
}

export default HomePage
