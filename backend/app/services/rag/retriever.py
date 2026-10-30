from typing import List, Dict, Any, Optional
from .vector_store import get_vector_store

# Multilingual domain synonym map to bridge 22 Indian regional languages to knowledge concepts
MULTILINGUAL_EXPANSIONS = {
    # PM-Kisan & Schemes
    "kisan": ["kisan", "किसान", "शेतकरी", "விவசாயி", "రైతు", "কৃষক", "pm-kisan", "योजना", "scheme", "installment", "किस्त"],
    "pmkisan": ["pm-kisan", "kisan", "किसान", "installment", "किस्त", "6000", "dbt"],
    "yojana": ["yojana", "योजना", "scheme", "పథకం", "திட்டம்", "યોજના"],
    "fasal": ["fasal", "crop", "फसल", "पिक", "பயிர்", "పంట", "bima", "विमा", "insurance"],
    "ayushman": ["ayushman", "आयुष्मान", "pm-jay", "card", "cardholder", "hospital", "अस्पताल", "उपचार", "500000", "इलाज"],
    "health": ["health", "swasthya", "स्वास्थ्य", "आरोग्य", "சுகாதாரம்", "ఆరోగ్యం", "doctor", "medicine"],
    "tika": ["tika", "immunization", "vaccine", "टीकाकरण", "लसीकरण", "தடுப்பூசி", "bcg", "polio", "pentavalent"],
    "asha": ["asha", "asha worker", "आशा", "janani", "suraksha", "anc", "delivery", "1400", "maternal", "गर्भवती"],
    "soil": ["soil", "soil health", "mitti", "मिट्टी", "माती", "मृदा", "fertilizer", "khad", "खाद", "npk", "urea"],
    "rust": ["rust", "yellow rust", "peela ratua", "पीला रतुआ", "tambeera", "बुरशी", "fungicide", "wheat", "गेहूं"]
}

class MultilingualRAGRetriever:
    def __init__(self):
        self.store = get_vector_store()

    def _expand_query(self, query: str) -> str:
        words = query.lower().split()
        expanded_terms = set(words)
        
        for word in words:
            for key, syns in MULTILINGUAL_EXPANSIONS.items():
                if key in word or any(s in word for s in syns):
                    expanded_terms.update(syns)
                    
        return " ".join(expanded_terms)

    def retrieve(self, query: str, top_k: int = 3, category_hint: Optional[str] = None) -> List[Dict[str, Any]]:
        expanded_query = self._expand_query(query)
        results = self.store.search(expanded_query, top_k=top_k, category_filter=category_hint)
        
        # If strict search returned nothing, retry with basic query
        if not results:
            results = self.store.search(query, top_k=top_k)
            
        return results

_retriever: Optional[MultilingualRAGRetriever] = None

def get_retriever() -> MultilingualRAGRetriever:
    global _retriever
    if _retriever is None:
        _retriever = MultilingualRAGRetriever()
    return _retriever

