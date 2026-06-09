import AIPanel from '@/components/AIPanel'
import { Editor } from '@/components/Editor'
import { Preview } from '@/components/Preview'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header full-width con i controlli di generazione */}
      <header className="border-b border-border px-4 py-3">
        <AIPanel />
      </header>
      
      {/*
        Griglia responsive
        - <768px (default): grid-cols-1 → Editor sopra, Preview sotto.
        - ≥768px (md):      grid-cols-2 → Editor a sinistra, Preview a destra.
      */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2">
        <section className="border-b border-border md:border-b-0 md:border-r overflow-auto min-w-0">
          <Editor />
        </section>
        <section className="overflow-auto min-w-0">
          <Preview />
        </section>
      </main>
    </div>
  )
}
