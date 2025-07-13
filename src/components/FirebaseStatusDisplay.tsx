import React, { useState, useEffect } from "react";
import {
  Database,
  Wifi,
  Activity,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { isFirebaseReady } from "../firebase/config";
import { isFirestoreReady } from "../firebase/firestoreConfig";
import { autoSyncService } from "../services/autoSyncService";
import { getFirebaseConfig } from "../config/firebaseEnv";

interface FirebaseStatusDisplayProps {
  compact?: boolean;
  expandable?: boolean;
}

export const FirebaseStatusDisplay: React.FC<FirebaseStatusDisplayProps> = ({
  compact = false,
  expandable = false,
}) => {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firestoreReady, setFirestoreReady] = useState(false);
  const [autoSyncActive, setAutoSyncActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "online" | "offline"
  >("offline");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      setFirebaseReady(isFirebaseReady());
      setFirestoreReady(isFirestoreReady());
      setAutoSyncActive(autoSyncService.isAutoSyncActive());
      setConnectionStatus(navigator.onLine ? "online" : "offline");
    };

    // Check initial status
    checkStatus();

    // Reduzido polling para evitar refresh constante no Builder.io
    const interval = setInterval(checkStatus, 60000); // 1 minuto em vez de 5 segundos

    // Listen to online/offline events
    const handleOnline = () => setConnectionStatus("online");
    const handleOffline = () => setConnectionStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getFirebaseProject = () => {
    const config = getFirebaseConfig();
    return config.projectId || "N/A";
  };

  const getOverallStatus = () => {
    if (firebaseReady && firestoreReady && connectionStatus === "online") {
      return {
        status: "excellent",
        colorClass: "bg-green-500",
        text: "Tudo Operacional",
      };
    } else if (firebaseReady && connectionStatus === "online") {
      return {
        status: "good",
        colorClass: "bg-blue-500",
        text: "Parcialmente Ativo",
      };
    } else if (connectionStatus === "offline") {
      return {
        status: "offline",
        colorClass: "bg-orange-500",
        text: "Sem Conexão",
      };
    } else {
      return {
        status: "error",
        colorClass: "bg-red-500",
        text: "Problemas Detectados",
      };
    }
  };

  const overall = getOverallStatus();

  if (compact) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-3 mb-4">
        <div
          className={`flex items-center justify-between ${expandable ? "cursor-pointer" : ""}`}
          onClick={expandable ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${overall.colorClass}`}></div>
            <span className="text-sm font-medium text-gray-900">
              {overall.text}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              Projeto: {getFirebaseProject()}
            </span>
            {expandable && (
              <div className="text-gray-400">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
        </div>

        {expandable && isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              {/* Firebase Core */}
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <div className="flex-shrink-0">
                  {firebaseReady ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Firebase</p>
                  <p className="text-xs text-gray-600">
                    {firebaseReady ? "Conectado" : "Desconectado"}
                  </p>
                </div>
              </div>

              {/* Firestore */}
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <div className="flex-shrink-0">
                  {firestoreReady ? (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Firestore</p>
                  <p className="text-xs text-gray-600">
                    {firestoreReady ? "Ativo" : "Inativo"}
                  </p>
                </div>
              </div>

              {/* Auto Sync */}
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <div className="flex-shrink-0">
                  {autoSyncActive ? (
                    <Activity className="h-4 w-4 text-purple-500 animate-pulse" />
                  ) : (
                    <Activity className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Sync</p>
                  <p className="text-xs text-gray-600">
                    {autoSyncActive ? "Auto" : "Manual"}
                  </p>
                </div>
              </div>

              {/* Connection */}
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <div className="flex-shrink-0">
                  {connectionStatus === "online" ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <Wifi className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Rede</p>
                  <p className="text-xs text-gray-600">
                    {connectionStatus === "online" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-600" />
          Status Firebase
        </h3>
        <div className="flex items-center space-x-1">
          <div className={`w-3 h-3 rounded-full ${overall.colorClass}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {overall.text}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Firebase Core */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            {firebaseReady ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Firebase</p>
            <p className="text-xs text-gray-600">
              {firebaseReady ? "Conectado" : "Desconectado"}
            </p>
          </div>
        </div>

        {/* Firestore */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            {firestoreReady ? (
              <CheckCircle className="h-5 w-5 text-blue-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Firestore</p>
            <p className="text-xs text-gray-600">
              {firestoreReady ? "Base de Dados Ativa" : "Inativo"}
            </p>
          </div>
        </div>

        {/* Auto Sync */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            {autoSyncActive ? (
              <Activity className="h-5 w-5 text-purple-500 animate-pulse" />
            ) : (
              <Activity className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Sincronização</p>
            <p className="text-xs text-gray-600">
              {autoSyncActive ? "Automática Ativa" : "Manual"}
            </p>
          </div>
        </div>

        {/* Connection */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            {connectionStatus === "online" ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <Wifi className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Conexão</p>
            <p className="text-xs text-gray-600">
              {connectionStatus === "online" ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
        <p className="text-xs text-blue-800">
          <span className="font-medium">Projeto:</span> {getFirebaseProject()}
        </p>
      </div>
    </div>
  );
};
