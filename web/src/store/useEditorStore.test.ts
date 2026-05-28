import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEditorStore, useCurrentText } from './useEditorStore'

beforeEach(() => {
  useEditorStore.setState({ currentText: '' })
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
