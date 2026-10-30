import { useState, useEffect } from 'react';

/**
 * InstallPrompt — Shows a PWA install banner when the browser fires
 * the `beforeinstallprompt` event. Provides "Install App" and dismiss controls.
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Hide banner if app is already installed
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="pwa-install-banner" role="banner" aria-label="Install application">
      <div className="pwa-install-content">
        <span className="pwa-install-icon" aria-hidden="true">📲</span>
        <div className="pwa-install-text">
          <strong>Install Rural Sahayak</strong>
          <span className="pwa-install-sub">Use this app offline — fast &amp; reliable</span>
        </div>
      </div>
      <div className="pwa-install-actions">
        <button
          className="pwa-install-btn"
          onClick={handleInstall}
          aria-label="Install Rural Sahayak app"
        >
          Install App
        </button>
        <button
          className="pwa-dismiss-btn"
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
