from pydantic import BaseModel, EmailStr, model_validator

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    confirm_password: str

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class RegisterResponse(BaseModel):
    message: str
    email: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ReviewRequest(BaseModel):
    code: str
    language: str = "auto"

class Issue(BaseModel):
    severity: str
    type: str
    line_hint: str
    description: str

class ChunkReport(BaseModel):
    chunk_index: int
    language: str
    issues: list[Issue]
    summary: str