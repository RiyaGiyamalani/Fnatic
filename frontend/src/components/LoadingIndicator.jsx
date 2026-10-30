import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="message-row assistant-row" aria-live="polite">
      <div className="message-avatar assistant-avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>

      <div className="message-content-wrapper">
        <div className="message-meta">
          <span className="sender-name">Rural Sahayak</span>
          <span className="mock-disclaimer-pill">Simulating Response</span>
        </div>
        <div className="message-bubble assistant-bubble loading-bubble">
          <div className="typing-dots" aria-label="Loading response">
            <span className="dot dot-1"></span>
            <span className="dot dot-2"></span>
            <span className="dot dot-3"></span>
          </div>
          <span className="loading-text">Preparing simulated answer... / उत्तर तैयार हो रहा है...</span>
        </div>
      </div>
    </div>
  );
}

