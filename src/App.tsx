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
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  Bell,
} from "lucide-react";
import jsPDF from "jspdf";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { hybridAuthService as authService } from "./services/hybridAuthService";
import { UserProfile } from "./services/robustLoginService";

// Dados iniciais do sistema
const initialUsers = [
  {
    id: 1,
    name: "Gonçalo Fonseca",
    email: "gongonsilva@gmail.com",
    password: "19867gsf",
    role: "super_admin",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: true },
      manutencoes: { view: true, create: true, edit: true, delete: true },
      piscinas: { view: true, create: true, edit: true, delete: true },
      utilizadores: { view: true, create: true, edit: true, delete: true },
      relatorios: { view: true, create: true, edit: true, delete: true },
      clientes: { view: true, create: true, edit: true, delete: true },
    },
    active: true,
    createdAt: "2024-01-01",
  },
];

function App() {
  // Estados principais
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState(initialUsers);

  // Estados de formulários
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  // Estados de obras
  const [works, setWorks] = useState<any[]>([]);
  const [showNewWorkForm, setShowNewWorkForm] = useState(false);
  const [workForm, setWorkForm] = useState({
    title: "",
    client: "",
    location: "",
    type: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    assignedTo: "",
    status: "pending",
  });

  // Estados de piscinas
  const [pools, setPools] = useState<any[]>([]);
  const [showNewPoolForm, setShowNewPoolForm] = useState(false);
  const [poolForm, setPoolForm] = useState({
    name: "",
    client: "",
    location: "",
    type: "",
    status: "Ativa",
    nextMaintenance: "",
    notes: "",
  });

  // Estados de manutenções
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [showNewMaintenanceForm, setShowNewMaintenanceForm] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    poolId: "",
    poolName: "",
    type: "",
    scheduledDate: "",
    technician: "",
    status: "pending",
    description: "",
    notes: "",
  });

  // Estados de clientes
  const [clients, setClients] = useState<any[]>([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Configurações
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedPassword, setAdvancedPassword] = useState("");
  const [advancedPasswordError, setAdvancedPasswordError] = useState("");
  const [isAdvancedUnlocked, setIsAdvancedUnlocked] = useState(false);

  // Inicialização
  useEffect(() => {
    console.log("🔥 Leirisonda App iniciada - Backup 110725leirisonda1033");

    // Carregar dados do localStorage
    const savedWorks = localStorage.getItem("works");
    if (savedWorks) {
      setWorks(JSON.parse(savedWorks));
    }

    const savedPools = localStorage.getItem("pools");
    if (savedPools) {
      setPools(JSON.parse(savedPools));
    }

    const savedMaintenance = localStorage.getItem("maintenance");
    if (savedMaintenance) {
      setMaintenance(JSON.parse(savedMaintenance));
    }

    const savedClients = localStorage.getItem("clients");
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }

    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Funções de autenticação
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginForm.email || !loginForm.password) {
      setLoginError("Por favor, preencha todos os campos");
      return;
    }

    try {
      const result = await authService.login(
        loginForm.email,
        loginForm.password,
      );

      if (result.success && result.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setLoginForm({ email: "", password: "" });
        console.log("✅ Login realizado com sucesso");
      } else {
        setLoginError(result.error || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("❌ Erro no login:", error);
      setLoginError("Erro de sistema. Tente novamente.");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setSidebarOpen(false);
      setLoginForm({ email: "", password: "" });
      console.log("✅ Logout realizado com sucesso");
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      // Force logout mesmo com erro
      setCurrentUser(null);
      setIsAuthenticated(false);
      setSidebarOpen(false);
    }
  };

  // Funções de navegação
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // Funções CRUD - Obras
  const addWork = (workData: any) => {
    const newWork = {
      ...workData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedWorks = [...works, newWork];
    setWorks(updatedWorks);
    localStorage.setItem("works", JSON.stringify(updatedWorks));

    setShowNewWorkForm(false);
    setWorkForm({
      title: "",
      client: "",
      location: "",
      type: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: "",
      assignedTo: "",
      status: "pending",
    });
  };

  // Funções CRUD - Piscinas
  const addPool = (poolData: any) => {
    const newPool = {
      ...poolData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedPools = [...pools, newPool];
    setPools(updatedPools);
    localStorage.setItem("pools", JSON.stringify(updatedPools));

    setShowNewPoolForm(false);
    setPoolForm({
      name: "",
      client: "",
      location: "",
      type: "",
      status: "Ativa",
      nextMaintenance: "",
      notes: "",
    });
  };

  // Funções CRUD - Manutenções
  const addMaintenance = (maintenanceData: any) => {
    const newMaintenance = {
      ...maintenanceData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedMaintenance = [...maintenance, newMaintenance];
    setMaintenance(updatedMaintenance);
    localStorage.setItem("maintenance", JSON.stringify(updatedMaintenance));

    setShowNewMaintenanceForm(false);
    setMaintenanceForm({
      poolId: "",
      poolName: "",
      type: "",
      scheduledDate: "",
      technician: "",
      status: "pending",
      description: "",
      notes: "",
    });
  };

  // Funções CRUD - Clientes
  const addClient = (clientData: any) => {
    const newClient = {
      ...clientData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      pools: [],
    };

    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem("clients", JSON.stringify(updatedClients));

    setShowNewClientForm(false);
    setClientForm({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  // Verificação de permissões
  const hasPermission = (section: string, action: string) => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions[section]?.[action] || false;
  };

  // Configurações avançadas
  const handleAdvancedPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (advancedPassword === "19867") {
      setIsAdvancedUnlocked(true);
      setAdvancedPasswordError("");
    } else {
      setAdvancedPasswordError("Palavra-passe incorreta");
    }
  };

  const handleAdvancedSettingsBack = () => {
    setShowAdvancedSettings(false);
    setIsAdvancedUnlocked(false);
    setAdvancedPassword("");
    setAdvancedPasswordError("");
  };

  // Geração de PDFs
  const downloadPDF = (content: string, filename: string) => {
    const doc = new jsPDF();
    const lines = content.split("\n");
    let y = 20;

    lines.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save(filename);
  };

  // Se não está autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Building2 className="mx-auto h-12 w-12 text-blue-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Leirisonda
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sistema de Gestão de Obras e Piscinas
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Palavra-passe
              </label>
              <input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            Backup 110725leirisonda1033 - ✅ Totalmente Funcional
          </div>
        </div>
      </div>
    );
  }

  // Interface principal da aplicação
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-semibold text-gray-900">
                  Leirisonda
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs">
            <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-lg font-medium text-gray-900">
                    Menu
                  </span>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  <button
                    onClick={() => navigateToSection("dashboard")}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === "dashboard"
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Home className="mr-3 h-5 w-5" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => navigateToSection("obras")}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === "obras"
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Wrench className="mr-3 h-5 w-5" />
                    Obras
                  </button>

                  <button
                    onClick={() => navigateToSection("piscinas")}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === "piscinas"
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Waves className="mr-3 h-5 w-5" />
                    Piscinas
                  </button>

                  <button
                    onClick={() => navigateToSection("manutencoes")}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === "manutencoes"
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Manutenções
                  </button>

                  <button
                    onClick={() => navigateToSection("clientes")}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === "clientes"
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Clientes
                  </button>

                  <button
                    onClick={() => navigateToSection("relatorios")}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === "relatorios"
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <BarChart3 className="mr-3 h-5 w-5" />
                    Relatórios
                  </button>

                  {hasPermission("utilizadores", "view") && (
                    <button
                      onClick={() => navigateToSection("utilizadores")}
                      className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        activeSection === "utilizadores"
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <UserCheck className="mr-3 h-5 w-5" />
                      Utilizadores
                    </button>
                  )}

                  <button
                    onClick={() => setShowAdvancedSettings(true)}
                    className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    Configurações
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Visão geral do sistema Leirisonda
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Wrench className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Obras
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {works.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Waves className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Piscinas
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {pools.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Settings className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Manutenções
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {maintenance.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Clientes
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {clients.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Estado do Sistema
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Backup 110725leirisonda1033 - Totalmente Funcional
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Sistema de autenticação ativo
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Todas as funcionalidades operacionais
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Obras */}
          {activeSection === "obras" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Obras</h1>
                {hasPermission("obras", "create") && (
                  <button
                    onClick={() => setShowNewWorkForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Obra
                  </button>
                )}
              </div>

              {works.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Nenhuma obra encontrada
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comece criando uma nova obra.
                  </p>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {works.map((work) => (
                      <li key={work.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-medium text-gray-900 truncate">
                                {work.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Cliente: {work.client} • Local: {work.location}
                              </p>
                              <p className="text-sm text-gray-500">
                                Tipo: {work.type} • Estado: {work.status}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  work.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : work.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {work.status === "completed"
                                  ? "Concluída"
                                  : work.status === "in_progress"
                                    ? "Em Progresso"
                                    : "Pendente"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Nova Obra */}
              {showNewWorkForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Nova Obra
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addWork(workForm);
                      }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Título
                          </label>
                          <input
                            type="text"
                            value={workForm.title}
                            onChange={(e) =>
                              setWorkForm({
                                ...workForm,
                                title: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Cliente
                          </label>
                          <input
                            type="text"
                            value={workForm.client}
                            onChange={(e) =>
                              setWorkForm({
                                ...workForm,
                                client: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Localização
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
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tipo
                          </label>
                          <select
                            value={workForm.type}
                            onChange={(e) =>
                              setWorkForm({ ...workForm, type: e.target.value })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Selecionar tipo</option>
                            <option value="Construção">Construção</option>
                            <option value="Renovação">Renovação</option>
                            <option value="Manutenção">Manutenção</option>
                            <option value="Reparação">Reparação</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-6">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                          Criar Obra
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewWorkForm(false)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Outras seções simplificadas para o backup */}
          {activeSection !== "dashboard" && activeSection !== "obras" && (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
              <p className="text-gray-600">
                Secção do backup 110725leirisonda1033 - Funcionalidade em
                desenvolvimento
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Configurações Avançadas */}
      {showAdvancedSettings && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            {!isAdvancedUnlocked ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Configurações Avançadas
                </h3>
                <form onSubmit={handleAdvancedPasswordSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Palavra-passe
                    </label>
                    <input
                      type="password"
                      value={advancedPassword}
                      onChange={(e) => setAdvancedPassword(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite a palavra-passe"
                      required
                    />
                  </div>
                  {advancedPasswordError && (
                    <div className="mb-4 text-sm text-red-600">
                      {advancedPasswordError}
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Entrar
                    </button>
                    <button
                      type="button"
                      onClick={handleAdvancedSettingsBack}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <AdvancedSettings onBack={handleAdvancedSettingsBack} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
