// lib/aiActions.ts

import { useEditorStore } from '@/store/useEditorStore'

/**
 * Restituisce il testo su cui operano le azioni AI.
 * Per ora ritorna l'intero contenuto della nota corrente.
 */
export function getActiveText(): string {
  // TODO: ED-01 userà la selezione
  return useEditorStore.getState().currentText
}
