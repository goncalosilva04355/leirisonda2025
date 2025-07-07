import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useAutoDataSync,
  useFirebaseRealtimeSync,
} from "../hooks/useAutoDataSync";
import { SyncErrorBoundary } from "./SyncErrorBoundary";

interface AutoSyncContextType {
  isActive: boolean;
  syncing: boolean;
  lastSync: Date | null;
  error: string | null;
  forceSyncNow: () => Promise<void>;
  config: {
    enabled: boolean;
    syncInterval: number;
    collections: string[];
  };
}

export const AutoSyncContext = createContext<AutoSyncContextType | null>(null);

interface AutoSyncProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  syncInterval?: number;
  collections?: string[];
  showNotifications?: boolean;
}

export const AutoSyncProvider: React.FC<AutoSyncProviderProps> = ({
  children,
  enabled = true,
  syncInterval = 600000, // 10 minutos (conservativo para evitar quota exceeded)
  collections = ["users", "pools", "maintenance", "works", "clients"],
  showNotifications = false,
}) => {
  const [mounted, setMounted] = useState(false);

  // Hook principal de sincronização
  const autoSync = useAutoDataSync({
    enabled,
    syncInterval,
    collections,
  });

  // Hook para listeners em tempo real do Firebase - DISABLED to prevent quota exceeded
  // useFirebaseRealtimeSync();

  // Estado para notificações
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

  // Evita hidration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Notificações discretas (opcional)
  useEffect(() => {
    if (!showNotifications || !mounted) return;

    if (autoSync.syncing) {
      const now = Date.now();
      // Só mostra notificação se passou tempo suficiente desde a última
      if (now - lastNotificationTime > 5000) {
        console.log("🔄 Sincronizando dados...");
        setLastNotificationTime(now);
      }
    }

    if (autoSync.lastSync) {
      const now = Date.now();
      if (now - lastNotificationTime > 10000) {
        console.log(
          "✅ Dados sincronizados:",
          autoSync.lastSync.toLocaleTimeString(),
        );
        setLastNotificationTime(now);
      }
    }

    if (autoSync.error) {
      console.warn("⚠️ Erro na sincronização:", autoSync.error);
    }
  }, [
    autoSync.syncing,
    autoSync.lastSync,
    autoSync.error,
    showNotifications,
    mounted,
    lastNotificationTime,
  ]);

  // Não renderiza até estar montado para evitar hydration issues
  if (!mounted) {
    return <>{children}</>;
  }

  const contextValue: AutoSyncContextType = {
    isActive: autoSync?.isActive ?? false,
    syncing: autoSync?.syncing ?? false,
    lastSync: autoSync?.lastSync ?? null,
    error: autoSync?.error ?? null,
    forceSyncNow: autoSync?.forceSyncNow ?? (async () => {}),
    config: autoSync?.config ?? {
      enabled: false,
      syncInterval: 30000,
      collections: [],
    },
  };

  return (
    <SyncErrorBoundary>
      <AutoSyncContext.Provider value={contextValue}>
        {children}
        {/* Indicador visual opcional */}
        {showNotifications && autoSync.syncing && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm shadow-lg z-50">
            🔄 Sincronizando...
          </div>
        )}
      </AutoSyncContext.Provider>
    </SyncErrorBoundary>
  );
};

// Hook para usar o contexto
export const useAutoSync = (): AutoSyncContextType => {
  const context = useContext(AutoSyncContext);
  if (!context) {
    throw new Error("useAutoSync must be used within an AutoSyncProvider");
  }
  return context;
};

// HOC para componentes que modificam dados
export const withAutoSync = <P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> => {
  const WrappedComponent = (props: P) => {
    const { forceSyncNow } = useAutoSync();

    // Disponibiliza forceSyncNow para o componente
    const enhancedProps = {
      ...props,
      forceSyncNow,
    } as P;

    return <Component {...enhancedProps} />;
  };

  WrappedComponent.displayName = `withAutoSync(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook para interceptar mudanças de dados e forçar sync
export const useDataMutationIntercept = () => {
  const { forceSyncNow } = useAutoSync();

  // Intercepta operações de localStorage
  useEffect(() => {
    const collections = ["users", "pools", "maintenance", "works", "clients"];

    // Intercepta setItem do localStorage
    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key: string, value: string) {
      const result = originalSetItem(key, value);

      if (collections.includes(key)) {
        console.log(
          `📝 Dados modificados em ${key}, forçando sincronização...`,
        );
        setTimeout(() => forceSyncNow(), 100);
      }

      return result;
    };

    // Intercepta removeItem do localStorage
    const originalRemoveItem = localStorage.removeItem.bind(localStorage);
    localStorage.removeItem = function (key: string) {
      const result = originalRemoveItem(key);

      if (collections.includes(key)) {
        console.log(`🗑️ Dados removidos de ${key}, forçando sincronização...`);
        setTimeout(() => forceSyncNow(), 100);
      }

      return result;
    };

    return () => {
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
    };
  }, [forceSyncNow]);

  return { forceSyncNow };
};
