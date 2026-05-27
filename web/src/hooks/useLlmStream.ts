export type LlmStreamStatus = 'idle' | 'streaming' | 'done' | 'error'

export type LlmStreamHandle = {
  start: (text: string) => Promise<void>
  abort: () => void
  status: LlmStreamStatus
}

export function useLlmStream(): LlmStreamHandle {
  return {
    start: async (_text: string) => {
      throw new Error('not implemented')
    },
    abort: () => {},
    status: 'idle',
  }
}
