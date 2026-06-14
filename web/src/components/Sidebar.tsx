import { useState } from 'react'
import { useNotesList, useNotesStore, useCurrentNote } from '../store/notes'
import { openNoteFromFile, saveNoteToFile, renameNote } from '../lib/fileSystem'
import { useEditorStore } from '../store/useEditorStore'

export function Sidebar() {
  const notes = useNotesList()
  const currentNote = useCurrentNote()
  const { currentId, select, createEmpty, loadNote, updateCurrent } = useNotesStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  async function handleOpenFile() {
    const note = await openNoteFromFile()
    if (!note) return
    loadNote(note)
    useEditorStore.getState().setCurrentText(note.content)
  }

  async function handleSaveFile() {
    if (!currentNote) return
    const content = useEditorStore.getState().currentText
    await saveNoteToFile({ ...currentNote, content })
  }

  function handleSelect(id: string) {
    select(id)
    const note = useNotesStore.getState().list.find((n) => n.id === id)
    if (note) useEditorStore.getState().setCurrentText(note.content)
  }

  function startRename(note: { id: string; title: string }) {
    setEditingId(note.id)
    setEditingTitle(note.title)
  }

  async function commitRename(note: Parameters<typeof renameNote>[0]) {
    const renamed = await renameNote(note, editingTitle)
    if (currentId === note.id) {
      updateCurrent({ title: renamed.title })
    } else {
      useNotesStore.getState().updateCurrent
      // aggiorna direttamente tramite loadNote per note non correnti
      loadNote({ ...note, title: renamed.title, updatedAt: renamed.updatedAt })
    }
    setEditingId(null)
  }

  return (
    <aside className="w-64 h-full flex flex-col border-r border-gray-200 bg-gray-50">
      <div className="p-3 border-b border-gray-200 flex flex-col gap-2">
        <button
          onClick={createEmpty}
          className="w-full px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Nuova nota
        </button>
        <button
          onClick={handleOpenFile}
          className="w-full px-3 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
        >
          Apri file…
        </button>
        <button
          onClick={handleSaveFile}
          disabled={!currentNote}
          className="w-full px-3 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-40"
        >
          Salva file
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
          All Notes
        </p>
        {notes.length === 0 && (
          <p className="px-3 text-sm text-gray-400">Nessuna nota</p>
        )}
        {notes.map((note) =>
          editingId === note.id ? (
            <input
              key={note.id}
              autoFocus
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={() => commitRename(note)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename(note)
                if (e.key === 'Escape') setEditingId(null)
              }}
              className="w-full px-3 py-2 text-sm border border-blue-400 outline-none bg-white"
            />
          ) : (
            <button
              key={note.id}
              onClick={() => handleSelect(note.id)}
              onDoubleClick={() => startRename(note)}
              className={`w-full text-left px-3 py-2 text-sm truncate hover:bg-gray-100 ${
                note.id === currentId ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700'
              }`}
            >
              {note.title || 'Senza titolo'}
            </button>
          )
        )}
      </div>
    </aside>
  )
}