// lib/fileSystem.ts

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

/** Apre una nota leggendo un file dal filesystem (stub) */
export async function openNoteFromFile(): Promise<Note | null> {
  throw new Error("not implemented");
}

/** Salva una nota su file (stub) */
export async function saveNoteToFile(_note: Note): Promise<void> {
  throw new Error("not implemented");
}

/** Rinomina una nota (stub) */
export async function renameNote(_note: Note, _name: string): Promise<Note> {
  throw new Error("not implemented");
}