import React from 'react';
import LanguageSelector from './LanguageSelector';

export default function Header({ selectedLanguage, onLanguageChange, onClearChat, messageCount, isLoading, backendStatus }) {
  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="brand-group">
          <div className="brand-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">Rural Sahayak</h1>
              <span className="brand-subtitle-hindi">ग्रामीण सहायक</span>
              <span className="prototype-badge">
                {backendStatus ? '● Live RAG Backend' : 'Offline / Standalone Mode'}
              </span>
            </div>
            <p className="brand-tagline">
              Multilingual Information Assistant for Government Schemes, Agriculture & Public Health
            </p>
          </div>
        </div>

        <div className="header-actions">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            disabled={isLoading}
          />

          <button
            type="button"
            className="clear-button"
            onClick={onClearChat}
            disabled={messageCount === 0 || isLoading}
            title="Clear current conversation"
            aria-label="Clear current conversation"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span>Clear Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
}

