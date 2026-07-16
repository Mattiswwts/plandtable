import { exportTablePlanPdf, exportGuestListPdf, exportPlaceCardsPdf } from '../utils/exportPdf'

function ExportPanel({ project, locked, onRequestUnlock }) {
  function handleExport(exportFn) {
    if (locked) {
      onRequestUnlock()
      return
    }
    exportFn(project)
  }

  return (
    <section className="panel export-panel">
      <h2>Export</h2>
      {locked && (
        <p className="warning-hint">
          Débloquez plandtable pour exporter au-delà de 30 invités.
        </p>
      )}
      <div className="export-actions">
        <button type="button" onClick={() => handleExport(exportTablePlanPdf)}>
          Plan de table (PDF)
        </button>
        <button type="button" onClick={() => handleExport(exportGuestListPdf)}>
          Liste alphabétique (PDF)
        </button>
        <button type="button" onClick={() => handleExport(exportPlaceCardsPdf)}>
          Marque-places (PDF)
        </button>
      </div>
      <p className="hint">
        Les marque-places sont prêts à imprimer et découper, un par invité placé.
      </p>
    </section>
  )
}

export default ExportPanel
