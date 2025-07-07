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

export const PersonalLocationSettings: React.FC = () => {
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
  const [showAdvanced, setShowAdvanced] = useState(false);

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

        // Save location for team map
        localStorage.setItem(
          "current-user-location",
          JSON.stringify(locationData),
        );
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
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <MapPin className="h-5 w-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-orange-900 mb-2">
              Minha Localização
            </h4>
            <p className="text-orange-700 text-sm mb-4">
              Configure e partilhe a sua localização com a equipa.
            </p>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {/* Permission Status */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <permissionStatus.icon
                    className={`h-4 w-4 ${permissionStatus.color}`}
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      Permissão
                    </p>
                    <p className={`text-xs ${permissionStatus.color}`}>
                      {permissionStatus.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Device Type */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <deviceInfo.icon className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      Dispositivo
                    </p>
                    <p className="text-xs text-blue-600">{deviceInfo.name}</p>
                  </div>
                </div>
              </div>

              {/* Location Status */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin
                    className={`h-4 w-4 ${location ? "text-green-600" : "text-gray-400"}`}
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-900">Status</p>
                    <p
                      className={`text-xs ${location ? "text-green-600" : "text-gray-400"}`}
                    >
                      {location ? "Ativa" : "Inativa"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location Info */}
            {location && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <h5 className="text-sm font-medium text-blue-900 mb-2">
                  Localização Atual
                </h5>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>
                    <strong>Coordenadas:</strong> {location.latitude.toFixed(6)}
                    , {location.longitude.toFixed(6)}
                  </p>
                  <p>
                    <strong>Precisão:</strong> ±{Math.round(location.accuracy)}m
                  </p>
                  <p>
                    <strong>Atualizada:</strong>{" "}
                    {formatTimestamp(location.timestamp)}
                  </p>
                  {location.address && (
                    <p>
                      <strong>Endereço:</strong>{" "}
                      {location.address.substring(0, 100)}...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 mb-4">
              {!settings.enabled ? (
                <button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, enabled: true }))
                  }
                  className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                >
                  Ativar Localização
                </button>
              ) : permission !== "granted" ? (
                <button
                  onClick={requestPermission}
                  className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Solicitar Permissão
                </button>
              ) : (
                <>
                  <button
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isLoading ? "A obter..." : "Atualizar"}
                  </button>
                  <button
                    onClick={checkPermission}
                    className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Verificar Status
                  </button>
                  {location && (
                    <button
                      onClick={openInMaps}
                      className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Ver no Maps
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-orange-700 hover:text-orange-800 text-sm"
            >
              <Settings className="h-4 w-4" />
              <span>
                {showAdvanced ? "Ocultar" : "Mostrar"} Configurações Avançadas
              </span>
            </button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Alta precisão
                    </label>
                    <p className="text-xs text-gray-500">
                      Usa GPS para maior precisão
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        highAccuracy: !prev.highAccuracy,
                      }))
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.highAccuracy ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.highAccuracy
                          ? "translate-x-5"
                          : "translate-x-1"
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
                      Atualiza automaticamente
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        autoRefresh: !prev.autoRefresh,
                      }))
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.autoRefresh ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.autoRefresh ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {settings.autoRefresh && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intervalo (segundos)
                    </label>
                    <select
                      value={settings.refreshInterval / 1000}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          refreshInterval: parseInt(e.target.value) * 1000,
                        }))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={30}>30 segundos</option>
                      <option value={60}>1 minuto</option>
                      <option value={300}>5 minutos</option>
                      <option value={600}>10 minutos</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
