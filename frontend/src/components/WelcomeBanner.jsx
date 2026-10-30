import React from 'react';

export default function WelcomeBanner({ onSelectSampleQuery }) {
  const sampleQueries = [
    {
      topic: 'PM-Kisan Scheme',
      query: 'पीएम किसान सम्मान निधि योजना के तहत कितनी सहायता मिलती है?',
      category: 'Government Schemes'
    },
    {
      topic: 'Crop Advisory',
      query: 'गेहूं की फसल में पीला रतुआ रोग से बचाव के क्या उपाय हैं?',
      category: 'Agriculture'
    },
    {
      topic: 'Ayushman Bharat',
      query: 'आयुष्मान भारत योजना के तहत मुफ्त इलाज के लिए क्या नियम हैं?',
      category: 'Health'
    }
  ];

  return (
    <section className="welcome-banner" aria-label="Welcome and Application Purpose">
      <div className="welcome-header">
        <div className="welcome-badge">Welcome • स्वागत है</div>
        <h2 className="welcome-title">नमस्ते! ग्रामीण सहायक में आपका स्वागत है</h2>
        <p className="welcome-description">
          This digital assistant is designed to help farmers, rural citizens, ASHA workers, and Panchayat members easily access official information in regional Indian languages.
        </p>
      </div>

      <div className="pillars-grid">
        <div className="pillar-card pillar-schemes">
          <div className="pillar-icon" aria-hidden="true">🏛️</div>
          <h3 className="pillar-heading">Government Schemes</h3>
          <p className="pillar-text">
            PM-Kisan, Ayushman Bharat, PMAY, Ration Card entitlements, and state welfare policies.
          </p>
        </div>

        <div className="pillar-card pillar-agriculture">
          <div className="pillar-icon" aria-hidden="true">🌾</div>
          <h3 className="pillar-heading">Agriculture & Crops</h3>
          <p className="pillar-text">
            Crop advisory, pest prevention, organic solutions, MSP rates, and weather alerts.
          </p>
        </div>

        <div className="pillar-card pillar-health">
          <div className="pillar-icon" aria-hidden="true">🏥</div>
          <h3 className="pillar-heading">General Health</h3>
          <p className="pillar-text">
            Maternal care, child immunization schedules, public health awareness, and ASHA guidance.
          </p>
        </div>
      </div>

      <div className="sample-queries-section">
        <span className="sample-queries-label">Try asking a sample question / उदाहरण प्रश्न:</span>
        <div className="sample-pills">
          {sampleQueries.map((item, index) => (
            <button
              key={index}
              type="button"
              className="sample-pill-btn"
              onClick={() => onSelectSampleQuery(item.query)}
            >
              <span className="sample-pill-tag">{item.category}</span>
              <span className="sample-pill-text">{item.query}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="notice-banner">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>
          <strong>Phase 1 Note:</strong> This is an initial frontend interface. Responses are generated locally as sample mock data to validate usability. Actual verified RAG retrieval with Qwen3 and LangChain will be integrated in Phase 2.
        </span>
      </div>
    </section>
  );
}

