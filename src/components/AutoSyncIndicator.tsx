import React, { useState, useEffect } from "react";
import { Zap, ZapOff, RotateCcw, CheckCircle } from "lucide-react";

// Safe imports with fallbacks
let autoSyncService: any = null;
let isFirestoreReady: any = null;

try {
  const autoSyncModule = require("../services/autoSyncService");
  autoSyncService = autoSyncModule.autoSyncService;
} catch (error) {
  console.warn(
    "⚠️ AutoSyncIndicator: Could not import autoSyncService:",
    error,
  );
}

try {
  const firestoreModule = require("../firebase/firestoreConfig");
  isFirestoreReady = firestoreModule.isFirestoreReady;
} catch (error) {
  console.warn(
    "⚠️ AutoSyncIndicator: Could not import isFirestoreReady:",
    error,
  );
}

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
      try {
        // Verificar se os serviços estão disponíveis antes de usar
        let autoSyncActive = false;
        let firestoreReady = false;

        // Verificar autoSyncService com proteção
        try {
          if (
            autoSyncService &&
            typeof autoSyncService.isAutoSyncActive === "function"
          ) {
            autoSyncActive = autoSyncService.isAutoSyncActive();
          }
        } catch (autoSyncError) {
          console.warn(
            "⚠️ AutoSyncIndicator: Erro ao verificar autoSyncService:",
            autoSyncError,
          );
        }

        // Verificar isFirestoreReady com proteção
        try {
          if (typeof isFirestoreReady === "function") {
            firestoreReady = isFirestoreReady();
          }
        } catch (firestoreError) {
          console.warn(
            "⚠️ AutoSyncIndicator: Erro ao verificar isFirestoreReady:",
            firestoreError,
          );
        }

        setIsAutoSyncActive(autoSyncActive);
        setIsFirestoreReady(firestoreReady);

        if (autoSyncActive) {
          setLastSyncTime(new Date());
        }
      } catch (error) {
        console.error("❌ AutoSyncIndicator: Erro em checkStatus:", error);
        // Set safe defaults
        setIsAutoSyncActive(false);
        setIsFirestoreReady(false);
      }
    };

    // Verificar status inicial com proteção
    try {
      checkStatus();
    } catch (error) {
      console.error(
        "❌ AutoSyncIndicator: Erro na verificação inicial:",
        error,
      );
    }

    // Atualizar a cada 5 segundos com proteção
    const interval = setInterval(() => {
      try {
        checkStatus();
      } catch (error) {
        console.error("❌ AutoSyncIndicator: Erro no interval:", error);
      }
    }, 5000);

    // Escutar eventos de sync com proteção
    const handleAutoSyncStarted = () => {
      try {
        setIsAutoSyncActive(true);
        setLastSyncTime(new Date());
      } catch (error) {
        console.error(
          "❌ AutoSyncIndicator: Erro em handleAutoSyncStarted:",
          error,
        );
      }
    };

    const handleCollectionUpdated = () => {
      try {
        setLastSyncTime(new Date());
      } catch (error) {
        console.error(
          "❌ AutoSyncIndicator: Erro em handleCollectionUpdated:",
          error,
        );
      }
    };

    // Adicionar event listeners com proteção
    try {
      window.addEventListener("autoSyncStarted", handleAutoSyncStarted);
      window.addEventListener("obrasUpdated", handleCollectionUpdated);
      window.addEventListener("piscinasUpdated", handleCollectionUpdated);
      window.addEventListener("manutencoesUpdated", handleCollectionUpdated);
      window.addEventListener("clientesUpdated", handleCollectionUpdated);
    } catch (error) {
      console.error(
        "❌ AutoSyncIndicator: Erro ao adicionar event listeners:",
        error,
      );
    }

    return () => {
      try {
        clearInterval(interval);
        window.removeEventListener("autoSyncStarted", handleAutoSyncStarted);
        window.removeEventListener("obrasUpdated", handleCollectionUpdated);
        window.removeEventListener("piscinasUpdated", handleCollectionUpdated);
        window.removeEventListener(
          "manutencoesUpdated",
          handleCollectionUpdated,
        );
        window.removeEventListener("clientesUpdated", handleCollectionUpdated);
      } catch (error) {
        console.error("❌ AutoSyncIndicator: Erro no cleanup:", error);
      }
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
