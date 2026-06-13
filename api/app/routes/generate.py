from fastapi import APIRouter, HTTPException

from ..schemas import GenerateRequest

router = APIRouter(prefix="/api", tags=["generate"])


@router.post("/generate")
async def generate(payload: GenerateRequest) -> None:
    # Stub: la logica reale arriva in B-02. Il body model resta in firma
    # cosi' lo schema finisce nell'OpenAPI (serve a SA-02).
    raise HTTPException(status_code=501, detail="Non ancora implementato")
