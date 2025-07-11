import React, { useState } from "react";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

// Utilizadores básicos
const initialUsers = [
  {
    id: 1,
    name: "Gonçalo Fonseca",
    email: "gongonsilva@gmail.com",
    password: "19867gsf",
    role: "super_admin",
    active: true,
  },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe: boolean = false,
  ) => {
    try {
      // Login simples
      const user = initialUsers.find(
        (u) => u.email === email && u.password === password,
      );

      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log("✅ Login successful:", user.email);
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    console.log("✅ Logout successful");
  };

  // Se não autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <LoginPage
          onLogin={handleLogin}
          showRegistration={false}
          onShowRegistration={() => {}}
        />
      </div>
    );
  }

  // Dashboard simples
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard - {currentUser?.name}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Aplicação Leirisonda
              </h2>
              <p className="text-gray-600">
                Sistema funcionando em modo básico
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-green-600">✅ Login funcional</p>
                <p className="text-sm text-green-600">✅ Autenticação ativa</p>
                <p className="text-sm text-green-600">✅ Sem erros Firebase</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
