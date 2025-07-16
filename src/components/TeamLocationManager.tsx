import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Clock,
  Navigation,
} from "lucide-react";

interface UserLocationStatus {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  hasLocation: boolean;
  lastLocationUpdate?: number;
  locationAccuracy?: number;
  permissionStatus?: "granted" | "denied" | "prompt" | "unknown";
}

interface TeamLocationManagerProps {
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  allUsers?: Array<{
    id: number | string;
    name: string;
    email: string;
    role: string;
    active: boolean;
  }>;
}

export const TeamLocationManager: React.FC<TeamLocationManagerProps> = ({
  currentUser,
  allUsers = [],
}) => {
  const [userStatuses, setUserStatuses] = useState<UserLocationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const loadUserLocationStatuses = () => {
    setIsLoading(true);

    try {
      // Load all user locations
      const savedLocations = localStorage.getItem("user-locations");
      const locations = savedLocations ? JSON.parse(savedLocations) : [];

      // Process each user
      const statuses: UserLocationStatus[] = allUsers.map((user) => {
        const userLocation = locations.find(
          (loc: any) => loc.email === user.email,
        );

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
          hasLocation: !!userLocation,
          lastLocationUpdate: userLocation?.timestamp,
          locationAccuracy: userLocation?.accuracy,
          permissionStatus: userLocation ? "granted" : "unknown",
        };
      });

      // Sort by location status and activity
      statuses.sort((a, b) => {
        // Active users with location first
        if (a.active && a.hasLocation && !(b.active && b.hasLocation))
          return -1;
        if (b.active && b.hasLocation && !(a.active && a.hasLocation)) return 1;

        // Then active users without location
        if (a.active && !b.active) return -1;
        if (b.active && !a.active) return 1;

        // Then by recent location update
        if (a.lastLocationUpdate && b.lastLocationUpdate) {
          return b.lastLocationUpdate - a.lastLocationUpdate;
        }
        if (a.lastLocationUpdate && !b.lastLocationUpdate) return -1;
        if (b.lastLocationUpdate && !a.lastLocationUpdate) return 1;

        // Finally by name
        return a.name.localeCompare(b.name);
      });

      setUserStatuses(statuses);
    } catch (error) {
      console.error("Erro ao carregar status de localizações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserLocationStatuses();

    // Auto-refresh every 2 minutes
    const interval = setInterval(loadUserLocationStatuses, 120000);
    return () => clearInterval(interval);
  }, [allUsers]);

  const openLocationInMaps = (status: UserLocationStatus) => {
    const savedLocations = localStorage.getItem("user-locations");
    if (!savedLocations) return;

    const locations = JSON.parse(savedLocations);
    const userLocation = locations.find(
      (loc: any) => loc.email === status.email,
    );

    if (userLocation) {
      const url = `https://maps.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}&z=15`;
      window.open(url, "_blank");
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "Nunca";

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

  const getStatusIcon = (status: UserLocationStatus) => {
    if (!status.active) return { icon: EyeOff, color: "text-gray-400" };
    if (status.hasLocation)
      return { icon: CheckCircle, color: "text-green-600" };
    return { icon: AlertCircle, color: "text-yellow-600" };
  };

  const filteredUsers = showInactive
    ? userStatuses
    : userStatuses.filter((user) => user.active);

  const stats = {
    total: allUsers.length,
    active: userStatuses.filter((u) => u.active).length,
    withLocation: userStatuses.filter((u) => u.hasLocation && u.active).length,
    recentUpdates: userStatuses.filter(
      (u) =>
        u.lastLocationUpdate && Date.now() - u.lastLocationUpdate < 3600000, // Last hour
    ).length,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Gestão de Localização da Equipa
            </h3>
            <p className="text-sm text-gray-600">
              Estado das permissões e localizações de todos os utilizadores
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={loadUserLocationStatuses}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600">Ativos</p>
                <p className="text-lg font-bold text-green-900">
                  {stats.active}
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600">
                  Com Localização
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {stats.withLocation}
                </p>
              </div>
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600">Recentes</p>
                <p className="text-lg font-bold text-purple-900">
                  {stats.recentUpdates}
                </p>
              </div>
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm ${
                showInactive
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {showInactive ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              <span>{showInactive ? "Ocultar" : "Mostrar"} Inativos</span>
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {filteredUsers.length} utilizador
            {filteredUsers.length !== 1 ? "es" : ""}
          </p>
        </div>

        {/* User List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredUsers.map((status) => {
            const statusInfo = getStatusIcon(status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={status.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  status.hasLocation && status.active
                    ? "bg-green-50 border-green-200"
                    : status.active
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        status.active
                          ? "bg-gradient-to-r from-blue-500 to-purple-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {status.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {status.name}
                      </h4>
                      {status.email === currentUser?.email && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          Você
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{status.email}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="capitalize">
                        {status.role?.replace("_", " ")}
                      </span>
                      <span>•</span>
                      <span>{status.active ? "Ativo" : "Inativo"}</span>
                      {status.hasLocation && (
                        <>
                          <span>•</span>
                          <span>
                            ±{Math.round(status.locationAccuracy || 0)}m
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {status.hasLocation
                        ? "Com localização"
                        : "Sem localização"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(status.lastLocationUpdate)}
                    </p>
                  </div>

                  {status.hasLocation && (
                    <button
                      onClick={() => openLocationInMaps(status)}
                      className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Ver</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum utilizador encontrado
            </h3>
            <p className="text-gray-600">
              {showInactive
                ? "Não há utilizadores no sistema."
                : "Não há utilizadores ativos no sistema."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamLocationManager;
