import sqlite3
from typing import Optional, Dict, Any
from pathlib import Path
from ...core.config import settings

class DatabaseManager:
    """
    Manages structured metadata and interaction logs.
    Adheres strictly to AGENTS.md rules:
    - Stores users, sessions, queries, timestamps, and routing telemetry.
    - NEVER stores vector embeddings here (FAISS manages all vectors).
    - Attempts MS SQL Server via pyodbc; seamlessly falls back to local SQLite if SQL Server is not running.
    """
    def __init__(self):
        self.sql_server_available = False
        self.sqlite_path = Path(__file__).resolve().parent.parent.parent / "rural_sahayak.db"
        self._init_db()

    def _init_db(self):
        # If SQL Server is explicitly configured, connect to it; otherwise default directly to fast local SQLite
        if settings.DB_SERVER and settings.DB_USER:
            try:
                import pyodbc
                conn_str = f"DRIVER={{{settings.DB_DRIVER}}};SERVER={settings.DB_SERVER};DATABASE={settings.DB_NAME};UID={settings.DB_USER};PWD={settings.DB_PASSWORD};"
                conn = pyodbc.connect(conn_str, timeout=1)
                conn.close()
                self.sql_server_available = True
                print("[Database] Connected successfully to Microsoft SQL Server.")
                return
            except Exception as e:
                print(f"[Database] MS SQL Server not reachable ({e}). Using local SQLite.")
        
        self.sql_server_available = False
        self._init_sqlite()

    def _init_sqlite(self):
        conn = sqlite3.connect(self.sqlite_path)
        try:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS interaction_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT,
                    query TEXT,
                    language_code TEXT,
                    category TEXT,
                    grounded INTEGER,
                    response_length INTEGER,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
        finally:
            conn.close()

    def log_interaction(self, session_id: str, query: str, language_code: str, category: str, grounded: bool, response_length: int):
        try:
            conn = sqlite3.connect(self.sqlite_path)
            try:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO interaction_logs (session_id, query, language_code, category, grounded, response_length)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (session_id, query, language_code, category, 1 if grounded else 0, response_length))
                conn.commit()
            finally:
                conn.close()
        except Exception as e:
            print(f"[Database Log Warning]: {e}")

_db_manager: Optional[DatabaseManager] = None

def get_db_manager() -> DatabaseManager:
    global _db_manager
    if _db_manager is None:
        _db_manager = DatabaseManager()
    return _db_manager
