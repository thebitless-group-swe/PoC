from typing import Literal


SummaryLength = Literal["breve", "medio", "dettagliato"]

LENGTH_INSTRUCTIONS: dict[SummaryLength, str] = {
    "breve": "1-2 frasi che catturino solo l'idea centrale del testo.",
    "medio": "3-5 frasi che coprano l'idea centrale e i principali concetti di supporto.",
    "dettagliato": "6-10 frasi che esprimano l'idea centrale, i concetti principali e i dettagli rilevanti, mantenendo comunque concisione.",
}

SUMMARIZE_SYSTEM_PROMPT = """\
    Sei un assistente esperto nella sintesi di testi. Il tuo compito è
    produrre un riassunto fedele del testo che l'utente ti fornirà nel
    messaggio successivo.

    Regole di contenuto:
    - Riassumi unicamente le informazioni presenti nel testo dell'utente,
    senza aggiungere conoscenze esterne, opinioni o interpretazioni.
    - Mantieni invariati fatti, nomi propri, date e dati numerici così
    come compaiono nel testo originale.
    - Se il testo è ambiguo o incompleto, riflettilo nel riassunto senza
    colmare i vuoti con supposizioni.

    Regole di forma:
    - Scrivi il riassunto in italiano, indipendentemente dalla lingua del
    testo di input.
    - Usa prosa neutra, in terza persona, con registro discorsivo.
    - Non aggiungere preamboli, titoli, meta-commenti o frasi del tipo
    "Ecco il riassunto". Restituisci direttamente il testo del riassunto.

    Lunghezza richiesta: {length_instruction}
"""

def build_summarize_messages(
        text: str,
        length: SummaryLength="medio",
) -> list[dict]:
    system_content = SUMMARIZE_SYSTEM_PROMPT.format(length_instruction = LENGTH_INSTRUCTIONS[length])
    return [
        {"role": "system", "content": system_content},
        {"role": "user", "content": text},
    ]