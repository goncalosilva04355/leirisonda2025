import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: number;
  autoHide?: boolean;
}

export const RealtimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification({
        type: "success",
        title: "Conexão restaurada",
        message: "Sincronização automática reativada",
        autoHide: true,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        type: "warning",
        title: "Conexão perdida",
        message:
          "Trabalhando offline - dados serão sincronizados quando a conexão for restaurada",
        autoHide: false,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Listen to sync events
  useEffect(() => {
    const handleFirebaseSync = (event: CustomEvent) => {
      const { type, collection, changeType, documentId } = event.detail;

      const collectionNames: Record<string, string> = {
        users: "usuários",
        pools: "piscinas",
        maintenance: "manutenções",
        works: "obras",
        clients: "clientes",
      };

      const changeMessages: Record<string, string> = {
        create: "adicionado",
        update: "atualizado",
        delete: "removido",
        "users-changed": "atualizados",
        "pools-changed": "atualizadas",
        "maintenance-changed": "atualizadas",
        "works-changed": "atualizadas",
      };

      if (type === "forced-sync") {
        addNotification({
          type: "info",
          title: "Sincronização",
          message: `Dados de ${collectionNames[collection] || collection} sincronizados`,
          autoHide: true,
        });
      } else if (changeType && changeMessages[changeType]) {
        addNotification({
          type: "success",
          title: "Dados atualizados",
          message: `${collectionNames[collection] || collection} ${changeMessages[changeType]}`,
          autoHide: true,
        });
      }
    };

    // Listen to work assignment events
    const handleWorkAssignment = (event: CustomEvent) => {
      const { workTitle, assignedTo, type: assignmentType } = event.detail;

      if (assignmentType === "assigned") {
        addNotification({
          type: "info",
          title: "Trabalho Atribuído",
          message: `"${workTitle}" foi atribuído a ${assignedTo}`,
          autoHide: true,
        });
      } else if (assignmentType === "updated") {
        addNotification({
          type: "warning",
          title: "Trabalho Atualizado",
          message: `"${workTitle}" foi atualizado`,
          autoHide: true,
        });
      }
    };

    // Listen to user events
    const handleUserEvents = (event: CustomEvent) => {
      addNotification({
        type: "info",
        title: "Utilizadores Atualizados",
        message: "Lista de utilizadores foi atualizada",
        autoHide: true,
      });
    };

    // Listen to custom notifications
    const handleCustomNotification = (event: CustomEvent) => {
      const { title, message, type, autoHide } = event.detail;
      addNotification({
        type: type || "info",
        title: title || "Notificação",
        message: message || "",
        autoHide: autoHide !== false,
      });
    };

    window.addEventListener(
      "firebase-sync",
      handleFirebaseSync as EventListener,
    );
    window.addEventListener(
      "firebase-auto-sync",
      handleFirebaseSync as EventListener,
    );
    window.addEventListener(
      "workAssignment",
      handleWorkAssignment as EventListener,
    );
    window.addEventListener("usersUpdated", handleUserEvents as EventListener);
    window.addEventListener(
      "customNotification",
      handleCustomNotification as EventListener,
    );

    return () => {
      window.removeEventListener(
        "firebase-sync",
        handleFirebaseSync as EventListener,
      );
      window.removeEventListener(
        "firebase-auto-sync",
        handleFirebaseSync as EventListener,
      );
      window.removeEventListener(
        "workAssignment",
        handleWorkAssignment as EventListener,
      );
      window.removeEventListener(
        "usersUpdated",
        handleUserEvents as EventListener,
      );
      window.removeEventListener(
        "customNotification",
        handleCustomNotification as EventListener,
      );
    };
  }, []);

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]); // Keep only 5 notifications

    // Auto-hide after 5 seconds if autoHide is true
    if (notification.autoHide) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} border rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">{getIcon(notification.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Fechar</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {/* Network Status Indicator */}
      <div
        className={`${isOnline ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-lg p-3 shadow-lg`}
      >
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Hook para adicionar notificações programaticamente
export const useRealtimeNotifications = () => {
  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => {
    const event = new CustomEvent("add-notification", { detail: notification });
    window.dispatchEvent(event);
  };

  return { addNotification };
};
