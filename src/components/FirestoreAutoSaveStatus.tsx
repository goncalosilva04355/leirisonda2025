import React, { useState, useEffect } from "react";
import { Database, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { testFirestoreConnection } from "../services/firestoreDataService";

interface AutoSaveEvent {
  id: string;
  type: "obra" | "manutencao" | "piscina" | "cliente" | "utilizador";
  firestoreId: string;
  timestamp: Date;
  status: "success" | "error";
}

export const FirestoreAutoSaveStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [recentSaves, setRecentSaves] = useState<AutoSaveEvent[]>([]);
  const [totalSaves, setTotalSaves] = useState(0);

  // Verificar conexão inicial
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await testFirestoreConnection();
        setIsConnected(connected);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();

    // Verificar periodicamente
    const interval = setInterval(checkConnection, 30000); // cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  // Escutar logs do console para detectar gravações automáticas
  useEffect(() => {
    const originalLog = console.log;

    console.log = function (...args) {
      const message = args.join(" ");

      // Detectar gravações automáticas bem-sucedidas
      if (message.includes("gravado automaticamente no Firestore")) {
        const match = message.match(
          /(Obra|Manutenção|Piscina|Cliente|Utilizador) gravado automaticamente no Firestore: (\w+)/,
        );
        if (match) {
          const [, type, firestoreId] = match;
          const newSave: AutoSaveEvent = {
            id: Date.now().toString(),
            type: type.toLowerCase() as AutoSaveEvent["type"],
            firestoreId,
            timestamp: new Date(),
            status: "success",
          };

          setRecentSaves((prev) => [newSave, ...prev.slice(0, 4)]); // Manter apenas os 5 mais recentes
          setTotalSaves((prev) => prev + 1);
        }
      }

      originalLog.apply(console, args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  const getTypeIcon = (type: AutoSaveEvent["type"]) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "obra":
        return "🏗️";
      case "manutencao":
        return "🔧";
      case "piscina":
        return "🏊";
      case "cliente":
        return "👤";
      case "utilizador":
        return "👥";
      default:
        return "📄";
    }
  };

  const getStatusColor = () => {
    if (isConnected === null) return "text-gray-500";
    return isConnected ? "text-green-500" : "text-red-500";
  };

  const getStatusIcon = () => {
    if (isConnected === null) return <Clock className="h-4 w-4" />;
    return isConnected ? (
      <CheckCircle className="h-4 w-4" />
    ) : (
      <AlertCircle className="h-4 w-4" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
          <Database className="h-4 w-4 text-blue-500" />
          <span>Gravação Automática Firestore</span>
        </h3>

        <div
          className={`flex items-center space-x-1 text-xs ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <span>
            {isConnected === null
              ? "Verificando..."
              : isConnected
                ? "Conectado"
                : "Desconectado"}
          </span>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="text-lg font-bold text-blue-600">{totalSaves}</div>
          <div className="text-xs text-blue-700">Total Gravado</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="text-lg font-bold text-green-600">
            {recentSaves.length}
          </div>
          <div className="text-xs text-green-700">Recentes</div>
        </div>
      </div>

      {/* Gravações recentes */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 mb-2">
          Gravações Recentes:
        </h4>
        {recentSaves.length > 0 ? (
          <div className="space-y-1">
            {recentSaves.map((save) => (
              <div
                key={save.id}
                className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-2">
                  <span>{getTypeIcon(save.type)}</span>
                  <span className="capitalize">{save.type}</span>
                  <span className="text-gray-500">
                    #{save.firestoreId.slice(-6)}
                  </span>
                </div>
                <div className="text-gray-500">
                  {save.timestamp.toLocaleTimeString("pt-PT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center py-2">
            Nenhuma gravação automática ainda
          </div>
        )}
      </div>

      {/* Info sobre funcionamento */}
      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
        <strong>💡 Como funciona:</strong> Sempre que criar obras, manutenções,
        piscinas, clientes ou utilizadores, os dados são automaticamente
        gravados no Firestore em tempo real.
      </div>
    </div>
  );
};
