import React, { useState, useEffect } from "react";
import { Bell, X, CheckCircle, Circle, Eye } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  data?: any;
  userId: string;
  seen?: boolean;
  read?: boolean;
}

interface NotificationCenterProps {
  currentUser: any;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationCenter({
  currentUser,
  onNotificationClick,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();

    // Check for new notifications every 10 seconds
    const interval = setInterval(loadNotifications, 10000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const loadNotifications = () => {
    try {
      if (!currentUser?.id && !currentUser?.email) return;

      const allNotifications = JSON.parse(
        localStorage.getItem("pending-notifications") || "[]",
      );
      const userNotifications = allNotifications.filter(
        (notif: Notification) =>
          notif.userId === currentUser.id || notif.userId === currentUser.email,
      );

      // Sort by timestamp (most recent first)
      userNotifications.sort(
        (a: Notification, b: Notification) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      setNotifications(userNotifications);

      // Count unread notifications
      const unread = userNotifications.filter(
        (notif: Notification) => !notif.read,
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("❌ Erro ao carregar notificações:", error);
    }
  };

  const markAsRead = (notificationId: string) => {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem("pending-notifications") || "[]",
      );
      const updatedNotifications = allNotifications.map(
        (notif: Notification) => {
          if (notif.id === notificationId) {
            return { ...notif, read: true, seen: true };
          }
          return notif;
        },
      );

      localStorage.setItem(
        "pending-notifications",
        JSON.stringify(updatedNotifications),
      );
      loadNotifications();
    } catch (error) {
      console.error("❌ Erro ao marcar notificação como lida:", error);
    }
  };

  const markAllAsRead = () => {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem("pending-notifications") || "[]",
      );
      const updatedNotifications = allNotifications.map(
        (notif: Notification) => {
          if (
            notif.userId === currentUser.id ||
            notif.userId === currentUser.email
          ) {
            return { ...notif, read: true, seen: true };
          }
          return notif;
        },
      );

      localStorage.setItem(
        "pending-notifications",
        JSON.stringify(updatedNotifications),
      );
      loadNotifications();
    } catch (error) {
      console.error("❌ Erro ao marcar todas como lidas:", error);
    }
  };

  const deleteNotification = (notificationId: string) => {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem("pending-notifications") || "[]",
      );
      const updatedNotifications = allNotifications.filter(
        (notif: Notification) => notif.id !== notificationId,
      );

      localStorage.setItem(
        "pending-notifications",
        JSON.stringify(updatedNotifications),
      );
      loadNotifications();
    } catch (error) {
      console.error("❌ Erro ao remover notificação:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    if (onNotificationClick) {
      onNotificationClick(notification);
    }

    // Close notification center
    setIsOpen(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        title="Notificações"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notificações</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Marcar todas como lidas
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Sem notificações</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {notification.read ? (
                          <CheckCircle
                            size={14}
                            className="text-gray-400 flex-shrink-0"
                          />
                        ) : (
                          <Circle
                            size={14}
                            className="text-blue-500 flex-shrink-0"
                          />
                        )}
                        <h4
                          className={`text-sm font-medium truncate ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.body}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.data?.workSheetNumber && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            {notification.data.workSheetNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
                      title="Remover notificação"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  // Clear all notifications for this user
                  try {
                    const allNotifications = JSON.parse(
                      localStorage.getItem("pending-notifications") || "[]",
                    );
                    const otherUserNotifications = allNotifications.filter(
                      (notif: Notification) =>
                        notif.userId !== currentUser.id &&
                        notif.userId !== currentUser.email,
                    );
                    localStorage.setItem(
                      "pending-notifications",
                      JSON.stringify(otherUserNotifications),
                    );
                    loadNotifications();
                  } catch (error) {
                    console.error("❌ Erro ao limpar notificações:", error);
                  }
                }}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Limpar todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
