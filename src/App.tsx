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
            <h1 className="text-2xl sm:text-3xl font-bold text-black border-b-2 border-black pb-2">
              Nova Obra
            </h1>
            <div className="bg-white border-2 border-black p-4 sm:p-6">
              <p className="text-black">
                Formulário para criar uma nova obra será implementado aqui.
              </p>
            </div>
          </div>
        );
      case "nova-manutencao":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-black border-b-2 border-black pb-2">
              Nova Manutenção
            </h1>
            <div className="bg-white border-2 border-black p-4 sm:p-6">
              <p className="text-black">
                Formulário para registar uma nova manutenção será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "nova-piscina":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-black border-b-2 border-black pb-2">
              Nova Piscina
            </h1>
            <div className="bg-white border-2 border-black p-4 sm:p-6">
              <p className="text-black">
                Formulário para registar uma nova piscina será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "utilizadores":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-black border-b-2 border-black pb-2">
              Utilizadores
            </h1>
            <div className="bg-white border-2 border-black p-4 sm:p-6">
              <p className="text-black">
                Gestão de utilizadores do sistema será implementada aqui.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-black border-b-2 border-black pb-2">
              Dashboard
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white border-2 border-black p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 border-2 border-black">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </div>
                  <div className="ml-3 sm:ml-4 border-l-2 border-black pl-3">
                    <p className="text-xs sm:text-sm font-medium text-black">
                      Obras Ativas
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-black">
                      12
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-black p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 border-2 border-black">
                    <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </div>
                  <div className="ml-3 sm:ml-4 border-l-2 border-black pl-3">
                    <p className="text-xs sm:text-sm font-medium text-black">
                      Manutenções
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-black">
                      8
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-black p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 border-2 border-black">
                    <Waves className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </div>
                  <div className="ml-3 sm:ml-4 border-l-2 border-black pl-3">
                    <p className="text-xs sm:text-sm font-medium text-black">
                      Piscinas
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-black">
                      24
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-black p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 border-2 border-black">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </div>
                  <div className="ml-3 sm:ml-4 border-l-2 border-black pl-3">
                    <p className="text-xs sm:text-sm font-medium text-black">
                      Clientes
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-black">
                      156
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border-2 border-black">
              <div className="px-4 sm:px-6 py-4 border-b-2 border-black">
                <h2 className="text-lg font-semibold text-black">
                  Atividade Recente
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 border-b border-black pb-2">
                    <div className="w-4 h-4 mt-1 border-2 border-black flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black">
                        Nova obra iniciada - Piscina Quinta da Marinha
                      </p>
                      <span className="text-xs text-black border-t border-black pt-1 block">
                        há 2 horas
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 border-b border-black pb-2">
                    <div className="w-4 h-4 mt-1 border-2 border-black flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black">
                        Manutenção completada - Casa Sr. Silva
                      </p>
                      <span className="text-xs text-black border-t border-black pt-1 block">
                        há 4 horas
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 mt-1 border-2 border-black flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black">
                        Novo cliente registado - Maria Santos
                      </p>
                      <span className="text-xs text-black border-t border-black pt-1 block">
                        há 1 dia
                      </span>
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
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-white border-2 border-black transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-black">
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center mr-3">
              <Building2 className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-black">
                Leirisonda
              </h1>
              <p className="text-xs text-black">Gestão de Obras</p>
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
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-3 text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? "border-2 border-black text-black bg-white"
                      : "border border-gray-300 text-black hover:border-black"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 sm:px-4 py-4 border-t-2 border-black space-y-3">
            <button
              onClick={() => {
                console.log("Terminar sessão");
                // Aqui implementar a lógica de logout
              }}
              className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 transition-all duration-200 border-2 border-black"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Terminar Sessão</span>
            </button>
            <p className="text-xs text-black text-center border-t border-black pt-2">
              © 2024 Leirisonda
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b-2 border-black px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 border-2 border-black text-black hover:bg-gray-100 lg:hidden transition-all duration-200"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <div className="text-right border-l-2 border-black pl-4">
              <p className="text-sm font-medium text-black">
                Sistema de Gestão
              </p>
              <p className="text-xs text-black">
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
