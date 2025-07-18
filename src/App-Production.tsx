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
  Settings,
  LogOut,
  Eye,
  EyeOff,
  FileText,
  MapPin,
  Share,
} from "lucide-react";

// Tipos básicos
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  permissions: {
    obras: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    manutencoes: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    piscinas: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    utilizadores: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    relatorios: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    clientes: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

// Storage seguro
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn("localStorage não disponível");
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn("localStorage não disponível");
    }
  },
};

function AppProduction() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  // Dados simulados para demonstração
  const [obras] = useState([
    {
      id: "1",
      title: "Construção Piscina Vila Real",
      client: "João Silva",
      status: "em_progresso",
      location: "Vila Real",
      startDate: "2024-07-01",
    },
    {
      id: "2",
      title: "Manutenção Hotel Porto",
      client: "Hotel Premium",
      status: "pendente",
      location: "Porto",
      startDate: "2024-07-15",
    },
  ]);

  const [piscinas] = useState([
    {
      id: "1",
      name: "Piscina Residencial VR",
      client: "João Silva",
      location: "Vila Real",
      type: "Residencial",
      status: "Ativa",
    },
    {
      id: "2",
      name: "Piscina Hotel Premium",
      client: "Hotel Premium",
      location: "Porto",
      type: "Comercial",
      status: "Ativa",
    },
  ]);

  const [manutencoes] = useState([
    {
      id: "1",
      poolName: "Piscina Residencial VR",
      date: "2024-07-18",
      technician: "Gonçalo Fonseca",
      status: "completed",
      type: "Limpeza",
    },
  ]);

  const [clientes] = useState([
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "910000000",
      location: "Vila Real",
      status: "Ativo",
    },
    {
      id: "2",
      name: "Hotel Premium",
      email: "geral@hotelpremium.pt",
      phone: "220000000",
      location: "Porto",
      status: "Ativo",
    },
  ]);

  // Verificar permissões
  const hasPermission = (section: string, action: string) => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return true;
    return currentUser.permissions[section]?.[action] || false;
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Credenciais válidas
    if (
      loginForm.email === "gongonsilva@gmail.com" &&
      loginForm.password === "19867gsf"
    ) {
      const user: UserProfile = {
        id: 1,
        name: "Gonçalo Fonseca",
        email: "gongonsilva@gmail.com",
        role: "super_admin",
        active: true,
        permissions: {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        },
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      safeLocalStorage.setItem("currentUser", JSON.stringify(user));
      safeLocalStorage.setItem("isAuthenticated", "true");
    } else {
      setLoginError("Credenciais inválidas");
    }
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    safeLocalStorage.removeItem("currentUser");
    safeLocalStorage.removeItem("isAuthenticated");
    setLoginForm({ email: "", password: "" });
  };

  // Verificar auth no carregamento
  useEffect(() => {
    try {
      const savedUser = safeLocalStorage.getItem("currentUser");
      const savedAuth = safeLocalStorage.getItem("isAuthenticated");

      if (savedAuth === "true" && savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn("Erro ao carregar auth:", error);
    }
  }, []);

  // Render Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Building2 className="w-8 h-8 text-cyan-600" />
            <h1 className="text-2xl font-bold text-gray-800">Leirisonda</h1>
          </div>

          <p className="text-center text-gray-600 mb-6">
            Sistema de Gestão de Piscinas
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="gongonsilva@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="19867gsf"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Versão Produção Otimizada</p>
          </div>
        </div>
      </div>
    );
  }

  // Navigation
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Wrench className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Obras Totais</p>
              <p className="text-2xl font-bold text-gray-900">{obras.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Waves className="w-8 h-8 text-cyan-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Piscinas</p>
              <p className="text-2xl font-bold text-gray-900">
                {piscinas.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Manutenções</p>
              <p className="text-2xl font-bold text-gray-900">
                {manutencoes.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientes.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Obras Recentes
        </h3>
        <div className="space-y-3">
          {obras.map((obra) => (
            <div
              key={obra.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <p className="font-medium">{obra.title}</p>
                <p className="text-sm text-gray-600">
                  {obra.client} - {obra.location}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  obra.status === "em_progresso"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {obra.status === "em_progresso" ? "Em Progresso" : "Pendente"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Obras
  const renderObras = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Obras</h2>
        {hasPermission("obras", "create") && (
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Obra
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Lista de Obras</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {obras.map((obra) => (
            <div key={obra.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">
                    {obra.title}
                  </h4>
                  <p className="text-gray-600">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {obra.location} • {obra.client}
                  </p>
                  <p className="text-sm text-gray-500">
                    Início: {obra.startDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      obra.status === "em_progresso"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {obra.status === "em_progresso"
                      ? "Em Progresso"
                      : "Pendente"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "obras":
        return renderObras();
      case "piscinas":
        return (
          <div className="text-center py-8">
            <Waves className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Piscinas</h2>
            <p className="text-gray-600">
              {piscinas.length} piscinas registadas
            </p>
          </div>
        );
      case "manutencoes":
        return (
          <div className="text-center py-8">
            <Settings className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Manutenções</h2>
            <p className="text-gray-600">
              {manutencoes.length} manutenções realizadas
            </p>
          </div>
        );
      case "clientes":
        return (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Clientes</h2>
            <p className="text-gray-600">{clientes.length} clientes ativos</p>
          </div>
        );
      case "relatorios":
        return (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Relatórios</h2>
            <p className="text-gray-600">Relatórios e análises</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-cyan-600" />
                <h1 className="text-xl font-bold text-gray-900">Leirisonda</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Olá, {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {[
                    { id: "dashboard", name: "Dashboard", icon: Home },
                    { id: "obras", name: "Obras", icon: Wrench },
                    { id: "piscinas", name: "Piscinas", icon: Waves },
                    { id: "manutencoes", name: "Manutenções", icon: Settings },
                    { id: "clientes", name: "Clientes", icon: Users },
                    { id: "relatorios", name: "Relatórios", icon: BarChart3 },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateToSection(item.id)}
                        className={`${
                          activeSection === item.id
                            ? "bg-cyan-100 text-cyan-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 flex z-40">
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex items-center gap-3 px-4 mb-6">
                    <Building2 className="w-8 h-8 text-cyan-600" />
                    <h1 className="text-xl font-bold text-gray-900">
                      Leirisonda
                    </h1>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {[
                      { id: "dashboard", name: "Dashboard", icon: Home },
                      { id: "obras", name: "Obras", icon: Wrench },
                      { id: "piscinas", name: "Piscinas", icon: Waves },
                      {
                        id: "manutencoes",
                        name: "Manutenções",
                        icon: Settings,
                      },
                      { id: "clientes", name: "Clientes", icon: Users },
                      { id: "relatorios", name: "Relatórios", icon: BarChart3 },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigateToSection(item.id)}
                          className={`${
                            activeSection === item.id
                              ? "bg-cyan-100 text-cyan-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                        >
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppProduction;
