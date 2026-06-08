import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

import {
  useCurrentText,
  useIsGenerating,
  useStreamedOutput,
} from '@/store/useEditorStore'
import { useTypewriter } from '@/hooks/useTypewriter'

export function Preview() {
  const streamedOutput = useStreamedOutput()
  const isGenerating = useIsGenerating()
  const currentText = useCurrentText()

  // Consumer progressivo: avanza di pochi caratteri per frame (RAF),
  // disaccoppiando la velocità di arrivo dei chunk SSE dal rendering.
  const displayedOutput = useTypewriter(streamedOutput, isGenerating)

  // Fallback: se non c'è un output streamato dal LLM, mostriamo il testo
  // dell'editor così l'utente vede sempre l'anteprima di ciò che sta scrivendo.
  const source = displayedOutput || currentText

  return (
    <div
      className={`prose dark:prose-invert max-w-none p-4${isGenerating ? ' typing-active' : ''}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
