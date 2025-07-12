import React, { useState, useEffect } from "react";
import {
  Database,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";

export const FirebaseGoogleCloudStatusCompact: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showRulesHelper, setShowRulesHelper] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    setHasError(false);
    try {
      // Check Firestore status with Safari compatibility
      const { safariCompatibility } = await import(
        /* webpackIgnore: true */ "../services/safariCompatibilityService"
      );
      const { getDB } = await import(
        /* webpackIgnore: true */ "../firebase/config"
      );

      let dbService = null;
      let rulesTest = null;
      let compatibilityStatus = safariCompatibility.getCompatibilityStatus();

      // Use Safari-safe operations
      dbService = await safariCompatibility.safeFirebaseOperation(async () => {
        return await getDB();
      });

      // Test Firestore rules if database is available
      if (dbService) {
        rulesTest = await safariCompatibility.safeFirebaseOperation(
          async () => {
            const { FirestoreRulesFix } = await import(
              /* webpackIgnore: true */ "../firebase/firestoreRulesFix"
            );
            return await FirestoreRulesFix.testFirestoreAccess();
          },
          {
            canRead: false,
            canWrite: false,
            error: "Rules test failed with Safari compatibility",
            suggestion: "Check Firestore rules and Safari compatibility",
          },
        );
      }

      // Check quota and performance
      const quotaStatus = {
        exceeded: localStorage.getItem("firebase-quota-exceeded") === "true",
        emergencyShutdown:
          localStorage.getItem("firebase-emergency-shutdown") === "true",
      };

      setStatus({
        firestore: {
          available: !!dbService,
          canRead: rulesTest?.canRead || false,
          canWrite: rulesTest?.canWrite || false,
          rulesError: rulesTest?.error || null,
        },
        quota: quotaStatus,
        compatibility: compatibilityStatus,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("❌ Erro ao verificar status Firestore:", error);
      setHasError(true);
      setStatus({
        error: error.message || "Erro desconhecido",
        timestamp: new Date().toISOString(),
        firestore: {
          available: false,
          canRead: false,
          canWrite: false,
          rulesError: "Erro ao testar conexão",
        },
        quota: {
          exceeded: false,
          emergencyShutdown: false,
        },
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getOverallStatus = () => {
    if (!status || status.error) return "error";
    if (status.quota.exceeded || status.quota.emergencyShutdown)
      return "warning";
    if (
      status.firestore.available &&
      status.firestore.canRead &&
      status.firestore.canWrite
    )
      return "good";
    if (status.firestore.available) return "degraded";
    return "error";
  };

  const getStatusColor = () => {
    const overall = getOverallStatus();
    switch (overall) {
      case "good":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "degraded":
        return "bg-orange-50 border-orange-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    const overall = getOverallStatus();
    switch (overall) {
      case "good":
        return "🟢";
      case "warning":
        return "🟡";
      case "degraded":
        return "🟠";
      case "error":
        return "🔴";
      default:
        return "⚪";
    }
  };

  // Error state
  if (hasError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🔴</span>
            <span className="text-sm font-medium text-red-700">
              Erro no Status Firestore
            </span>
          </div>
          <button
            onClick={() => {
              setHasError(false);
              checkStatus();
            }}
            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
        <div className="mt-2 text-xs text-red-600">
          Erro ao carregar status. Clique "Tentar Novamente" ou atualize a
          página.
        </div>
      </div>
    );
  }

  // Loading state
  if (!status) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
          <span className="text-sm text-gray-600">
            Verificando estado dos serviços...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-3 mb-4 border ${getStatusColor()}`}>
      {/* Header compacto */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <div className="flex items-center space-x-1">
            <Database className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Firestore</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              checkStatus();
            }}
            disabled={isChecking}
            className="p-1 hover:bg-white/50 rounded"
          >
            <RefreshCw
              className={`h-3 w-3 text-gray-500 ${isChecking ? "animate-spin" : ""}`}
            />
          </button>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </div>

      {/* Status resumido sempre visível */}
      <div className="mt-2 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span>Disponível: {status.firestore?.available ? "✅" : "❌"}</span>
          <span>Leitura: {status.firestore?.canRead ? "✅" : "❌"}</span>
          <span>Escrita: {status.firestore?.canWrite ? "✅" : "❌"}</span>
        </div>
      </div>

      {/* Detalhes expandidos */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          {status.error ? (
            <div className="text-red-700 text-xs">
              <strong>Erro:</strong> {status.error}
            </div>
          ) : (
            <>
              {/* Firestore Details */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Database className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-gray-700">
                    Firestore Database
                  </span>
                </div>
                <div className="ml-4 text-xs text-gray-600 space-y-1">
                  <div>
                    Disponível:{" "}
                    {status.firestore.available ? "✅ Sim" : "❌ Não"}
                  </div>
                  <div>
                    Permissão leitura:{" "}
                    {status.firestore.canRead ? "✅ Sim" : "❌ Não"}
                  </div>
                  <div>
                    Permissão escrita:{" "}
                    {status.firestore.canWrite ? "✅ Sim" : "❌ Não"}
                  </div>
                  {status.firestore.rulesError && (
                    <div className="text-red-600">
                      Erro: {status.firestore.rulesError}
                    </div>
                  )}
                </div>
              </div>

              {/* Quota Status */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-700">
                  Estado do Sistema
                </div>
                <div className="ml-4 text-xs text-gray-600 space-y-1">
                  <div>
                    Quota excedida:{" "}
                    {status.quota.exceeded ? "❌ Sim" : "✅ Não"}
                  </div>
                  <div>
                    Modo emergência:{" "}
                    {status.quota.emergencyShutdown ? "🚨 Ativo" : "✅ Normal"}
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {(status.quota.exceeded ||
                status.quota.emergencyShutdown ||
                !status.firestore.available ||
                !status.firestore.canRead ||
                !status.firestore.canWrite) && (
                <div className="bg-yellow-100 border border-yellow-300 rounded p-2 text-xs">
                  <strong>⚠️ Avisos:</strong>
                  {status.quota.exceeded && (
                    <div>• Quota do Firestore excedida</div>
                  )}
                  {status.quota.emergencyShutdown && (
                    <div>• Sistema em modo de emergência</div>
                  )}
                  {!status.firestore.available && (
                    <div>• Firestore não está disponível</div>
                  )}
                  {!status.firestore.canRead && (
                    <div>• Sem permissão de leitura</div>
                  )}
                  {!status.firestore.canWrite && (
                    <div>• Sem permissão de escrita</div>
                  )}

                  {/* Botão para mostrar helper de regras quando há problemas de permissões */}
                  {(!status.firestore.canRead ||
                    !status.firestore.canWrite) && (
                    <div className="mt-2 pt-2 border-t border-yellow-400">
                      <button
                        onClick={() => setShowRulesHelper(!showRulesHelper)}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        <Settings className="h-3 w-3" />
                        <span>
                          {showRulesHelper ? "Ocultar" : "Corrigir Regras"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Helper de regras Firestore */}
              {showRulesHelper && (
                <div className="mt-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm font-medium text-blue-900 mb-2">
                      🔧 Configuração de Regras Firestore
                    </div>
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>
                        1. Abre:
                        console.firebase.google.com/project/leiria-1cfc9/firestore/rules
                      </div>
                      <div>
                        2. Substitui as regras por: allow read, write: if true;
                      </div>
                      <div>3. Clica "Publish"</div>
                      <div>4. Volta aqui e clica refresh</div>
                    </div>
                    <button
                      onClick={() =>
                        window.open(
                          "https://console.firebase.google.com/project/leiria-1cfc9/firestore/rules",
                          "_blank",
                        )
                      }
                      className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Abrir Firebase Console
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            Última atualização:{" "}
            {new Date(status.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseGoogleCloudStatusCompact;
