import unittest
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

from backend.app.services.rag.vector_store import get_vector_store
from backend.app.services.rag.retriever import get_retriever
from backend.app.services.llm.qwen_service import get_llm_service
from backend.app.services.database.sql_server import get_db_manager

class TestRuralSahayakBackend(unittest.TestCase):

    def setUp(self):
        self.vector_store = get_vector_store()
        self.retriever = get_retriever()
        self.llm = get_llm_service()
        self.db = get_db_manager()

    def test_1_knowledge_base_indexing(self):
        """Verify knowledge base documents are parsed and indexed."""
        self.assertGreater(len(self.vector_store.documents), 0, "Documents must be loaded")
        self.assertGreater(len(self.vector_store.chunk_index), 0, "Document chunks must be indexed")
        print(f"Loaded {len(self.vector_store.documents)} docs and {len(self.vector_store.chunk_index)} chunks.")

    def test_2_pm_kisan_retrieval(self):
        """Verify PM-Kisan scheme query retrieves verified document."""
        query = "पीएम किसान सम्मान निधि योजना में कितने पैसे मिलते हैं?"
        results = self.retriever.retrieve(query, top_k=2)
        self.assertGreater(len(results), 0, "Should return at least 1 citation")
        self.assertIn("Kisan", results[0]["title"], "Top result must match PM-Kisan")
        self.assertEqual(results[0]["category"], "Government Schemes")

    def test_3_agriculture_wheat_retrieval(self):
        """Verify wheat pest and yellow rust advisory retrieval."""
        query = "गेहूं की फसल में पीला रतुआ रोग से कैसे बचें?"
        results = self.retriever.retrieve(query, top_k=2)
        self.assertGreater(len(results), 0)
        self.assertEqual(results[0]["category"], "Agriculture & Crops")
        self.assertIn("Wheat", results[0]["title"])

    def test_4_health_retrieval(self):
        """Verify maternal health and ASHA guidance retrieval."""
        query = "गर्भवती महिला के लिए जननी सुरक्षा योजना और आशा कार्यकर्ता की सहायता"
        results = self.retriever.retrieve(query, top_k=2)
        self.assertGreater(len(results), 0)
        self.assertEqual(results[0]["category"], "General Health Information")

    def test_5_abstention_on_unknown(self):
        """Verify retriever returns empty on completely unrelated query and LLM abstains."""
        query = "xyznonexistentqueryrocketscience9988"
        results = self.retriever.retrieve(query)
        self.assertEqual(len(results), 0, "Unrelated query should yield 0 results")
        
        res = self.llm.generate_response(query, "hi", results)
        self.assertFalse(res["grounded"], "Should be marked ungrounded")
        self.assertIn("माफ़ कीजिए", res["text"], "Must politely abstain")

    def test_6_database_logging(self):
        """Verify interaction logging works without raising exceptions."""
        self.db.log_interaction("test-sess-1", "Test query", "hi", "Government Schemes", True, 120)
        self.assertTrue(True)

if __name__ == "__main__":
    unittest.main()
