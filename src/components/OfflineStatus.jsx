import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
      <WifiOff size={16} />
      <span>غير متصل بالإنترنت - البيانات محفوظة محلياً</span>
    </div>
  );
};

export default OfflineStatus;