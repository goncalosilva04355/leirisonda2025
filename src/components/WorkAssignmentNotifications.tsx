import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const previousWorksRef = useRef<Work[]>([]);

  // Carregar notificações salvas do usuário
  useEffect(() => {
    if (!currentUser) return;

    const savedNotifications = localStorage.getItem(
      `work-notifications-${currentUser.uid}`,
    );
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        updateUnreadCount(parsed);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      }
    }
  }, [currentUser]);

  // Monitorar mudanças nos trabalhos
  useEffect(() => {
    if (!currentUser) return;

    const handleWorksChange = () => {
      try {
        const worksData = localStorage.getItem("works");
        if (!worksData) return;

        const currentWorks: Work[] = JSON.parse(worksData);

        // Se não há trabalhos anteriores, salvar o estado atual e sair
        if (previousWorks.length === 0) {
          setPreviousWorks(currentWorks);
          return;
        }

        // Detectar novos trabalhos atribuídos ao usuário atual
        checkForNewAssignments(currentWorks, previousWorks, currentUser);

        // Detectar mudanças em trabalhos existentes
        checkForAssignmentUpdates(currentWorks, previousWorks, currentUser);

        // Atualizar estado anterior
        setPreviousWorks(currentWorks);
      } catch (error) {
        console.error("Erro ao processar mudanças de trabalhos:", error);
      }
    };

    // Carregar estado inicial
    const initialWorksData = localStorage.getItem("works");
    if (initialWorksData) {
      try {
        const initialWorks = JSON.parse(initialWorksData);
        setPreviousWorks(initialWorks);
      } catch (error) {
        console.error("Erro ao carregar trabalhos iniciais:", error);
      }
    }

    // Listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "works") {
        handleWorksChange();
      }
    };

    // Listener customizado para atualizações
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("worksUpdated", handleWorksChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("worksUpdated", handleWorksChange);
    };
  }, [currentUser, previousWorks]);

  const checkForNewAssignments = (
    currentWorks: Work[],
    previousWorks: Work[],
    user: User,
  ) => {
    currentWorks.forEach((work) => {
      const previousWork = previousWorks.find((w) => w.id === work.id);

      // Se é um trabalho completamente novo
      if (!previousWork) {
        if (isAssignedToUser(work, user)) {
          addNotification({
            workId: work.id,
            workTitle: work.title,
            client: work.client,
            location: work.location,
            startDate: work.startDate,
            type: "new_assignment",
            urgent: isUrgentWork(work),
          });
        }
        return;
      }

      // Se é um trabalho existente que agora foi atribuído ao usuário
      const wasAssigned = isAssignedToUser(previousWork, user);
      const isNowAssigned = isAssignedToUser(work, user);

      if (!wasAssigned && isNowAssigned) {
        addNotification({
          workId: work.id,
          workTitle: work.title,
          client: work.client,
          location: work.location,
          startDate: work.startDate,
          type: "new_assignment",
          urgent: isUrgentWork(work),
        });
      }
    });
  };

  const checkForAssignmentUpdates = (
    currentWorks: Work[],
    previousWorks: Work[],
    user: User,
  ) => {
    currentWorks.forEach((work) => {
      const previousWork = previousWorks.find((w) => w.id === work.id);
      if (!previousWork || !isAssignedToUser(work, user)) return;

      // Verificar mudanças importantes
      const hasImportantChanges =
        work.startDate !== previousWork.startDate ||
        work.location !== previousWork.location ||
        work.status !== previousWork.status ||
        work.description !== previousWork.description;

      if (hasImportantChanges) {
        addNotification({
          workId: work.id,
          workTitle: work.title,
          client: work.client,
          location: work.location,
          startDate: work.startDate,
          type: "assignment_updated",
          urgent: work.status === "cancelled",
        });
      }
    });
  };

  const isAssignedToUser = (work: Work, user: User): boolean => {
    // Verificar se está no assignedTo (string)
    if (work.assignedTo?.toLowerCase().includes(user.name.toLowerCase())) {
      return true;
    }

    // Verificar se está na lista assignedUsers
    if (work.assignedUsers && work.assignedUsers.length > 0) {
      return work.assignedUsers.some(
        (assignedUser) =>
          assignedUser.name.toLowerCase() === user.name.toLowerCase() ||
          assignedUser.id === user.uid,
      );
    }

    // Verificar se está na lista assignedUserIds
    if (work.assignedUserIds && work.assignedUserIds.length > 0) {
      return work.assignedUserIds.includes(user.uid);
    }

    return false;
  };

  const isUrgentWork = (work: Work): boolean => {
    if (!work.startDate) return false;

    const startDate = new Date(work.startDate);
    const now = new Date();
    const timeDiff = startDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Urgente se começar em menos de 2 dias
    return daysDiff <= 2 && daysDiff >= 0;
  };

  const addNotification = (
    notificationData: Omit<WorkNotification, "id" | "timestamp" | "read">,
  ) => {
    const notification: WorkNotification = {
      ...notificationData,
      id: `${notificationData.workId}-${Date.now()}`,
      timestamp: Date.now(),
      read: false,
    };

    setNotifications((prev) => {
      const updated = [notification, ...prev.slice(0, 19)]; // Manter apenas 20 notificações
      saveNotifications(updated);
      updateUnreadCount(updated);

      // Mostrar toast de notificação
      showToastNotification(notification);

      return updated;
    });
  };

  const showToastNotification = (notification: WorkNotification) => {
    // Criar toast notification temporário
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
      notification.urgent ? "bg-red-600" : "bg-blue-600"
    }`;

    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold">${
            notification.type === "new_assignment"
              ? "🔔 Novo Trabalho Atribuído!"
              : "📝 Trabalho Atualizado"
          }</h4>
          <p class="text-sm opacity-90">${notification.workTitle}</p>
          <p class="text-xs opacity-75">${notification.client} • ${notification.location}</p>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    // Remover após 5 segundos
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 5000);
  };

  const saveNotifications = (notifications: WorkNotification[]) => {
    if (!currentUser) return;
    localStorage.setItem(
      `work-notifications-${currentUser.uid}`,
      JSON.stringify(notifications),
    );
  };

  const updateUnreadCount = (notifications: WorkNotification[]) => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      );
      saveNotifications(updated);
      updateUnreadCount(updated);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      updateUnreadCount(updated);
      return updated;
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== notificationId);
      saveNotifications(updated);
      updateUnreadCount(updated);
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_assignment":
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case "assignment_updated":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "assignment_cancelled":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
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
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.type === "new_assignment" &&
                              "🆕 Novo Trabalho"}
                            {notification.type === "assignment_updated" &&
                              "📝 Atualização"}
                            {notification.type === "assignment_cancelled" &&
                              "❌ Cancelado"}
                          </h4>
                          {notification.urgent && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                              Urgente
                            </span>
                          )}
                        </div>
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
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              notification.startDate,
                            ).toLocaleDateString("pt-PT")}
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
