import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

import { useCurrentText, useStreamedOutput } from '@/store/useEditorStore'

export function Preview() {
  const streamedOutput = useStreamedOutput()
  const currentText = useCurrentText()

  // Fallback: se non c'è un output streamato dal LLM, mostriamo il testo
  // dell'editor così l'utente vede sempre l'anteprima di ciò che sta scrivendo.
  const source = streamedOutput || currentText

  return (
    <div className="prose dark:prose-invert max-w-none p-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
