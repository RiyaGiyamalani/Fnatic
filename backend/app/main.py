import sys
# Ensure console output on Windows handles UTF-8 characters cleanly
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.config import settings
from .api.v1.endpoints import router as api_v1_router
from .services.rag.vector_store import get_vector_store
from .services.database.sql_server import get_db_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Warm up vector store and initialize database connection
    print(f"[Rural Sahayak] Initializing Backend Engine v{settings.PROJECT_VERSION}...")
    vector_store = get_vector_store()
    print(f"[Knowledge Base] Successfully indexed {len(vector_store.chunk_index)} verified document chunks.")
    db = get_db_manager()
    print(f"[Storage Engine] Ready ({'MS SQL Server' if db.sql_server_available else 'SQLite Local'}).")
    yield
    print("[Rural Sahayak] Server shutting down cleanly.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Multilingual Information Assistant for Rural Indian Citizens (Government Schemes, Agriculture, Health)",
    lifespan=lifespan
)

# Enable CORS for frontend Vite client
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "status": "active",
        "documentation": "/docs",
        "api_endpoint": f"{settings.API_V1_STR}/chat"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)

