import React, { useState, useEffect } from "react";
import {
  Database,
  Wifi,
  Activity,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";
import { isFirebaseReady } from "../firebase/config";
import { isFirestoreReady } from "../firebase/firestoreConfig";
import { autoSyncService } from "../services/autoSyncService";

interface EditModeFirestoreStatusProps {
  isEditing: boolean;
  entityType?: "obra" | "piscina" | "manutencao";
  entityId?: string;
}

export const EditModeFirestoreStatus: React.FC<
  EditModeFirestoreStatusProps
> = ({ isEditing, entityType = "obra", entityId }) => {
  const [firestoreStatus, setFirestoreStatus] = useState({
    firebase: false,
    firestore: false,
    autoSync: false,
    realTimeSync: false,
  });

  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkStatus = () => {
      const firebase = isFirebaseReady();
      const firestore = isFirestoreReady();
      const autoSync = autoSyncService.isAutoSyncActive();

      // Check if real-time listeners are active
      const realTimeSync = firebase && firestore && autoSync;

      setFirestoreStatus({
        firebase,
        firestore,
        autoSync,
        realTimeSync,
      });

      if (realTimeSync) {
        setLastSyncTime(new Date());
      }
    };

    // Check immediately
    checkStatus();

    if (isEditing) {
      // Reduced frequency even during editing to prevent refresh issues
      interval = setInterval(checkStatus, 30000); // 30 segundos em vez de 2
    } else {
      // Less frequent checks when not editing
      interval = setInterval(checkStatus, 120000); // 2 minutos em vez de 10 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEditing]);

  // Force enable Firestore if it's disabled during editing
  useEffect(() => {
    if (isEditing && !firestoreStatus.autoSync) {
      const enableFirestore = async () => {
        try {
          console.log("🔥 Ativando Firestore para modo de edição...");
          await autoSyncService.startAutoSync();
          console.log("✅ Firestore ativado para edição");
        } catch (error) {
          console.error("❌ Erro ao ativar Firestore:", error);
        }
      };

      // Small delay to avoid conflicts
      setTimeout(enableFirestore, 1000);
    }
  }, [isEditing, firestoreStatus.autoSync]);

  if (!isEditing) {
    return null; // Don't show when not editing
  }

  const getStatusColor = () => {
    if (firestoreStatus.realTimeSync) {
      return "bg-green-500";
    } else if (firestoreStatus.firebase) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };

  const getStatusText = () => {
    if (firestoreStatus.realTimeSync) {
      return "Sincronização Ativa";
    } else if (firestoreStatus.firestore) {
      return "Firestore Conectado";
    } else if (firestoreStatus.firebase) {
      return "Firebase Conectado";
    } else {
      return "Desconectado";
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor()} ${firestoreStatus.realTimeSync ? "animate-pulse" : ""}`}
            ></div>
            <span className="text-sm font-medium text-gray-900">
              {getStatusText()}
            </span>
          </div>

          {isEditing && (
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">
                Modo Edição
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Database className="h-4 w-4" />
          <span>
            {entityType} {entityId ? `#${entityId.slice(-6)}` : ""}
          </span>
          {lastSyncTime && (
            <span className="text-green-600">
              {lastSyncTime.toLocaleTimeString("pt-PT", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Detailed status during editing */}
      <div className="mt-2 grid grid-cols-4 gap-2">
        <div className="flex items-center space-x-1">
          {firestoreStatus.firebase ? (
            <CheckCircle className="h-3 w-3 text-green-500" />
          ) : (
            <AlertCircle className="h-3 w-3 text-red-500" />
          )}
          <span className="text-xs text-gray-700">Firebase</span>
        </div>

        <div className="flex items-center space-x-1">
          {firestoreStatus.firestore ? (
            <CheckCircle className="h-3 w-3 text-green-500" />
          ) : (
            <AlertCircle className="h-3 w-3 text-orange-500" />
          )}
          <span className="text-xs text-gray-700">Firestore</span>
        </div>

        <div className="flex items-center space-x-1">
          {firestoreStatus.autoSync ? (
            <Activity className="h-3 w-3 text-purple-500 animate-pulse" />
          ) : (
            <Activity className="h-3 w-3 text-gray-400" />
          )}
          <span className="text-xs text-gray-700">Auto-Sync</span>
        </div>

        <div className="flex items-center space-x-1">
          {firestoreStatus.realTimeSync ? (
            <Wifi className="h-3 w-3 text-green-500" />
          ) : (
            <Wifi className="h-3 w-3 text-red-500" />
          )}
          <span className="text-xs text-gray-700">Tempo Real</span>
        </div>
      </div>

      {!firestoreStatus.realTimeSync && (
        <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
          ⚠️ Sincronização em tempo real desativada. As alterações podem não ser
          guardadas automaticamente.
        </div>
      )}
    </div>
  );
};
