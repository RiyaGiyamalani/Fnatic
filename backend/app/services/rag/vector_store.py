import os
import re
import math
from pathlib import Path
from typing import List, Dict, Any, Optional

class KnowledgeDocument:
    def __init__(self, doc_id: str, title: str, category: str, source_org: str, content: str, file_path: str):
        self.doc_id = doc_id
        self.title = title
        self.category = category
        self.source_org = source_org
        self.content = content
        self.file_path = file_path
        self.chunks = self._chunk_document(content)

    def _chunk_document(self, text: str, max_chars: int = 500) -> List[str]:
        # Split into meaningful paragraphs
        raw_paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        chunks = []
        for p in raw_paragraphs:
            if len(p) <= max_chars:
                chunks.append(p)
            else:
                # Split large paragraphs by sentence/line
                lines = p.split('\n')
                current_chunk = ""
                for line in lines:
                    if len(current_chunk) + len(line) < max_chars:
                        current_chunk += " " + line
                    else:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                        current_chunk = line
                if current_chunk:
                    chunks.append(current_chunk.strip())
        return chunks if chunks else [text]

class MultilingualVectorStore:
    def __init__(self, knowledge_base_dir: Path):
        self.kb_dir = knowledge_base_dir
        self.documents: List[KnowledgeDocument] = []
        self.chunk_index: List[Dict[str, Any]] = []
        self._load_and_index()

    def _load_and_index(self):
        if not self.kb_dir.exists():
            return

        categories = {
            "government_schemes": "Government Schemes",
            "agriculture": "Agriculture & Crops",
            "health": "General Health Information"
        }

        for cat_dir, cat_name in categories.items():
            dir_path = self.kb_dir / cat_dir
            if not dir_path.exists():
                continue

            for file in dir_path.glob("*.md"):
                try:
                    with open(file, "r", encoding="utf-8") as f:
                        text = f.read()

                    # Extract title
                    title = file.stem.replace("_", " ").title()
                    source_org = "Government of India Official Portal"
                    for line in text.splitlines():
                        if line.startswith("# "):
                            title = line.replace("# ", "").strip()
                        elif "Department" in line or "Source" in line:
                            parts = line.split(":", 1)
                            if len(parts) > 1:
                                source_org = parts[1].replace("*", "").strip()

                    doc = KnowledgeDocument(
                        doc_id=file.stem,
                        title=title,
                        category=cat_name,
                        source_org=source_org,
                        content=text,
                        file_path=str(file)
                    )
                    self.documents.append(doc)

                    # Index each chunk
                    for idx, chunk in enumerate(doc.chunks):
                        self.chunk_index.append({
                            "chunk_id": f"{doc.doc_id}_{idx}",
                            "doc_title": doc.title,
                            "category": doc.category,
                            "source_org": doc.source_org,
                            "text": chunk,
                            "tokens": self._tokenize(chunk)
                        })
                except Exception as e:
                    print(f"Error indexing {file}: {e}")

    def _tokenize(self, text: str) -> List[str]:
        # Multilingual word extraction (supports Indic scripts + Latin alphanumeric)
        tokens = re.findall(r'[\w\u0900-\u0D7F]+', text.lower())
        return [t for t in tokens if len(t) > 1]

    def search(self, query: str, top_k: int = 3, category_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        query_tokens = self._tokenize(query)
        if not query_tokens or not self.chunk_index:
            return []

        results = []
        for item in self.chunk_index:
            if category_filter and item["category"].lower() != category_filter.lower():
                continue

            chunk_tokens = item["tokens"]
            if not chunk_tokens:
                continue

            # Compute term overlap score
            common = set(query_tokens).intersection(set(chunk_tokens))
            if not common:
                continue

            score = len(common) / (math.sqrt(len(query_tokens)) * math.sqrt(len(chunk_tokens)) + 1e-5)
            # Boost matches on title
            title_tokens = set(self._tokenize(item["doc_title"]))
            title_overlap = len(set(query_tokens).intersection(title_tokens))
            score += title_overlap * 0.4

            results.append({
                "title": item["doc_title"],
                "category": item["category"],
                "source_org": item["source_org"],
                "excerpt": item["text"],
                "score": float(score)
            })

        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

# Global store singleton
_vector_store: Optional[MultilingualVectorStore] = None

def get_vector_store() -> MultilingualVectorStore:
    global _vector_store
    if _vector_store is None:
        from ...core.config import settings
        _vector_store = MultilingualVectorStore(settings.KNOWLEDGE_BASE_DIR)
    return _vector_store

