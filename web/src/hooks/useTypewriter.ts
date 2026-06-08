import { useEffect, useRef, useState } from 'react'

/**
 * Consumer progressivo che trasforma un testo in arrivo (streamedText) in un
 * output visualizzato carattere-per-carattere (displayedOutput), creando
 * l'effetto typewriter.
 *
 * Usa requestAnimationFrame per sincronizzarsi con il refresh del browser:
 * ad ogni frame avanza di CHARS_PER_FRAME caratteri, bilanciando fluidità
 * visiva e costo di re-render del parser Markdown a valle.
 *
 * Il loop RAF è stabile: NON viene distrutto/ricreato ad ogni chunk SSE.
 * Il testo sorgente è letto tramite ref, così l'effect dipende solo da
 * isGenerating (transizione idle↔streaming), evitando cleanup continui
 * che causerebbero micro-stutter nell'animazione.
 *
 * @param streamedText  Il testo accumulato dal backend (cresce ad ogni chunk SSE).
 * @param isGenerating  Flag di streaming attivo dallo store Zustand.
 * @returns displayedOutput  Il testo da renderizzare, che cresce gradualmente.
 */

const CHARS_PER_FRAME = 3

export function useTypewriter(
  streamedText: string,
  isGenerating: boolean,
): string {
  const [displayedOutput, setDisplayedOutput] = useState('')

  // Ref al testo sorgente: aggiornato ad ogni render senza ri-triggerare
  // l'effect del RAF. Il tick legge sempre il valore più recente.
  const streamedTextRef = useRef(streamedText)
  streamedTextRef.current = streamedText

  // Indice del prossimo carattere da "digitare". Ref per non re-triggerare
  // l'effect: viene letto/scritto solo dentro il RAF callback.
  const cursorRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  /*
   * Reset quando parte una nuova generazione: il testo visualizzato torna
   * vuoto e il cursore riparte da zero.
   */
  useEffect(() => {
    if (isGenerating) {
      setDisplayedOutput('')
      cursorRef.current = 0
    }
  }, [isGenerating])

  /*
   * Loop RAF stabile: si avvia quando isGenerating diventa true e si ferma
   * quando lo streaming è finito E tutto il testo è stato visualizzato.
   * NON dipende da streamedText → niente cleanup/restart ad ogni chunk.
   */
  useEffect(() => {
    const tick = () => {
      const cursor = cursorRef.current
      const target = streamedTextRef.current.length

      if (cursor < target) {
        const next = Math.min(cursor + CHARS_PER_FRAME, target)
        cursorRef.current = next
        setDisplayedOutput(streamedTextRef.current.slice(0, next))
        rafRef.current = requestAnimationFrame(tick)
      } else if (isGenerating) {
        // Il cursore ha raggiunto il testo disponibile ma lo streaming è
        // ancora attivo: aspettiamo il prossimo frame per nuovi chunk.
        rafRef.current = requestAnimationFrame(tick)
      }
      // Se cursor >= target E !isGenerating → streaming finito, tutto
      // visualizzato: il loop si ferma naturalmente.
    }

    if (isGenerating || cursorRef.current < streamedTextRef.current.length) {
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isGenerating])

  return displayedOutput
}
