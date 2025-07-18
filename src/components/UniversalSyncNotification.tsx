import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Globe,
  X,
  AlertTriangle,
  RefreshCw,
  Users,
  Smartphone,
} from "lucide-react";
import { useUniversalDataSyncSafe as useUniversalDataSync } from "../hooks/useUniversalDataSyncSafe";

export function UniversalSyncNotification() {
  const universalSync = useUniversalDataSync();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | "info"
  >("info");
  const [lastSyncStatus, setLastSyncStatus] = useState("");

  // Monitorar mudanças no status de sincronização
  useEffect(() => {
    if (lastSyncStatus !== universalSync.syncStatus) {
      setLastSyncStatus(universalSync.syncStatus);

      // Mostrar notificação baseada no status
      if (
        universalSync.syncStatus === "connected" &&
        universalSync.totalItems > 0
      ) {
        setNotificationType("success");
        setShowNotification(true);

        // Auto-ocultar após 5 segundos
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      } else if (universalSync.syncStatus === "error") {
        setNotificationType("error");
        setShowNotification(true);

        // Auto-ocultar após 8 segundos para erros
        setTimeout(() => {
          setShowNotification(false);
        }, 8000);
      }
    }
  }, [universalSync.syncStatus, universalSync.totalItems, lastSyncStatus]);

  // Mostrar notificação inicial se há dados sincronizados
  useEffect(() => {
    if (
      universalSync.totalItems > 0 &&
      universalSync.syncStatus === "connected"
    ) {
      setTimeout(() => {
        setNotificationType("info");
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 6000);
      }, 2000); // Delay inicial de 2 segundos
    }
  }, []); // Apenas no mount inicial

  if (!showNotification) {
    return null;
  }

  const getNotificationConfig = () => {
    switch (notificationType) {
      case "success":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
          title: "Sincronização Universal Ativa!",
          message: `${universalSync.totalItems} registos sincronizados e partilhados entre todos os utilizadores.`,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
        };
      case "error":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
          title: "Erro na Sincronização",
          message:
            universalSync.error ||
            "Não foi possível sincronizar os dados. Alguns dados podem não estar partilhados.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
        };
      default:
        return {
          icon: <Globe className="h-6 w-6 text-blue-600" />,
          title: "Dados Partilhados Globalmente",
          message: `Todas as ${universalSync.obras.length} obras, ${universalSync.manutencoes.length} manutenções, ${universalSync.piscinas.length} piscinas e ${universalSync.clientes.length} clientes são visíveis para toda a equipa.`,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
        };
    }
  };

  const config = getNotificationConfig();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div
        className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">{config.icon}</div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-semibold ${config.textColor}`}>
                {config.title}
              </h3>
              <p
                className={`mt-1 text-sm ${config.textColor.replace("800", "700")}`}
              >
                {config.message}
              </p>

              {/* Detalhes adicionais para sucesso */}
              {notificationType === "success" && (
                <div className="mt-2 flex items-center space-x-4 text-xs text-green-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>Partilhado com todos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Smartphone className="h-3 w-3" />
                    <span>Todos os dispositivos</span>
                  </div>
                </div>
              )}

              {/* Indicador de sincronização ativa */}
              {universalSync.syncStatus === "syncing" && (
                <div className="mt-2 flex items-center space-x-2 text-xs text-blue-600">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Sincronizando dados...</span>
                </div>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => setShowNotification(false)}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de progresso para notificações temporárias */}
        {notificationType !== "error" && (
          <div className="h-1 bg-gray-200">
            <div
              className={`h-1 ${notificationType === "success" ? "bg-green-500" : "bg-blue-500"} transition-all duration-500 ease-out`}
              style={{
                width: "100%",
                animation:
                  notificationType === "success"
                    ? "shrink 5s linear"
                    : "shrink 6s linear",
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
