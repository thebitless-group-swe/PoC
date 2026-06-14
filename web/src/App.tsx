import { Editor } from '@/components/Editor'
import { EditorToolbar } from '@/components/EditorToolbar'
import { Preview } from '@/components/Preview'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'

export default function App() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        {/*
          Griglia responsive
          - <768px (default): grid-cols-1 → Editor sopra, Preview sotto.
          - ≥768px (md):      grid-cols-2 → Editor a sinistra, Preview a destra.
        */}
        <main className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
          <section className="flex min-w-0 flex-col overflow-hidden border-b border-border md:border-b-0 md:border-r">
            <EditorToolbar />
            <div className="min-h-0 flex-1 overflow-auto">
              <Editor />
            </div>
          </section>
          <section className="min-w-0 overflow-auto">
            <Preview />
          </section>
        </main>
      </div>
    </div>
  )
}
