import React, { useState, useEffect } from "react";
import { CheckCircle, Cloud, Wifi, RefreshCw } from "lucide-react";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";

interface SyncNotification {
  id: string;
  type: "sync" | "create" | "update" | "delete";
  message: string;
  timestamp: Date;
}

export function SyncNotifications() {
  const { isOnline, isSyncing, lastSync, isFirebaseAvailable } =
    useFirebaseSync();
  const [notifications, setNotifications] = useState<SyncNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Monitor sync status changes
  useEffect(() => {
    if (lastSync) {
      const notification: SyncNotification = {
        id: crypto.randomUUID(),
        type: "sync",
        message: isFirebaseAvailable
          ? "Dados sincronizados"
          : "Dados guardados localmente",
        timestamp: lastSync,
      };

      setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Keep only last 5
      setShowNotifications(true);

      // Hide notification after 3 seconds
      setTimeout(() => setShowNotifications(false), 3000);
    }
  }, [lastSync, isFirebaseAvailable]);

  // Auto-hide when component unmounts
  useEffect(() => {
    return () => setShowNotifications(false);
  }, []);

  if (!showNotifications || notifications.length === 0) {
    return null;
  }

  const latestNotification = notifications[0];
  const getIcon = () => {
    if (isSyncing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (isFirebaseAvailable && isOnline) return <Cloud className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  const getColor = () => {
    if (isSyncing) return "bg-blue-500";
    if (isFirebaseAvailable && isOnline) return "bg-green-500";
    return "bg-orange-500";
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div
        className={`${getColor()} text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm`}
      >
        {getIcon()}
        <span className="text-sm font-medium">
          {latestNotification.message}
        </span>
        <CheckCircle className="w-4 h-4 opacity-80" />
      </div>
    </div>
  );
}
