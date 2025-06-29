import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Waves,
  Plus,
  Eye,
  Edit,
  Calendar,
  MapPin,
  Phone,
  User,
  Thermometer,
  Activity,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { PoolMaintenance } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MaintenanceList() {
  const [maintenances, setMaintenances] = useState<PoolMaintenance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadMaintenances();
  }, []);

  const loadMaintenances = () => {
    try {
      const stored = localStorage.getItem("pool_maintenances");
      if (stored) {
        setMaintenances(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading maintenances:", error);
    }
  };

  const filteredMaintenances = maintenances.filter((maintenance) => {
    const matchesSearch =
      maintenance.poolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || maintenance.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      seasonal: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    const labels = {
      active: "Ativa",
      inactive: "Inativa",
      seasonal: "Sazonal",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPoolTypeLabel = (type: string) => {
    const labels = {
      outdoor: "Exterior",
      indoor: "Interior",
      spa: "Spa",
      olympic: "Olímpica",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getLastInterventionDate = (maintenance: PoolMaintenance) => {
    if (maintenance.interventions.length === 0) return "Nunca";

    const lastIntervention = maintenance.interventions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];

    return format(new Date(lastIntervention.date), "dd/MM/yyyy", {
      locale: pt,
    });
  };

  const getNextMaintenanceDate = (maintenance: PoolMaintenance) => {
    const lastIntervention = maintenance.interventions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];

    if (!lastIntervention?.nextMaintenanceDate) return "A definir";

    return format(
      new Date(lastIntervention.nextMaintenanceDate),
      "dd/MM/yyyy",
      { locale: pt },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center shadow-md p-1 shrink-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800"
              alt="Leirisonda Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
              <Waves className="mr-3 h-6 lg:h-8 w-6 lg:w-8 text-blue-600 shrink-0" />
              <span className="truncate">Manutenção de Piscinas</span>
            </h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Gerir piscinas e intervenções de manutenção
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0">
          <Link to="/create-maintenance" className="block">
            <Button className="btn-primary w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nova Piscina
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline mr-2 h-4 w-4" />
              Pesquisar
            </label>
            <Input
              type="text"
              placeholder="Nome da piscina, cliente ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline mr-2 h-4 w-4" />
              Estado
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
                <SelectItem value="seasonal">Sazonais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <strong>{filteredMaintenances.length}</strong> de{" "}
              <strong>{maintenances.length}</strong> piscinas
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMaintenances.map((maintenance) => (
          <div key={maintenance.id} className="glass-card p-6 hover-scale">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {maintenance.poolName}
                </h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <User className="mr-1 h-4 w-4" />
                  {maintenance.clientName}
                </div>
              </div>
              {getStatusBadge(maintenance.status)}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-2 h-4 w-4" />
                {maintenance.location}
              </div>

              <div className="flex items-center text-gray-600">
                <Phone className="mr-2 h-4 w-4" />
                {maintenance.clientPhone}
              </div>

              <div className="flex items-center text-gray-600">
                <Waves className="mr-2 h-4 w-4" />
                {getPoolTypeLabel(maintenance.poolType)} •{" "}
                {maintenance.waterCubicage}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm text-gray-500">
                    Última Intervenção
                  </div>
                  <div className="font-medium">
                    {getLastInterventionDate(maintenance)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">
                    Próxima Manutenção
                  </div>
                  <div className="font-medium">
                    {getNextMaintenanceDate(maintenance)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-gray-600">
                  <Activity className="mr-1 h-4 w-4" />
                  <span className="text-sm">
                    {maintenance.interventions.length} intervenções
                  </span>
                </div>

                {maintenance.interventions.some((i) =>
                  i.problems.some((p) => !p.resolved),
                ) && (
                  <div className="flex items-center text-orange-600">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    <span className="text-sm">Problemas pendentes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to={`/maintenance/${maintenance.id}`} className="flex-1">
                <Button variant="outline" className="w-full justify-center">
                  <Eye className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Ver Detalhes</span>
                  <span className="sm:hidden">Detalhes</span>
                </Button>
              </Link>

              <Link
                to={`/maintenance/${maintenance.id}/new-intervention`}
                className="flex-1"
              >
                <Button className="btn-primary w-full justify-center">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Nova Intervenção</span>
                  <span className="sm:hidden">Nova</span>
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredMaintenances.length === 0 && (
        <div className="text-center py-12">
          <Waves className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== "all"
              ? "Nenhuma piscina encontrada"
              : "Nenhuma piscina registrada"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Tenta ajustar os filtros de pesquisa."
              : "Comece por registrar a primeira piscina."}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Link to="/create-maintenance">
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Registar Primeira Piscina
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Fixed bottom button for Nova Manutenção */}
      {maintenances.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-50">
          <Link to="/maintenance/new-general">
            <Button
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg px-8 py-4 text-lg font-medium rounded-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nova
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
