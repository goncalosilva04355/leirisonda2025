import React, { useState, useEffect } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Plus,
  Wrench,
  Waves,
  BarChart3,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Edit2,
  Play,
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  Bell,
  FileText,
  MapPin,
} from "lucide-react";
import jsPDF from "jspdf";
import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { SyncStatusDisplay } from "./components/SyncStatusDisplay";
import { InstallPrompt } from "./components/InstallPrompt";
import { UserPermissionsManager } from "./components/UserPermissionsManager";
import { RegisterForm } from "./components/RegisterForm";
import { LocationPage } from "./components/LocationPage";
import { PersonalLocationSettings } from "./components/PersonalLocationSettings";
import { AutoSyncProvider } from "./components/AutoSyncProvider";
import { FirebaseQuotaWarning } from "./components/FirebaseQuotaWarning";
import { FirebaseQuotaAlert } from "./components/FirebaseQuotaAlert";

import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { useDataSync } from "./hooks/useDataSync_simple";
import { authService, UserProfile } from "./services/authService";

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMenu, setShowMenu] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showPermissionsManager, setShowPermissionsManager] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showFirebaseConfig, setShowFirebaseConfig] = useState(false);

  // Data sync
  const dataSync = useDataSync();
  const {
    pools,
    maintenance,
    futureMaintenance,
    works,
    clients,
    isLoading: syncLoading,
    lastSync,
    error: syncError,
    syncWithFirebase,
    addPool,
    addWork,
    addMaintenance,
    addClient,
  } = dataSync;

  // Forms state
  const [workForm, setWorkForm] = useState({
    title: "",
    description: "",
    client: "",
    contact: "",
    location: "",
    type: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    budget: "",
    assignedTo: "",
    status: "pending",
  });

  const [poolForm, setPoolForm] = useState({
    name: "",
    location: "",
    client: "",
    type: "",
    status: "active",
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    poolId: "",
    type: "",
    description: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    technician: "",
    status: "scheduled",
  });

  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Initialize authentication state
  useEffect(() => {
    console.log("🔒 Initializing authentication...");

    const unsubscribe = authService.onAuthStateChanged((user) => {
      console.log("🔄 Auth state changed:", user ? user.email : "null");
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setLoginError("");

      console.log("🔐 Attempting login...");
      const result = await authService.login(email, password);

      if (result.success && result.user) {
        console.log("✅ Login successful");
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        console.log("❌ Login failed:", result.error);
        setLoginError(result.error || "Erro de login");
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setLoginError("Erro de conexão. Tente novamente.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      await authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setActiveTab("dashboard");
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  // Handle work form submission
  const handleWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addWork({
        ...workForm,
        budget: workForm.budget ? parseFloat(workForm.budget) : undefined,
        createdBy: currentUser?.name || "Sistema",
        createdByUser: currentUser?.uid || "",
      });

      // Reset form
      setWorkForm({
        title: "",
        description: "",
        client: "",
        contact: "",
        location: "",
        type: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        budget: "",
        assignedTo: "",
        status: "pending",
      });

      // Sync with Firebase
      await syncWithFirebase();

      console.log("✅ Work added successfully");
    } catch (error) {
      console.error("❌ Error adding work:", error);
    }
  };

  // Handle pool form submission
  const handlePoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addPool(poolForm);

      // Reset form
      setPoolForm({
        name: "",
        location: "",
        client: "",
        type: "",
        status: "active",
      });

      // Sync with Firebase
      await syncWithFirebase();

      console.log("✅ Pool added successfully");
    } catch (error) {
      console.error("❌ Error adding pool:", error);
    }
  };

  // Handle maintenance form submission
  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedPool = pools.find((p) => p.id === maintenanceForm.poolId);

      addMaintenance({
        ...maintenanceForm,
        poolName: selectedPool?.name || "",
        clientName: selectedPool?.client || "",
        location: selectedPool?.location || "",
      });

      // Reset form
      setMaintenanceForm({
        poolId: "",
        type: "",
        description: "",
        scheduledDate: new Date().toISOString().split("T")[0],
        technician: "",
        status: "scheduled",
      });

      // Sync with Firebase
      await syncWithFirebase();

      console.log("✅ Maintenance added successfully");
    } catch (error) {
      console.error("❌ Error adding maintenance:", error);
    }
  };

  // Handle client form submission
  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addClient({
        ...clientForm,
        pools: [],
      });

      // Reset form
      setClientForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      // Sync with Firebase
      await syncWithFirebase();

      console.log("✅ Client added successfully");
    } catch (error) {
      console.error("❌ Error adding client:", error);
    }
  };

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>A carregar aplicação...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        loginError={loginError}
        isLoading={isLoading}
      />
    );
  }

  // Main app interface
  return (
    <AutoSyncProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
              >
                {showMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center ml-2 lg:ml-0">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Leirisonda
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sync status */}
              {syncLoading && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Sincronizando...
                </div>
              )}

              {/* User info and logout */}
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">
                    {currentUser?.name}
                  </p>
                  <p className="text-gray-500">{currentUser?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav
            className={`bg-white w-64 min-h-screen shadow-sm border-r border-gray-200 ${showMenu ? "block" : "hidden"} lg:block`}
          >
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "dashboard"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("obras")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "obras"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Building2 className="h-4 w-4 mr-3" />
                    Obras
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("piscinas")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "piscinas"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Waves className="h-4 w-4 mr-3" />
                    Piscinas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("manutencoes")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "manutencoes"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Wrench className="h-4 w-4 mr-3" />
                    Manutenções
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("clientes")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "clientes"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Clientes
                  </button>
                </li>
                {currentUser?.permissions.utilizadores.view && (
                  <li>
                    <button
                      onClick={() => setActiveTab("utilizadores")}
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeTab === "utilizadores"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <UserCheck className="h-4 w-4 mr-3" />
                      Utilizadores
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => setActiveTab("configuracoes")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "configuracoes"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Configurações
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 p-6">
            {activeTab === "dashboard" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Dashboard
                </h1>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Building2 className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Obras
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {works.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Waves className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Piscinas
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {pools.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Wrench className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Manutenções
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {maintenance.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Clientes
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {clients.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent activities */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Atividades Recentes
                    </h2>
                  </div>
                  <div className="p-6">
                    {lastSync ? (
                      <p className="text-sm text-gray-600">
                        Última sincronização: {lastSync.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Nenhuma sincronização ainda realizada
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "obras" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Obras</h1>
                  {currentUser?.permissions.obras.create && (
                    <button
                      onClick={() => setActiveTab("nova-obra")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Obra
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Título
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data Início
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {works.map((work) => (
                          <tr key={work.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {work.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {work.client}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  work.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : work.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {work.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(work.startDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "nova-obra" && (
              <div>
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setActiveTab("obras")}
                    className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Nova Obra
                  </h1>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <form onSubmit={handleWorkSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título *
                        </label>
                        <input
                          type="text"
                          value={workForm.title}
                          onChange={(e) =>
                            setWorkForm({ ...workForm, title: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cliente *
                        </label>
                        <input
                          type="text"
                          value={workForm.client}
                          onChange={(e) =>
                            setWorkForm({ ...workForm, client: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contacto
                        </label>
                        <input
                          type="text"
                          value={workForm.contact}
                          onChange={(e) =>
                            setWorkForm({
                              ...workForm,
                              contact: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Localização *
                        </label>
                        <input
                          type="text"
                          value={workForm.location}
                          onChange={(e) =>
                            setWorkForm({
                              ...workForm,
                              location: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Obra *
                        </label>
                        <select
                          value={workForm.type}
                          onChange={(e) =>
                            setWorkForm({ ...workForm, type: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="nova_construcao">
                            Nova Construção
                          </option>
                          <option value="reparacao">Reparação</option>
                          <option value="manutencao">Manutenção</option>
                          <option value="reforma">Reforma</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Início *
                        </label>
                        <input
                          type="date"
                          value={workForm.startDate}
                          onChange={(e) =>
                            setWorkForm({
                              ...workForm,
                              startDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Fim
                        </label>
                        <input
                          type="date"
                          value={workForm.endDate}
                          onChange={(e) =>
                            setWorkForm({
                              ...workForm,
                              endDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Orçamento (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={workForm.budget}
                          onChange={(e) =>
                            setWorkForm({ ...workForm, budget: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Responsável
                        </label>
                        <input
                          type="text"
                          value={workForm.assignedTo}
                          onChange={(e) =>
                            setWorkForm({
                              ...workForm,
                              assignedTo: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={workForm.status}
                          onChange={(e) =>
                            setWorkForm({ ...workForm, status: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Progresso</option>
                          <option value="completed">Concluída</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        value={workForm.description}
                        onChange={(e) =>
                          setWorkForm({
                            ...workForm,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab("obras")}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Criar Obra
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Other tabs would continue here... */}
            {activeTab === "configuracoes" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Configurações
                </h1>

                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Firebase
                    </h2>
                    <button
                      onClick={() => setShowFirebaseConfig(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Configurar Firebase
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Sincronização
                    </h2>
                    <button
                      onClick={syncWithFirebase}
                      disabled={syncLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {syncLoading ? "Sincronizando..." : "Sincronizar Agora"}
                    </button>
                  </div>

                  {currentUser?.permissions.utilizadores.view && (
                    <div className="bg-white rounded-lg shadow p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Utilizadores
                      </h2>
                      <div className="space-x-4">
                        <button
                          onClick={() => setShowRegisterForm(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Registar Utilizador
                        </button>
                        <button
                          onClick={() => setShowPermissionsManager(true)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                        >
                          Gerir Permissões
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modals */}
        {showRegisterForm && (
          <RegisterForm
            isOpen={showRegisterForm}
            onClose={() => setShowRegisterForm(false)}
          />
        )}

        {showPermissionsManager && (
          <UserPermissionsManager
            isOpen={showPermissionsManager}
            onClose={() => setShowPermissionsManager(false)}
          />
        )}

        {showFirebaseConfig && (
          <FirebaseConfig
            isOpen={showFirebaseConfig}
            onClose={() => setShowFirebaseConfig(false)}
          />
        )}

        {/* Error/success messages */}
        {syncError && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {syncError}
            </div>
          </div>
        )}
      </div>
    </AutoSyncProvider>
  );
}

export default App;
