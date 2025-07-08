import React, { useEffect } from "react";
import { useRealTimeUpdates } from "../hooks/useRealTimeUpdates";

interface RealTimeNotificationsProps {
  onDataChange?: (type: string) => void;
}

export const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({
  onDataChange,
}) => {
  const { notifications, hasNewUpdates } = useRealTimeUpdates();

  // Monitor for new updates and trigger callback (silent sync)
  useEffect(() => {
    if (hasNewUpdates && onDataChange) {
      const latestNotification = notifications[0];
      if (latestNotification) {
        onDataChange(latestNotification.type);
      }
    }
  }, [hasNewUpdates, notifications, onDataChange]);

  // No visual notifications - only silent data sync
  return null;
};

// Hook personalizado para usar nas páginas/componentes (sem notificações visuais)
export const useDataChangeNotifications = () => {
  const { addNotification } = useRealTimeUpdates();

  const notifyDataChange = (
    type: "work" | "pool" | "maintenance" | "client",
    action: "created" | "updated" | "deleted",
    title: string,
  ) => {
    // Only trigger silent sync, no visual notifications
    addNotification({
      type,
      action,
      title,
      autoHide: true,
    });
  };

  return { notifyDataChange };
};
