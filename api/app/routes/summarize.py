from fastapi import APIRouter, HTTPException, status

from ..schemas import TextRequest

router = APIRouter(prefix="/api", tags=["summarize"])


@router.post("/summarize")
async def summarize(request: TextRequest) -> None:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Endpoint stub: implementazione in POC-B-09.",
    )
