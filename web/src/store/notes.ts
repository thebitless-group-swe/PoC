import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note } from '../lib/fileSystem'

type NotesState = {
  list: Note[]
  currentId: string | null
  createEmpty: () => void
  select: (id: string) => void
  updateCurrent: (patch: Partial<Pick<Note, 'title' | 'content'>>) => void
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      list: [],
      currentId: null,

      createEmpty() {
        const note: Note = {
          id: crypto.randomUUID(),
          title: 'Untitled',
          content: '',
          updatedAt: Date.now(),
        }
        set((s) => ({ list: [...s.list, note], currentId: note.id }))
      },

      select(id: string) {
        set({ currentId: id })
      },

      updateCurrent(patch) {
        const { currentId, list } = get()
        if (!currentId) return
        set({
          list: list.map((n) =>
            n.id === currentId
              ? { ...n, ...patch, updatedAt: Date.now() }
              : n
          ),
        })
      },
    }),
    { name: 'notes_persistence' }
  )
)

// Selettori granulari
export const useNotesList = () => useNotesStore((s) => s.list)
export const useCurrentNote = () =>
  useNotesStore((s) => s.list.find((n) => n.id === s.currentId) ?? null)