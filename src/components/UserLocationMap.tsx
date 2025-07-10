import React, { useState, useEffect } from "react";
import {
  MapPin,
  ExternalLink,
  RefreshCw,
  Users,
  Navigation,
  AlertCircle,
  User,
} from "lucide-react";

interface UserLocation {
  id: string;
  name: string;
  email: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface UserLocationMapProps {
  currentUser?: {
    id: string;
    name: string;
    email: string;
  };
}

export const UserLocationMap: React.FC<UserLocationMapProps> = ({
  currentUser,
}) => {
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load user locations from localStorage - only real data
  const loadUserLocations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let locations: UserLocation[] = [];

      // Add current user's location if available
      if (currentUser) {
        const currentUserLocation = localStorage.getItem(
          "current-user-location",
        );
        if (currentUserLocation) {
          const location = JSON.parse(currentUserLocation);
          const userLoc: UserLocation = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            ...location,
          };
          locations.push(userLoc);
        }
      }

      // Load other users' real locations (exclude demo data)
      const savedLocations = localStorage.getItem("user-locations");
      if (savedLocations) {
        const allLocations: UserLocation[] = JSON.parse(savedLocations);
        // Filter out demo data and duplicates
        const realLocations = allLocations.filter(
          (loc) =>
            !loc.email.includes("demo") &&
            !loc.id.startsWith("demo-") &&
            loc.email !== currentUser?.email &&
            !loc.name.includes("Técnico -") &&
            !loc.name.includes("Manager -") &&
            loc.email !== "joao@leirisonda.pt" &&
            loc.email !== "maria@leirisonda.pt",
        );
        locations.push(...realLocations);
      }

      // Remove duplicates by email
      const uniqueLocations = locations.reduce((acc, current) => {
        const existing = acc.find((item) => item.email === current.email);
        if (!existing) {
          acc.push(current);
        } else if (current.timestamp > existing.timestamp) {
          // Replace with newer location
          const index = acc.findIndex((item) => item.email === current.email);
          acc[index] = current;
        }
        return acc;
      }, [] as UserLocation[]);

      // Sort locations to show current user first
      uniqueLocations.sort((a, b) => {
        if (a.email === currentUser?.email) return -1;
        if (b.email === currentUser?.email) return 1;
        return b.timestamp - a.timestamp; // Then by most recent
      });

      setUserLocations(uniqueLocations);

