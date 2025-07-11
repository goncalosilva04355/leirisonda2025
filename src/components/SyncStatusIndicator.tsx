import React, { useState, useEffect } from "react";
import {
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { isFirestoreReady } from "../firebase/firestoreConfig";
import { autoSyncService } from "../services/autoSyncService";

export const SyncStatusIndicator: React.FC = () => {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [isAutoSyncActive, setIsAutoSyncActive] = useState(false);
  const [lastSync, setLastSync] = useState<string>("");
  const [observersCount, setObserversCount] = useState(0);

  useEffect(() => {
    const checkStatus = () => {
      const firebaseReady = isFirestoreReady();
      const autoSync = autoSyncService.isAutoSyncActive();
      const observers = Object.keys(
        autoSyncService.getObserversStatus(),
      ).length;

      setIsFirebaseReady(firebaseReady);
      setIsAutoSyncActive(autoSync);
      setObserversCount(observers);
      setLastSync(new Date().toLocaleTimeString("pt-PT"));
    };

    // Check status initially
    checkStatus();

    // Check status every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    // Listen for sync events
    const handleAutoSyncStarted = () => {
      setIsAutoSyncActive(true);
      console.log("🔔 Auto sync started event received");
    };

    const handleDataUpdated = (event: CustomEvent) => {
      setLastSync(new Date().toLocaleTimeString("pt-PT"));
      console.log("🔔 Data updated event received:", event.detail.collection);
    };

    // Add event listeners for all collections
    const collections = [
      "obras",
      "piscinas",
      "manutencoes",
      "utilizadores",
      "clientes",
    ];
    collections.forEach((collection) => {
      window.addEventListener(
        `${collection}Updated`,
        handleDataUpdated as EventListener,
      );
    });

    window.addEventListener("autoSyncStarted", handleAutoSyncStarted);

    return () => {
      clearInterval(interval);
      collections.forEach((collection) => {
        window.removeEventListener(
          `${collection}Updated`,
          handleDataUpdated as EventListener,
        );
      });
      window.removeEventListener("autoSyncStarted", handleAutoSyncStarted);
    };
  }, []);

  const getSyncStatus = () => {
    if (!isFirebaseReady) {
      return {
        icon: WifiOff,
        text: "Local",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    }

    if (isAutoSyncActive) {
      return {
        icon: CheckCircle,
        text: "Sincronizado",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    }

    return {
      icon: RefreshCw,
      text: "Online",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    };
  };

  const status = getSyncStatus();
  const StatusIcon = status.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${status.bgColor} ${status.borderColor} transition-all duration-300`}
    >
      <StatusIcon className={`h-4 w-4 ${status.color}`} />
      <span className={`text-sm font-medium ${status.color}`}>
        {status.text}
      </span>
      {isAutoSyncActive && (
        <div className="flex items-center gap-1">
          <Database className="h-3 w-3 text-blue-500" />
          <span className="text-xs text-gray-500">{observersCount}</span>
        </div>
      )}
      {lastSync && <span className="text-xs text-gray-400">{lastSync}</span>}
    </div>
  );
};

// Compact version for smaller spaces
export const SyncStatusCompact: React.FC = () => {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [isAutoSyncActive, setIsAutoSyncActive] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const firebaseReady = isFirestoreReady();
      const autoSync = autoSyncService.isAutoSyncActive();

      setIsFirebaseReady(firebaseReady);
      setIsAutoSyncActive(autoSync);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const getSyncStatus = () => {
    if (!isFirebaseReady) {
      return {
        icon: WifiOff,
        color: "text-yellow-500",
        text: "Local",
      };
    }

    if (isAutoSyncActive) {
      return {
        icon: CheckCircle,
        color: "text-green-600",
        text: "Sync",
      };
    }

    return {
      icon: RefreshCw,
      color: "text-amber-500",
      text: "...",
    };
  };

  const status = getSyncStatus();
  const StatusIcon = status.icon;

  return (
    <div className="inline-flex items-center gap-1">
      <StatusIcon className={`h-3 w-3 ${status.color}`} />
      <span className={`text-xs font-medium ${status.color}`}>
        {status.text}
      </span>
    </div>
  );
};

export default SyncStatusIndicator;
