import React from 'react';
import { SCHEDULED_LANGUAGES } from '../constants/languages';

export default function LanguageSelector({ selectedLanguage, onLanguageChange, disabled }) {
  return (
    <div className="language-selector-container">
      <label htmlFor="language-select" className="language-label">
        <svg
          className="lang-icon"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="lang-text">Language / भाषा:</span>
      </label>
      <select
        id="language-select"
        className="language-dropdown"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={disabled}
        aria-label="Select preferred language from 22 scheduled Indian languages"
      >
        {SCHEDULED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
}

