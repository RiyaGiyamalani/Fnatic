import { generateMockResponse } from '../utils/mockResponses.js';

const BACKEND_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export async function sendChatMessage(query, languageCode, categoryHint = null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(`${BACKEND_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        language_code: languageCode,
        category_hint: categoryHint
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const primaryCitation = data.citations && data.citations.length > 0 ? data.citations[0] : null;

      return {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        isMock: false,
        grounded: data.grounded,
        category: data.category,
        source: primaryCitation ? `${primaryCitation.source_org} | ${primaryCitation.title}` : 'Verified Knowledge Base',
        text: data.response_text,
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  } catch {
    // Backend offline / network fallback
    console.info('Backend unreachable, using local fallback response.');
  }

  // Graceful offline fallback
  return generateMockResponse(query, languageCode);
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    return null;
  }
  return null;
}
