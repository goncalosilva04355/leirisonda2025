import React, { useState, useEffect } from "react";
import { Bell, BellOff, Check, X, AlertCircle, RefreshCw } from "lucide-react";

interface NotificationPermissionsManagerProps {}

export const NotificationPermissionsManager: React.FC<
  NotificationPermissionsManagerProps
> = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
    loadSettings();
  }, []);

  const checkPermissionStatus = () => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  };

  const loadSettings = () => {
    const enabled = localStorage.getItem("notifications-enabled") === "true";
    setNotificationsEnabled(enabled);

    const token = localStorage.getItem("fcm-device-token");
    if (token) {
      setDeviceToken(token.substring(0, 20) + "...");
    }
  };

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const { pushNotificationService } = await import(
        "../services/pushNotificationService"
      );

      const hasPermission = await pushNotificationService.requestPermission();

      if (hasPermission) {
        const token = await pushNotificationService.getDeviceToken();
        if (token) {
          setDeviceToken(token.substring(0, 20) + "...");
          localStorage.setItem("fcm-device-token", token);

          // Salvar token para o utilizador atual
          const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}",
          );
          if (currentUser.id || currentUser.email) {
            await pushNotificationService.saveDeviceToken(
              String(currentUser.id) || currentUser.email,
            );
          }
        }
        setPermission("granted");
        setNotificationsEnabled(true);
        localStorage.setItem("notifications-enabled", "true");
      } else {
        setPermission("denied");
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled && permission !== "granted") {
      await requestPermission();
    } else {
      const newState = !notificationsEnabled;
      setNotificationsEnabled(newState);
      localStorage.setItem("notifications-enabled", String(newState));
    }
  };

  const testNotification = async () => {
    try {
      const { pushNotificationService } = await import(
        "../services/pushNotificationService"
      );

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );

      await pushNotificationService.notifyObraAssignment(
        {
          id: "test",
          workSheetNumber: "LS-TEST",
          client: "Cliente Teste",
        },
        String(currentUser.id) || currentUser.email,
      );

      alert("Notificação de teste enviada!");
    } catch (error) {
      console.error("Erro ao testar notificação:", error);
      alert("Erro ao enviar notificação de teste");
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case "granted":
        return {
          icon: Check,
          text: "Concedida",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "denied":
        return {
          icon: X,
          text: "Negada",
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      default:
        return {
          icon: AlertCircle,
          text: "Pendente",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        };
    }
  };

  const status = getPermissionStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4">
      {/* Status da Permissão */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${status.bgColor}`}>
            <StatusIcon className={`h-5 w-5 ${status.color}`} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Estado da Permissão</h4>
            <p className="text-sm text-gray-600">
              Permissão para notificações:{" "}
              <span className={`font-medium ${status.color}`}>
                {status.text}
              </span>
            </p>
          </div>
        </div>

        {permission !== "granted" && (
          <button
            onClick={requestPermission}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
            <span>{isLoading ? "A solicitar..." : "Solicitar Permissão"}</span>
          </button>
        )}
      </div>

      {/* Toggle de Notificações */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${notificationsEnabled ? "bg-green-100" : "bg-gray-100"}`}
          >
            {notificationsEnabled ? (
              <Bell className="h-5 w-5 text-green-600" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Notificações de Obras</h4>
            <p className="text-sm text-gray-600">
              Receber notificações quando obras são atribuídas
            </p>
          </div>
        </div>

        <button
          onClick={toggleNotifications}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notificationsEnabled ? "bg-blue-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notificationsEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Informações do Token */}
      {deviceToken && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            Dispositivo Registado
          </h4>
          <p className="text-sm text-blue-700">
            Token do dispositivo:{" "}
            <span className="font-mono">{deviceToken}</span>
          </p>
        </div>
      )}

      {/* Teste de Notificação */}
      {permission === "granted" && notificationsEnabled && (
        <div className="flex justify-end">
          <button
            onClick={testNotification}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>Testar Notificação</span>
          </button>
        </div>
      )}

      {/* Instruções */}
      {permission === "denied" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-900 mb-2">Permissão Negada</h4>
          <p className="text-sm text-red-700 mb-3">
            As notificações foram bloqueadas. Para ativar:
          </p>
          <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
            <li>Clique no ícone de cadeado na barra de endereços</li>
            <li>Ative as notificações para este site</li>
            <li>Recarregue a página</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default NotificationPermissionsManager;
