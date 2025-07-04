import React, { useState } from "react";
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
} from "lucide-react";

// Mock authentication and user data
const ADMIN_USER = {
  email: "gongonsilva@gmail.com",
  password: "19867gsf",
  name: "Gonçalo Fonseca",
  role: "super_admin",
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState(ADMIN_USER);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-4">
              {/* Header Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-lg shadow-md p-1">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                        alt="Leirisonda Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      Olá, Gonçalo Fonseca
                    </h1>
                    <p className="text-gray-600 text-sm">
                      Bem-vindo ao sistema Leirisonda
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="space-y-3">
                <div className="bg-white rounded-lg border-l-4 border-red-500 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 font-medium text-sm">
                        Pendentes
                      </p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-l-4 border-orange-500 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 font-medium text-sm">
                        Em Progresso
                      </p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-l-4 border-green-500 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium text-sm">
                        Concluídas
                      </p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximas Manutenções */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Próximas Manutenções
                  </h2>
                </div>
                <div className="p-4 text-center text-gray-500">
                  <p>Nenhuma manutenção agendada</p>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ações Rápidas
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveSection("nova-obra")}
                    className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Criar Obra</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "piscinas":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Piscinas</h1>
                <p className="text-gray-600 text-sm">
                  Gestão de piscinas no sistema
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Waves className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma piscina registada
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Comece por adicionar a primeira piscina ao sistema
                </p>
                <button
                  onClick={() => setActiveSection("nova-piscina")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Piscina</span>
                </button>
              </div>
            </div>
          </div>
        );

      case "nova-obra":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Nova Obra</h1>
                <p className="text-gray-600 text-sm">
                  Criar uma nova obra no sistema
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-600">
                  Formulário de nova obra em desenvolvimento
                </p>
              </div>
            </div>
          </div>
        );

      case "utilizadores":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">
                  Utilizadores
                </h1>
                <p className="text-gray-600 text-sm">
                  Gestão de utilizadores do sistema
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-600">
                  Sistema de utilizadores em desenvolvimento
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Página não encontrada
              </h1>
              <p className="text-gray-600">
                A seção solicitada não foi encontrada.
              </p>
            </div>
          </div>
        );
    }
  };

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "nova-obra", icon: Plus, label: "Nova Obra" },
    { id: "piscinas", icon: Waves, label: "Piscinas" },
    { id: "utilizadores", icon: UserCheck, label: "Utilizadores" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-10 bg-white rounded-lg shadow-md p-1">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                  alt="Leirisonda Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gestão de Serviços</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="px-4 py-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-sm text-gray-500">{currentUser.role}</p>
              </div>
            </div>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-80">{renderContent()}</main>
    </div>
  );
}

export default App;
