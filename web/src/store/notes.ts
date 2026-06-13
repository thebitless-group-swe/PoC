import { create } from 'zustand'
import type { Note } from '../lib/fileSystem'

// Struttura per la persistenza localStorage — non ancora attiva
export interface NotesPersistence {
  list: Note[]
  currentId: string | null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const STORAGE_KEY = 'notes_persistence'

type NotesState = {
  list: Note[]
  currentId: string | null
  createEmpty: () => void
  select: (id: string) => void
}

export const useNotesStore = create<NotesState>((set) => ({
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
    set(() => ({ currentId: id }))
  },
}))