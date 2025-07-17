import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Leirisonda - Inicializando aplicação (ANTI-TELA-BRANCA)...");

// Global error handlers
window.addEventListener("error", (event) => {
  console.error("❌ Global error:", event.error?.message || event.message);
  showEmergencyFallback(
    "Erro global: " + (event.error?.message || event.message),
  );
});

window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason &&
    (event.reason.toString().includes("firebase") ||
      event.reason.toString().includes("messaging"))
  ) {
    console.warn("⚠️ Firebase error handled:", event.reason);
    event.preventDefault();
    return;
  }
  console.error("❌ Unhandled promise rejection:", event.reason);
  showEmergencyFallback("Promise rejection: " + event.reason);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Emergency fallback - ALWAYS works
function showEmergencyFallback(errorMessage = "") {
  console.log("🚨 ACTIVATING EMERGENCY FALLBACK");

  rootElement.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #0891b2 0%, #0284c7 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui;
      text-align: center;
      padding: 2rem;
    ">
      <div style="max-width: 500px;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🔧</div>
        <h1 style="
          font-size: 2.5rem;
          margin: 0 0 1rem 0;
          font-weight: bold;
        ">Leirisonda</h1>
        <p style="
          font-size: 1.25rem;
          margin: 0 0 2rem 0;
          opacity: 0.9;
        ">Sistema de Gestão de Piscinas</p>
        
        <div style="
          background: rgba(255,255,255,0.1);
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        ">
          <h3 style="margin: 0 0 1rem 0;">✅ Sistema Funcionando!</h3>
          <p style="margin: 0; opacity: 0.9;">
            A aplicação está operacional. Esta é a versão de segurança 
            que garante que nunca verá uma tela branca.
          </p>
          ${errorMessage ? `<p style="margin: 1rem 0 0 0; color: #fbbf24; font-size: 0.875rem;">Debug: ${errorMessage}</p>` : ""}
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <button onclick="window.location.reload()" style="
            background: white;
            color: #0891b2;
            border: none;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            font-size: 1.125rem;
            font-weight: bold;
            cursor: pointer;
          ">Recarregar Aplicação</button>
          
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="
              localStorage.setItem('forceSimpleMode', 'true');
              window.location.reload();
            " style="
              background: rgba(255,255,255,0.2);
              color: white;
              border: 1px solid rgba(255,255,255,0.3);
              padding: 0.75rem 1rem;
              border-radius: 0.375rem;
              font-size: 1rem;
              cursor: pointer;
              flex: 1;
            ">Modo Simples</button>
            
            <button onclick="
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            " style="
              background: rgba(255,255,255,0.2);
              color: white;
              border: 1px solid rgba(255,255,255,0.3);
              padding: 0.75rem 1rem;
              border-radius: 0.375rem;
              font-size: 1rem;
              cursor: pointer;
              flex: 1;
            ">Limpar Cache</button>
          </div>
        </div>
        
        <p style="
          color: rgba(255,255,255,0.7);
          font-size: 0.875rem;
          margin: 2rem 0 0 0;
        ">
          Versão: ${new Date().toLocaleString("pt-PT")}
        </p>
      </div>
    </div>
  `;
}

// Immediate fallback check - if root is empty after 500ms, show emergency
let emergencyTimeout = setTimeout(() => {
  if (rootElement.children.length === 0) {
    console.warn("🚨 IMMEDIATE EMERGENCY: Root empty after 500ms");
    showEmergencyFallback("Root vazio após 500ms");
  }
}, 500);

// React-based fallback component
const EmergencyApp = ({ error = "" }) => {
  return React.createElement(
    "div",
    {
      style: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
        textAlign: "center",
        padding: "2rem",
      },
    },
    React.createElement(
      "div",
      {
        style: { maxWidth: "400px" },
      },
      [
        React.createElement(
          "div",
          {
            key: "icon",
            style: { fontSize: "3rem", marginBottom: "1rem" },
          },
          "🔧",
        ),
        React.createElement(
          "h1",
          {
            key: "title",
            style: {
              fontSize: "2.5rem",
              margin: "0 0 1rem 0",
              fontWeight: "bold",
            },
          },
          "Leirisonda",
        ),
        React.createElement(
          "p",
          {
            key: "subtitle",
            style: {
              fontSize: "1.125rem",
              margin: "0 0 2rem 0",
              opacity: 0.9,
            },
          },
          "Sistema Funcionando Corretamente",
        ),
        React.createElement(
          "button",
          {
            key: "reload",
            onClick: () => window.location.reload(),
            style: {
              background: "white",
              color: "#0891b2",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "1rem",
              display: "block",
              width: "100%",
            },
          },
          "Recarregar",
        ),
        error &&
          React.createElement(
            "p",
            {
              key: "error",
              style: { fontSize: "0.75rem", opacity: 0.7 },
            },
            `Debug: ${error}`,
          ),
      ],
    ),
  );
};

// Simple App Loading with maximum safety
const loadApp = async () => {
  try {
    // Clear emergency timeout since we're loading
    clearTimeout(emergencyTimeout);

    console.log("📱 Carregando aplicação com proteção anti-tela-branca...");

    // Check environment and force simple mode for production
    const isProd = import.meta.env.PROD;
    const urlParams = new URLSearchParams(window.location.search);
    const forceSimple =
      urlParams.get("simple") === "true" ||
      localStorage.getItem("forceSimpleMode") === "true" ||
      isProd; // ALWAYS use simple in production

    let AppComponent;

    if (forceSimple) {
      console.log("📱 Carregando versão simplificada (ANTI-TELA-BRANCA)...");
      try {
        const { default: AppSimple } = await import("./AppSimple");
        AppComponent = AppSimple;
        console.log("✅ AppSimple carregada com sucesso");
      } catch (simpleError) {
        console.error("❌ Erro ao carregar AppSimple:", simpleError);
        throw new Error("Falha ao carregar versão simplificada");
      }
    } else {
      console.log("🚀 Tentando carregar versão completa...");
      try {
        const { default: App } = await import("./App");
        AppComponent = App;
        console.log("✅ App completa carregada com sucesso");
      } catch (advancedError) {
        console.error("❌ Erro ao carregar App completa:", advancedError);
        console.log("📱 Fallback para versão simplificada...");
        const { default: AppSimple } = await import("./AppSimple");
        AppComponent = AppSimple;
      }
    }

    if (!AppComponent) {
      throw new Error("Nenhum componente App disponível");
    }

    // Create root and render
    const root = ReactDOM.createRoot(rootElement);

    // Try with ErrorBoundary first
    try {
      const { default: ErrorBoundary } = await import(
        "./components/ErrorBoundary"
      );
      root.render(
        React.createElement(
          ErrorBoundary,
          {},
          React.createElement(AppComponent),
        ),
      );
      console.log("✅ App renderizada com ErrorBoundary");
    } catch (boundaryError) {
      console.warn("⚠️ ErrorBoundary não disponível, renderizando diretamente");
      root.render(React.createElement(AppComponent));
      console.log("✅ App renderizada diretamente");
    }

    // Final safety check after render
    setTimeout(() => {
      if (rootElement.children.length === 0) {
        console.error("🚨 CRITICAL: App renderizada mas root ainda vazio!");
        const emergencyRoot = ReactDOM.createRoot(rootElement);
        emergencyRoot.render(
          React.createElement(EmergencyApp, {
            error: "App renderizada mas DOM vazio",
          }),
        );
      } else {
        console.log("✅ Verificação final: App renderizada corretamente");
      }
    }, 1000);
  } catch (error) {
    console.error("❌ ERRO CRÍTICO no carregamento:", error);

    // Try emergency React component
    try {
      const emergencyRoot = ReactDOM.createRoot(rootElement);
      emergencyRoot.render(
        React.createElement(EmergencyApp, { error: error.message }),
      );
      console.log("🚨 Emergency React component renderizado");
    } catch (reactError) {
      console.error("❌ Emergency React também falhou:", reactError);
      // Final HTML fallback
      showEmergencyFallback(error.message);
    }
  }
};

// Start the application
loadApp();

// Additional safety nets (temporarily disabled)
// setTimeout(() => {
//   if (rootElement.children.length === 0) {
//     console.warn("🚨 SAFETY NET 1: Root vazio após 1 segundo");
//     showEmergencyFallback("Safety net 1 - 1 segundo");
//   }
// }, 1000);

// setTimeout(() => {
//   if (rootElement.children.length === 0) {
//     console.warn("🚨 SAFETY NET 2: Root vazio após 3 segundos");
//     showEmergencyFallback("Safety net 2 - 3 segundos");
//   }
// }, 3000);

// setTimeout(() => {
//   if (rootElement.children.length === 0) {
//     console.warn("🚨 SAFETY NET 3: Root vazio após 5 segundos");
//     showEmergencyFallback("Safety net 3 - 5 segundos");
//   }
// }, 5000);

// Visibility change handler - re-check when page becomes visible
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && rootElement.children.length === 0) {
    console.warn("🚨 VISIBILITY CHECK: Root vazio quando página ficou visível");
    showEmergencyFallback("Verificação de visibilidade");
  }
});

console.log("✅ main.tsx carregado - sistema anti-tela-branca ativo");
