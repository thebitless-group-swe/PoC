import { useNotesList, useNotesStore } from '../store/notes'
import { openNoteFromFile } from '../lib/fileSystem'
import { useEditorStore } from '../store/useEditorStore'

export function Sidebar() {
  const notes = useNotesList()
  const { currentId, select, createEmpty, loadNote } = useNotesStore()

  async function handleOpenFile() {
    const note = await openNoteFromFile()
    if (!note) return
    loadNote(note)
    useEditorStore.getState().setCurrentText(note.content)
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
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
          All Notes
        </p>
        {notes.length === 0 && (
          <p className="px-3 text-sm text-gray-400">Nessuna nota</p>
        )}
        {notes.map((note) => (
          <button
            key={note.id}
            onClick={() => select(note.id)}
            className={`w-full text-left px-3 py-2 text-sm truncate hover:bg-gray-100 ${
              note.id === currentId ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700'
            }`}
          >
            {note.title || 'Senza titolo'}
          </button>
        ))}
      </div>
    </aside>
  )
}