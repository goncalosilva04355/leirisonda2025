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
          <div className="space-y-8">
            <div className="relative">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nova Obra
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <p className="text-white/80 text-lg">
                Formulário para criar uma nova obra será implementado aqui.
              </p>
            </div>
          </div>
        );
      case "nova-manutencao":
        return (
          <div className="space-y-8">
            <div className="relative">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                Nova Manutenção
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <p className="text-white/80 text-lg">
                Formulário para registar uma nova manutenção será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "nova-piscina":
        return (
          <div className="space-y-8">
            <div className="relative">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Nova Piscina
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <p className="text-white/80 text-lg">
                Formulário para registar uma nova piscina será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "utilizadores":
        return (
          <div className="space-y-8">
            <div className="relative">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Utilizadores
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <p className="text-white/80 text-lg">
                Gestão de utilizadores do sistema será implementada aqui.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <div className="relative">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">12</p>
                    <p className="text-sm text-cyan-200">Obras Ativas</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">8</p>
                    <p className="text-sm text-emerald-200">Manutenções</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>

              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                    <Waves className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">24</p>
                    <p className="text-sm text-purple-200">Piscinas</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>

              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg shadow-yellow-500/25 group-hover:shadow-yellow-500/40 transition-all duration-300">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">156</p>
                    <p className="text-sm text-yellow-200">Clientes</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-white/20">
                <h2 className="text-xl font-semibold text-white">
                  Atividade Recente
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group">
                    <div className="w-3 h-3 mt-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">
                        Nova obra iniciada - Piscina Quinta da Marinha
                      </p>
                      <span className="text-xs text-white/60">há 2 horas</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group">
                    <div className="w-3 h-3 mt-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">
                        Manutenção completada - Casa Sr. Silva
                      </p>
                      <span className="text-xs text-white/60">há 4 horas</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group">
                    <div className="w-3 h-3 mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-yellow-500/25 group-hover:shadow-yellow-500/40 transition-all duration-300"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">
                        Novo cliente registado - Maria Santos
                      </p>
                      <span className="text-xs text-white/60">há 1 dia</span>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 sm:w-72 backdrop-blur-xl bg-white/10 border-r border-white/20 shadow-2xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-500 ease-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-110">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Leirisonda
              </h1>
              <p className="text-sm text-cyan-200">Gestão de Obras</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`w-full flex items-center space-x-4 px-4 py-4 text-sm font-medium transition-all duration-300 rounded-2xl animate-fade-in ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/10 backdrop-blur-sm transform scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:transform hover:scale-102 hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/25"
                        : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                  </div>
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-6 border-t border-white/20 space-y-4">
            <button
              onClick={() => {
                console.log("Terminar sessão");
                // Aqui implementar a lógica de logout
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-white/70 hover:text-white rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 backdrop-blur-sm"
            >
              <div className="p-1 rounded-lg bg-red-500/20">
                <LogOut className="h-4 w-4 flex-shrink-0" />
              </div>
              <span>Terminar Sessão</span>
            </button>
            <p className="text-xs text-white/50 text-center">
              © 2024 Leirisonda
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 px-6 py-4 m-4 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 lg:hidden transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <div className="text-right">
              <p className="text-sm font-medium text-white">
                Sistema de Gestão
              </p>
              <p className="text-xs text-cyan-200">
                Obras e Manutenção de Piscinas
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 pb-safe relative z-10">{renderContent()}</main>
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
