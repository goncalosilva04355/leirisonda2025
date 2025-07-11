import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Database,
  User,
} from "lucide-react";

interface DataInputStatus {
  firebase: boolean;
  localStorage: boolean;
  authentication: boolean;
  connectivity: boolean;
  isOnline?: boolean;
  pendingSync?: number;
  firebaseAvailable?: boolean;
  lastSync?: string;
}

export const DataInputStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<DataInputStatus>({
    firebase: false,
    localStorage: false,
    authentication: false,
    connectivity: false,
  });

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      // Verificar localStorage
      const localStorageWorks = (() => {
        try {
          localStorage.setItem("test", "ok");
          const test = localStorage.getItem("test");
          localStorage.removeItem("test");
          return test === "ok";
        } catch {
          return false;
        }
      })();

      // Verificar Firebase
      let firebaseWorks = false;
      try {
        const { firebaseService } = await import("../firebase/robustConfig");
        firebaseWorks = await firebaseService.initialize();
      } catch {
        firebaseWorks = false;
      }

      // Verificar autenticação (híbrida)
      let authWorks = false;
      try {
        const { robustLoginService } = await import(
          "../services/robustLoginService"
        );
        const currentUser = robustLoginService.getCurrentUser();
        authWorks = !!currentUser;
      } catch {
        authWorks = false;
      }

      // Verificar conectividade
      const connectivityWorks = navigator.onLine;

      // Verificar sincronização híbrida
      let syncStatus = {
        isOnline: false,
        pendingSync: 0,
        firebaseAvailable: false,
      };
      try {
        const { hybridDataSync } = await import("../services/hybridDataSync");
        syncStatus = hybridDataSync.getSyncStatus();
      } catch (error) {
        console.log("ℹ️ Sync service não disponível");
      }

      setStatus({
        firebase: firebaseWorks,
        localStorage: localStorageWorks,
        authentication: authWorks,
        connectivity: connectivityWorks,
        ...syncStatus,
      });
    };

    checkStatus();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);

    // Listener para mudanças de conectividade
    const handleOnline = () =>
      setStatus((prev) => ({ ...prev, connectivity: true }));
    const handleOffline = () =>
      setStatus((prev) => ({ ...prev, connectivity: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getOverallStatus = () => {
    if (status.localStorage && (status.firebase || !status.connectivity)) {
      return "good"; // Sistema funcional
    }
    if (status.localStorage) {
      return "warning"; // Funcional mas limitado
    }
    return "error"; // Problemas críticos
  };

  const overallStatus = getOverallStatus();

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors z-50"
        title="Mostrar status do sistema"
      >
        i
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <Database className="w-4 h-4 mr-2" />
          Status do Sistema
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Database className="w-3 h-3 mr-2" />
            localStorage
          </span>
          {status.localStorage ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Wifi className="w-3 h-3 mr-2" />
            Firebase
          </span>
          {status.firebase ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-orange-500" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <User className="w-3 h-3 mr-2" />
            Autenticação
          </span>
          {status.authentication ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-orange-500" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center">
            {status.connectivity ? (
              <Wifi className="w-3 h-3 mr-2" />
            ) : (
              <WifiOff className="w-3 h-3 mr-2" />
            )}
            Internet
          </span>
          {status.connectivity ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-orange-500" />
          )}
        </div>

        {/* Status de Sincronização */}
        {status.pendingSync !== undefined && (
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Database className="w-3 h-3 mr-2" />
              Sincronização
            </span>
            <div className="flex items-center space-x-1">
              {status.pendingSync === 0 ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-orange-600">
                    {status.pendingSync}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">Status Geral:</span>
          <span
            className={`text-sm font-semibold ${
              overallStatus === "good"
                ? "text-green-600"
                : overallStatus === "warning"
                  ? "text-orange-600"
                  : "text-red-600"
            }`}
          >
            {overallStatus === "good"
              ? "Funcional"
              : overallStatus === "warning"
                ? "Limitado"
                : "Problema"}
          </span>
        </div>

        {overallStatus === "good" && (
          <div className="text-xs text-green-600 mt-1">
            <p>✅ Sistema funcionando - pode inserir dados</p>
            {status.firebase && status.pendingSync === 0 && (
              <p>🔥 Sincronização Firebase ativa</p>
            )}
            {!status.firebase && status.localStorage && (
              <p>💾 Modo local - sincronizará quando Firebase disponível</p>
            )}
          </div>
        )}

        {overallStatus === "warning" && (
          <p className="text-xs text-orange-600 mt-1">
            ⚠️ Modo offline - dados salvos localmente
          </p>
        )}

        {overallStatus === "error" && (
          <div className="text-xs text-red-600 mt-1">
            <p>❌ Problemas detectados</p>
            <p className="mt-1">
              💡 Tente: F5 (recarregar) ou Ctrl+Shift+N (modo incógnito)
            </p>
          </div>
        )}
      </div>

      {/* Instruções de teste */}
      {!status.authentication && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-blue-600">
          <p className="font-medium">🔐 Para testar login:</p>
          <p>Email: teste@teste.com</p>
          <p>Password: 123</p>
        </div>
      )}
    </div>
  );
};

export default DataInputStatusIndicator;
