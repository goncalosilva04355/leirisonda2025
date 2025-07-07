import React, { useState } from "react";
import { MapPin, Save, AlertCircle } from "lucide-react";

interface LocationSettings {
  shareLocation: boolean;
  useRealLocation: boolean;
  customLocation: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

interface PersonalLocationSettingsProps {
  currentUser: any;
  onLocationUpdate?: (location: any) => void;
}

export const PersonalLocationSettings: React.FC<
  PersonalLocationSettingsProps
> = ({ currentUser, onLocationUpdate }) => {
  const [settings, setSettings] = useState<LocationSettings>({
    shareLocation: false,
    useRealLocation: false,
    customLocation: {
      name: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const [customLocationInput, setCustomLocationInput] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  const [gettingLocation, setGettingLocation] = useState(false);
  const [error, setError] = useState("");

  const handleSaveCustomLocation = () => {
    const lat = parseFloat(customLocationInput.latitude);
    const lng = parseFloat(customLocationInput.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Coordenadas inválidas");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("Coordenadas fora dos limites válidos");
      return;
    }

    const newLocation = {
      name: customLocationInput.name || `Localização de ${currentUser?.name}`,
      latitude: lat,
      longitude: lng,
    };

    setSettings((prev) => ({
      ...prev,
      customLocation: newLocation,
    }));

    if (onLocationUpdate) {
      onLocationUpdate(newLocation);
    }

    setError("");
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada pelo navegador");
      return;
    }

    setGettingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          name: `Localização de ${currentUser?.name}`,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setSettings((prev) => ({
          ...prev,
          customLocation: location,
        }));

        setCustomLocationInput({
          name: location.name,
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
        });

        if (onLocationUpdate) {
          onLocationUpdate(location);
        }

        setGettingLocation(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        setError("Não foi possível obter a localização atual");
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <MapPin className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">
          Configurações de Localização
        </h3>
      </div>

      {/* Share Location Toggle */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div>
          <p className="font-medium text-gray-900">Partilhar Localização</p>
          <p className="text-sm text-gray-500">
            Permite que outros membros da equipa vejam a sua localização
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.shareLocation}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                shareLocation: e.target.checked,
              }))
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {settings.shareLocation && (
        <div className="space-y-4">
          {/* Location Source */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Fonte da Localização</h4>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="locationSource"
                  checked={settings.useRealLocation}
                  onChange={() =>
                    setSettings((prev) => ({ ...prev, useRealLocation: true }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Usar localização GPS real
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="locationSource"
                  checked={!settings.useRealLocation}
                  onChange={() =>
                    setSettings((prev) => ({ ...prev, useRealLocation: false }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Usar localização personalizada
                </span>
              </label>
            </div>
          </div>

          {/* Real Location */}
          {settings.useRealLocation && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <button
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                {gettingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    A obter localização...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Obter Localização Atual
                  </>
                )}
              </button>
            </div>
          )}

          {/* Custom Location */}
          {!settings.useRealLocation && (
            <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">
                Localização Personalizada
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Localização
                  </label>
                  <input
                    type="text"
                    value={customLocationInput.name}
                    onChange={(e) =>
                      setCustomLocationInput((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder={`Localização de ${currentUser?.name}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={customLocationInput.latitude}
                      onChange={(e) =>
                        setCustomLocationInput((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      placeholder="Ex: 38.7436"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={customLocationInput.longitude}
                      onChange={(e) =>
                        setCustomLocationInput((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      placeholder="Ex: -9.1952"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveCustomLocation}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Localização
                </button>
              </div>
            </div>
          )}

          {/* Current Location Display */}
          {(settings.customLocation.latitude !== 0 ||
            settings.customLocation.longitude !== 0) && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Localização Atual
              </h4>
              <p className="text-sm text-blue-700">
                <strong>Nome:</strong> {settings.customLocation.name}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Coordenadas:</strong>{" "}
                {settings.customLocation.latitude.toFixed(6)},{" "}
                {settings.customLocation.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-700">
          <strong>Privacidade:</strong> As configurações de localização são
          temporárias e aplicam-se apenas a esta sessão.
        </p>
      </div>
    </div>
  );
};
