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
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <h1 className="text-3xl font-bold mb-2">Nova Obra</h1>
              <p className="text-white/90">Criar uma nova obra no sistema</p>
            </div>
            <div className="card-leirisonda">
              <h2 className="text-lg font-semibold mb-4">Detalhes da Obra</h2>
              <p className="text-gray-600">
                Formulário para criar uma nova obra será implementado aqui.
              </p>
            </div>
          </div>
        );
      case "nova-manutencao":
        return (
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <h1 className="text-3xl font-bold mb-2">Nova Manutenção</h1>
              <p className="text-white/90">Registar uma nova manutenção</p>
            </div>
            <div className="card-leirisonda">
              <h2 className="text-lg font-semibold mb-4">
                Detalhes da Manutenção
              </h2>
              <p className="text-gray-600">
                Formulário para registar uma nova manutenção será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "nova-piscina":
        return (
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <h1 className="text-3xl font-bold mb-2">Nova Piscina</h1>
              <p className="text-white/90">Registar uma nova piscina</p>
            </div>
            <div className="card-leirisonda">
              <h2 className="text-lg font-semibold mb-4">
                Detalhes da Piscina
              </h2>
              <p className="text-gray-600">
                Formulário para registar uma nova piscina será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "utilizadores":
        return (
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <h1 className="text-3xl font-bold mb-2">Utilizadores</h1>
              <p className="text-white/90">Gestão de utilizadores do sistema</p>
            </div>
            <div className="card-leirisonda">
              <h2 className="text-lg font-semibold mb-4">
                Lista de Utilizadores
              </h2>
              <p className="text-gray-600">
                Gestão de utilizadores do sistema será implementada aqui.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <h1 className="text-4xl font-bold mb-4">
                Bem-vindo ao Sistema Leirisonda
              </h1>
              <p className="text-lg text-white/90">
                Sistema de gestão de obras e manutenção de piscinas
              </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid mb-8">
              <div className="stat-card-leirisonda stat-card-primary">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    <p className="text-sm text-gray-600">Obras Ativas</p>
                  </div>
                </div>
              </div>

              <div className="stat-card-leirisonda stat-card-success">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Wrench className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">8</h3>
                    <p className="text-sm text-gray-600">Manutenções</p>
                  </div>
                </div>
              </div>

              <div className="stat-card-leirisonda stat-card-secondary">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Waves className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">24</h3>
                    <p className="text-sm text-gray-600">Piscinas</p>
                  </div>
                </div>
              </div>

              <div className="stat-card-leirisonda stat-card-warning">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">156</h3>
                    <p className="text-sm text-gray-600">Clientes</p>
                  </div>
                </div>
              </div>

              <div className="stat-card-leirisonda stat-card-primary">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">6</h3>
                    <p className="text-sm text-gray-600">Utilizadores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="content-grid">
              <div className="space-y-6">
                <div className="card-leirisonda">
                  <h2 className="text-xl font-semibold mb-4">
                    Atividade Recente
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Nova obra iniciada - Piscina Quinta da Marinha
                        </p>
                        <p className="text-xs text-gray-500">há 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Manutenção completada - Casa Sr. Silva
                        </p>
                        <p className="text-xs text-gray-500">há 4 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Novo cliente registado - Maria Santos
                        </p>
                        <p className="text-xs text-gray-500">há 1 dia</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-leirisonda">
                  <h2 className="text-xl font-semibold mb-4">
                    Próximas Tarefas
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        Inspeção piscina - Hotel Atlantic
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Amanhã
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        Manutenção quinzenal - Condomínio Sol
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Sexta-feira
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        Orçamento nova piscina - Villa Cascais
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Próxima semana
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="card-leirisonda">
                  <h2 className="text-xl font-semibold mb-4">Resumo do Mês</h2>
                  <div className="space-y-4">
                    <div className="section-leirisonda-blue">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Receita</span>
                        <span className="text-lg font-bold">€12.450</span>
                      </div>
                    </div>
                    <div className="section-leirisonda">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Obras Concluídas
                        </span>
                        <span className="text-lg font-bold">18</span>
                      </div>
                    </div>
                    <div className="section-leirisonda">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Novos Clientes
                        </span>
                        <span className="text-lg font-bold">7</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-leirisonda">
                  <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveSection("nova-obra")}
                      className="btn-leirisonda w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Obra
                    </button>
                    <button
                      onClick={() => setActiveSection("nova-manutencao")}
                      className="btn-leirisonda btn-leirisonda-secondary w-full"
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Nova Manutenção
                    </button>
                    <button
                      onClick={() => setActiveSection("nova-piscina")}
                      className="btn-leirisonda w-full"
                    >
                      <Waves className="h-4 w-4 mr-2" />
                      Nova Piscina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="leirisonda-layout">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-5 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Leirisonda</h1>
              <p className="text-sm text-gray-500">Gestão de Obras</p>
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
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`nav-item-leirisonda ${isActive ? "active" : ""}`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={() => {
                console.log("Terminar sessão");
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Terminar Sessão</span>
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              © 2024 Leirisonda
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="lg:ml-72 bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
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
            <p className="text-xs text-gray-500">
              Obras e Manutenção de Piscinas
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-72">{renderContent()}</main>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
