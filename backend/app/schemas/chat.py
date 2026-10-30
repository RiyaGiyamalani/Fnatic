from pydantic import BaseModel, Field
from typing import List, Optional

class SourceCitation(BaseModel):
    title: str = Field(..., description="Document or scheme title")
    category: str = Field(..., description="Knowledge domain (Schemes, Agriculture, Health)")
    source_org: str = Field(..., description="Official government source organization")
    excerpt: str = Field(..., description="Relevant contextual excerpt")
    confidence: float = Field(default=0.85, description="Retrieval similarity score")

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Citizen's question in regional or English language")
    language_code: str = Field(default="hi", description="ISO language code of selected language (e.g. hi, mr, ta)")
    category_hint: Optional[str] = Field(default=None, description="Optional category filter")
    session_id: Optional[str] = Field(default=None, description="Client session identifier")

class ChatResponse(BaseModel):
    response_text: str = Field(..., description="Grounded response in the user's selected language")
    language_code: str = Field(..., description="Language of the response")
    category: str = Field(..., description="Identified or routed domain")
    grounded: bool = Field(default=True, description="Whether response is directly supported by official documents")
    citations: List[SourceCitation] = Field(default_factory=list, description="Retrieved government citations")
    session_id: str = Field(..., description="Session identifier")
    timestamp: str = Field(..., description="Response generation timestamp")

class VoiceTranscribeRequest(BaseModel):
    audio_base64: str = Field(..., description="Base64 encoded audio bytes")
    language_code: Optional[str] = Field(default="hi")

class VoiceTranscribeResponse(BaseModel):
    transcription: str
    detected_language: str
    confidence: float

class VoiceSynthesizeRequest(BaseModel):
    text: str
    language_code: str

class VoiceSynthesizeResponse(BaseModel):
    audio_base64: Optional[str] = None
    status: str
    message: str

