from collections.abc import AsyncIterator
#Generatore di log
import logging

from fastapi import APIRouter, Depends, Request
#Risposta ufficiale di FastApi, accetta un async generator
#Gestisce autonomamente il chunked transfer-encoding HTTP
from fastapi.responses import StreamingResponse 

from ..schemas import TextRequest
from ..llm import get_llm_client
from ..llm.client import LLMClient
from ..llm.prompts import build_summarize_messages

router = APIRouter(prefix="/api", tags=["summarize"])

logger = logging.getLogger(__name__)

@router.post("/summarize")
async def summarize(
    #Separiamo il reale contenuto dalla richiesta HTTP di fastAPI
    payload: TextRequest,
    request: Request,
    #Depends permette di aspettare prima di chiamare la funzione desiderata
    client: LLMClient = Depends(get_llm_client),
) -> StreamingResponse:
    messages = build_summarize_messages(payload.text)

    async def event_stream() -> AsyncIterator[str]:
        stream = client.stream(messages)
        try:
            async for chunk in stream:
                if await request.is_disconnected():
                    logger.info("Client disconnesso, chiudo stream riassunto")
                    return
                #Stringa formattata SSE;
                #"\n\n" separa gli eventi, standard SSE
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        finally:
            await stream.aclose()
        
    #event-stream setta l'header in maniera che identifichi l'SSE, lo processa a chunk
    return StreamingResponse(event_stream(), media_type="text/event-stream")
