import type { ReactNode } from 'react'
import {
  Languages,
  Sparkles,
  Wand2,
  FileText,
} from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useLlmStream } from '@/hooks/useLlmStream'
import {
  useAiModal,
  useCurrentText,
  useEditorStore,
  useErrorMessage,
  useIsGenerating,
} from '@/store/useEditorStore'

type AiAction = {
  label: string
  icon: ReactNode
}

const disabledActions: AiAction[] = [
  { label: 'Migliora', icon: <Wand2 aria-hidden="true" /> },
  { label: 'Traduci', icon: <Languages aria-hidden="true" /> },
  {
    label: 'Analisi',
    icon: (
      <span aria-hidden="true" className="grayscale brightness-0 opacity-100">
        🧢
      </span>
    ),
  },
]

export interface TopBarProps {
  noteTitle?: string
}

export function TopBar({ noteTitle = 'Untitled Note' }: TopBarProps) {
  const { start, abort } = useLlmStream()
  const isGenerating = useIsGenerating()
  const errorMessage = useErrorMessage()
  const currentText = useCurrentText()
  const aiModal = useAiModal()
  const showStreamingUi = isGenerating && aiModal === null

  const onRun = () => start(currentText)
  const onSummarize = () => {
    useEditorStore.setState({
      streamedOutput: '',
      errorMessage: null,
      aiModal: 'summarize',
    })
  }

  return (
    <header className="flex flex-col gap-2 border-b border-border bg-background px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1 basis-full md:basis-auto">
          <div
            role="heading"
            aria-level={1}
            className="truncate text-base font-semibold text-foreground"
          >
            {noteTitle}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onRun}
            disabled={isGenerating}
            aria-disabled={isGenerating}
            aria-label="Genera"
          >
            <Sparkles aria-hidden="true" />
            Genera
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onSummarize}
            disabled={isGenerating}
            aria-disabled={isGenerating}
            aria-label="Riassumi"
          >
            <FileText aria-hidden="true" />
            Riassumi
          </Button>

          {disabledActions.map(({ label, icon }) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              size="sm"
              disabled
              aria-disabled="true"
              title={`${label} (non disponibile)`}
            >
              {icon}
              {label}
            </Button>
          ))}

          {showStreamingUi && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={abort}
              aria-label="Interrompi generazione in corso"
            >
              Interrompi
            </Button>
          )}

          {showStreamingUi && (
            <span
              role="status"
              aria-label="Generazione in corso"
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground"
            />
          )}
        </div>
      </div>

      <div aria-live="polite">
        {errorMessage && aiModal === null && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </header>
  )
}

export default TopBar
