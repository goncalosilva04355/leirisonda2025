import React, { useState } from "react";
import {
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  TestTube,
  Smartphone,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useFCM } from "../hooks/useFCM";

interface User {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
}

interface FCMNotificationSetupProps {
  currentUser: User | null;
  onClose?: () => void;
}

export const FCMNotificationSetup: React.FC<FCMNotificationSetupProps> = ({
  currentUser,
  onClose,
}) => {
  const {
    fcmStatus,
    isLoading,
    error,
    canRequestPermission,
    hasValidSetup,
    needsSetup,
    requestPermissionAndToken,
    removeToken,
    sendTestNotification,
    clearError,
    getUserTokens,
  } = useFCM(currentUser);

  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!currentUser) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="w-5 h-5" />
          <span>Faça login para configurar notificações</span>
        </div>
      </div>
    );
  }

  const userTokens = getUserTokens();

  const getStatusIcon = () => {
    if (!fcmStatus.supported)
      return <WifiOff className="w-6 h-6 text-red-500" />;
    if (hasValidSetup)
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (fcmStatus.permission === "denied")
      return <XCircle className="w-6 h-6 text-red-500" />;
    return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
  };

  const getStatusMessage = () => {
    if (!fcmStatus.supported)
      return "Seu navegador não suporta notificações push";
    if (hasValidSetup) return "Notificações push configuradas e ativas";
    if (fcmStatus.permission === "denied")
      return "Permissão para notificações negada";
    if (needsSetup)
      return "Configure notificações para receber alertas de obras";
    return "Verificando configuração de notificações...";
  };

  const getStatusColor = () => {
    if (!fcmStatus.supported || fcmStatus.permission === "denied") return "red";
    if (hasValidSetup) return "green";
    return "yellow";
  };

  const statusColor = getStatusColor();

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Notificações Push
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="p-4">
        <div
          className={`bg-${statusColor}-50 border border-${statusColor}-200 rounded-lg p-4`}
        >
          <div className="flex items-start gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <h4 className={`font-medium text-${statusColor}-900`}>
                Status das Notificações
              </h4>
              <p className={`text-sm text-${statusColor}-700 mt-1`}>
                {getStatusMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={clearError}
                  className="text-xs text-red-600 hover:text-red-800 mt-1"
                >
                  Dispensar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 space-y-3">
          {canRequestPermission && (
            <button
              onClick={requestPermissionAndToken}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              {isLoading ? "Configurando..." : "Ativar Notificações"}
            </button>
          )}

          {hasValidSetup && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={sendTestNotification}
                disabled={isLoading}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <TestTube className="w-4 h-4" />
                Testar
              </button>
              <button
                onClick={removeToken}
                disabled={isLoading}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <BellOff className="w-4 h-4" />
                Desativar
              </button>
            </div>
          )}

          {fcmStatus.permission === "denied" && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <p className="font-medium mb-2">Para ativar notificações:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Clique no ícone de cadeado na barra de endereços</li>
                <li>Altere "Notificações" para "Permitir"</li>
                <li>Recarregue a página</li>
              </ol>
            </div>
          )}
        </div>

        {/* Advanced Info */}
        {hasValidSetup && (
          <div className="mt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? "Ocultar" : "Mostrar"} detalhes técnicos
            </button>

            {showAdvanced && (
              <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suporte:</span>
                    <span className="flex items-center gap-1">
                      {fcmStatus.supported ? (
                        <>
                          <Wifi className="w-3 h-3 text-green-500" />
                          <span className="text-green-600">Sim</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3 h-3 text-red-500" />
                          <span className="text-red-600">Não</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Permissão:</span>
                    <span
                      className={`capitalize ${
                        fcmStatus.permission === "granted"
                          ? "text-green-600"
                          : fcmStatus.permission === "denied"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {fcmStatus.permission === "granted"
                        ? "Concedida"
                        : fcmStatus.permission === "denied"
                          ? "Negada"
                          : "Pendente"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dispositivos:</span>
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      {userTokens.length}
                    </span>
                  </div>
                  {userTokens.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-600 text-xs">
                        Último registro:
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(
                          userTokens[0]?.deviceInfo.timestamp,
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FCMNotificationSetup;
