"""
Cloud AI Architect V2 - Pydantic Request & Response Models
Defines clean models without preloaded fake defaults.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ArchitectPromptRequest(BaseModel):
    prompt: Optional[str] = Field(default="", description="Natural language workload description")
    budget: Optional[float] = Field(default=None, description="Optional budget override")
    dau: Optional[int] = Field(default=None, description="Optional DAU override")
    region: Optional[str] = Field(default=None, description="Optional region override")
    surge: Optional[int] = Field(default=None, description="Optional traffic surge override")
    overrideBudget: Optional[float] = Field(default=None, description="Optional budget override")
    overrideDAU: Optional[int] = Field(default=None, description="Optional DAU override")
    overrideRegion: Optional[str] = Field(default=None, description="Optional region override")
    overrideSurge: Optional[int] = Field(default=None, description="Optional traffic surge override")
    spec: Optional[Dict[str, Any]] = Field(default=None, description="Optional structured spec")

class EvaluateRequest(BaseModel):
    prompt: Optional[str] = Field(default="")
    spec: Optional[Dict[str, Any]] = Field(default=None)
    budget: Optional[float] = Field(default=None)
    dau: Optional[int] = Field(default=None)
    region: Optional[str] = Field(default=None)
    surge: Optional[int] = Field(default=None)
    overrideBudget: Optional[float] = Field(default=None)
    overrideDAU: Optional[int] = Field(default=None)
    overrideRegion: Optional[str] = Field(default=None)
    overrideSurge: Optional[int] = Field(default=None)

class BlueprintCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = Field(default="")
    spec: Dict[str, Any]
    result: Dict[str, Any]
    id: Optional[str] = Field(default=None)

BlueprintSaveRequest = BlueprintCreate

class IaCGenerateRequest(BaseModel):
    format: str = Field(default="terraform")
    providerId: str = Field(default="azure")
    workload: Dict[str, Any]
