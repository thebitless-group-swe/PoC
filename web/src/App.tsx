import AIPanel from '@/components/AIPanel'
import { Editor } from '@/components/Editor'
import { Preview } from '@/components/Preview'
import { useViewMode } from '@/store/useEditorStore'

export default function App() {
  const viewMode = useViewMode()

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
      <main
        className={
          viewMode === 'split'
            ? 'flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0'
            : 'flex-1 flex flex-col min-h-0'
        }
      >
        {/* Mostra l'Editor se in modalità editor o split */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <section 
            className={`overflow-auto min-w-0 ${
              viewMode === 'split' 
                ? 'border-b border-border md:border-b-0 md:border-r' 
                : 'flex-1'
            }`}
          >
            <Editor />
          </section>
        )}

        {/* Mostra la Preview se in modalità render o split */}
        {(viewMode === 'render' || viewMode === 'split') && (
          <section 
            className={`overflow-auto min-w-0 ${
              viewMode !== 'split' ? 'flex-1' : ''
            }`}
          >
            <Preview />
          </section>
        )}
      </main>
    </div>
  )
}
