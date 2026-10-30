import { useState, useEffect } from 'react';

/**
 * OfflineIndicator — A small banner that appears when the browser
 * is offline (navigator.onLine === false).
 */
export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="offline-indicator" role="status" aria-live="polite">
      <span className="offline-indicator-icon" aria-hidden="true">⚡</span>
      <span className="offline-indicator-text">
        You are offline. Cached responses may be available.
      </span>
    </div>
  );
}
