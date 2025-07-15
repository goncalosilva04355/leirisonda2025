import React, { useState, useEffect } from "react";
import { Building2, Menu, X, Home, Plus, Wrench, Waves } from "lucide-react";

// Componentes essenciais apenas
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

// Utilities seguros
import { safeLocalStorage } from "./utils/storageUtils";

// Tipos básicos
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions?: any;
}

function AppFixed() {
  // Estados básicos
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loginError, setLoginError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  console.log("🔍 App renderizando...", { isAuthenticated, currentUser });

  // Função de navegação simples
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
    window.history.replaceState(null, "", `#${section}`);
  };

  // Inicializar autenticação
  useEffect(() => {
    try {
      const savedUser = safeLocalStorage.getItem("currentUser");
      const isAuthenticatedStored = safeLocalStorage.getItem("isAuthenticated");

      if (savedUser && isAuthenticatedStored === "true") {
        const userProfile = JSON.parse(savedUser);
        console.log("✅ Sessão existente encontrada:", userProfile.email);
        setCurrentUser(userProfile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar sessão:", error);
    }
  }, []);

  // Handle de login simples
  const handleLogin = async (
    email: string,
    password: string,
    rememberMe: boolean = false,
  ) => {
    try {
      setLoginError("");

      // Login simples para o admin principal
      if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
        const user: UserProfile = {
          id: 1,
          name: "Gonçalo Fonseca",
          email: email,
          role: "super_admin",
          permissions: {
            obras: { view: true, create: true, edit: true, delete: true },
            manutencoes: { view: true, create: true, edit: true, delete: true },
            piscinas: { view: true, create: true, edit: true, delete: true },
            utilizadores: {
              view: true,
              create: true,
              edit: true,
              delete: true,
            },
            relatorios: { view: true, create: true, edit: true, delete: true },
            clientes: { view: true, create: true, edit: true, delete: true },
          },
        };

        setCurrentUser(user);
        setIsAuthenticated(true);
        safeLocalStorage.setItem("currentUser", JSON.stringify(user));
        safeLocalStorage.setItem("isAuthenticated", "true");

        console.log("✅ Login bem-sucedido");
        navigateToSection("dashboard");
      } else {
        setLoginError("Login incorreto");
      }
    } catch (error) {
      console.error("❌ Erro no login:", error);
      setLoginError("Erro no login");
    }
  };

  // Handle de logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    safeLocalStorage.removeItem("currentUser");
    safeLocalStorage.removeItem("isAuthenticated");
    setSidebarOpen(false);
    setActiveSection("dashboard");
    window.location.hash = "";
    console.log("🚪 Logout executado");
  };

  // Renderizar página de login se não autenticado
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoginPage
          onLogin={handleLogin}
          loginError={loginError}
          isLoading={false}
        />
      </div>
    );
  }

  // Menu items
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "obras", icon: Building2, label: "Obras" },
    { id: "piscinas", icon: Waves, label: "Piscinas" },
    { id: "manutencoes", icon: Wrench, label: "Manutenções" },
  ];

  // Renderizar conteúdo baseado na seção ativa
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard
              </h1>
              <p className="text-gray-600 mb-4">
                Bem-vindo, {currentUser.name}!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-900">Obras</h3>
                  <p className="text-2xl font-bold text-blue-700">0</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-900">Piscinas</h3>
                  <p className="text-2xl font-bold text-green-700">0</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h3 className="font-semibold text-orange-900">Manutenções</h3>
                  <p className="text-2xl font-bold text-orange-700">0</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-900">Clientes</h3>
                  <p className="text-2xl font-bold text-purple-700">0</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "obras":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Obras</h1>
              <p className="text-gray-600">Gestão de obras do sistema.</p>
            </div>
          </div>
        );
      case "piscinas":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Piscinas
              </h1>
              <p className="text-gray-600">Gestão de piscinas do sistema.</p>
            </div>
          </div>
        );
      case "manutencoes":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Manutenções
              </h1>
              <p className="text-gray-600">Gestão de manutenções do sistema.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Seção não encontrada
              </h1>
              <p className="text-gray-600">A seção solicitada não existe.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Leirisonda</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigateToSection(item.id)}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Leirisonda</h1>
          <div className="w-10"></div>
        </div>

        {/* Page content */}
        <main className="flex-1">{renderContent()}</main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AppFixed;
