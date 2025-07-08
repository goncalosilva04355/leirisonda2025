import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
  CheckCircle,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  Cloud,
  CloudOff,
} from "lucide-react";
import {
  getFirebaseStatus,
  waitForFirebaseInit,
  reinitializeFirebase,
} from "../firebase/config";

interface FirebaseConnectionStatusProps {
  className?: string;
  showWhenConnected?: boolean;
}

export function FirebaseConnectionStatus({
  className = "",
  showWhenConnected = false,
}: FirebaseConnectionStatusProps) {
  const [status, setStatus] = useState({
    app: false,
    auth: false,
    db: false,
    ready: false,
    quotaExceeded: false,
  });
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkFirebaseStatus = async () => {
    try {
      const currentStatus = getFirebaseStatus();
      setStatus(currentStatus);
      setLastCheck(new Date());

      // If not ready, try to initialize
      if (!currentStatus.ready && !currentStatus.quotaExceeded) {
        console.log("🔄 Attempting Firebase initialization...");
        await waitForFirebaseInit();
      }
    } catch (error) {
      console.warn("Firebase status check failed:", error);
    }
  };

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    try {
      console.log("🔄 User requested Firebase reconnection...");
      const success = await reinitializeFirebase();
      if (success) {
        console.log("✅ Firebase reconnection successful");
        await checkFirebaseStatus();
      } else {
        console.warn("⚠️ Firebase reconnection failed");
      }
    } catch (error) {
      console.error("❌ Error during Firebase reconnection:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkFirebaseStatus();

    // Set up periodic status checks
    const interval = setInterval(checkFirebaseStatus, 30000); // Check every 30 seconds

    // Listen for online/offline events
    const handleOnline = () => {
      console.log("🌐 Network connection restored - checking Firebase...");
      setTimeout(checkFirebaseStatus, 1000);
    };

    const handleOffline = () => {
      console.log("📱 Network connection lost - operating in offline mode");
      setStatus((prev) => ({ ...prev, ready: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // If Firebase is working and we don't want to show when connected, don't render
  if (status.ready && !showWhenConnected) {
    return null;
  }

  // If quota is exceeded, show different message
  if (status.quotaExceeded) {
    return (
      <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between">
            <span>
              Firebase temporariamente indisponível - modo local ativo
            </span>
            <span className="text-xs text-orange-600">
              Última verificação: {lastCheck.toLocaleTimeString()}
            </span>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // If Firebase is ready, show success message
  if (status.ready) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cloud className="h-4 w-4" />
              <span>Conectado ao Firebase - sincronização ativa</span>
            </div>
            <span className="text-xs text-green-600">
              {lastCheck.toLocaleTimeString()}
            </span>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Check network status
  const isOnline = navigator.onLine;

  // If offline, show network message
  if (!isOnline) {
    return (
      <Alert className={`border-gray-200 bg-gray-50 ${className}`}>
        <WifiOff className="h-4 w-4 text-gray-600" />
        <AlertDescription className="text-gray-800">
          <div className="flex items-center justify-between">
            <span>Sem conexão à internet - modo offline</span>
            <span className="text-xs text-gray-600">
              Os dados serão sincronizados quando a conexão for restaurada
            </span>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Firebase is not ready but we're online
  return (
    <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
      <CloudOff className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Conectando ao Firebase...</span>
            {isRetrying && <RefreshCw className="h-4 w-4 animate-spin" />}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-blue-600">
              {lastCheck.toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryConnection}
              disabled={isRetrying}
              className="h-6 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Tentando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Tentar
                </>
              )}
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
