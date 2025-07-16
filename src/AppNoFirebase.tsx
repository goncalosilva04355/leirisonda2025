import React, { useState } from "react";
import { Building2, Menu, Home, Users, Settings } from "lucide-react";

function AppNoFirebase() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Leirisonda</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <nav className="w-64 bg-white shadow-lg h-screen">
            <div className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg ${
                    activeSection === "dashboard"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveSection("obras")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg ${
                    activeSection === "obras"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Building2 className="w-5 h-5 mr-3" />
                  Obras
                </button>
                <button
                  onClick={() => setActiveSection("utilizadores")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg ${
                    activeSection === "utilizadores"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  Utilizadores
                </button>
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {activeSection === "dashboard" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">
                      Total de Obras
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Obras Ativas</h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Utilizadores</h3>
                    <p className="text-3xl font-bold text-purple-600">1</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "obras" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Obras</h2>
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <p className="text-gray-500">Nenhuma obra encontrada.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "utilizadores" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Utilizadores
                </h2>
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold">Gonçalo Fonseca</h3>
                      <p className="text-sm text-gray-500">
                        gongonsilva@gmail.com
                      </p>
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Administrador
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppNoFirebase;
