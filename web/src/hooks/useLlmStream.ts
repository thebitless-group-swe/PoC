import { useCallback, useRef, useState } from 'react'
import { useEditorStore } from '@/store/useEditorStore'

export type LlmStreamStatus = 'idle' | 'streaming' | 'done' | 'error'

const MIN_TEXT_LENGTH = 10

/**
 * Azioni dello store di cui l'hook ha bisogno. Contratto minimo implementato
 * dalle slice dello store (streaming/errore). Disaccoppia l'hook dalla forma
 * completa dello store: quando le slice lo soddisferanno, il cast in
 * `getActions` potra essere rimosso.
 */
export type EditorActions = {
  appendChunk: (chunk: string) => void
  startStreaming: () => void
  finishStreaming: () => void
  setError: (message: string) => void
}

export type LlmStreamHandle = {
  start: (text: string) => Promise<void>
  abort: () => void
  status: LlmStreamStatus
}

function getActions(): EditorActions {
  return useEditorStore.getState() as unknown as EditorActions
}

export function useLlmStream(): LlmStreamHandle {
  const [status, setStatus] = useState<LlmStreamStatus>('idle')
  const controllerRef = useRef<AbortController | null>(null)

  const abort = useCallback(() => {
    controllerRef.current?.abort()
    setStatus('idle')
  }, [])

  const start = useCallback(async (text: string) => {
    const actions = getActions()

    // Pre-validazione: stessa soglia del backend (Field min_length=10).
    if (text.trim().length < MIN_TEXT_LENGTH) {
      actions.setError('Testo troppo corto')
      setStatus('error')
      return
    }

    const controller = new AbortController()
    controllerRef.current = controller

    setStatus('streaming')
    actions.startStreaming()
  }, [])

  return { start, abort, status }
}
