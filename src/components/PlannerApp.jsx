import { useEffect, useState } from 'react'
import GuestPanel from './GuestPanel'
import TablePanel from './TablePanel'
import ConstraintBuilder from './ConstraintBuilder'
import SolveButton from './SolveButton'
import TableCanvas from './TableCanvas'
import ExportPanel from './ExportPanel'
import Paywall from './Paywall'
import {
  createGuest,
  createTable,
  createConstraint,
  loadProject,
  saveProject,
  FREE_GUEST_LIMIT,
} from '../models/project'
import { solvePlacement } from '../utils/solver'
import { findFreeTablePosition } from '../utils/tableLayout'

function PlannerApp() {
  const [project, setProject] = useState(() => loadProject())
  const [solveResult, setSolveResult] = useState(null)
  const [paywallOpen, setPaywallOpen] = useState(false)

  useEffect(() => {
    saveProject(project)
  }, [project])

  function addGuest(name) {
    setProject((p) => ({ ...p, guests: [...p.guests, createGuest(name)] }))
  }

  function addGuests(names) {
    setProject((p) => ({
      ...p,
      guests: [...p.guests, ...names.map((n) => createGuest(n))],
    }))
  }

  function removeGuest(id) {
    setProject((p) => ({
      ...p,
      guests: p.guests.filter((g) => g.id !== id),
      constraints: p.constraints.filter((c) => !c.guestIds.includes(id)),
      placement: Object.fromEntries(
        Object.entries(p.placement).filter(([guestId]) => guestId !== id),
      ),
    }))
  }

  function addGuestTag(guestId, tag) {
    setProject((p) => ({
      ...p,
      guests: p.guests.map((g) =>
        g.id === guestId && !g.tags.includes(tag) ? { ...g, tags: [...g.tags, tag] } : g,
      ),
    }))
  }

  function removeGuestTag(guestId, tag) {
    setProject((p) => ({
      ...p,
      guests: p.guests.map((g) =>
        g.id === guestId ? { ...g, tags: g.tags.filter((t) => t !== tag) } : g,
      ),
    }))
  }

  function addTable(config) {
    setProject((p) => {
      const { x, y } = findFreeTablePosition(p.tables, { shape: config.shape, capacity: config.capacity })
      return { ...p, tables: [...p.tables, createTable({ ...config, x, y })] }
    })
  }

  function updateTable(id, patch) {
    setProject((p) => ({
      ...p,
      tables: p.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }

  function removeTable(id) {
    setProject((p) => ({
      ...p,
      tables: p.tables.filter((t) => t.id !== id),
      constraints: p.constraints.filter((c) => c.tableId !== id),
      placement: Object.fromEntries(
        Object.entries(p.placement).filter(([, place]) => place.tableId !== id),
      ),
    }))
  }

  function addConstraint(config) {
    setProject((p) => ({ ...p, constraints: [...p.constraints, createConstraint(config)] }))
  }

  function removeConstraint(id) {
    setProject((p) => ({ ...p, constraints: p.constraints.filter((c) => c.id !== id) }))
  }

  function moveGuestToSeat(guestId, targetTableId, targetSeatIndex) {
    setProject((p) => {
      const placement = { ...p.placement }
      const current = placement[guestId]
      const occupantId = Object.keys(placement).find(
        (id) =>
          id !== guestId &&
          placement[id].tableId === targetTableId &&
          placement[id].seatIndex === targetSeatIndex,
      )

      if (occupantId) {
        if (current) {
          placement[occupantId] = { tableId: current.tableId, seatIndex: current.seatIndex }
        } else {
          delete placement[occupantId]
        }
      }

      placement[guestId] = { tableId: targetTableId, seatIndex: targetSeatIndex }
      return { ...p, placement }
    })
  }

  function unseatGuest(guestId) {
    setProject((p) => {
      const placement = { ...p.placement }
      delete placement[guestId]
      return { ...p, placement }
    })
  }

  const totalCapacity = project.tables.reduce((sum, t) => sum + t.capacity, 0)
  const overLimit = project.guests.length > FREE_GUEST_LIMIT
  const locked = overLimit && !project.unlocked
  const hasPlacement = Object.keys(project.placement).length > 0
  const solveLocked = locked && hasPlacement

  function solve() {
    if (solveLocked) {
      setPaywallOpen(true)
      return
    }
    const result = solvePlacement(project)
    setProject((p) => ({ ...p, placement: result.placement }))
    setSolveResult(result)
  }

  return (
    <div id="planner">
      <header className="app-header">
        <input
          type="text"
          className="project-name-input"
          placeholder="Nom du mariage (ex : Julie & Thomas)"
          value={project.name}
          onChange={(e) =>
            setProject((p) => ({ ...p, name: e.target.value }))
          }
        />
        <p className="summary">
          {project.guests.length} invité(s) · {totalCapacity} place(s) en
          table
          {overLimit && !project.unlocked && (
            <span className="paywall-hint">
              {' '}
              · au-delà de {FREE_GUEST_LIMIT} invités, le déblocage est
              nécessaire pour ajuster et exporter
            </span>
          )}
        </p>
      </header>

      <main className="app-main">
        <GuestPanel
          guests={project.guests}
          onAddGuest={addGuest}
          onAddGuests={addGuests}
          onRemoveGuest={removeGuest}
          onAddTag={addGuestTag}
          onRemoveTag={removeGuestTag}
        />
        <TablePanel
          tables={project.tables}
          onAddTable={addTable}
          onUpdateTable={updateTable}
          onRemoveTable={removeTable}
        />
        <ConstraintBuilder
          guests={project.guests}
          tables={project.tables}
          constraints={project.constraints}
          onAddConstraint={addConstraint}
          onRemoveConstraint={removeConstraint}
        />
        <SolveButton
          guests={project.guests}
          tables={project.tables}
          constraints={project.constraints}
          totalCapacity={totalCapacity}
          hasPlacement={hasPlacement}
          locked={solveLocked}
          onSolve={solve}
          onRequestUnlock={() => setPaywallOpen(true)}
          result={solveResult}
        />
        <TableCanvas
          tables={project.tables}
          guests={project.guests}
          placement={project.placement}
          locked={locked}
          onRequestUnlock={() => setPaywallOpen(true)}
          onMoveGuestToSeat={moveGuestToSeat}
          onUnseatGuest={unseatGuest}
          onMoveTable={(id, x, y) => updateTable(id, { x, y })}
        />
        <ExportPanel
          project={project}
          locked={locked}
          onRequestUnlock={() => setPaywallOpen(true)}
        />
      </main>

      <Paywall open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  )
}

export default PlannerApp
