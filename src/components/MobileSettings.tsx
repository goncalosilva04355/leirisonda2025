import React, { useState, useEffect } from "react";
import {
  Bell,
  BellOff,
  MapPin,
  Phone,
  Smartphone,
  Check,
  X,
  AlertTriangle,
  Settings,
  TestTube,
  RefreshCw,
  Bug,
} from "lucide-react";
import { LoginDebugger } from "./LoginDebugger";
import { SyncDiagnostic } from "./SyncDiagnostic";

export const MobileSettings: React.FC = () => {
  const [notificationPermission, setNotificationPermission] = useState<
    "default" | "granted" | "denied"
  >("default");
  const [locationPermission, setLocationPermission] = useState<
    "default" | "granted" | "denied"
  >("default");
  const [geolocationSupported, setGeolocationSupported] = useState(false);
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [showDebugger, setShowDebugger] = useState(false);
  const [showSyncDiagnostic, setShowSyncDiagnostic] = useState(false);

  // Check browser support and permissions on mount
  useEffect(() => {
    // Check notification support
    if ("Notification" in window) {
      setNotificationSupported(true);
      setNotificationPermission(Notification.permission);
    }

    // Check geolocation support
    if ("geolocation" in navigator) {
      setGeolocationSupported(true);
      // Check if we have permission by trying to get position
      navigator.permissions?.query({ name: "geolocation" }).then((result) => {
        setLocationPermission(result.state as any);
      });
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!notificationSupported) {
      alert("Notificações não são suportadas neste navegador.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        // Send test notification
        new Notification("Leirisonda", {
          body: "Notificações ativadas com sucesso!",
          icon: "/icon.svg",
        });
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão de notificações:", error);
      alert("Erro ao solicitar permissões de notificação.");
    }
  };

  const testNotification = () => {
    if (notificationPermission === "granted") {
      new Notification("Teste de Notificação", {
        body: `Teste enviado às ${new Date().toLocaleTimeString("pt-PT")}`,
        icon: "/icon.svg",
      });
    } else {
      alert("Permissão de notificações não concedida.");
    }
  };

  const requestLocationPermission = () => {
    if (!geolocationSupported) {
      alert("Geolocalização não é suportada neste navegador.");
      return;
    }

    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationPermission("granted");
        alert(
          `Localização obtida com sucesso!\nLatitude: ${position.coords.latitude.toFixed(6)}\nLongitude: ${position.coords.longitude.toFixed(6)}`,
        );
      },
      (error) => {
        setLocationPermission("denied");
        let errorMessage = "Erro ao obter localização: ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Permissão negada pelo utilizador.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Localização indisponível.";
            break;
          case error.TIMEOUT:
            errorMessage += "Timeout na obtenção da localização.";
            break;
          default:
            errorMessage += "Erro desconhecido.";
            break;
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const openMapsWithLocation = () => {
    if (currentLocation) {
      const url = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
      window.open(url, "_blank");
    } else {
      alert("Localização não disponível. Solicite primeiro a permissão.");
    }
  };

  const testPhoneCall = () => {
    const testNumber = "+351123456789";
    const confirmed = confirm(
      `Testar chamada para ${testNumber}?\n\nEsta ação irá abrir o marcador de telefone.`,
    );
    if (confirmed) {
      window.location.href = `tel:${testNumber}`;
    }
  };

  const getPermissionStatusColor = (
    permission: "default" | "granted" | "denied",
  ) => {
    switch (permission) {
      case "granted":
        return "text-green-600 bg-green-50";
      case "denied":
        return "text-red-600 bg-red-50";
      default:
        return "text-orange-600 bg-orange-50";
    }
  };

  const getPermissionIcon = (permission: "default" | "granted" | "denied") => {
    switch (permission) {
      case "granted":
        return <Check className="h-5 w-5" />;
      case "denied":
        return <X className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Smartphone className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Configurações para Dispositivos Móveis
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Configure as permissões necessárias para o funcionamento completo
              da aplicação em dispositivos móveis.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Notificações Push
              </h3>
              <p className="text-sm text-gray-600">
                Receba notificações sobre novas obras e atualizações
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getPermissionStatusColor(notificationPermission)}`}
          >
            {getPermissionIcon(notificationPermission)}
            <span className="ml-1">
              {notificationPermission === "granted"
                ? "Ativadas"
                : notificationPermission === "denied"
                  ? "Negadas"
                  : "Pendente"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {!notificationSupported && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">
                <BellOff className="h-4 w-4 inline mr-2" />
                Notificações não são suportadas neste navegador.
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={requestNotificationPermission}
              disabled={
                !notificationSupported || notificationPermission === "granted"
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {notificationPermission === "granted"
                ? "✓ Permissão Concedida"
                : "Solicitar Permissão"}
            </button>

            <button
              onClick={testNotification}
              disabled={notificationPermission !== "granted"}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <TestTube className="h-4 w-4 inline mr-2" />
              Testar Notificação
            </button>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Localização GPS
              </h3>
              <p className="text-sm text-gray-600">
                Permite navegação automática para locais de trabalho
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getPermissionStatusColor(locationPermission)}`}
          >
            {getPermissionIcon(locationPermission)}
            <span className="ml-1">
              {locationPermission === "granted"
                ? "Ativada"
                : locationPermission === "denied"
                  ? "Negada"
                  : "Pendente"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {!geolocationSupported && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">
                <MapPin className="h-4 w-4 inline mr-2" />
                Geolocalização não é suportada neste navegador.
              </p>
            </div>
          )}

          {locationError && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">{locationError}</p>
            </div>
          )}

          {currentLocation && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-sm text-green-700">
                <Check className="h-4 w-4 inline mr-2" />
                Localização atual: {currentLocation.lat.toFixed(6)},{" "}
                {currentLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={requestLocationPermission}
              disabled={!geolocationSupported}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {locationPermission === "granted"
                ? "🔄 Atualizar Localização"
                : "Obter Localização"}
            </button>

            <button
              onClick={openMapsWithLocation}
              disabled={!currentLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <MapPin className="h-4 w-4 inline mr-2" />
              Abrir no Maps
            </button>
          </div>
        </div>
      </div>

      {/* Phone Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Phone className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Chamadas Telefónicas
              </h3>
              <p className="text-sm text-gray-600">
                Marcação automática para clientes e contactos
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-700">
              <Phone className="h-4 w-4 inline mr-2" />
              As chamadas são suportadas em todos os dispositivos móveis
              modernos.
            </p>
          </div>

          <button
            onClick={testPhoneCall}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <TestTube className="h-4 w-4 inline mr-2" />
            Testar Chamada
          </button>
        </div>
      </div>

      {/* Debug Tools Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center mb-4">
          <Settings className="h-6 w-6 text-gray-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Ferramentas de Debug
            </h3>
            <p className="text-sm text-gray-600">
              Ferramentas de diagnóstico e teste do sistema
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowDebugger(true)}
            className="flex items-center justify-center px-4 py-3 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 border border-orange-300"
          >
            <Bug className="h-5 w-5 mr-2" />
            Debug de Login
          </button>

          <button
            onClick={() => setShowSyncDiagnostic(true)}
            className="flex items-center justify-center px-4 py-3 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 border border-purple-300"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Diagnóstico de Sync
          </button>
        </div>
      </div>

      {/* Debug Components */}
      <LoginDebugger
        isVisible={showDebugger}
        onClose={() => setShowDebugger(false)}
      />

      <SyncDiagnostic
        isVisible={showSyncDiagnostic}
        onClose={() => setShowSyncDiagnostic(false)}
      />
    </div>
  );
};
