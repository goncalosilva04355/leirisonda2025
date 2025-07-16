import React, { useState, useEffect } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Users,
  Settings,
  LogOut,
  Plus,
  Wrench,
  Waves,
  BarChart3,
} from "lucide-react";

// Safe storage utilities
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Error reading from localStorage: ${error}`);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Error writing to localStorage: ${error}`);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from localStorage: ${error}`);
    }
  },
};

// Initial users data
const initialUsers = [
  {
    id: 1,
    name: "Gonçalo Fonseca",
    email: "gongonsilva@gmail.com",
    password: "19867gsf",
    role: "super_admin",
    active: true,
    createdAt: "2024-01-01",
  },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState(initialUsers);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Load users and auth state on startup
  useEffect(() => {
    console.log("🚀 Inicializando aplicação Leirisonda...");

    // Load users from localStorage
    const savedUsers = safeLocalStorage.getItem("app-users");
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
        console.log("✅ Utilizadores carregados:", parsedUsers.length);
      } catch (error) {
        console.error("❌ Erro ao carregar utilizadores:", error);
        setUsers(initialUsers);
      }
    } else {
      // Save initial users
      safeLocalStorage.setItem("app-users", JSON.stringify(initialUsers));
      setUsers(initialUsers);
      console.log("📝 Utilizadores iniciais criados");
    }

    // Check for saved authentication (optional - can be disabled for security)
    const savedUser = safeLocalStorage.getItem("currentUser");
    const isAuthenticatedStored = safeLocalStorage.getItem("isAuthenticated");

    if (savedUser && isAuthenticatedStored === "true") {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log("✅ Sessão restaurada:", user.email);
      } catch (error) {
        console.error("❌ Erro ao restaurar sessão:", error);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginForm.email || !loginForm.password) {
      setLoginError("Por favor, preencha todos os campos");
      return;
    }

    // Find user in the users array
    const user = users.find(
      (u) => u.email === loginForm.email && u.password === loginForm.password,
    );

    if (user && user.active) {
      console.log("✅ Login successful:", user.email);
      setCurrentUser(user);
      setIsAuthenticated(true);

      // Save auth state
      safeLocalStorage.setItem("currentUser", JSON.stringify(user));
      safeLocalStorage.setItem("isAuthenticated", "true");

      setLoginForm({ email: "", password: "" });
      setActiveSection("dashboard");
    } else {
      setLoginError("Credenciais inválidas ou utilizador inativo");
    }
  };

  const handleLogout = () => {
    console.log("🔐 Logout realizado");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveSection("dashboard");

    // Clear auth state
    safeLocalStorage.removeItem("currentUser");
    safeLocalStorage.removeItem("isAuthenticated");
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Leirisonda</h1>
            <p className="text-gray-600">Sistema de Gestão de Piscinas</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Entrar
              </button>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Utilizador de teste: gongonsilva@gmail.com / 19867gsf</p>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "obras", name: "Obras", icon: Building2 },
    { id: "piscinas", name: "Piscinas", icon: Waves },
    { id: "manutencoes", name: "Manutenções", icon: Wrench },
    { id: "relatorios", name: "Relatórios", icon: BarChart3 },
    { id: "utilizadores", name: "Utilizadores", icon: Users },
    { id: "configuracoes", name: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Leirisonda</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Olá, {currentUser?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find((item) => item.id === activeSection)?.name ||
                  "Dashboard"}
              </h2>
              {activeSection !== "dashboard" && (
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Adicionar
                </button>
              )}
            </div>

            <div className="text-gray-600">
              {activeSection === "dashboard" && (
                <div>
                  <p className="mb-6">
                    Bem-vindo ao sistema Leirisonda, {currentUser?.name}!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Obras Ativas
                      </h3>
                      <p className="text-3xl font-bold text-blue-600">0</p>
                      <p className="text-sm text-blue-700 mt-1">Em progresso</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">
                        Piscinas
                      </h3>
                      <p className="text-3xl font-bold text-green-600">0</p>
                      <p className="text-sm text-green-700 mt-1">Registadas</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">
                        Manutenções
                      </h3>
                      <p className="text-3xl font-bold text-purple-600">0</p>
                      <p className="text-sm text-purple-700 mt-1">Este mês</p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-orange-900 mb-2">
                        Utilizadores
                      </h3>
                      <p className="text-3xl font-bold text-orange-600">
                        {users.length}
                      </p>
                      <p className="text-sm text-orange-700 mt-1">Ativos</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Ações Rápidas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setActiveSection("obras")}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <Building2 className="h-8 w-8 text-blue-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">
                          Nova Obra
                        </h4>
                        <p className="text-sm text-gray-600">
                          Criar uma nova obra
                        </p>
                      </button>
                      <button
                        onClick={() => setActiveSection("piscinas")}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <Waves className="h-8 w-8 text-green-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">
                          Nova Piscina
                        </h4>
                        <p className="text-sm text-gray-600">
                          Registar nova piscina
                        </p>
                      </button>
                      <button
                        onClick={() => setActiveSection("manutencoes")}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <Wrench className="h-8 w-8 text-purple-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">
                          Nova Manutenção
                        </h4>
                        <p className="text-sm text-gray-600">
                          Agendar manutenção
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "obras" && (
                <div>
                  <p className="text-gray-600 mb-4">
                    Gestão de obras de piscinas
                  </p>
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma obra registada</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Criar primeira obra
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "piscinas" && (
                <div>
                  <p className="text-gray-600 mb-4">Gestão de piscinas</p>
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <Waves className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma piscina registada</p>
                    <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Registar primeira piscina
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "manutencoes" && (
                <div>
                  <p className="text-gray-600 mb-4">Gestão de manutenções</p>
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma manutenção agendada</p>
                    <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Agendar primeira manutenção
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "relatorios" && (
                <div>
                  <p className="text-gray-600 mb-4">
                    Relatórios e estatísticas
                  </p>
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Relatórios em desenvolvimento
                    </p>
                  </div>
                </div>
              )}

              {activeSection === "utilizadores" && (
                <div>
                  <p className="text-gray-600 mb-4">Gestão de utilizadores</p>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {user.name}
                          </h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              user.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.active ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.role === "super_admin"
                            ? "Super Admin"
                            : "Utilizador"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "configuracoes" && (
                <div>
                  <p className="text-gray-600 mb-4">Configurações do sistema</p>
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Dados Locais
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Os dados estão a ser guardados localmente no seu
                        navegador.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Limpar todos os dados
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
