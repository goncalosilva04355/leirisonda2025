import React, { useState } from "react";
import { AlertTriangle, Shield, Users, LogOut, RefreshCw } from "lucide-react";
import {
  emergencyLogoutService,
  EmergencyLogoutResult,
} from "../services/emergencyLogoutService";

export const EmergencyLogoutManager: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<EmergencyLogoutResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const executeEmergencyLogout = async () => {
    setIsExecuting(true);
    setResult(null);

    try {
      console.log("🚨 Executing emergency logout...");
      const logoutResult = await emergencyLogoutService.forceLogoutAllUsers();
      setResult(logoutResult);

      if (logoutResult.success) {
        console.log("✅ Emergency logout completed successfully");

        // Dispatch event to notify all components
        window.dispatchEvent(new CustomEvent("emergencyLogoutCompleted"));

        // Force page reload to clear all state
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      console.error("❌ Emergency logout failed:", error);
      setResult({
        success: false,
        message: `Emergency logout failed: ${error.message}`,
        details: {
          firebaseLogoutCompleted: false,
          localSessionsCleared: false,
          persistentDataCleared: false,
          autoLoginDisabled: false,
          errors: [error.message],
        },
      });
    } finally {
      setIsExecuting(false);
      setShowConfirmation(false);
    }
  };

  const handleEmergencyLogout = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="space-y-6">
      {/* Warning Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Emergency Logout - Nuclear Option
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Esta ação irá deslogar TODOS os utilizadores imediatamente e
              revogar todas as sessões ativas. Use apenas se utilizadores
              antigos ainda conseguem aceder à aplicação.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Logout Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-red-600" />
            Emergency Logout
          </h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Esta ação irá:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Deslogar todos os utilizadores do Firebase</li>
                <li>
                  Limpar todas as sessões locais (localStorage, sessionStorage)
                </li>
                <li>Remover todos os cookies de autenticação</li>
                <li>Limpar IndexedDB do Firebase</li>
                <li>Desativar auto-login temporariamente</li>
                <li>Manter apenas o super admin Gonçalo</li>
              </ul>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmation && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">
                      Tem a certeza? Esta ação não pode ser desfeita.
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={executeEmergencyLogout}
                      disabled={isExecuting}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {isExecuting ? "A executar..." : "Confirmar"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            {!showConfirmation && (
              <button
                onClick={handleEmergencyLogout}
                disabled={isExecuting}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />A
                    executar Emergency Logout...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Executar Emergency Logout
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div
          className={`border rounded-lg p-4 ${
            result.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start">
            {result.success ? (
              <Shield className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            )}
            <div className="flex-1">
              <h4
                className={`text-sm font-medium ${
                  result.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {result.success
                  ? "Emergency Logout Completo"
                  : "Emergency Logout Falhado"}
              </h4>
              <p
                className={`text-sm mt-1 ${
                  result.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {result.message}
              </p>

              {/* Details */}
              <div className="mt-3 text-xs">
                <div className="space-y-1">
                  <div
                    className={`flex items-center ${
                      result.details.firebaseLogoutCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                    Firebase Logout:{" "}
                    {result.details.firebaseLogoutCompleted ? "✅" : "❌"}
                  </div>
                  <div
                    className={`flex items-center ${
                      result.details.localSessionsCleared
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                    Sessões Locais Limpas:{" "}
                    {result.details.localSessionsCleared ? "✅" : "❌"}
                  </div>
                  <div
                    className={`flex items-center ${
                      result.details.persistentDataCleared
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                    Dados Persistentes Limpos:{" "}
                    {result.details.persistentDataCleared ? "✅" : "❌"}
                  </div>
                  <div
                    className={`flex items-center ${
                      result.details.autoLoginDisabled
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                    Auto-Login Desativado:{" "}
                    {result.details.autoLoginDisabled ? "✅" : "❌"}
                  </div>
                </div>

                {result.details.errors.length > 0 && (
                  <div className="mt-2">
                    <span className="text-red-600 font-medium">Erros:</span>
                    <ul className="list-disc list-inside text-red-600 ml-2">
                      {result.details.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {result.success && (
                <div className="mt-3 text-xs text-green-700">
                  A página será recarregada automaticamente em 2 segundos...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <Users className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Quando usar Emergency Logout:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Utilizadores antigos ainda conseguem aceder</li>
              <li>• Após mudanças de passwords que não surtiram efeito</li>
              <li>• Quando há suspeitas de sessões comprometidas</li>
              <li>• Como último recurso quando outros métodos falharam</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
