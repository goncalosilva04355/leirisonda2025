import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import {
  CheckCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  Bell,
  X,
  Activity,
  AlertTriangle,
} from "lucide-react";

interface SyncNotification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  autoHide?: boolean;
}

export function SyncNotification() {
  const {
    isOnline,
    isSyncing,
    lastSync,
    isFirebaseAvailable,
    works,
    maintenances,
  } = useFirebaseSync();

  const [notifications, setNotifications] = useState<SyncNotification[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Monitorar mudanças de estado e criar notificações
  useEffect(() => {
    const addNotification = (
      notification: Omit<SyncNotification, "id" | "timestamp">,
    ) => {
      const newNotification: SyncNotification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]); // Manter apenas 5 notificações

      // Auto-hide após 5 segundos se especificado
      if (notification.autoHide) {
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== newNotification.id),
          );
        }, 5000);
      }
    };

    // Notificação quando volta online
    if (isOnline && !isSyncing) {
      addNotification({
        type: "success",
        title: "Conectado",
        message: "Dispositivo online - sincronização ativa",
        autoHide: true,
      });
    }

    // Notificação quando fica offline
    if (!isOnline) {
      addNotification({
        type: "warning",
        title: "Offline",
        message:
          "Modo local ativo - dados serão sincronizados quando voltar online",
        autoHide: true,
      });
    }

    // Notificação quando Firebase fica indisponível
    if (!isFirebaseAvailable && isOnline) {
      addNotification({
        type: "error",
        title: "Firebase Indisponível",
        message:
          "Problemas de conectividade com Firebase - usando dados locais",
        autoHide: false,
      });
    }
  }, [isOnline, isFirebaseAvailable]);

  // Monitorar sincronização ativa
  useEffect(() => {
    if (isSyncing) {
      const syncNotification: SyncNotification = {
        id: "syncing",
        type: "info",
        title: "Sincronizando",
        message: "Atualizando dados entre dispositivos...",
        timestamp: new Date(),
        autoHide: false,
      };

      setNotifications((prev) => {
        const filtered = prev.filter((n) => n.id !== "syncing");
        return [syncNotification, ...filtered];
      });
    } else {
      // Remover notificação de sincronização quando completa
      setNotifications((prev) => prev.filter((n) => n.id !== "syncing"));
    }
  }, [isSyncing]);

  // Monitorar novas obras/manutenções
  useEffect(() => {
    // Listener para localStorage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "leirisonda_new_work_notification" && e.newValue) {
        try {
          const notification = JSON.parse(e.newValue);
          addNotification({
            type: "success",
            title: "Nova Obra Criada",
            message: `${notification.clientName} (${notification.workSheetNumber}) foi adicionada`,
            autoHide: true,
          });
        } catch (error) {
          console.error("Erro ao processar notificação de nova obra:", error);
        }
      }

      if (e.key === "leirisonda_last_update" && e.newValue) {
        try {
          const updateData = JSON.parse(e.newValue);
          if (updateData.type === "works_updated") {
            addNotification({
              type: "info",
              title: "Dados Atualizados",
              message: `${updateData.worksCount} obras sincronizadas de outro dispositivo`,
              autoHide: true,
            });
          }
        } catch (error) {
          console.error("Erro ao processar atualização de dados:", error);
        }
      }
    };

    const handleCustomEvent = (event: CustomEvent) => {
      if (event.detail.source === "new_work_created") {
        addNotification({
          type: "success",
          title: "Obra Criada",
          message: `Nova obra sincronizada instantaneamente`,
          autoHide: true,
        });
      }

      if (event.detail.source === "firebase_listener" && event.detail.works) {
        addNotification({
          type: "info",
          title: "Sync Automático",
          message: `${event.detail.works} obras atualizadas em tempo real`,
          autoHide: true,
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "leirisonda_sync_trigger",
      handleCustomEvent as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "leirisonda_sync_trigger",
        handleCustomEvent as EventListener,
      );
    };
  }, []);

  const addNotification = (
    notification: Omit<SyncNotification, "id" | "timestamp">,
  ) => {
    const newNotification: SyncNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]); // Manter apenas 5 notificações

    // Auto-hide após 5 segundos se especificado
    if (notification.autoHide) {
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotification.id),
        );
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "info":
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <CloudOff className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50";
      case "info":
        return "border-blue-200 bg-blue-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "error":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  if (!isVisible || notifications.length === 0) {
    return (
      <div className="fixed top-4 right-4 z-50">
        {/* Status badge sempre visível */}
        <div className="flex items-center gap-2">
          <Badge
            variant={isOnline ? "default" : "destructive"}
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setIsVisible(true)}
          >
            {isOnline ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            {isOnline ? "Online" : "Offline"}
          </Badge>
          {isFirebaseAvailable && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              Firebase
            </Badge>
          )}
          {isSyncing && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Sync
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Status badges */}
      <div className="flex items-center gap-2 justify-end">
        <Badge
          variant={isOnline ? "default" : "destructive"}
          className="flex items-center gap-1"
        >
          {isOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          {isOnline ? "Online" : "Offline"}
        </Badge>
        {isFirebaseAvailable && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Cloud className="w-3 h-3" />
            Firebase
          </Badge>
        )}
        {isSyncing && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Sincronizando
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Notificações */}
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          className={`${getNotificationStyle(notification.type)} shadow-lg`}
        >
          <div className="flex items-start gap-2">
            {getNotificationIcon(notification.type)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <AlertDescription className="text-xs mt-1">
                {notification.message}
              </AlertDescription>
              <div className="text-xs text-gray-500 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </Alert>
      ))}

      {/* Resumo de dados */}
      <div className="bg-white border rounded-lg p-3 shadow-lg">
        <div className="text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Obras: {works.length}</span>
            <span>Manutenções: {maintenances.length}</span>
          </div>
          {lastSync && (
            <div className="text-center mt-1">
              Última sync: {lastSync.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
