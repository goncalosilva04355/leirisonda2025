import React, { useState, useEffect } from "react";
import { AlertTriangle, Database, RefreshCw } from "lucide-react";
import { dataPersistenceManager } from "../utils/dataPersistenceFix";

interface DataPersistenceAlertProps {
  onOpenDiagnostic?: () => void;
}

export const DataPersistenceAlert: React.FC<DataPersistenceAlertProps> = ({
  onOpenDiagnostic,
}) => {
  const [show, setShow] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Verificar persistência periodicamente
  useEffect(() => {
    const checkPersistence = async () => {
      try {
        const status = await dataPersistenceManager.diagnoseDataPersistence();
        setLastCheck(new Date());

        if (!status.working && !show) {
          setShow(true);
          console.warn("🚨 Alerta de persistência ativado:", status.issues);
        } else if (status.working && show) {
          setShow(false);
          console.log("✅ Persistência restaurada, removendo alerta");
        }
      } catch (error) {
        console.error("❌ Erro na verificação de persistência:", error);
        if (!show) {
          setShow(true);
        }
      }
    };

    // Verificação inicial
    setTimeout(checkPersistence, 3000);

    // Verificação periódica
    const interval = setInterval(checkPersistence, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [show]);

  const handleQuickRepair = async () => {
    setIsRepairing(true);
    try {
      const success = await dataPersistenceManager.repairDataPersistence();

      if (success) {
        setShow(false);

        // Mostrar notificação de sucesso
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("✅ Dados Reparados", {
            body: "O sistema de persistência foi reparado com sucesso",
            icon: "/icon.svg",
          });
        } else {
          alert(
            "✅ Sistema reparado com sucesso! Os dados devem agora ser guardados corretamente.",
          );
        }
      } else {
        alert(
          "❌ Não foi possível reparar automaticamente. Use o diagnóstico completo.",
        );
        if (onOpenDiagnostic) {
          onOpenDiagnostic();
        }
      }
    } catch (error) {
      console.error("❌ Erro na reparação rápida:", error);
      alert("❌ Erro na reparação. Tente o diagnóstico completo.");
    } finally {
      setIsRepairing(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-red-600 text-white rounded-lg shadow-lg border border-red-700">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-yellow-300" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold">🚨 Problema de Persistência</h3>
              <p className="text-xs mt-1 text-red-100">
                Os dados podem não estar a ser guardados. Isto pode causar perda
                de informação.
              </p>
              {lastCheck && (
                <p className="text-xs mt-1 text-red-200">
                  Última verificação: {lastCheck.toLocaleTimeString("pt-PT")}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleQuickRepair}
              disabled={isRepairing}
              className="flex items-center space-x-1 px-3 py-1 bg-white text-red-600 rounded text-xs font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3 w-3 ${isRepairing ? "animate-spin" : ""}`}
              />
              <span>{isRepairing ? "Reparando..." : "Reparação Rápida"}</span>
            </button>

            {onOpenDiagnostic && (
              <button
                onClick={onOpenDiagnostic}
                className="flex items-center space-x-1 px-3 py-1 bg-red-700 text-white rounded text-xs hover:bg-red-800"
              >
                <Database className="h-3 w-3" />
                <span>Diagnóstico</span>
              </button>
            )}

            <button
              onClick={() => setShow(false)}
              className="px-3 py-1 bg-red-800 text-white rounded text-xs hover:bg-red-900"
            >
              Dispensar
            </button>
          </div>
        </div>

        {/* Barra de progresso para mostrar atividade */}
        {isRepairing && (
          <div className="h-1 bg-red-700">
            <div className="h-full bg-yellow-300 animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPersistenceAlert;
