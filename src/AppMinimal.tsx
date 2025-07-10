import React, { useState } from "react";
import { LoginPage } from "./pages/LoginPage";

function AppMinimal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    console.log("Login attempt:", email);
    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Credenciais inválidas");
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        loginError={loginError}
        isLoading={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold">App Funcional!</h1>
        <p>Login realizado com sucesso!</p>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AppMinimal;
