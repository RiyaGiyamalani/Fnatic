from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import uuid

from ...schemas.chat import (
    ChatRequest, ChatResponse, SourceCitation,
    VoiceTranscribeRequest, VoiceTranscribeResponse,
    VoiceSynthesizeRequest, VoiceSynthesizeResponse
)
from ...services.rag.retriever import get_retriever, MultilingualRAGRetriever
from ...services.llm.qwen_service import get_llm_service, QwenLLMService
from ...services.database.sql_server import get_db_manager, DatabaseManager
from ...services.asr.whisper_service import whisper_service
from ...services.tts.sherpa_service import sherpa_service
from ...services.sms.sms_service import sms_service
from ...core.config import settings

router = APIRouter()

@router.get("/health", tags=["System"])
async def health_check():
    db = get_db_manager()
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "database_backend": "Microsoft SQL Server" if db.sql_server_available else "Local SQLite Storage",
        "rag_knowledge_loaded": True,
        "llm_runtime": "Local Qwen3 1.7B Engine"
    }

@router.post("/chat", response_model=ChatResponse, tags=["RAG Chatbot"])
async def handle_chat(
    request: ChatRequest,
    retriever: MultilingualRAGRetriever = Depends(get_retriever),
    llm: QwenLLMService = Depends(get_llm_service),
    db: DatabaseManager = Depends(get_db_manager)
):
    session_id = request.session_id or str(uuid.uuid4())
    
    # Step 1: Multilingual RAG Retrieval from verified knowledge base
    retrieved_chunks = retriever.retrieve(
        query=request.query,
        top_k=3,
        category_hint=request.category_hint
    )

    # Step 2: Grounded generation via Qwen LLM
    llm_result = llm.generate_response(
        query=request.query,
        language_code=request.language_code,
        retrieved_contexts=retrieved_chunks
    )

    # Step 3: Format official government citations
    citations = [
        SourceCitation(
            title=chunk["title"],
            category=chunk["category"],
            source_org=chunk["source_org"],
            excerpt=chunk["excerpt"],
            confidence=round(chunk["score"], 2)
        )
        for chunk in retrieved_chunks
    ]

    identified_category = retrieved_chunks[0]["category"] if retrieved_chunks else "General Inquiry"

    # Step 4: Structured logging in SQL database
    db.log_interaction(
        session_id=session_id,
        query=request.query,
        language_code=request.language_code,
        category=identified_category,
        grounded=llm_result["grounded"],
        response_length=len(llm_result["text"])
    )

    return ChatResponse(
        response_text=llm_result["text"],
        language_code=request.language_code,
        category=identified_category,
        grounded=llm_result["grounded"],
        citations=citations,
        session_id=session_id,
        timestamp=datetime.utcnow().isoformat()
    )

@router.post("/voice/transcribe", response_model=VoiceTranscribeResponse, tags=["Speech-to-Text"])
async def transcribe_speech(request: VoiceTranscribeRequest):
    result = await whisper_service.transcribe_audio(request.audio_base64.encode('utf-8'), request.language_code or "hi")
    return VoiceTranscribeResponse(**result)

@router.post("/voice/synthesize", response_model=VoiceSynthesizeResponse, tags=["Text-to-Speech"])
async def synthesize_speech(request: VoiceSynthesizeRequest):
    result = await sherpa_service.synthesize(request.text, request.language_code)
    return VoiceSynthesizeResponse(**result)

@router.post("/sms/send", tags=["SMS Fallback"])
async def send_sms_fallback(phone_number: str, message: str):
    return await sms_service.send_sms_advisory(phone_number, message)
