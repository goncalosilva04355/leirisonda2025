import React, { useState, useEffect } from "react";
import { Database, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { dataPersistenceManager } from "../utils/dataPersistenceFix";

interface DataPersistenceIndicatorProps {
  onClick?: () => void;
}

export const DataPersistenceIndicator: React.FC<
  DataPersistenceIndicatorProps
> = ({ onClick }) => {
  const [status, setStatus] = useState<{
    localStorage: boolean;
    firestore: boolean;
    working: boolean;
  } | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await dataPersistenceManager.diagnoseDataPersistence();
        setStatus({
          localStorage: result.localStorage,
          firestore: result.firestore,
          working: result.working,
        });
        setLastCheck(new Date());
      } catch (error) {
        console.error("❌ Erro no indicador de persistência:", error);
        setStatus({
          localStorage: false,
          firestore: false,
          working: false,
        });
      }
    };

    // Verificação inicial
    setTimeout(checkStatus, 2000);

    // Verificação periódica
    const interval = setInterval(checkStatus, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return null; // Ainda carregando
  }

  const getStatusIcon = () => {
    if (!status.working) {
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    } else if (status.firestore && status.localStorage) {
      return <Wifi className="h-3 w-3 text-green-500" />;
    } else if (status.localStorage) {
      return <WifiOff className="h-3 w-3 text-yellow-500" />;
    } else {
      return <Database className="h-3 w-3 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    if (!status.working) return "bg-red-100 border-red-300";
    if (status.firestore && status.localStorage)
      return "bg-green-100 border-green-300";
    if (status.localStorage) return "bg-yellow-100 border-yellow-300";
    return "bg-blue-100 border-blue-300";
  };

  const getStatusText = () => {
    if (!status.working) return "Persistência com problemas";
    if (status.firestore && status.localStorage)
      return "Sincronização completa";
    if (status.localStorage) return "Apenas local";
    return "Verificando...";
  };

  return (
    <div
      onClick={onClick}
      className={`fixed bottom-4 left-4 z-40 cursor-pointer transition-all duration-200 hover:scale-105 ${
        onClick ? "hover:shadow-lg" : ""
      }`}
      title={`${getStatusText()}${lastCheck ? ` - ${lastCheck.toLocaleTimeString("pt-PT")}` : ""}`}
    >
      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getStatusColor()} backdrop-blur-sm`}
      >
        {getStatusIcon()}
        <span className="text-xs font-medium text-gray-700">
          {status.firestore && status.localStorage
            ? "Sync"
            : status.localStorage
              ? "Local"
              : !status.working
                ? "Erro"
                : "Off"}
        </span>
      </div>
    </div>
  );
};

export default DataPersistenceIndicator;
