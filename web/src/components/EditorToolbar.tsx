import {
  Bold,
  Code,
  Heading,
  Image,
  Italic,
  Link,
  List,
  Save,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/store/useEditorStore'
import {
  cycleHeadingCommand,
  insertImageCommand,
  toggleBoldCommand,
  toggleInlineCodeCommand,
  toggleItalicCommand,
  toggleLinkCommand,
  toggleListCommand,
} from '@/lib/editorCommands'

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

type ToolLabel = (typeof formatTools)[number]['label']

export function EditorToolbar() {
  const handleAction = (label: ToolLabel) => {
    const view = useEditorStore.getState().editorView
    if (!view) return

    switch (label) {
      case 'Grassetto':
        toggleBoldCommand(view)
        break
      case 'Corsivo':
        toggleItalicCommand(view)
        break
      case 'Titolo':
        cycleHeadingCommand(view)
        break
      case 'Lista':
        toggleListCommand(view)
        break
      case 'Link':
        toggleLinkCommand(view)
        break
      case 'Immagine':
        insertImageCommand(view)
        break
      case 'Codice':
        toggleInlineCodeCommand(view)
        break
      default:
        break
    }
  }
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
            onClick={() => handleAction(label)}
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
      </div>
    </div>
  )
}

export default EditorToolbar
