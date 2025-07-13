import React, { useState, useEffect } from "react";
import {
  Database,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface FirebaseStatusBoxProps {
  className?: string;
}

interface FirebaseStatus {
  connection: "connected" | "disconnected" | "checking";
  config: "valid" | "invalid" | "missing";
  auth: "active" | "inactive" | "error";
  firestore: "active" | "inactive" | "error";
  quota: "normal" | "warning" | "exceeded";
}

export const FirebaseStatusBox: React.FC<FirebaseStatusBoxProps> = ({
  className = "",
}) => {
  const [status, setStatus] = useState<FirebaseStatus>({
    connection: "checking",
    config: "checking" as any,
    auth: "checking" as any,
    firestore: "checking" as any,
    quota: "checking" as any,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    checkFirebaseStatus();

    // Verificar a cada 10 segundos
    const interval = setInterval(checkFirebaseStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkFirebaseStatus = async () => {
    try {
      // Verificar configuração Firebase
      const configStatus = checkConfig();

      // Verificar conexão
      const connectionStatus = await checkConnection();

      // Verificar autenticação
      const authStatus = checkAuth();

      // Verificar Firestore
      const firestoreStatus = checkFirestore();

      // Verificar quota
      const quotaStatus = checkQuota();

      setStatus({
        connection: connectionStatus,
        config: configStatus,
        auth: authStatus,
        firestore: firestoreStatus,
        quota: quotaStatus,
      });
    } catch (error) {
      console.error("Erro ao verificar status Firebase:", error);
    }
  };

  const checkConfig = (): "valid" | "invalid" | "missing" => {
    try {
      // Verificar primeiro se há config no localStorage
      const storedConfig = localStorage.getItem("firebase-config");
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        if (config.apiKey && config.projectId && config.authDomain) {
          return "valid";
        }
      }

      // Verificar se há config hardcoded (padrão do projeto)
      const defaultConfig = {
        apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
        projectId: "leiria-1cfc9",
        authDomain: "leiria-1cfc9.firebaseapp.com",
      };

      if (
        defaultConfig.apiKey &&
        defaultConfig.projectId &&
        defaultConfig.authDomain
      ) {
        return "valid";
      }

      return "missing";
    } catch {
      return "invalid";
    }
  };

  const checkConnection = async (): Promise<
    "connected" | "disconnected" | "checking"
  > => {
    try {
      // Verificar se Firebase está inicializado
      if (typeof window !== "undefined") {
        // Verificar se Firebase app existe
        const firebaseInitialized = localStorage.getItem(
          "firebase-initialized",
        );
        if (firebaseInitialized === "true") {
          return "connected";
        }

        // Verificar se há erro de quota
        const quotaExceeded = localStorage.getItem("firebase-quota-exceeded");
        if (quotaExceeded === "true") {
          return "disconnected";
        }

        // Verificar conectividade online
        if (navigator.onLine) {
          return "connected";
        }
      }

      return "disconnected";
    } catch {
      return "disconnected";
    }
  };

  const checkAuth = (): "active" | "inactive" | "error" => {
    try {
      // Verificar múltiplas fontes de estado de auth
      const authState = localStorage.getItem("firebase-auth-state");
      const firebaseUser = localStorage.getItem("firebase-user");
      const authToken = localStorage.getItem("firebase-token");
      const authPersistence = localStorage.getItem("firebase-persistence");
      const currentUser = localStorage.getItem("currentUser");

      // Se algum indicador de auth existe, consideramos ativo
      if (
        authState ||
        firebaseUser ||
        authToken ||
        authPersistence ||
        currentUser
      ) {
        return "active";
      }

      // Verificar se Firebase Auth está inicializado mas sem user
      const firebaseInitialized = localStorage.getItem("firebase-initialized");
      if (firebaseInitialized === "true") {
        return "inactive"; // Inicializado mas sem user logado
      }

      return "inactive";
    } catch {
      return "error";
    }
  };

  const checkFirestore = (): "active" | "inactive" | "error" => {
    try {
      // Verificar múltiplas fontes de estado do Firestore
      const firestoreCache = localStorage.getItem("firestore-cache");
      const firebaseInitialized = localStorage.getItem("firebase-initialized");
      const syncStatus = localStorage.getItem("sync-status");
      const lastSync = localStorage.getItem("last-sync");

      // Verificar dados que indicam Firestore ativo
      const users = localStorage.getItem("users");
      const works = localStorage.getItem("works");
      const pools = localStorage.getItem("pools");
      const maintenance = localStorage.getItem("maintenance");

      // Se há cache ou dados Firestore, consideramos ativo
      if (firestoreCache || users || works || pools || maintenance) {
        return "active";
      }

      // Se Firebase está inicializado mas sem dados, ainda é ativo
      if (firebaseInitialized === "true") {
        return "active";
      }

      // Verificar se há sincronização recente
      if (syncStatus === "completed" || lastSync) {
        return "active";
      }

      return "inactive";
    } catch {
      return "error";
    }
  };

  const checkQuota = (): "normal" | "warning" | "exceeded" => {
    try {
      const quotaExceeded = localStorage.getItem("firebase-quota-exceeded");
      if (quotaExceeded === "true") return "exceeded";

      const emergencyShutdown = localStorage.getItem(
        "firebase-emergency-shutdown",
      );
      if (emergencyShutdown === "true") return "warning";

      return "normal";
    } catch {
      return "normal";
    }
  };

  const getStatusIcon = (statusType: keyof FirebaseStatus, value: string) => {
    if (value === "checking")
      return <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />;

    switch (statusType) {
      case "connection":
        return value === "connected" ? (
          <Wifi className="w-3 h-3 text-green-500" />
        ) : (
          <WifiOff className="w-3 h-3 text-red-500" />
        );
      case "config":
        return value === "valid" ? (
          <CheckCircle className="w-3 h-3 text-green-500" />
        ) : (
          <AlertTriangle className="w-3 h-3 text-red-500" />
        );
      case "quota":
        return value === "exceeded" ? (
          <AlertTriangle className="w-3 h-3 text-red-500" />
        ) : value === "warning" ? (
          <AlertTriangle className="w-3 h-3 text-yellow-500" />
        ) : (
          <CheckCircle className="w-3 h-3 text-green-500" />
        );
      default:
        return value === "active" ? (
          <CheckCircle className="w-3 h-3 text-green-500" />
        ) : value === "error" ? (
          <AlertTriangle className="w-3 h-3 text-red-500" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-gray-300" />
        );
    }
  };

  const getStatusColor = (statusType: keyof FirebaseStatus, value: string) => {
    if (value === "checking") return "text-gray-500";

    switch (statusType) {
      case "connection":
        return value === "connected" ? "text-green-600" : "text-red-600";
      case "config":
        return value === "valid" ? "text-green-600" : "text-red-600";
      case "quota":
        return value === "exceeded"
          ? "text-red-600"
          : value === "warning"
            ? "text-yellow-600"
            : "text-green-600";
      default:
        return value === "active"
          ? "text-green-600"
          : value === "error"
            ? "text-red-600"
            : "text-gray-600";
    }
  };

  const getStatusText = (statusType: keyof FirebaseStatus, value: string) => {
    if (value === "checking") return "Verificando...";

    switch (statusType) {
      case "connection":
        return value === "connected" ? "Conectado" : "Desconectado";
      case "config":
        if (value === "valid") {
          // Verificar se é config do localStorage ou hardcoded
          const storedConfig = localStorage.getItem("firebase-config");
          return storedConfig ? "Válida (Local)" : "Válida (Padrão)";
        }
        return value === "invalid" ? "Inválida" : "Ausente";
      case "auth":
        return value === "active"
          ? "Ativo"
          : value === "error"
            ? "Erro"
            : "Inativo";
      case "firestore":
        return value === "active"
          ? "Ativo"
          : value === "error"
            ? "Erro"
            : "Inativo";
      case "quota":
        return value === "exceeded"
          ? "Excedida"
          : value === "warning"
            ? "Aviso"
            : "Normal";
      default:
        return value;
    }
  };

  const overallStatus = () => {
    if (status.quota === "exceeded") return "error";
    if (
      status.connection === "disconnected" ||
      status.config === "invalid" ||
      status.config === "missing"
    )
      return "error";
    if (
      status.quota === "warning" ||
      status.auth === "error" ||
      status.firestore === "error"
    )
      return "warning";
    if (status.connection === "connected" && status.config === "valid")
      return "good";
    return "checking";
  };

  const overallColor = () => {
    const overall = overallStatus();
    switch (overall) {
      case "good":
        return "border-green-200 bg-green-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "error":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className={`border rounded-lg p-3 ${overallColor()} ${className}`}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Estado Firebase
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {getStatusIcon("connection", status.connection)}
          <span className="text-xs text-gray-500">
            {isCollapsed ? "▼" : "▲"}
          </span>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Conexão:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon("connection", status.connection)}
                <span
                  className={getStatusColor("connection", status.connection)}
                >
                  {getStatusText("connection", status.connection)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Config:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon("config", status.config)}
                <span className={getStatusColor("config", status.config)}>
                  {getStatusText("config", status.config)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Auth:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon("auth", status.auth)}
                <span className={getStatusColor("auth", status.auth)}>
                  {getStatusText("auth", status.auth)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Firestore:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon("firestore", status.firestore)}
                <span className={getStatusColor("firestore", status.firestore)}>
                  {getStatusText("firestore", status.firestore)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between col-span-2">
              <span className="text-gray-600">Quota:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon("quota", status.quota)}
                <span className={getStatusColor("quota", status.quota)}>
                  {getStatusText("quota", status.quota)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              checkFirebaseStatus();
            }}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Atualizar Status
          </button>
        </div>
      )}
    </div>
  );
};
