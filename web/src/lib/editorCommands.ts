import { EditorView } from '@codemirror/view'

export const toggleLinkCommand = (view: EditorView): boolean => {
  const mainSelection = view.state.selection.main
  const { from, to } = mainSelection
  const selected = view.state.sliceDoc(from, to)

  const line = view.state.doc.lineAt(from)
  const lineText = line.text
  
  //Selezione esatta del link intero 
  const exactMatch = selected.match(/^\[(.*?)\]\((.*?)\)$/)
  if (exactMatch) {
    view.dispatch({
      changes: { from, to, insert: exactMatch[1] },
      selection: { anchor: from + exactMatch[1].length } 
    })
    view.focus()
    return true
  }

  //Unwrap a scansione di riga
  const linkRegex = /\[(.*?)\]\((.*?)\)/g
  let match
  while ((match = linkRegex.exec(lineText)) !== null) {
    const matchStart = line.from + match.index
    const matchEnd = matchStart + match[0].length
    
    if (from >= matchStart && to <= matchEnd) {
      view.dispatch({
        changes: { from: matchStart, to: matchEnd, insert: match[1] },
        selection: { anchor: matchStart + match[1].length }
      })
      view.focus()
      return true
    }
  }

  // Wrap standard del testo selezionato
  const defaultUrl = 'https://'
  view.dispatch({
    changes: { from, to, insert: `[${selected}](${defaultUrl})` },
    selection: { 
      // Seleziona esattamente "https://" per permettere la sovrascrittura immediata
      anchor: from + selected.length + 3, 
      head: from + selected.length + 3 + defaultUrl.length 
    }
  })
  
  view.focus()
  return true
}