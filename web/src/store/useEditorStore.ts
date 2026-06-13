import { create } from 'zustand'

import type { Note } from '@/lib/fileSystem'

// SC-FS: slice note. La struttura è pronta per la persistenza su localStorage,
// NON ancora attiva: gli stub non leggono né scrivono nulla.
export interface NotesSlice {
  list: Note[]
  currentId: string | null
  createEmpty: () => void
  select: (id: string) => void
}

// V4: layout dell'area di lavoro — solo editor, solo render, o affiancati.
export type ViewMode = 'editor' | 'render' | 'split'
// V4: quale modale AI è aperta (null = nessuna).
export type AiModal = null | 'summarize' | 'generate'
// V4: stato della bozza di output prodotta da un'azione AI.
export type OutputStatus = 'idle' | 'streaming' | 'done' | 'error'
export interface OutputDraft {
  text: string
  status: OutputStatus
}

interface EditorState {
  currentText: string
  setCurrentText: (text: string) => void
  reset: () => void
  streamedOutput: string
  isGenerating: boolean
  startStreaming: () => void
  appendChunk: (chunk: string) => void
  finishStreaming: () => void
  errorMessage: string | null
  setError: (msg: string) => void
  clearError: () => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  aiModal: AiModal
  setAiModal: (modal: AiModal) => void
  outputDraft: OutputDraft
  insertOutputIntoNote: () => void
  notes: NotesSlice
}

export const useEditorStore = create<EditorState>((set) => ({
  currentText: '',
  setCurrentText: (text) => set({ currentText: text }),
  reset: () => set({ currentText: '' }),
  streamedOutput: '',
  isGenerating: false,
  startStreaming: () => set({ streamedOutput: '', isGenerating: true }),
  // callback form: su chunk consecutivi rapidi evita la race sullo stato letto fuori
  appendChunk: (chunk) =>
    set((s) => ({ streamedOutput: s.streamedOutput + chunk })),
  finishStreaming: () => set({ isGenerating: false }),
  errorMessage: null,
  // su errore fermiamo anche lo spinner: niente generazione in corso con errore a video
  setError: (msg) => set({ errorMessage: msg, isGenerating: false }),
  clearError: () => set({ errorMessage: null }),
  viewMode: 'split',
  setViewMode: (mode) => set({ viewMode: mode }),
  aiModal: null,
  setAiModal: (modal) => set({ aiModal: modal }),
  outputDraft: { text: '', status: 'idle' },
  insertOutputIntoNote: () => {
    // TODO: F-05
  },
  notes: {
    list: [],
    currentId: null,
    createEmpty: () => {
      // TODO: SC-FS — crea nota vuota + persistenza localStorage (non attiva)
    },
    select: (_id) => {
      // TODO: SC-FS — seleziona nota (non attiva)
    },
  },
}))

// V9: selettore atomico — non esporre mai oggetti compositi
export const useCurrentText = () => useEditorStore((s) => s.currentText)
export const useStreamedOutput = () => useEditorStore((s) => s.streamedOutput)
export const useIsGenerating = () => useEditorStore((s) => s.isGenerating)
export const useErrorMessage = () => useEditorStore((s) => s.errorMessage)
export const useViewMode = () => useEditorStore((s) => s.viewMode)
export const useAiModal = () => useEditorStore((s) => s.aiModal)
export const useOutputDraft = () => useEditorStore((s) => s.outputDraft)
