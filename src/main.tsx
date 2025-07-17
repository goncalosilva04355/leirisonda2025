import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Inicializando aplicação Leirisonda...");

// Error handlers
window.addEventListener("error", (event) => {
  console.error("❌ Global error:", event.error?.message || event.message);
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
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Fallback component for production
const FallbackApp = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "400px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔧</div>
        <h1
          style={{
            fontSize: "2.5rem",
            margin: "0 0 1rem 0",
            fontWeight: "bold",
          }}
        >
          Leirisonda
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            margin: "0 0 2rem 0",
            opacity: 0.9,
          }}
        >
          Sistema de Gestão de Piscinas
        </p>
        <p style={{ marginBottom: "2rem" }}>A aplicação está a carregar...</p>
        <button
          onClick={() => window.location.reload()}
          style={{
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
          }}
        >
          Recarregar
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          }}
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Limpar Cache
        </button>
      </div>
    </div>
  );
};

// Simple App Loading Function
const loadSimpleApp = async () => {
  try {
    console.log("📱 Carregando App simplificada...");
    const { default: AppSimple } = await import("./AppSimple");
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(AppSimple));
    console.log("✅ App simplificada carregada");
  } catch (error) {
    console.error("❌ Erro ao carregar App simplificada:", error);
    // Final fallback
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(FallbackApp));
    console.log("🛡️ Fallback final renderizado");
  }
};

// Main App Loading Function
const loadApp = async () => {
  try {
    console.log("📦 Tentando carregar App principal...");

    // Check if we should use simple app for production issues
    const isProd = import.meta.env.PROD;
    const urlParams = new URLSearchParams(window.location.search);
    const forceAdvanced = urlParams.get("advanced") === "true";
    const useSimple = urlParams.get("simple") === "true";

    // For production, default to simple app unless advanced is explicitly requested
    if ((isProd && !forceAdvanced) || useSimple) {
      console.log("📱 Usando versão simplificada para produção");
      await loadSimpleApp();
      return;
    }

    console.log("🚀 Carregando App avançada...");
    const [{ default: App }, { default: ErrorBoundary }] = await Promise.all([
      import("./App"),
      import("./components/ErrorBoundary").catch(() => ({
        default: React.Fragment,
      })),
    ]);

    if (!App) {
      throw new Error("App component não carregado");
    }

    console.log("✅ Componentes avançados carregados");

    const root = ReactDOM.createRoot(rootElement);

    // Render with ErrorBoundary if available, otherwise render directly
    if (ErrorBoundary && ErrorBoundary !== React.Fragment) {
      root.render(
        React.createElement(ErrorBoundary, {}, React.createElement(App)),
      );
      console.log("✅ App avançada renderizada com ErrorBoundary");
    } else {
      root.render(React.createElement(App));
      console.log("✅ App avançada renderizada diretamente");
    }

    // Verificar se renderizou após 2 segundos
    setTimeout(() => {
      if (rootElement.children.length === 0) {
        console.warn(
          "⚠️ Root ainda vazio, fallback para versão simplificada...",
        );
        loadSimpleApp();
      }
    }, 2000);
  } catch (error) {
    console.error("❌ Erro ao carregar App principal:", error);
    console.error("Stack:", error.stack);

    // Try simple app
    await loadSimpleApp();
  }
};

// Start loading the application
loadApp().catch((error) => {
  console.error("❌ Erro final ao carregar aplicação:", error);
  loadSimpleApp();
});

// White screen detector and recovery
setTimeout(() => {
  if (rootElement.children.length === 0) {
    console.warn("🚨 TELA BRANCA DETECTADA! Ativando recuperação...");
    loadSimpleApp();
  } else {
    console.log("✅ Aplicação carregada corretamente");
  }
}, 3000);

// Additional quick check
setTimeout(() => {
  if (rootElement.children.length === 0) {
    console.warn("🚨 DETECTOR RÁPIDO: Aplicação não carregou!");
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: #0891b2; color: white; display: flex; align-items: center; justify-content: center; font-family: system-ui; text-align: center; padding: 2rem;">
        <div>
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">🔧 Leirisonda</h1>
          <p style="margin-bottom: 1rem;">Carregando aplicação...</p>
          <div style="border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }
}, 1000);
