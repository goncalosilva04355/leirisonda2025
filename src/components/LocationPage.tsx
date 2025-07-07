import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  RefreshCw,
  Settings,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  Smartphone,
  Monitor,
  ArrowLeft,
  Shield,
} from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface LocationSettings {
  enabled: boolean;
  highAccuracy: boolean;
  timeout: number;
  maxAge: number;
  autoRefresh: boolean;
  refreshInterval: number;
}

interface LocationPageProps {
  onBack?: () => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({ onBack }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [settings, setSettings] = useState<LocationSettings>(() => {
    const saved = localStorage.getItem("location-settings");
    return saved
      ? JSON.parse(saved)
      : {
          enabled: false,
          highAccuracy: true,
          timeout: 10000,
          maxAge: 300000, // 5 minutes
          autoRefresh: false,
          refreshInterval: 60000, // 1 minute
        };
  });
  const [showSettings, setShowSettings] = useState(false);

  // Check geolocation permission status
  const checkPermission = async () => {
    if ("permissions" in navigator) {
      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        setPermission(result.state);
        result.addEventListener("change", () => {
          setPermission(result.state);
        });
      } catch (error) {
        console.warn("Erro ao verificar permissões:", error);
      }
    }
  };

  useEffect(() => {
    checkPermission();

    // Verificar permissões quando a página se torna visível
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkPermission();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Auto-refresh location
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (settings.enabled && settings.autoRefresh && permission === "granted") {
      interval = setInterval(() => {
        getCurrentLocation();
      }, settings.refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    settings.enabled,
    settings.autoRefresh,
    settings.refreshInterval,
    permission,
  ]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("location-settings", JSON.stringify(settings));
  }, [settings]);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada neste navegador");
      return;
    }

    setIsLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: settings.highAccuracy,
      timeout: settings.timeout,
      maximumAge: settings.maxAge,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Se conseguimos obter a localização, a permissão foi concedida
        setPermission("granted");

        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        // Try to get address from coordinates using a free service
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationData.latitude}&lon=${locationData.longitude}&zoom=18&addressdetails=1`,
          );
          if (response.ok) {
            const data = await response.json();
            if (data.display_name) {
              locationData.address = data.display_name;
            }
          }
        } catch (err) {
          console.warn("Não foi possível obter o endereço:", err);
          // Fallback: create a simple address with coordinates
          locationData.address = `Lat: ${locationData.latitude.toFixed(6)}, Lon: ${locationData.longitude.toFixed(6)}`;
        }

        setLocation(locationData);
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = "Erro desconhecido";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada pelo utilizador";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informação de localização não disponível";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo limite excedido para obter localização";
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
    );
  };

  const requestPermission = async () => {
    try {
      await getCurrentLocation();
      // Verificar novamente o estado da permissão após tentar obter localização
      await checkPermission();
      setSettings((prev) => ({ ...prev, enabled: true }));
    } catch (err) {
      console.error("Erro ao solicitar permissão:", err);
      // Verificar permissão mesmo em caso de erro
      await checkPermission();
    }
  };

  const openInMaps = () => {
    if (!location) return;

    const { latitude, longitude } = location;
    const url = `https://maps.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("pt-PT");
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case "granted":
        return { text: "Concedida", color: "text-green-600", icon: Check };
      case "denied":
        return { text: "Negada", color: "text-red-600", icon: X };
      case "prompt":
        return {
          text: "Aguarda aprovação",
          color: "text-yellow-600",
          icon: AlertCircle,
        };
      default:
        return {
          text: "Desconhecida",
          color: "text-gray-600",
          icon: AlertCircle,
        };
    }
  };

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );
    return {
      type: isMobile ? "mobile" : "desktop",
      icon: isMobile ? Smartphone : Monitor,
      name: isMobile ? "Dispositivo Móvel" : "Computador",
    };
  };

  const permissionStatus = getPermissionStatus();
  const deviceInfo = getDeviceInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Voltar às Configurações</span>
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">Localizações</h1>
          <p className="text-gray-600 text-sm">
            Visualize e gerencie a localização do dispositivo
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <Settings className="h-4 w-4" />
          <span>Configurações</span>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Configurações de Localização
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Localização ativada
                </label>
                <p className="text-xs text-gray-500">
                  Permite que a aplicação aceda à sua localização
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Alta precisão
                </label>
                <p className="text-xs text-gray-500">
                  Usa GPS para maior precisão (consome mais bateria)
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    highAccuracy: !prev.highAccuracy,
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.highAccuracy ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.highAccuracy ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Atualização automática
                </label>
                <p className="text-xs text-gray-500">
                  Atualiza a localização automaticamente
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    autoRefresh: !prev.autoRefresh,
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoRefresh ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoRefresh ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {settings.autoRefresh && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo de atualização (segundos)
                </label>
                <select
                  value={settings.refreshInterval / 1000}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      refreshInterval: parseInt(e.target.value) * 1000,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30 segundos</option>
                  <option value={60}>1 minuto</option>
                  <option value={300}>5 minutos</option>
                  <option value={600}>10 minutos</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Permission Status */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <permissionStatus.icon
              className={`h-5 w-5 ${permissionStatus.color}`}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Permissão</p>
              <p className={`text-xs ${permissionStatus.color}`}>
                {permissionStatus.text}
              </p>
            </div>
          </div>
        </div>

        {/* Device Type */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <deviceInfo.icon className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Dispositivo</p>
              <p className="text-xs text-blue-600">{deviceInfo.name}</p>
            </div>
          </div>
        </div>

        {/* Location Status */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <MapPin
              className={`h-5 w-5 ${location ? "text-green-600" : "text-gray-400"}`}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Localização</p>
              <p
                className={`text-xs ${location ? "text-green-600" : "text-gray-400"}`}
              >
                {location ? "Disponível" : "Não disponível"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          {!settings.enabled ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Localização Desativada
              </h3>
              <p className="text-gray-600 mb-4">
                Ative a localização nas configurações para começar a rastrear a
                sua posição.
              </p>
              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, enabled: true }))
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ativar Localização
              </button>
            </div>
          ) : permission !== "granted" && !location ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Permissão Necessária
              </h3>
              <p className="text-gray-600 mb-4">
                Para usar esta funcionalidade, é necessário conceder permissão
                de acesso à localização.
              </p>
              <div className="space-y-2">
                <button
                  onClick={requestPermission}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Solicitar Permissão
                </button>
                <button
                  onClick={getCurrentLocation}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Tentar Obter Localização
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Location */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Localização Atual
                  </h3>
                  {location && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Coordenadas:</strong>{" "}
                        {location.latitude.toFixed(6)},{" "}
                        {location.longitude.toFixed(6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Precisão:</strong> ±
                        {Math.round(location.accuracy)}m
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Última atualização:</strong>{" "}
                        {formatTimestamp(location.timestamp)}
                      </p>
                      {location.address && (
                        <p className="text-sm text-gray-600">
                          <strong>Endereço:</strong> {location.address}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                    <span>{isLoading ? "A obter..." : "Atualizar"}</span>
                  </button>
                  <button
                    onClick={checkPermission}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Verificar Permissões</span>
                  </button>
                  {location && (
                    <button
                      onClick={openInMaps}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Ver no Maps</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Como ativar a localização:
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    <strong>Chrome/Safari:</strong> Clique no ícone de
                    localização na barra de endereços
                  </p>
                  <p>
                    <strong>Firefox:</strong> Clique em "Partilhar localização"
                    quando solicitado
                  </p>
                  <p>
                    <strong>iPhone/Safari:</strong> Configurações → Safari →
                    Localização
                  </p>
                  <p>
                    <strong>Android/Chrome:</strong> Configurações → Sites →
                    Localização
                  </p>
                  <p>
                    💡 <strong>Dica:</strong> Use o botão "Verificar Permissões"
                    para atualizar o estado
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
