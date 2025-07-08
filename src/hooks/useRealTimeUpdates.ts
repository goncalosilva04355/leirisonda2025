import { useState, useEffect, useRef } from "react";

interface UpdateNotification {
  id: string;
  type: "work" | "pool" | "maintenance" | "client";
  action: "created" | "updated" | "deleted";
  title: string;
  timestamp: Date;
  autoHide?: boolean;
}

interface RealTimeUpdatesHook {
  notifications: UpdateNotification[];
  addNotification: (
    notification: Omit<UpdateNotification, "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  hasNewUpdates: boolean;
  markAsRead: () => void;
}

export const useRealTimeUpdates = (): RealTimeUpdatesHook => {
  const [notifications, setNotifications] = useState<UpdateNotification[]>([]);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const lastReadRef = useRef<Date>(new Date());

  const addNotification = (
    notification: Omit<UpdateNotification, "id" | "timestamp">,
  ) => {
    const newNotification: UpdateNotification = {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]); // Manter apenas 10 notificações
    setHasNewUpdates(true);

    // Auto-hide notification after 5 seconds if autoHide is true
    if (notification.autoHide !== false) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Leirisonda - Atualização", {
        body: `${notification.title}`,
        icon: "/icon.svg",
        tag: "leirisonda-update",
      });
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setHasNewUpdates(false);
  };

  const markAsRead = () => {
    lastReadRef.current = new Date();
    setHasNewUpdates(false);
  };

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    hasNewUpdates,
    markAsRead,
  };
};
