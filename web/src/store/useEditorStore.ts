import { create } from 'zustand'
import { EditorView } from '@codemirror/view'
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
  selectedText: string
  setSelectedText: (text: string) => void
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
  discardOutput: () => void
  notes: NotesSlice
  editorView: EditorView | null
  setEditorView: (view: EditorView | null) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  currentText: '',
  setCurrentText: (text) => set({ currentText: text }),
  selectedText: '',
  setSelectedText: (text) => set({ selectedText: text }),
  reset: () => set({ currentText: '', selectedText: '' }),
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
    const { currentText, streamedOutput, selectedText } = get()
    const output = streamedOutput.trim()
    if (!output) return

    if (selectedText.length > 0) {
      const idx = currentText.indexOf(selectedText)
      if (idx !== -1) {
        set({
          currentText:
            currentText.slice(0, idx) +
            output +
            currentText.slice(idx + selectedText.length),
          streamedOutput: '',
          selectedText: '',
          aiModal: null,
        })
        return
      }
    }

    // Nessuna selezione (o selezione non più presente nel testo): accoda.
    const sep =
      currentText.length > 0 && !currentText.endsWith('\n') ? '\n\n' : ''
    set({
      currentText: currentText + sep + output,
      streamedOutput: '',
      aiModal: null,
    })
  },
  discardOutput: () =>
    set({
      streamedOutput: '',
      errorMessage: null,
      aiModal: null,
    }),
  notes: {
    list: [],
    currentId: null,
    createEmpty: () => {
      // TODO: SC-FS — crea nota vuota + persistenza localStorage (non attiva)
    },
    select: () => {
      // TODO: SC-FS — seleziona nota (non attiva)
    },
  },
  editorView: null,
  setEditorView: (view) => set({ editorView: view })
}))

// V9: selettore atomico — non esporre mai oggetti compositi
export const useSelectedText = () => useEditorStore((s) => s.selectedText)
export const useCurrentText = () => useEditorStore((s) => s.currentText)
export const useStreamedOutput = () => useEditorStore((s) => s.streamedOutput)
export const useIsGenerating = () => useEditorStore((s) => s.isGenerating)
export const useErrorMessage = () => useEditorStore((s) => s.errorMessage)
export const useViewMode = () => useEditorStore((s) => s.viewMode)
export const useAiModal = () => useEditorStore((s) => s.aiModal)
export const useOutputDraft = () => useEditorStore((s) => s.outputDraft)
