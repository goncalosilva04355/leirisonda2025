import React, { useState, useEffect } from "react";
import { Zap, ZapOff, RotateCcw, CheckCircle } from "lucide-react";
import { autoSyncService } from "../services/autoSyncService";
import { isFirestoreReady } from "../firebase/firestoreConfig";

interface PostLoginAutoSyncIndicatorProps {
  className?: string;
  showOnlyAfterLogin?: boolean;
}

export const PostLoginAutoSyncIndicator: React.FC<
  PostLoginAutoSyncIndicatorProps
> = ({ className = "", showOnlyAfterLogin = true }) => {
  const [isAutoSyncActive, setIsAutoSyncActive] = useState(false);
  const [isFirestoreReadyState, setIsFirestoreReadyState] = useState(false);
  const [hasUserLoggedIn, setHasUserLoggedIn] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncCount, setSyncCount] = useState(0);

  useEffect(() => {
    const checkStatus = () => {
      try {
        const autoSyncActive = autoSyncService.isAutoSyncActive();
        const firestoreReady = isFirestoreReady();

        setIsAutoSyncActive(autoSyncActive);
        setIsFirestoreReadyState(firestoreReady);

        if (autoSyncActive) {
          setLastSyncTime(new Date());
        }
      } catch (error) {
        console.error("❌ PostLoginAutoSync: Erro ao verificar status:", error);
      }
    };

    // Verificar status inicial
    checkStatus();

    // Listener para quando utilizador faz login
    const handleUserLoggedIn = (event: CustomEvent) => {
      const { user } = event.detail;
      console.log("🔑 PostLoginAutoSync: Utilizador logado:", user.email);
      setHasUserLoggedIn(true);

      // Verificar status após login
      setTimeout(checkStatus, 1000);
    };

    // Listener para atualizações de coleções
    const handleCollectionUpdated = (event: CustomEvent) => {
      const { collection } = event.detail;
      console.log(`🔄 PostLoginAutoSync: ${collection} atualizado`);
      setSyncCount((prev) => prev + 1);
      setLastSyncTime(new Date());
    };

    // Listener para início do auto sync
    const handleAutoSyncStarted = () => {
      console.log("🚀 PostLoginAutoSync: Auto sync iniciado");
      setIsAutoSyncActive(true);
      setLastSyncTime(new Date());
    };

    // Adicionar event listeners
    window.addEventListener(
      "userLoggedIn",
      handleUserLoggedIn as EventListener,
    );
    window.addEventListener("autoSyncStarted", handleAutoSyncStarted);

    // Listeners para atualizações de dados
    const collections = [
      "obras",
      "piscinas",
      "manutencoes",
      "utilizadores",
      "clientes",
    ];
    collections.forEach((collection) => {
      window.addEventListener(
        `${collection}Updated`,
        handleCollectionUpdated as EventListener,
      );
    });

    // Polling para verificar status (apenas em produção)
    let interval: NodeJS.Timeout | null = null;
    if (
      typeof import.meta === "undefined" ||
      !import.meta.env ||
      !import.meta.env.DEV
    ) {
      interval = setInterval(checkStatus, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener(
        "userLoggedIn",
        handleUserLoggedIn as EventListener,
      );
      window.removeEventListener("autoSyncStarted", handleAutoSyncStarted);
      collections.forEach((collection) => {
        window.removeEventListener(
          `${collection}Updated`,
          handleCollectionUpdated as EventListener,
        );
      });
    };
  }, []);

  // Se showOnlyAfterLogin é true e utilizador ainda não fez login, não mostrar
  if (showOnlyAfterLogin && !hasUserLoggedIn) {
    return null;
  }

  const getIcon = () => {
    if (isAutoSyncActive && isFirestoreReadyState) {
      return <Zap className="h-4 w-4 text-green-500" />;
    }
    if (isFirestoreReadyState) {
      return <RotateCcw className="h-4 w-4 text-blue-500" />;
    }
    return <ZapOff className="h-4 w-4 text-gray-400" />;
  };

  const getStatus = () => {
    if (isAutoSyncActive && isFirestoreReadyState) {
      return "Auto Sync ATIVO";
    }
    if (isFirestoreReadyState) {
      return "Firebase Conectado";
    }
    return "Conectando...";
  };

  const getStatusColor = () => {
    if (isAutoSyncActive && isFirestoreReadyState) {
      return "text-green-600";
    }
    if (isFirestoreReadyState) {
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
        <div className="text-xs opacity-75">
          {lastSyncTime && (
            <span>Último sync: {lastSyncTime.toLocaleTimeString()}</span>
          )}
          {syncCount > 0 && <span className="ml-2">({syncCount} syncs)</span>}
        </div>
      </div>
    </div>
  );
};

export default PostLoginAutoSyncIndicator;
