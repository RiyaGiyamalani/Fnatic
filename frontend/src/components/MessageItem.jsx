import React from 'react';

export default function MessageItem({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      <div className={`message-avatar ${isUser ? 'user-avatar' : 'assistant-avatar'}`} aria-hidden="true">
        {isUser ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        )}
      </div>

      <div className="message-content-wrapper">
        <div className="message-meta">
          <span className="sender-name">
            {isUser ? 'You (आप)' : 'Rural Sahayak'}
          </span>
          {!isUser && (
            <span className={message.isMock ? "mock-disclaimer-pill" : "verified-rag-pill"} title={message.isMock ? "Local mock fallback" : "Grounded in official government documents"}>
              {message.isMock ? "Mock Fallback" : "✓ Verified Official Source"}
            </span>
          )}
          <span className="message-timestamp">{message.timestamp}</span>
        </div>

        <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
          <div className="message-body">
            {message.text.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="message-paragraph">{paragraph}</p>
            ))}
          </div>

          {!isUser && message.source && (
            <div className="mock-source-box">
              <span className="source-label">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
                Grounding Source (Simulated):
              </span>
              <span className="source-value">{message.source}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

