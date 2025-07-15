import React, { useState, useEffect } from "react";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

function AppDebug() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginError, setLoginError] = useState("");

  console.log("🔍 AppDebug renderizando...", { isAuthenticated, currentUser });

  // Verificar se há estado salvo
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      const isAuthenticatedStored = localStorage.getItem("isAuthenticated");

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

  // Renderizar conteúdo baseado na autenticação
  if (!isAuthenticated || !currentUser) {
    console.log("🔓 Mostrando página de login");
    return (
      <div className="min-h-screen bg-gray-50">
        <LoginPage
          onLogin={async (email, password, rememberMe = false) => {
            console.log("🔐 Tentativa de login:", email);

            try {
              // Simulação simples de login
              if (
                email === "gongonsilva@gmail.com" &&
                password === "19867gsf"
              ) {
                const user = {
                  id: 1,
                  name: "Gonçalo Fonseca",
                  email: email,
                  role: "super_admin",
                };

                setCurrentUser(user);
                setIsAuthenticated(true);
                localStorage.setItem("currentUser", JSON.stringify(user));
                localStorage.setItem("isAuthenticated", "true");

                console.log("✅ Login bem-sucedido");
              } else {
                console.log("❌ Credenciais inválidas");
                setLoginError("Login incorreto");
              }
            } catch (error) {
              console.error("❌ Erro no login:", error);
              setLoginError("Erro no login");
            }
          }}
          loginError={loginError}
          isLoading={false}
        />
      </div>
    );
  }

  console.log("✅ Mostrando dashboard autenticado");
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Dashboard - Debug
          </h1>
          <p className="text-gray-600 mb-4">Olá, {currentUser?.name}!</p>
          <p className="text-sm text-gray-500">
            Se consegues ver isto, a autenticação está a funcionar.
          </p>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setCurrentUser(null);
              localStorage.removeItem("currentUser");
              localStorage.removeItem("isAuthenticated");
              console.log("🚪 Logout executado");
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppDebug;
