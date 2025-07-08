import React, { useEffect } from "react";
import { Bell, X, Check, Plus, Edit, Trash, RefreshCw } from "lucide-react";
import { useRealTimeUpdates } from "../hooks/useRealTimeUpdates";

interface RealTimeNotificationsProps {
  onDataChange?: (type: string) => void;
}

export const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({
  onDataChange,
}) => {
  const {
    notifications,
    removeNotification,
    clearNotifications,
    hasNewUpdates,
    markAsRead,
  } = useRealTimeUpdates();

  // Monitor for new updates and trigger callback
  useEffect(() => {
    if (hasNewUpdates && onDataChange) {
      const latestNotification = notifications[0];
      if (latestNotification) {
        onDataChange(latestNotification.type);
      }
    }
  }, [hasNewUpdates, notifications, onDataChange]);

  const getIcon = (action: string) => {
    switch (action) {
      case "created":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "updated":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "deleted":
        return <Trash className="h-4 w-4 text-red-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "created":
        return "Criado";
      case "updated":
        return "Atualizado";
      case "deleted":
        return "Eliminado";
      default:
        return "Modificado";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "work":
        return "Obra";
      case "pool":
        return "Piscina";
      case "maintenance":
        return "Manutenção";
      case "client":
        return "Cliente";
      default:
        return "Item";
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating notification indicator */}
      {hasNewUpdates && (
        <div
          className="fixed top-4 right-4 z-50 cursor-pointer"
          onClick={markAsRead}
        >
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
            <Bell className="h-4 w-4" />
            <span className="text-sm font-medium">
              {notifications.length} nova{notifications.length !== 1 ? "s" : ""}{" "}
              atualização{notifications.length !== 1 ? "ões" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Notification list */}
      <div className="fixed top-16 right-4 z-40 space-y-2 max-w-sm">
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 transform transition-all duration-300 ease-in-out"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2 flex-1">
                {getIcon(notification.action)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {getTypeText(notification.type)}{" "}
                    {getActionText(notification.action)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.timestamp.toLocaleTimeString("pt-PT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {notifications.length > 3 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">
              +{notifications.length - 3} mais notificações
            </p>
            <button
              onClick={clearNotifications}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              Limpar todas
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Hook personalizado para usar nas páginas/componentes
export const useDataChangeNotifications = () => {
  const { addNotification } = useRealTimeUpdates();

  const notifyDataChange = (
    type: "work" | "pool" | "maintenance" | "client",
    action: "created" | "updated" | "deleted",
    title: string,
  ) => {
    addNotification({
      type,
      action,
      title,
      autoHide: true,
    });
  };

  return { notifyDataChange };
};
