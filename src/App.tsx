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
} from "lucide-react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "nova-obra", icon: Plus, label: "Nova Obra", path: "/obras/nova" },
    {
      id: "nova-manutencao",
      icon: Wrench,
      label: "Nova Manutenção",
      path: "/manutencao/nova",
    },
    {
      id: "nova-piscina",
      icon: Waves,
      label: "Nova Piscina",
      path: "/piscinas/nova",
    },
    {
      id: "utilizadores",
      icon: UserCheck,
      label: "Utilizadores",
      path: "/utilizadores",
    },
    {
      id: "relatorios",
      icon: BarChart3,
      label: "Relatórios",
      path: "/relatorios",
    },
    { id: "clientes", icon: Users, label: "Clientes", path: "/clientes" },
    {
      id: "configuracoes",
      icon: Settings,
      label: "Configurações",
      path: "/configuracoes",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "nova-obra":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Nova Obra
            </h1>
            <div className="bg-white shadow-sm border border-blue-100 p-4 sm:p-6">
              <p className="text-gray-600">
                Formulário para criar uma nova obra será implementado aqui.
              </p>
            </div>
          </div>
        );
      case "nova-manutencao":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Nova Manutenção
            </h1>
            <div className="bg-white shadow-sm border border-blue-100 p-4 sm:p-6">
              <p className="text-gray-600">
                Formulário para registar uma nova manutenção será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "nova-piscina":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Nova Piscina
            </h1>
            <div className="bg-white shadow-sm border border-blue-100 p-4 sm:p-6">
              <p className="text-gray-600">
                Formulário para registar uma nova piscina será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "utilizadores":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Utilizadores
            </h1>
            <div className="bg-white shadow-sm border border-blue-100 p-4 sm:p-6">
              <p className="text-gray-600">
                Gestão de utilizadores do sistema será implementada aqui.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white shadow-sm border border-blue-100 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-blue-200">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Obras Ativas
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      12
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm border border-blue-100 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-100 to-emerald-200">
                    <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Manutenções
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      8
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm border border-blue-100 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-100 to-cyan-200">
                    <Waves className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Piscinas
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      24
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm border border-blue-100 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-100 to-purple-200">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Clientes
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      156
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow-sm border border-blue-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Atividade Recente
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 mt-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate sm:whitespace-normal">
                        Nova obra iniciada - Piscina Quinta da Marinha
                      </p>
                      <span className="text-xs text-gray-400">há 2 horas</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate sm:whitespace-normal">
                        Manutenção completada - Casa Sr. Silva
                      </p>
                      <span className="text-xs text-gray-400">há 4 horas</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 mt-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate sm:whitespace-normal">
                        Novo cliente registado - Maria Santos
                      </p>
                      <span className="text-xs text-gray-400">há 1 dia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-white shadow-2xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-blue-100`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="w-10 h-10 bg-white/20 backdrop-blur flex items-center justify-center mr-3">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Leirisonda
              </h1>
              <p className="text-xs text-blue-100">Gestão de Obras</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-l-4 border-blue-400"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-l-2 hover:border-blue-300"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 sm:px-4 py-4 border-t border-blue-100 space-y-3">
            <button
              onClick={() => {
                console.log("Terminar sessão");
                // Aqui implementar a lógica de logout
              }}
              className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-red-200/50"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Terminar Sessão</span>
            </button>
            <p className="text-xs text-gray-500 text-center">
              © 2024 Leirisonda
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 lg:hidden transition-all duration-200"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Sistema de Gestão
              </p>
              <p className="text-xs text-blue-600">
                Obras e Manutenção de Piscinas
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 pb-safe">{renderContent()}</main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
