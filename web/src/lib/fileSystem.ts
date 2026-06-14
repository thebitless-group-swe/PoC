// lib/fileSystem.ts

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

/** Apre una nota leggendo un file dal filesystem (File System Access API con fallback input) */
export async function openNoteFromFile(): Promise<Note | null> {
  let text: string
  let fileName: string

  if ('showOpenFilePicker' in window) {
    // File System Access API (Chrome/Edge)
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Testo / Markdown',
            accept: { 'text/plain': ['.md', '.txt'] },
          },
        ],
        multiple: false,
      })
      const file = await fileHandle.getFile()
      text = await file.text()
      fileName = file.name
    } catch (err: any) {
      // L'utente ha annullato il picker
      if (err.name === 'AbortError') return null
      throw err
    }
  } else {
    // Fallback: <input type="file">
    text = await new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.md,.txt'
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) return resolve('')
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(reader.error)
        reader.readAsText(file)
      }
      input.oncancel = () => resolve('')
      input.click()
    })
    fileName = ''
    if (!text) return null
  }

  const now = Date.now()
  const title = fileName
    ? fileName.replace(/\.(md|txt)$/i, '')
    : 'Imported note'

  return {
    id: crypto.randomUUID(),
    title,
    content: text,
    createdAt: now,
    updatedAt: now,
  }
}

/** Salva una nota su file (stub — implementato in FS-02) */
export async function saveNoteToFile(_note: Note): Promise<void> {
  throw new Error('not implemented')
}

/** Rinomina una nota (stub — implementato in FS-04) */
export async function renameNote(_note: Note, _name: string): Promise<Note> {
  throw new Error('not implemented')
}