import React, { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export const FirebaseReactivatedNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification when Firebase is reactivated
    const hasBeenReactivated = localStorage.getItem("firebase-reactivated");
    if (!hasBeenReactivated) {
      setIsVisible(true);
      localStorage.setItem("firebase-reactivated", "true");

      // Auto-hide after 10 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
      <div className="flex items-center space-x-3">
        <CheckCircle className="h-5 w-5 text-white" />
        <div>
          <div className="font-medium">🎉 Firebase Reativado!</div>
          <div className="text-sm opacity-90">
            Sincronização em tempo real restaurada entre dispositivos
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-green-700 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
