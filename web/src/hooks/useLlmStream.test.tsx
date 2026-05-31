import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLlmStream } from '@/hooks/useLlmStream'

// Store mockato: getState() restituisce spy, così l'hook e testabile senza
// le slice reali (di un altro task) e senza render dello store.
const actions = {
  appendChunk: vi.fn(),
  startStreaming: vi.fn(),
  finishStreaming: vi.fn(),
  setError: vi.fn(),
}

vi.mock('@/store/useEditorStore', () => ({
  useEditorStore: Object.assign(() => actions, { getState: () => actions }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useLlmStream — scheletro (#30)', () => {
  it('parte dallo stato idle', () => {
    const { result } = renderHook(() => useLlmStream())
    expect(result.current.status).toBe('idle')
  })

  it('start passa a streaming e notifica startStreaming', async () => {
    const { result } = renderHook(() => useLlmStream())
    await act(async () => {
      await result.current.start('testo abbastanza lungo')
    })
    await waitFor(() => expect(result.current.status).toBe('streaming'))
    expect(actions.startStreaming).toHaveBeenCalledTimes(1)
  })

  it('abort interrompe il controller e riporta a idle', async () => {
    const { result } = renderHook(() => useLlmStream())
    await act(async () => {
      await result.current.start('testo abbastanza lungo')
    })
    act(() => result.current.abort())
    await waitFor(() => expect(result.current.status).toBe('idle'))
  })
})

describe('useLlmStream — pre-validation (#31)', () => {
  it('testo piu corto di 10 caratteri: setError e nessuno startStreaming', async () => {
    const { result } = renderHook(() => useLlmStream())
    await act(async () => {
      await result.current.start('ciao')
    })
    expect(actions.setError).toHaveBeenCalledWith('Testo troppo corto')
    expect(actions.startStreaming).not.toHaveBeenCalled()
    await waitFor(() => expect(result.current.status).toBe('error'))
  })

  it('conta i caratteri dopo trim (solo spazi: troppo corto)', async () => {
    const { result } = renderHook(() => useLlmStream())
    await act(async () => {
      await result.current.start('          ')
    })
    expect(actions.setError).toHaveBeenCalledWith('Testo troppo corto')
  })
})
