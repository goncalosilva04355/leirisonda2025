import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  Users,
  Calendar,
  Activity,
  BarChart3,
  Eye,
  Waves,
  Droplets,
  Building,
  Wrench,
  Search,
} from "lucide-react";
import { Work, DashboardStats } from "@shared/types";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { SyncStatus } from "@/components/SyncStatus";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalWorks: 0,
    pendingWorks: 0,
    inProgressWorks: 0,
    completedWorks: 0,
    remainingWorkSheets: 0,
    workSheetsPending: 0,
  });
  const [recentWorks, setRecentWorks] = useState<Work[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Work[]>([]);

  const navigateToWorks = (status?: string) => {
    if (status) {
      navigate(`/works?status=${status}`);
    } else {
      navigate("/works");
    }
  };

  const navigateToWorksSheets = (type: "pending" | "completed") => {
    navigate(`/works?worksheet=${type}`);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const performSearch = () => {
    const storedWorks = localStorage.getItem("leirisonda_works");
    const works: Work[] = storedWorks ? JSON.parse(storedWorks) : [];

    const filtered = works.filter(
      (work) =>
        work.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.workSheetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.contact.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
  };

  const loadDashboardData = () => {
    const storedWorks = localStorage.getItem("leirisonda_works");
    const works: Work[] = storedWorks ? JSON.parse(storedWorks) : [];

    // Calculate stats
    const totalWorks = works.length;
    const pendingWorks = works.filter((w) => w.status === "pendente").length;
    const inProgressWorks = works.filter(
      (w) => w.status === "em_progresso",
    ).length;
    const completedWorks = works.filter((w) => w.status === "concluida").length;

    // Calculate work sheets pending (not completed)
    const workSheetsPending = works.filter((w) => !w.workSheetCompleted).length;

    setStats({
      totalWorks,
      pendingWorks,
      inProgressWorks,
      completedWorks,
      remainingWorkSheets: 0, // Not used anymore
      workSheetsPending,
    });

    // Get recent works (last 5)
    const sortedWorks = works
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
    setRecentWorks(sortedWorks);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pendente":
        return { label: "Pendente", className: "badge-pending" };
      case "em_progresso":
        return { label: "Em Progresso", className: "badge-progress" };
      case "concluida":
        return { label: "Concluída", className: "badge-completed" };
      default:
        return { label: status, className: "badge-pending" };
    }
  };

  const getWorkTypeLabel = (type: string) => {
    switch (type) {
      case "piscina":
        return "Piscina";
      case "manutencao":
        return "Manutenção";
      case "avaria":
        return "Avaria";
      case "montagem":
        return "Montagem";
      default:
        return type;
    }
  };

  const getWorkTypeIcon = (type: string) => {
    switch (type) {
      case "piscina":
        return Droplets;
      case "manutencao":
        return Wrench;
      case "avaria":
        return Activity;
      case "montagem":
        return Building;
      default:
        return FileText;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-leirisonda-fade">
      {/* Classy & Simple Header */}
      <div className="relative bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-3xl border border-gray-200/50 shadow-lg backdrop-blur-sm p-8 mb-8 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl p-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800"
                  alt="Leirisonda Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-1"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-light text-gray-900">
                Olá,{" "}
                <span className="font-semibold text-gray-800">
                  {user?.name}
                </span>
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {format(new Date(), "EEEE, dd 'de' MMMM", { locale: pt })}
                  </span>
                </div>
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                  <SyncStatus />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {user?.permissions?.canCreateWorks && (
              <button
                className="group relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                onClick={() => navigate("/create-work")}
              >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                Nova Obra
              </button>
            )}
            {user?.permissions?.canViewMaintenance && (
              <button
                className="group relative bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                onClick={() => navigate("/pool-maintenance")}
              >
                <Droplets className="w-4 h-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                Manutenção
              </button>
            )}
            {user?.role === "admin" && (
              <button
                className="group relative bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                onClick={() => navigate("/user-data")}
              >
                <Users className="w-4 h-4 mr-2 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                Dados
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div
          className="stat-card-leirisonda stat-card-primary hover-leirisonda"
          onClick={() => navigateToWorks()}
        >
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-2xl lg:text-3xl font-bold text-gray-900">
              {stats.totalWorks}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Total de Obras
          </h3>
          <p className="text-xs text-gray-600">Todas registadas</p>
        </div>

        <div
          className="stat-card-leirisonda stat-card-danger hover-leirisonda"
          onClick={() => navigateToWorks("pendente")}
        >
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-6 h-6 text-red-600" />
            <span className="text-2xl lg:text-3xl font-bold text-gray-900">
              {stats.pendingWorks}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Pendentes
          </h3>
          <p className="text-xs text-gray-600">Necessitam atenção</p>
        </div>

        <div
          className="stat-card-leirisonda stat-card-warning hover-leirisonda"
          onClick={() => navigateToWorks("em_progresso")}
        >
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <span className="text-2xl lg:text-3xl font-bold text-gray-900">
              {stats.inProgressWorks}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Em Progresso
          </h3>
          <p className="text-xs text-gray-600">A decorrer</p>
        </div>

        <div
          className="stat-card-leirisonda stat-card-success hover-leirisonda"
          onClick={() => navigateToWorks("concluida")}
        >
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-2xl lg:text-3xl font-bold text-gray-900">
              {stats.completedWorks}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Concluídas
          </h3>
          <p className="text-xs text-gray-600">Finalizadas</p>
        </div>

        <div
          className="stat-card-leirisonda stat-card-danger hover-leirisonda"
          onClick={() => navigateToWorksSheets("pending")}
        >
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-6 h-6 text-red-600" />
            <span className="text-2xl lg:text-3xl font-bold text-gray-900">
              {stats.workSheetsPending}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Folhas por Fazer
          </h3>
          <p className="text-xs text-gray-600">Por preencher</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Works */}
        <div className="w-full">
          <div className="card-leirisonda">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Obras Recentes
                </h3>
              </div>
              <Button variant="outline" asChild className="hover-leirisonda">
                <Link to="/works">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Todas
                </Link>
              </Button>
            </div>

            {recentWorks.length === 0 ? (
              <div className="section-leirisonda text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma obra registada
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Comece por criar a sua primeira obra.
                </p>
                <button
                  className="btn-leirisonda"
                  onClick={() => navigate("/create-work")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Obra
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentWorks.map((work) => {
                  const statusInfo = getStatusInfo(work.status);
                  const WorkIcon = getWorkTypeIcon(work.type);
                  return (
                    <div
                      key={work.id}
                      className="section-leirisonda hover-leirisonda cursor-pointer"
                      onClick={() => navigate(`/works/${work.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <WorkIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {work.clientName}
                              </h4>
                              <span className={statusInfo.className}>
                                {statusInfo.label}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {getWorkTypeLabel(work.type)}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-600">
                              <div className="truncate">
                                <span className="font-medium">Folha:</span>{" "}
                                {work.workSheetNumber}
                              </div>
                              <div>
                                <span className="font-medium">Data:</span>{" "}
                                {format(
                                  new Date(work.createdAt),
                                  "dd/MM/yyyy",
                                  {
                                    locale: pt,
                                  },
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-3 flex-shrink-0">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6 w-full">
          {/* Quick Actions */}
          <div className="card-leirisonda">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ações Rápidas
              </h3>
            </div>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start hover-leirisonda h-auto py-3"
                asChild
              >
                <Link to="/create-work">
                  <Plus className="w-4 h-4 mr-3" />
                  Nova Obra
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start hover-leirisonda h-auto py-3"
                asChild
              >
                <Link to="/pool-maintenance">
                  <Droplets className="w-4 h-4 mr-3" />
                  Manutenção Piscinas
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start hover-leirisonda h-auto py-3"
                asChild
              >
                <Link to="/works">
                  <FileText className="w-4 h-4 mr-3" />
                  Todas as Obras
                </Link>
              </Button>
              {user?.role === "admin" && (
                <Button
                  variant="outline"
                  className="w-full justify-start hover-leirisonda h-auto py-3"
                  asChild
                >
                  <Link to="/create-user">
                    <Users className="w-4 h-4 mr-3" />
                    Novo Utilizador
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Search Works */}
          <div className="card-leirisonda">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Pesquisar Obras
              </h3>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cliente, folha obra, morada..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-leirisonda pl-10 text-sm"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((work) => {
                    const statusInfo = getStatusInfo(work.status);
                    const WorkIcon = getWorkTypeIcon(work.type);
                    return (
                      <div
                        key={work.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/works/${work.id}`)}
                      >
                        <div className="flex items-center space-x-2">
                          <WorkIcon className="w-4 h-4 text-gray-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {work.clientName}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.className}`}
                              >
                                {statusInfo.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                {work.workSheetNumber}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {searchTerm && searchResults.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    Nenhuma obra encontrada
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
