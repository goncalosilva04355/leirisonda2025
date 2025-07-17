import React, { useState, useEffect } from "react";
import { Database, Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { getFirebaseFirestore } from "../firebase/leiriaConfig";
import { testFirestoreConnection } from "../services/firestoreDataServiceRest";

export const SyncStatusIndicatorFixed: React.FC = () => {
  const [status, setStatus] = useState<
    "checking" | "online" | "offline" | "syncing"
  >("checking");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [dataCount, setDataCount] = useState(0);

  // Verificar status da conexão
  const checkConnectionStatus = async () => {
    try {
      setStatus("checking");

      // Verificar se Firestore está disponível
      const db = getFirebaseFirestore();
      if (!db) {
        setStatus("offline");
        return;
      }

      // Testar conectividade
      const isConnected = await testFirestoreConnection();
      if (isConnected) {
        setStatus("online");
        setLastSync(new Date());
      } else {
        setStatus("offline");
      }
    } catch (error) {
      console.error("Erro ao verificar status de conexão:", error);
      setStatus("offline");
    }
  };

  // Contar dados locais
  const countLocalData = () => {
    try {
      const works = JSON.parse(localStorage.getItem("works") || "[]");
      const pools = JSON.parse(localStorage.getItem("pools") || "[]");
      const maintenance = JSON.parse(
        localStorage.getItem("maintenance") || "[]",
      );
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");

      const total =
        works.length + pools.length + maintenance.length + clients.length;
      setDataCount(total);
    } catch (error) {
      setDataCount(0);
    }
  };

  // Inicializar verificações
  useEffect(() => {
    checkConnectionStatus();
    countLocalData();

    // Verificar periodicamente
    const interval = setInterval(() => {
      checkConnectionStatus();
      countLocalData();
    }, 30000); // 30 segundos

    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      countLocalData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case "checking":
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case "online":
        return <Wifi className="w-4 h-4 text-green-500" />;
      case "syncing":
        return <Database className="w-4 h-4 animate-pulse text-blue-500" />;
      case "offline":
      default:
        return <WifiOff className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "checking":
        return "Verificando...";
      case "online":
        return "Sincronizado";
      case "syncing":
        return "Sincronizando...";
      case "offline":
      default:
        return "Modo Local";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-50 border-green-200";
      case "syncing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "checking":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "offline":
      default:
        return "text-orange-600 bg-orange-50 border-orange-200";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm ${getStatusColor()}`}
    >
      {getStatusIcon()}
      <span className="font-medium">{getStatusText()}</span>

      {dataCount > 0 && (
        <span className="text-xs opacity-75">({dataCount} registos)</span>
      )}

      {lastSync && status === "online" && (
        <span className="text-xs opacity-75">
          {lastSync.toLocaleTimeString()}
        </span>
      )}

      {status === "offline" && (
        <button
          onClick={checkConnectionStatus}
          className="text-xs underline hover:no-underline"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export default SyncStatusIndicatorFixed;
