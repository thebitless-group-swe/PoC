import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useEditorStore,
  useCurrentText,
  useStreamedOutput,
  useIsGenerating,
  useErrorMessage,
} from './useEditorStore'

beforeEach(() => {
  useEditorStore.setState({
    currentText: '',
    streamedOutput: '',
    isGenerating: false,
    errorMessage: null,
  })
})

describe('useEditorStore', () => {
  it('stato iniziale: currentText è una stringa vuota', () => {
    const { result } = renderHook(() => useCurrentText())
    expect(result.current).toBe('')
  })

  it('setCurrentText aggiorna currentText', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => {
      result.current.setCurrentText('ciao mondo')
    })
    expect(result.current.currentText).toBe('ciao mondo')
  })

  it('reset riporta currentText a stringa vuota', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => {
      result.current.setCurrentText('testo modificato')
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.currentText).toBe('')
  })
})

describe('useEditorStore — slice streaming', () => {
  it('startStreaming inizializza: isGenerating a true, streamedOutput vuoto', () => {
    const { result } = renderHook(() => useEditorStore())
    // sporco lo stato per dimostrare che startStreaming azzera l'output
    act(() => {
      result.current.appendChunk('residuo precedente')
    })
    act(() => {
      result.current.startStreaming()
    })
    expect(result.current.isGenerating).toBe(true)
    expect(result.current.streamedOutput).toBe('')
  })

  it('finishStreaming spegne isGenerating', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => {
      result.current.startStreaming()
    })
    act(() => {
      result.current.finishStreaming()
    })
    expect(result.current.isGenerating).toBe(false)
  })

  it('appendChunk consecutivi concatenano senza perdere dati (callback form)', () => {
    const { result } = renderHook(() => useEditorStore())
    // due chiamate nello stesso act, senza re-render intermedio: la forma a
    // callback legge sempre lo stato più recente, quindi nessun chunk va perso
    act(() => {
      result.current.appendChunk('a')
      result.current.appendChunk('b')
    })
    expect(result.current.streamedOutput).toBe('ab')
  })

  it('useStreamedOutput e useIsGenerating riflettono lo stato corrente', () => {
    const output = renderHook(() => useStreamedOutput())
    const generating = renderHook(() => useIsGenerating())
    act(() => {
      useEditorStore.getState().startStreaming()
      useEditorStore.getState().appendChunk('ciao')
    })
    expect(output.result.current).toBe('ciao')
    expect(generating.result.current).toBe(true)
  })
})

describe('useEditorStore — slice error', () => {
  it('stato iniziale: errorMessage è null', () => {
    const { result } = renderHook(() => useErrorMessage())
    expect(result.current).toBeNull()
  })

  it('setError aggiorna il messaggio e spegne isGenerating', () => {
    const { result } = renderHook(() => useEditorStore())
    // simulo una generazione in corso che viene interrotta da un errore
    act(() => {
      result.current.startStreaming()
    })
    act(() => {
      result.current.setError('Servizio temporaneamente non disponibile')
    })
    expect(result.current.errorMessage).toBe(
      'Servizio temporaneamente non disponibile',
    )
    expect(result.current.isGenerating).toBe(false)
  })

  it('clearError riporta errorMessage a null', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => {
      result.current.setError('errore qualsiasi')
    })
    act(() => {
      result.current.clearError()
    })
    expect(result.current.errorMessage).toBeNull()
  })
})
