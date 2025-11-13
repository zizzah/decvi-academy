# classes/routes.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter()

# Example Pydantic schemas
class ClassCreate(BaseModel):
    title: str
    description: str

class ClassOut(BaseModel):
    id: int
    title: str
    description: str

# In‐memory store (for example only; replace with DB logic later)
_fake_db: List[ClassOut] = []
_next_id = 1

@router.post("/classes", response_model=ClassOut)
async def create_class(payload: ClassCreate):
    global _next_id
    new_class = ClassOut(id=_next_id, title=payload.title, description=payload.description)
    _fake_db.append(new_class)
    _next_id += 1
    return new_class

@router.get("/classes", response_model=List[ClassOut])
async def list_classes():
    return _fake_db
