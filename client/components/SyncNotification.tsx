import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  Users,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";

interface SyncEvent {
  type: "sync_complete" | "sync_error" | "new_data" | "offline" | "online";
  message: string;
  timestamp: Date;
  details?: any;
}

export function SyncNotification() {
  const { user } = useAuth();
  const { isOnline, isSyncing, lastSync, works, maintenances } =
    useFirebaseSync();
  const [notifications, setNotifications] = useState<SyncEvent[]>([]);
  const [lastWorksCount, setLastWorksCount] = useState(works.length);
  const [lastMaintenancesCount, setLastMaintenancesCount] = useState(
    maintenances.length,
  );
  const [isVisible, setIsVisible] = useState(false);

  // Monitor changes in data count for sync notifications
  useEffect(() => {
    if (works.length > lastWorksCount) {
      const newWorksCount = works.length - lastWorksCount;
      addNotification({
        type: "new_data",
        message: `${newWorksCount} nova${newWorksCount > 1 ? "s" : ""} obra${newWorksCount > 1 ? "s" : ""} sincronizada${newWorksCount > 1 ? "s" : ""}`,
        timestamp: new Date(),
        details: { newCount: newWorksCount, totalWorks: works.length },
      });
    }
    setLastWorksCount(works.length);
  }, [works.length, lastWorksCount]);

  useEffect(() => {
    if (maintenances.length > lastMaintenancesCount) {
      const newMaintenancesCount = maintenances.length - lastMaintenancesCount;
      addNotification({
        type: "new_data",
        message: `${newMaintenancesCount} nova${newMaintenancesCount > 1 ? "s" : ""} manutenção${newMaintenancesCount > 1 ? "ões" : ""} sincronizada${newMaintenancesCount > 1 ? "s" : ""}`,
        timestamp: new Date(),
        details: {
          newCount: newMaintenancesCount,
          totalMaintenances: maintenances.length,
        },
      });
    }
    setLastMaintenancesCount(maintenances.length);
  }, [maintenances.length, lastMaintenancesCount]);

  // Monitor online/offline status
  useEffect(() => {
    if (isOnline) {
      addNotification({
        type: "online",
        message: "Dispositivo online - sincronização ativa",
        timestamp: new Date(),
      });
    } else {
      addNotification({
        type: "offline",
        message: "Dispositivo offline - modo local ativo",
        timestamp: new Date(),
      });
    }
  }, [isOnline]);

  // Monitor sync completion
  useEffect(() => {
    if (lastSync && !isSyncing) {
      addNotification({
        type: "sync_complete",
        message: "Sincronização completa",
        timestamp: lastSync,
        details: { works: works.length, maintenances: maintenances.length },
      });
    }
  }, [lastSync, isSyncing]);

  // Listen for cross-device notifications
  useEffect(() => {
    const handleCrossDeviceUpdate = (event: CustomEvent) => {
      addNotification({
        type: "new_data",
        message: "Dados atualizados de outro dispositivo",
        timestamp: new Date(),
        details: event.detail,
      });
    };

    const handleSyncTrigger = (event: CustomEvent) => {
      console.log("🔔 Sync trigger notification:", event.detail);
      if (event.detail.source === "firebase_listener") {
        // Only show notification if there's actually new data
        // This is handled by the count monitoring above
      } else if (event.detail.source === "manual_test") {
        addNotification({
          type: "new_data",
          message: `Teste de sincronização recebido (${event.detail.testId})`,
          timestamp: new Date(),
          details: event.detail,
        });
      }
    };

    window.addEventListener(
      "leirisonda_works_updated",
      handleCrossDeviceUpdate as EventListener,
    );
    window.addEventListener(
      "leirisonda_sync_trigger",
      handleSyncTrigger as EventListener,
    );

    return () => {
      window.removeEventListener(
        "leirisonda_works_updated",
        handleCrossDeviceUpdate as EventListener,
      );
      window.removeEventListener(
        "leirisonda_sync_trigger",
        handleSyncTrigger as EventListener,
      );
    };
  }, []);

  const addNotification = (notification: SyncEvent) => {
    console.log("🔔 Adding notification:", notification);
    setNotifications((prev) => {
      const newNotifications = [notification, ...prev].slice(0, 5); // Keep only last 5
      return newNotifications;
    });

    // Show notification temporarily
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 4000);
  };

  const getNotificationIcon = (type: SyncEvent["type"]) => {
    switch (type) {
      case "sync_complete":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "sync_error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "new_data":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "online":
        return <Wifi className="w-4 h-4 text-green-600" />;
      case "offline":
        return <WifiOff className="w-4 h-4 text-orange-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: SyncEvent["type"]) => {
    switch (type) {
      case "sync_complete":
      case "online":
        return "bg-green-50 border-green-200 text-green-800";
      case "sync_error":
        return "bg-red-50 border-red-200 text-red-800";
      case "new_data":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "offline":
        return "bg-orange-50 border-orange-200 text-orange-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  // Don't show if user is not logged in
  if (!user) return null;

  return (
    <>
      {/* Status Indicator (Always visible) */}
      <div className="fixed top-4 right-4 z-40 flex items-center space-x-2">
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
            isOnline
              ? "bg-green-50 border-green-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-orange-600" />
          )}
          <span
            className={`text-xs font-medium ${
              isOnline ? "text-green-700" : "text-orange-700"
            }`}
          >
            {isSyncing ? "Sincronizando..." : isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Temporary Notifications */}
      {isVisible && notifications.length > 0 && (
        <div className="fixed top-16 right-4 z-50 space-y-2 max-w-sm">
          {notifications.slice(0, 2).map((notification, index) => (
            <div
              key={`${notification.timestamp.getTime()}-${index}`}
              className={`px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${getNotificationColor(notification.type)}`}
              style={{
                animation: "slideInRight 0.3s ease-out",
              }}
            >
              <div className="flex items-start space-x-2">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                  {notification.details && (
                    <div className="text-xs opacity-60 mt-1">
                      {JSON.stringify(notification.details, null, 2).slice(
                        0,
                        100,
                      )}
                      ...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Notifications Panel (for admin) */}
      {user.role === "admin" && notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-30">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Sincronização Recente
              </span>
              <button
                onClick={() => setNotifications([])}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Limpar
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {notifications.slice(0, 3).map((notification, index) => (
                <div
                  key={`${notification.timestamp.getTime()}-${index}`}
                  className="flex items-center space-x-2 text-xs p-1 rounded"
                >
                  {getNotificationIcon(notification.type)}
                  <span className="flex-1 truncate">
                    {notification.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
