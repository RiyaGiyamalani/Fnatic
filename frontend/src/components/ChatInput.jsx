import React, { useRef, useEffect } from 'react';

export default function ChatInput({
  inputText,
  onInputChange,
  onSendMessage,
  isLoading,
  selectedLanguageName
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading && inputText.trim()) {
      onSendMessage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const placeholderText = selectedLanguageName
    ? `Ask in ${selectedLanguageName} or English (e.g. योजना या फसल के बारे में पूछें)...`
    : 'Ask a question about schemes, farming or health...';

  return (
    <form className="chat-input-form" onSubmit={handleSubmit} aria-label="Ask a question">
      <div className="input-wrapper">
        <textarea
          ref={inputRef}
          className="chat-textarea"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          disabled={isLoading}
          rows={1}
          aria-label="Your question"
        />

        <button
          type="submit"
          className="send-button"
          disabled={!inputText.trim() || isLoading}
          aria-label="Send message"
          title="Send message"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span className="send-btn-label">Send</span>
        </button>
      </div>

      <div className="input-hint-row">
        <span className="input-hint">
          Press <strong>Enter ↵</strong> to send • Works with mobile keyboard
        </span>
        <span className="privacy-hint">
          🔒 Public information only. Never enter sensitive personal documents or OTPs.
        </span>
      </div>
    </form>
  );
}

