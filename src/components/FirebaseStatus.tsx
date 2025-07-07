import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { app, db, auth } from "../firebase/config";
import { realFirebaseService } from "../services/realFirebaseService";

export const FirebaseStatus: React.FC = () => {
  const [status, setStatus] = useState({
    app: false,
    auth: false,
    firestore: false,
    database: false,
    lastCheck: new Date(),
  });

  useEffect(() => {
    const checkStatus = async () => {
      // Check if Firebase is disabled for quota protection
      const isFirebaseDisabled = !app && !db && !auth;

      const newStatus = {
        app: !!app,
        auth: !!auth,
        firestore: !!db,
        database: false,
        lastCheck: new Date(),
      };

      // Skip Firebase checks if it's disabled for quota protection
      if (isFirebaseDisabled) {
        console.log("⏸️ Firebase status check skipped - quota protection mode");
        setStatus(newStatus);
        return;
      }

      // Check database service
      try {
        const initialized = realFirebaseService.initialize();
        if (initialized) {
          const connectionOk = await realFirebaseService.testConnection();
          newStatus.database = connectionOk;
        }
      } catch (error) {
        console.warn("Database status check failed:", error);
      }

      setStatus(newStatus);
    };

    checkStatus();

    // Check status every 2 minutes (reduzido para melhorar performance)
    const interval = setInterval(checkStatus, 120000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (isOk: boolean) => {
    return isOk ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500" />
    );
  };

  const allOk = status.app && status.auth && status.firestore;

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
      <div className="flex items-center space-x-2 mb-2">
        {allOk ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className="text-sm font-medium">
          Firebase {allOk ? "Ativo" : "Problemas"}
        </span>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span>App:</span>
          {getStatusIcon(status.app)}
        </div>
        <div className="flex items-center justify-between">
          <span>Auth:</span>
          {getStatusIcon(status.auth)}
        </div>
        <div className="flex items-center justify-between">
          <span>Firestore:</span>
          {getStatusIcon(status.firestore)}
        </div>
        <div className="flex items-center justify-between">
          <span>Database:</span>
          {getStatusIcon(status.database)}
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        {status.lastCheck.toLocaleTimeString("pt-PT")}
      </div>
    </div>
  );
};
