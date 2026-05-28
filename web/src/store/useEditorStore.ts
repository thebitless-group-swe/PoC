import { create } from 'zustand'

interface EditorState {
  currentText: string
  setCurrentText: (text: string) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  currentText: '',
  setCurrentText: (text) => set({ currentText: text }),
  reset: () => set({ currentText: '' }),
}))

// V9: selettore atomico — non esporre mai oggetti compositi
export const useCurrentText = () => useEditorStore((s) => s.currentText)
