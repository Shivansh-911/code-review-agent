from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ReviewRequest(BaseModel):
    code: str
    language: str = "auto"  # hint, not enforced

class Issue(BaseModel):
    severity: str        # critical | warning | suggestion
    type: str
    line_hint: str
    description: str

class ChunkReport(BaseModel):
    chunk_index: int
    language: str
    issues: list[Issue]
    summary: str