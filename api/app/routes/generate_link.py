from fastapi import APIRouter, HTTPException

from ..schemas import LinkRequest

router = APIRouter(prefix="/api", tags=["generate-link"])


@router.post("/generate-from-link")
async def generate_from_link(payload: LinkRequest) -> None:
    # Stub: la logica reale arriva in B-04/B-05. Il body model resta in firma
    # cosi' lo schema finisce nell'OpenAPI (serve a SA-02).
    raise HTTPException(status_code=501, detail="Non ancora implementato")
