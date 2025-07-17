import React, { useState, useEffect } from "react";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

console.log("🚀 AppSimple carregando...");

// Dados de utilizador padrão
const defaultUser = {
  id: 1,
  name: "Gonçalo Fonseca",
  email: "gongonsilva@gmail.com",
  password: "19867gsf",
  role: "super_admin",
  permissions: {
    obras: { view: true, create: true, edit: true, delete: true },
    manutencoes: { view: true, create: true, edit: true, delete: true },
    piscinas: { view: true, create: true, edit: true, delete: true },
    utilizadores: { view: true, create: true, edit: true, delete: true },
    relatorios: { view: true, create: true, edit: true, delete: true },
    clientes: { view: true, create: true, edit: true, delete: true },
  },
  active: true,
  createdAt: "2024-01-01",
};

export default function AppSimple() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  console.log("🔄 AppSimple renderizando...", { isAuthenticated });

  // Se não estiver autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <LoginPage
          onLogin={(user) => {
            console.log("✅ Login bem-sucedido:", user);
            setCurrentUser(user);
            setIsAuthenticated(true);
          }}
        />
      </div>
    );
  }

  // Se estiver autenticado, mostrar dashboard simples
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0891b2",
        color: "white",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>🔧 Leirisonda - Dashboard</h1>
      <p>Bem-vindo, {currentUser?.name || "Utilizador"}!</p>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setCurrentUser(null);
          }}
          style={{
            padding: "0.5rem 1rem",
            background: "white",
            color: "#0891b2",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "1rem",
          }}
        >
          Sair
        </button>

        <button
          onClick={() => alert("Dashboard completo em desenvolvimento")}
          style={{
            padding: "0.5rem 1rem",
            background: "rgba(255,255,255,0.2)",
            color: "white",
            border: "1px solid white",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Funcionalidades
        </button>
      </div>

      <div style={{ marginTop: "2rem", fontSize: "0.9rem", opacity: 0.8 }}>
        <p>Aplicação em produção - {new Date().toLocaleString("pt-PT")}</p>
        <p>Versão simplificada para garantir estabilidade</p>
      </div>
    </div>
  );
}
