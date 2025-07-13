import React, { useState, useEffect } from "react";
import { Zap, ZapOff, RotateCcw, CheckCircle } from "lucide-react";
import { autoSyncService } from "../services/autoSyncService";
import { isFirestoreReady } from "../firebase/firestoreConfig";

interface AutoSyncIndicatorProps {
  className?: string;
}

export const AutoSyncIndicator: React.FC<AutoSyncIndicatorProps> = ({
  className,
}) => {
  const [isAutoSyncActive, setIsAutoSyncActive] = useState(false);
  const [isFirestoreReady, setIsFirestoreReady] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = () => {
      const autoSyncActive = autoSyncService.isAutoSyncActive();
      const firestoreReady = isFirestoreReady();

      setIsAutoSyncActive(autoSyncActive);
      setIsFirestoreReady(firestoreReady);

      if (autoSyncActive) {
        setLastSyncTime(new Date());
      }
    };

    // Verificar status inicial
    checkStatus();

    // Atualizar a cada 5 segundos
    const interval = setInterval(checkStatus, 5000);

    // Escutar eventos de sync
    const handleAutoSyncStarted = () => {
      setIsAutoSyncActive(true);
      setLastSyncTime(new Date());
    };

    const handleCollectionUpdated = () => {
      setLastSyncTime(new Date());
    };

    window.addEventListener("autoSyncStarted", handleAutoSyncStarted);
    window.addEventListener("obrasUpdated", handleCollectionUpdated);
    window.addEventListener("piscinasUpdated", handleCollectionUpdated);
    window.addEventListener("manutencoesUpdated", handleCollectionUpdated);
    window.addEventListener("clientesUpdated", handleCollectionUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener("autoSyncStarted", handleAutoSyncStarted);
      window.removeEventListener("obrasUpdated", handleCollectionUpdated);
      window.removeEventListener("piscinasUpdated", handleCollectionUpdated);
      window.removeEventListener("manutencoesUpdated", handleCollectionUpdated);
      window.removeEventListener("clientesUpdated", handleCollectionUpdated);
    };
  }, []);

  const getIcon = () => {
    if (isAutoSyncActive && isFirestoreReady) {
      return <Zap className="h-4 w-4 text-green-500" />;
    }
    if (isFirestoreReady) {
      return <RotateCcw className="h-4 w-4 text-blue-500" />;
    }
    return <ZapOff className="h-4 w-4 text-gray-400" />;
  };

  const getStatus = () => {
    if (isAutoSyncActive && isFirestoreReady) {
      return "Sincronização Automática ATIVA";
    }
    if (isFirestoreReady) {
      return "Firebase Conectado";
    }
    return "Conectando...";
  };

  const getStatusColor = () => {
    if (isAutoSyncActive && isFirestoreReady) {
      return "text-green-600";
    }
    if (isFirestoreReady) {
      return "text-blue-600";
    }
    return "text-gray-500";
  };

  return (
    <div
      className={`flex items-center space-x-2 ${getStatusColor()} ${className}`}
    >
      {getIcon()}
      <div className="text-sm">
        <div className="font-medium">{getStatus()}</div>
        {lastSyncTime && (
          <div className="text-xs opacity-75">
            Último sync: {lastSyncTime.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoSyncIndicator;