      // Save cleaned locations
      localStorage.setItem("user-locations", JSON.stringify(uniqueLocations));
    } catch (err) {
      setError("Erro ao carregar localizações dos utilizadores");
      console.error("Error loading user locations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserLocations();

    // Auto-refresh locations every 2 minutes
    const interval = setInterval(() => {
      loadUserLocations();
    }, 120000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Get current user location and save it
  const shareMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada neste navegador");
      return;
    }

    if (!currentUser) {
      setError("É necessário estar autenticado para partilhar localização");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        // Try to get address
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
          locationData.address = `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`;
        }

        // Save current user location
        localStorage.setItem(
          "current-user-location",
          JSON.stringify(locationData),
        );

        // Reload all locations
        await loadUserLocations();
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = "Erro desconhecido";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Localização não disponível";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo limite excedido";
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
    );
  };

  // Open location in Google Maps
  const openInMaps = (location: UserLocation) => {
    const url = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15`;
    window.open(url, "_blank");
  };

  // Add sample team locations for testing
  const addSampleTeamLocations = async () => {
    if (!currentUser) return;

    setIsLoading(true);

    // Sample locations around Leiria, Portugal (assuming this is the base)
    const sampleLocations: UserLocation[] = [
      {
        id: "user-2",
        name: "João Silva",
        email: "joao.silva@leirisonda.pt",
        latitude: 39.7436 + (Math.random() - 0.5) * 0.02, // Small random offset around Leiria
        longitude: -8.8071 + (Math.random() - 0.5) * 0.02,
        accuracy: 10 + Math.random() * 20,
        timestamp: Date.now() - Math.random() * 3600000, // Random time in last hour
        address: "Leiria, Portugal",
      },
      {
        id: "user-3",
        name: "Maria Santos",
        email: "maria.santos@leirisonda.pt",
        latitude: 39.7436 + (Math.random() - 0.5) * 0.05,
        longitude: -8.8071 + (Math.random() - 0.5) * 0.05,
        accuracy: 15 + Math.random() * 25,
        timestamp: Date.now() - Math.random() * 7200000, // Random time in last 2 hours
        address: "Área de Leiria, Portugal",
      },
      {
        id: "user-4",
        name: "Carlos Mendes",
        email: "carlos.mendes@leirisonda.pt",
        latitude: 39.7436 + (Math.random() - 0.5) * 0.03,
        longitude: -8.8071 + (Math.random() - 0.5) * 0.03,
        accuracy: 8 + Math.random() * 15,
        timestamp: Date.now() - Math.random() * 1800000, // Random time in last 30 min
        address: "Próximo de Leiria, Portugal",
      },
    ];

    // Get existing locations and merge with samples (exclude duplicates)
    const existingLocations = localStorage.getItem("user-locations");
    let allLocations: UserLocation[] = [];

    if (existingLocations) {
      allLocations = JSON.parse(existingLocations);
    }

    // Add sample locations that don't already exist
    sampleLocations.forEach((sample) => {
      const exists = allLocations.find((loc) => loc.email === sample.email);
      if (!exists) {
        allLocations.push(sample);
      }
    });

    // Save updated locations
    localStorage.setItem("user-locations", JSON.stringify(allLocations));

    // Reload to show new locations
    await loadUserLocations();
    setIsLoading(false);

    alert(
      `✅ Adicionadas ${sampleLocations.length} localizações de exemplo da equipa!`,
    );
  };

  // Open all locations in Google Maps
  const openAllInMaps = () => {
    if (userLocations.length === 0) return;

    // Create a URL with multiple markers
    const markers = userLocations
      .map((loc) => `${loc.latitude},${loc.longitude}`)
      .join("|");

    const url = `https://maps.google.com/maps?q=${userLocations[0].latitude},${userLocations[0].longitude}&z=12`;
    window.open(url, "_blank");
  };

  // Calculate map center - prioritize current user location
  const getMapCenter = () => {
    // First priority: current user's location if available
    const currentUserLoc = userLocations.find(
      (loc) => loc.email === currentUser?.email,
    );
    if (currentUserLoc) {
      return { lat: currentUserLoc.latitude, lng: currentUserLoc.longitude };
    }

    // Second priority: get from localStorage
    const currentUserLocation = localStorage.getItem("current-user-location");
    if (currentUserLocation) {
      const location = JSON.parse(currentUserLocation);
      return { lat: location.latitude, lng: location.longitude };
    }

    // Third priority: calculate average if other users exist
    if (userLocations.length > 0) {
      const avgLat =
        userLocations.reduce((sum, loc) => sum + loc.latitude, 0) /
        userLocations.length;
      const avgLng =
        userLocations.reduce((sum, loc) => sum + loc.longitude, 0) /
        userLocations.length;
      return { lat: avgLat, lng: avgLng };
    }

    // Default to Portugal center (more generic)
    return { lat: 39.5, lng: -8.0 };
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min atrás`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;

    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  const mapCenter = getMapCenter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Mapa de Utilizadores
          </h2>
          <p className="text-gray-600 text-sm">
            {userLocations.length === 0
              ? "Nenhuma localização partilhada ainda"
              : userLocations.length === 1
                ? "Apenas a sua localização está partilhada"
                : `${userLocations.length} utilizadores com localizações partilhadas`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={shareMyLocation}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Navigation
              className={`h-4 w-4 ${isLoading ? "animate-pulse" : ""}`}
            />
            <span>Partilhar Localização</span>
          </button>
          <button
            onClick={loadUserLocations}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Atualizar</span>
          </button>
          {userLocations.length < 3 && (
            <button
              onClick={addSampleTeamLocations}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              <Users
                className={`h-4 w-4 ${isLoading ? "animate-pulse" : ""}`}
              />
              <span>Adicionar Equipa</span>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Utilizadores Online
              </p>
              <p className="text-xs text-blue-600">{userLocations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Localizações Ativas
              </p>
              <p className="text-xs text-green-600">
                {
                  userLocations.filter(
                    (loc) => Date.now() - loc.timestamp < 3600000,
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <ExternalLink className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Centro do Mapa
              </p>
              <p className="text-xs text-purple-600">
                {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder with Google Maps Embed */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Mapa da Equipa
            </h3>
            <button
              onClick={openAllInMaps}
              className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Abrir no Google Maps</span>
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Google Maps Embed with markers */}
          <iframe
            src={`https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=13&output=embed&markers=${userLocations.map((loc) => `${loc.latitude},${loc.longitude}`).join("|")}`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />

          {/* Overlay with user markers info */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">
                {userLocations.length} localizações
              </span>
            </div>
            {userLocations.length > 0 && (
              <div className="mt-2 space-y-1">
                {userLocations.slice(0, 3).map((loc) => (
                  <div key={loc.id} className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 ${loc.email === currentUser?.email ? "bg-orange-500" : "bg-blue-500"} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white text-xs font-bold">
                        {loc.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-700">
                      {loc.name.split(" ")[0]}
                      {loc.email === currentUser?.email && " (Você)"}
                    </span>
                  </div>
                ))}
                {userLocations.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{userLocations.length - 3} mais
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Utilizadores</h3>
          <p className="text-sm text-gray-600">
            Clique num utilizador para ver no Google Maps
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {userLocations.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma localização disponível
              </h3>
              <p className="text-gray-600 mb-4">
                Partilhe a sua localização ou aguarde que outros utilizadores
                partilhem as suas.
              </p>
              <button
                onClick={shareMyLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Partilhar a Minha Localização
              </button>
            </div>
          ) : (
            userLocations.map((location) => (
              <div
                key={location.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedUser?.id === location.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => {
                  setSelectedUser(location);
                  openInMaps(location);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 ${location.email === currentUser?.email ? "bg-gradient-to-r from-orange-500 to-red-600" : "bg-gradient-to-r from-blue-500 to-purple-600"} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-sm">
                        {location.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {location.name}
                      </h4>
                      <p className="text-sm text-gray-600">{location.email}</p>
                      {location.address && (
                        <p className="text-xs text-gray-500 mt-1">
                          {location.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>±{Math.round(location.accuracy)}m</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(location.timestamp)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInMaps(location);
                      }}
                      className="mt-2 flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Ver no Maps</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
