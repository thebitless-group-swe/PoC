import {
  Bold,
  Code,
  Heading,
  Image,
  Italic,
  Link,
  List,
  Save,
  Share2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type FormatTool = {
  label: string
  icon: typeof Bold
}

const formatTools: FormatTool[] = [
  { label: 'Grassetto', icon: Bold },
  { label: 'Corsivo', icon: Italic },
  { label: 'Titolo', icon: Heading },
  { label: 'Lista', icon: List },
  { label: 'Link', icon: Link },
  { label: 'Immagine', icon: Image },
  { label: 'Codice', icon: Code },
]

export function EditorToolbar() {
  return (
    <div
      role="toolbar"
      aria-label="Formattazione editor"
      className="flex flex-wrap items-center gap-1 border-b border-border bg-background px-2 py-2"
    >
      <div className="flex flex-wrap items-center gap-1">
        {formatTools.map(({ label, icon: Icon }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            title={label}
          >
            <Icon aria-hidden="true" />
          </Button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label="Salva nota"
        >
          <Save aria-hidden="true" />
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          aria-disabled="true"
          title="Share (non disponibile)"
          aria-label="Share (non disponibile)"
        >
          <Share2 aria-hidden="true" />
          Share
        </Button>
      </div>
    </div>
  )
}

export default EditorToolbar
