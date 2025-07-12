import React, { useState, useEffect } from "react";
import {
  Cloud,
  Database,
  Shield,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const FirebaseGoogleCloudStatusCompact: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      // Check Firebase status
      const { isFirebaseReady, getDB, getAuthService } = await import(
        "../firebase/config"
      );
      const { UltimateSimpleFirebase } = await import(
        "../firebase/ultimateSimpleFirebase"
      );

      const firebaseReady = isFirebaseReady();
      const ultStatus = UltimateSimpleFirebase.getStatus();

      let authService = null;
      let dbService = null;

      try {
        authService = await getAuthService();
      } catch (error) {
        console.log("Auth service not available:", error);
      }

      try {
        dbService = await getDB();
      } catch (error) {
        console.log("DB service not available:", error);
      }

      // Check Google Cloud Project info
      const googleCloudProject = {
        projectId: "leiria-1cfc9",
        region: "us-central1",
        status:
          firebaseReady && authService && dbService ? "active" : "degraded",
      };

      // Check quota and performance
      const quotaStatus = {
        exceeded: localStorage.getItem("firebase-quota-exceeded") === "true",
        lastCheck: localStorage.getItem("firebase-quota-check-time"),
        emergencyShutdown:
          localStorage.getItem("firebase-emergency-shutdown") === "true",
      };

      setStatus({
        firebase: {
          ready: firebaseReady,
          auth: !!authService,
          database: !!dbService,
          ultStatus,
        },
        googleCloud: googleCloudProject,
        quota: quotaStatus,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      setStatus({
        error: error.message,
        timestamp: new Date().toISOString(),
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
      status.firebase.ready &&
      status.firebase.auth &&
      status.firebase.database
    )
      return "good";
    return "degraded";
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
        return "��";
      case "error":
        return "🔴";
      default:
        return "⚪";
    }
  };

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
            <Cloud className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Firebase & Google Cloud
            </span>
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
          <span>Firebase: {status.firebase?.ready ? "✅" : "❌"}</span>
          <span>Auth: {status.firebase?.auth ? "✅" : "❌"}</span>
          <span>DB: {status.firebase?.database ? "✅" : "❌"}</span>
          <span>
            GCP: {status.googleCloud?.status === "active" ? "✅" : "⚠️"}
          </span>
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
              {/* Firebase Details */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Database className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-gray-700">
                    Firebase
                  </span>
                </div>
                <div className="ml-4 text-xs text-gray-600 space-y-1">
                  <div>
                    Status: {status.firebase.ultStatus?.status || "unknown"}
                  </div>
                  <div>
                    App: {status.firebase.ultStatus?.hasApp ? "✅" : "❌"}
                  </div>
                  <div>
                    Ready: {status.firebase.ultStatus?.ready ? "✅" : "❌"}
                  </div>
                </div>
              </div>

              {/* Google Cloud Details */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Cloud className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-gray-700">
                    Google Cloud
                  </span>
                </div>
                <div className="ml-4 text-xs text-gray-600 space-y-1">
                  <div>Projeto: {status.googleCloud.projectId}</div>
                  <div>Região: {status.googleCloud.region}</div>
                  <div>Estado: {status.googleCloud.status}</div>
                </div>
              </div>

              {/* Quota Status */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-purple-500" />
                  <span className="text-xs font-medium text-gray-700">
                    Quotas & Limites
                  </span>
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
                !status.firebase.ready) && (
                <div className="bg-yellow-100 border border-yellow-300 rounded p-2 text-xs">
                  <strong>⚠️ Avisos:</strong>
                  {status.quota.exceeded && (
                    <div>• Quota do Firebase excedida</div>
                  )}
                  {status.quota.emergencyShutdown && (
                    <div>• Sistema em modo de emergência</div>
                  )}
                  {!status.firebase.ready && (
                    <div>• Firebase não está completamente funcional</div>
                  )}
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
