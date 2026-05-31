import { useCallback, useRef, useState } from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { parseSseStream } from '@/lib/sse'

export type LlmStreamStatus = 'idle' | 'streaming' | 'done' | 'error'

const MIN_TEXT_LENGTH = 10
const SUMMARIZE_ENDPOINT = '/api/summarize'

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

export function useLlmStream(
  fetchImpl: typeof fetch = globalThis.fetch,
): LlmStreamHandle {
  const [status, setStatus] = useState<LlmStreamStatus>('idle')
  const controllerRef = useRef<AbortController | null>(null)

  const abort = useCallback(() => {
    controllerRef.current?.abort()
    setStatus('idle')
  }, [])

  const start = useCallback(
    async (text: string) => {
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

      try {
        const response = await fetchImpl(SUMMARIZE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const body = await response.json().catch(() => null)
          actions.setError(body?.detail ?? `Errore ${response.status}`)
          setStatus('error')
          return
        }

        const reader = response.body!.getReader()
        for await (const chunk of parseSseStream(reader)) {
          actions.appendChunk(chunk)
        }

        setStatus('done')
        actions.finishStreaming()
      } catch (error) {
        // L'abort dell'utente non e un errore: torna a idle senza alert.
        if (error instanceof DOMException && error.name === 'AbortError') {
          setStatus('idle')
          return
        }
        actions.setError('Errore di connessione')
        setStatus('error')
      }
    },
    [fetchImpl],
  )

  return { start, abort, status }
}
