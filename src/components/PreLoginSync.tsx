import React, { useEffect, useState } from "react";
import {
  Cloud,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  isFirebaseReady,
  getFirebaseStatus,
  reinitializeFirebase,
} from "../firebase/config";
// import { authService } from "../services/authService"; // Removed - no longer exists

interface PreLoginSyncProps {
  onSyncComplete?: () => void;
}

export const PreLoginSync: React.FC<PreLoginSyncProps> = ({
  onSyncComplete,
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [firebaseStatus, setFirebaseStatus] = useState({
    available: false,
    quotaExceeded: false,
    auth: false,
    db: false,
  });
  const [syncStatus, setSyncStatus] = useState<
    "checking" | "available" | "unavailable" | "error"
  >("checking");
  const [retryCount, setRetryCount] = useState(0);

  // Check Firebase status on component mount
  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  const checkFirebaseStatus = async () => {
    setIsChecking(true);

    try {
      const status = getFirebaseStatus();
      setFirebaseStatus({
        available: status.ready,
        quotaExceeded: status.quotaExceeded || false,
        auth: status.auth,
        db: status.db,
      });

      if (status.ready) {
        setSyncStatus("available");
        console.log(
          "✅ Firebase disponível para sincronização entre dispositivos",
        );
      } else if (status.quotaExceeded) {
        setSyncStatus("error");
        console.log("⏸️ Firebase em cooldown devido a quota excedido");
      } else {
        setSyncStatus("unavailable");
        console.log("📱 Firebase não disponível - modo local apenas");
      }
    } catch (error) {
      console.warn("Erro ao verificar status do Firebase:", error);
      setSyncStatus("error");
    } finally {
      setIsChecking(false);
      onSyncComplete?.();
    }
  };

  const retryFirebaseConnection = async () => {
    if (retryCount >= 3) {
      console.log(
        "🚫 Máximo de tentativas atingido - trabalhando em modo local",
      );
      return;
    }

    setIsChecking(true);
    setRetryCount((prev) => prev + 1);

    try {
      const success = await reinitializeFirebase();
      if (success) {
        await checkFirebaseStatus();
      } else {
        setSyncStatus("unavailable");
        setIsChecking(false);
      }
    } catch (error) {
      console.warn("Erro ao tentar reconectar Firebase:", error);
      setSyncStatus("error");
      setIsChecking(false);
    }
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
    }

    switch (syncStatus) {
      case "available":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "unavailable":
        return <WifiOff className="w-5 h-5 text-orange-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    if (isChecking) {
      return "A verificar conectividade...";
    }

    switch (syncStatus) {
      case "available":
        return "Sincronização entre dispositivos disponível";
      case "unavailable":
        return "Modo local - dados limitados a este dispositivo";
      case "error":
        if (firebaseStatus.quotaExceeded) {
          return "Sincronização temporariamente pausada";
        }
        return "Erro de conectividade - a tentar novamente...";
      default:
        return "A verificar...";
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case "available":
        return "border-green-200 bg-green-50";
      case "unavailable":
        return "border-orange-200 bg-orange-50";
      case "error":
        return "border-red-200 bg-red-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div className={`rounded-lg border p-4 mb-4 ${getStatusColor()}`}>
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              Estado da Sincronização
            </p>
            {syncStatus === "error" && retryCount < 3 && (
              <button
                onClick={retryFirebaseConnection}
                disabled={isChecking}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Tentar Novamente
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{getStatusMessage()}</p>

          {syncStatus === "available" && (
            <div className="mt-2 flex items-center text-xs text-green-700">
              <Cloud className="w-4 h-4 mr-1" />
              As suas credenciais podem ser utilizadas noutros dispositivos
            </div>
          )}

          {syncStatus === "unavailable" && (
            <div className="mt-2 text-xs text-orange-700">
              💡 Para acesso multi-dispositivo, certifique-se de que tem conexão
              à internet
            </div>
          )}

          {firebaseStatus.quotaExceeded && (
            <div className="mt-2 text-xs text-red-700">
              ⏳ A sincronização será reativada automaticamente em breve
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreLoginSync;
