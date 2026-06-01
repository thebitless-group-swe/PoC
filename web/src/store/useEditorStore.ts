import { create } from 'zustand'

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
}))

// V9: selettore atomico — non esporre mai oggetti compositi
export const useCurrentText = () => useEditorStore((s) => s.currentText)
export const useStreamedOutput = () => useEditorStore((s) => s.streamedOutput)
export const useIsGenerating = () => useEditorStore((s) => s.isGenerating)
export const useErrorMessage = () => useEditorStore((s) => s.errorMessage)
