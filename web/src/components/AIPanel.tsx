import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLlmStream } from '@/hooks/useLlmStream'
import {
  useCurrentText,
  useErrorMessage,
  useIsGenerating,
} from '@/store/useEditorStore'

export interface AIPanelProps {
  isGenerating: boolean
  errorMessage: string | null
  onGenerate: () => void
  onAbort: () => void
}

export function AIPanelUI({
  isGenerating,
  errorMessage,
  onGenerate,
  onAbort,
}: AIPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          aria-disabled={isGenerating}
          aria-label="Genera riassunto del testo"
          className="focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Genera Riassunto
        </Button>

        {isGenerating && (
          <Button
            type="button"
            variant="destructive"
            onClick={onAbort}
            aria-label="Interrompi generazione in corso"
            className="focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Interrompi
          </Button>
        )}

        {isGenerating && (
          <span
            role="status"
            aria-label="Generazione in corso"
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground"
          />
        )}
      </div>

      <div aria-live="polite">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default function AIPanel() {
  const { start, abort } = useLlmStream()
  const isGenerating = useIsGenerating()
  const errorMessage = useErrorMessage()
  const currentText = useCurrentText()

  return (
    <AIPanelUI
      isGenerating={isGenerating}
      errorMessage={errorMessage}
      onGenerate={() => start(currentText)}
      onAbort={abort}
    />
  )
}
