import { create } from 'zustand'

type EditorState = {
  _stub: true
}

export const useEditorStore = create<EditorState>(() => ({
  _stub: true,
}))
