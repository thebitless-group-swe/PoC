from pydantic import BaseModel, Field


class TextRequest(BaseModel):
    text: str = Field(min_length=10)


class ErrorResponse(BaseModel):
    detail: str
