from collections.abc import AsyncIterator

from fastapi import APIRouter, Depends
#Risposta ufficiale di FastApi, accetta un async generator
#Gestisce autonomamente il chunked transfer-encoding HTTP
from fastapi.responses import StreamingResponse 

from ..schemas import TextRequest
from ..llm import get_llm_client
from ..llm.client import LLMClient
from ..llm.prompts import build_summarize_messages

router = APIRouter(prefix="/api", tags=["summarize"])


@router.post("/summarize")
async def summarize(
    request: TextRequest,
    #Depends permette di aspettare prima di chiamare la funzione desiderata
    client: LLMClient = Depends(get_llm_client),
) -> StreamingResponse:
    messages = build_summarize_messages(request.text)

    async def event_stream() -> AsyncIterator[str]:
        async for chunk in client.stream(messages):
            #Stringa formattata SSE; 
            #"\n\n" separa gli eventi, standard SSE
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    #event-stream setta l'header in maniera che identifichi l'SSE, lo processa a chunk
    return StreamingResponse(event_stream(), media_type="text/event-stream")
