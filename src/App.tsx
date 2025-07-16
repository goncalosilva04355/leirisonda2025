import React, { useState } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Leirisonda</h1>
            <p className="text-gray-600">Sistema de Gestão de Piscinas</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthenticated(true);
            }}
          >
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="gongonsilva@gmail.com"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="19867gsf"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "obras", name: "Obras", icon: Building2 },
    { id: "users", name: "Utilizadores", icon: Users },
    { id: "settings", name: "Configurações", icon: Settings },
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
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {menuItems.find((item) => item.id === activeSection)?.name ||
                "Dashboard"}
            </h2>
            <div className="text-gray-600">
              {activeSection === "dashboard" && (
                <div>
                  <p className="mb-4">Bem-vindo ao sistema Leirisonda!</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900">
                        Obras Ativas
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900">Piscinas</h3>
                      <p className="text-2xl font-bold text-green-600">0</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900">
                        Manutenções
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">0</p>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "obras" && (
                <p>Secção de obras em desenvolvimento...</p>
              )}
              {activeSection === "users" && (
                <p>Gestão de utilizadores em desenvolvimento...</p>
              )}
              {activeSection === "settings" && (
                <p>Configurações em desenvolvimento...</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
