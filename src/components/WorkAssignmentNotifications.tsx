import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  User,
  X,
  Briefcase,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface Work {
  id: string;
  title: string;
  description: string;
  client: string;
  location: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  budget?: number;
  assignedTo: string;
  assignedUsers?: Array<{ id: string; name: string }>;
  assignedUserIds?: string[];
  createdAt: any;
  updatedAt?: any;
}

interface User {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
}

interface WorkNotification {
  id: string;
  workId: string;
  workTitle: string;
  client: string;
  location: string;
  startDate: string;
  type: "new_assignment" | "assignment_updated" | "assignment_cancelled";
  timestamp: number;
  read: boolean;
  urgent?: boolean;
}

interface WorkAssignmentNotificationsProps {
  currentUser: User | null;
}

export const WorkAssignmentNotifications: React.FC<
  WorkAssignmentNotificationsProps
> = ({ currentUser }) => {
  const [notifications, setNotifications] = useState<WorkNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Carregar notificações salvas do usuário - SEM LOOPS
  useEffect(() => {
    if (!currentUser) return;

    const savedNotifications = localStorage.getItem(
      `work-notifications-${currentUser.uid}`,
    );
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        const unread = parsed.filter((n: WorkNotification) => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      }
    }
  }, [currentUser?.uid]); // Apenas UID como dependência

  // Listener para eventos de trabalho - SEM LOOPS
  useEffect(() => {
    if (!currentUser) return;

    const handleWorkEvent = (event: CustomEvent) => {
      const { type, workId, workTitle, client, location, startDate } =
        event.detail;

      if (type === "assignment") {
        // Criar notificação simples
        const notification: WorkNotification = {
          id: `${workId}-${Date.now()}`,
          workId,
          workTitle,
          client: client || "Cliente",
          location: location || "Local",
          startDate: startDate || new Date().toISOString(),
          type: "new_assignment",
          timestamp: Date.now(),
          read: false,
          urgent: false,
        };

        setNotifications((prev) => {
          const updated = [notification, ...prev.slice(0, 19)];
          localStorage.setItem(
            `work-notifications-${currentUser.uid}`,
            JSON.stringify(updated),
          );
          setUnreadCount(updated.filter((n) => !n.read).length);
          showSimpleToast(notification);
          return updated;
        });
      }
    };

    window.addEventListener("worksUpdated", handleWorkEvent as EventListener);

    return () => {
      window.removeEventListener(
        "worksUpdated",
        handleWorkEvent as EventListener,
      );
    };
  }, [currentUser?.uid]); // Apenas UID como dependência

  const showSimpleToast = (notification: WorkNotification) => {
    // Toast simples sem dependências complexas
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm";

    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold">🔔 Novo Trabalho Atribuído!</h4>
          <p class="text-sm opacity-90">${notification.workTitle}</p>
          <p class="text-xs opacity-75">${notification.client}</p>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto-remove
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      );
      if (currentUser) {
        localStorage.setItem(
          `work-notifications-${currentUser.uid}`,
          JSON.stringify(updated),
        );
      }
      setUnreadCount(updated.filter((n) => !n.read).length);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      if (currentUser) {
        localStorage.setItem(
          `work-notifications-${currentUser.uid}`,
          JSON.stringify(updated),
        );
      }
      setUnreadCount(0);
      return updated;
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== notificationId);
      if (currentUser) {
        localStorage.setItem(
          `work-notifications-${currentUser.uid}`,
          JSON.stringify(updated),
        );
      }
      setUnreadCount(updated.filter((n) => !n.read).length);
      return updated;
    });
  };

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return "Agora";
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-16 left-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações de Trabalhos
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Marcar todas como lidas
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          🆕 Novo Trabalho
                        </h4>
                        <p className="text-sm text-gray-900 font-medium">
                          {notification.workTitle}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {notification.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {notification.location}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Marcar como lida"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Eliminar notificação"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};
