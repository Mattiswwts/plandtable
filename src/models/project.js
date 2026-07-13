export const STORAGE_KEY = 'plandtable:project'
export const FREE_GUEST_LIMIT = 30

export function createGuest(name, tags = []) {
  return { id: crypto.randomUUID(), name, tags }
}

export function createTable({ label, shape = 'round', capacity = 8, x = 0, y = 0 }) {
  return { id: crypto.randomUUID(), label, shape, capacity, x, y }
}

export function createConstraint({ type, guestIds = [], tableId = null, label = null }) {
  return { id: crypto.randomUUID(), type, guestIds, tableId, label }
}

export function createDefaultProject() {
  return {
    version: 1,
    name: '',
    guests: [],
    tables: [],
    constraints: [],
    placement: {},
    unlocked: false,
  }
}

export function loadProject() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultProject()
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== 1) return createDefaultProject()
    return { ...createDefaultProject(), ...parsed }
  } catch {
    return createDefaultProject()
  }
}

export function saveProject(project) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
  } catch {
    // localStorage indisponible (navigation privée, quota dépassé) : on ignore
  }
}
