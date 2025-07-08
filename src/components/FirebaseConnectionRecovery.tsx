import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle, X } from "lucide-react";
import { getFirebaseStatus } from "../firebase/config";

export function FirebaseConnectionRecovery() {
  const [showRecoveryNotification, setShowRecoveryNotification] =
    useState(false);
  const [wasDisconnected, setWasDisconnected] = useState(false);

  useEffect(() => {
    const checkConnectionStatus = () => {
      const status = getFirebaseStatus();

      // If Firebase was previously disconnected and is now ready
      if (wasDisconnected && status.ready) {
        setShowRecoveryNotification(true);
        setWasDisconnected(false);

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowRecoveryNotification(false);
        }, 5000);
      }

      // Track disconnection state
      if (!status.ready && !status.quotaExceeded) {
        setWasDisconnected(true);
      }
    };

    // Check immediately
    checkConnectionStatus();

    // Set up periodic checks
    const interval = setInterval(checkConnectionStatus, 10000);

    return () => clearInterval(interval);
  }, [wasDisconnected]);

  if (!showRecoveryNotification) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <Alert className="border-green-200 bg-green-50 shadow-lg">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <div className="flex items-center justify-between">
          <AlertDescription className="text-green-800">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Firebase reconectado!</span>
              <span className="text-sm">Sincronização reativada</span>
            </div>
          </AlertDescription>
          <button
            onClick={() => setShowRecoveryNotification(false)}
            className="text-green-600 hover:text-green-800 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Alert>
    </div>
  );
}
