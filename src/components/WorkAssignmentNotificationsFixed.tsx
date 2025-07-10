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

interface User {
  uid: string;
  email: string;
  name: string;
  role: string;
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

export const WorkAssignmentNotificationsFixed: React.FC<
  WorkAssignmentNotificationsProps
> = ({ currentUser }) => {
  const [notifications, setNotifications] = useState<WorkNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load saved notifications for user
  useEffect(() => {
    if (!currentUser?.uid) return;

    try {
      const savedNotifications = localStorage.getItem(
        `work-notifications-${currentUser.uid}`,
      );
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        const unread = parsed.filter((n: WorkNotification) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, [currentUser?.uid]);

  // Listen for work assignment events
  useEffect(() => {
    if (!currentUser?.uid) return;

    const handleWorkEvent = (event: CustomEvent) => {
      try {
        const { type, workId, workTitle, client, location, startDate } =
          event.detail;

        const newNotification: WorkNotification = {
          id: `${workId}-${Date.now()}`,
          workId,
          workTitle,
          client,
          location,
          startDate,
          type,
          timestamp: Date.now(),
          read: false,
          urgent: type === "new_assignment",
        };

        setNotifications((prev) => {
          const updated = [newNotification, ...prev].slice(0, 50); // Keep last 50

          // Save to localStorage
          localStorage.setItem(
            `work-notifications-${currentUser.uid}`,
            JSON.stringify(updated),
          );

          return updated;
        });

        setUnreadCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error handling work event:", error);
      }
    };

    window.addEventListener("workAssigned", handleWorkEvent as EventListener);
    window.addEventListener("workUpdated", handleWorkEvent as EventListener);
    window.addEventListener("workCancelled", handleWorkEvent as EventListener);

    return () => {
      window.removeEventListener(
        "workAssigned",
        handleWorkEvent as EventListener,
      );
      window.removeEventListener(
        "workUpdated",
        handleWorkEvent as EventListener,
      );
      window.removeEventListener(
        "workCancelled",
        handleWorkEvent as EventListener,
      );
    };
  }, [currentUser?.uid]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      );

      if (currentUser?.uid) {
        localStorage.setItem(
          `work-notifications-${currentUser.uid}`,
          JSON.stringify(updated),
        );
      }

      return updated;
    });

    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));

      if (currentUser?.uid) {
        localStorage.setItem(
          `work-notifications-${currentUser.uid}`,
          JSON.stringify(updated),
        );
      }

      return updated;
    });

    setUnreadCount(0);
  };

  // Don't render if no current user
  if (!currentUser) {
    return null;
  }

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-16 right-4 w-96 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">
              Notificações de Trabalho
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Marcar todas como lidas
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Sem notificações</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {notification.type === "new_assignment" && (
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      )}
                      {notification.type === "assignment_updated" && (
                        <Clock className="h-4 w-4 text-orange-600" />
                      )}
                      {notification.type === "assignment_cancelled" && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.workTitle}
                      </p>
                      <p className="text-sm text-gray-600">
                        {notification.client}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">
                          {notification.location}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {new Date(notification.startDate).toLocaleDateString(
                            "pt-PT",
                          )}
                        </span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
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
