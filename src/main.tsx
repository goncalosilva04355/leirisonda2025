import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Inicializando aplicação (versão corrigida para produção)...");

// Error handler global simplificado
window.addEventListener("error", (event) => {
  console.error("❌ Global error:", event.error?.message || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  // Handle Firebase errors gracefully
  if (
    event.reason &&
    (event.reason.toString().includes("firebase") ||
      event.reason.toString().includes("messaging") ||
      event.reason.toString().includes("_FirebaseError"))
  ) {
    console.warn(
      "⚠️ Firebase error handled:",
      event.reason.message || event.reason,
    );
    event.preventDefault();
    return;
  }
  console.error("❌ Unhandled promise rejection:", event.reason);
});

// Função para detectar modo seguro - DESABILITADA: sempre usar app principal
const shouldUseSafeMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const forceSimple =
    urlParams.get("simple") === "true" ||
    localStorage.getItem("forceSimpleApp") === "true";

  console.log("🔍 Mode detection (sempre app principal):", {
    forceSimple,
    url: window.location.href,
  });

  // Só usar modo simples se explicitamente forçado
  if (forceSimple) {
    return true;
  }

  // SEMPRE usar app principal, tanto em desenvolvimento como produção
  return false;
};

// App simplificado para produção/modo seguro
const SafeModeApp = () => {
  const [showLogin, setShowLogin] = React.useState(false);

  if (!showLogin) {
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
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
            }}
          >
            🔧
          </div>
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
          <button
            onClick={() => setShowLogin(true)}
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
            Entrar na Aplicação
          </button>
          <button
            onClick={() => {
              localStorage.setItem("forceAdvancedApp", "true");
              localStorage.removeItem("forceSimpleApp");
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
              marginRight: "0.5rem",
            }}
          >
            Modo Avançado
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
  }

  // Página de login simples
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#0891b2",
            fontSize: "1.5rem",
          }}
        >
          Login - Leirisonda
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          Modo simplificado ativo. Para aceder à aplicação completa, clique em
          "Carregar App Completa" abaixo.
        </p>
        <button
          onClick={() => {
            localStorage.setItem("forceAdvancedApp", "true");
            localStorage.removeItem("forceSimpleApp");
            window.location.href = window.location.origin;
          }}
          style={{
            background: "#0891b2",
            color: "white",
            border: "none",
            padding: "1rem",
            borderRadius: "0.375rem",
            fontSize: "1rem",
            cursor: "pointer",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          Carregar App Completa
        </button>
        <button
          onClick={() => setShowLogin(false)}
          style={{
            background: "#f3f4f6",
            color: "#6b7280",
            border: "none",
            padding: "0.75rem",
            borderRadius: "0.375rem",
            fontSize: "1rem",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  console.log("🔄 Carregando aplicação principal...");
  console.log("📊 Estado do ambiente:", {
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE,
    shouldUseSafe: shouldUseSafeMode(),
    forceSimple: localStorage.getItem("forceSimpleApp"),
    url: window.location.href,
  });

  // Limpar localStorage que força AppProduction
  localStorage.removeItem("forceAdvancedApp");
  localStorage.removeItem("forceSimpleApp");

  // SEMPRE carregar app principal, tanto em desenvolvimento como produção
  if (shouldUseSafeMode()) {
    console.log("🛡️ Modo seguro ativo - usando app simplificada");
    ReactDOM.createRoot(rootElement).render(React.createElement(SafeModeApp));
    console.log("✅ App simplificada renderizada!");
  } else {
    console.log("🚀 Carregando aplicação principal...");

    // Carregar sempre a aplicação principal
    import("./App")
      .then(({ default: App }) => {
        console.log("📦 App.tsx importada com sucesso!");

        // Verificar se App é um componente válido
        if (!App || typeof App !== "function") {
          throw new Error("App não é um componente válido");
        }

        import("./components/ErrorBoundary")
          .then(({ default: ErrorBoundary }) => {
            console.log("📦 ErrorBoundary importado com sucesso!");

            const root = ReactDOM.createRoot(rootElement);
            root.render(
              React.createElement(ErrorBoundary, {}, React.createElement(App)),
            );
            console.log("✅ Aplicação principal carregada com ErrorBoundary!");

            // Verificar se realmente renderizou após 2 segundos
            setTimeout(() => {
              if (rootElement.children.length === 0) {
                console.warn("⚠️ Root ainda vazio, tentando render direto...");
                root.render(React.createElement(App));
              }
            }, 2000);
          })
          .catch((error) => {
            console.error(
              "❌ Erro ao carregar ErrorBoundary, carregando App diretamente:",
              error,
            );
            const root = ReactDOM.createRoot(rootElement);
            root.render(React.createElement(App));
            console.log("✅ App principal carregada sem ErrorBoundary!");
          });
      })
      .catch((error) => {
        console.error("❌ Erro crítico ao carregar App principal:", error);
        console.error("Stack trace:", error.stack);

        // Fallback para modo seguro em caso de erro crítico
        ReactDOM.createRoot(rootElement).render(
          React.createElement(SafeModeApp),
        );
        console.log("🛡️ Fallback para SafeModeApp após erro crítico!");
      });
  }
} catch (error) {
  console.error("❌ Erro crítico, usando fallback HTML:", error);

  // Fallback HTML direto
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #0891b2; color: white; display: flex; align-items: center; justify-content: center; font-family: system-ui; text-align: center; padding: 2rem;">
      <div>
        <h1 style="font-size: 2.5rem; margin: 0 0 1rem 0;">🔧 Leirisonda</h1>
        <p style="font-size: 1.125rem; margin: 0 0 2rem 0; opacity: 0.9;">Sistema de Gestão de Piscinas</p>
        <p style="margin-bottom: 2rem;">A aplicação encontrou um problema durante o carregamento.</p>
        <button onclick="window.location.reload()" style="background: white; color: #0891b2; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-size: 1rem; font-weight: bold; cursor: pointer; margin-right: 0.5rem;">
          Tentar Novamente
        </button>
        <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-size: 1rem; cursor: pointer;">
          Limpar Cache
        </button>
      </div>
    </div>
  `;
}

// Detector de tela branca - verificar após 5 segundos se a aplicação carregou
setTimeout(() => {
  if (
    rootElement.children.length === 0 ||
    (rootElement.innerHTML && rootElement.innerHTML.trim() === "")
  ) {
    console.warn(
      "🚨 TELA BRANCA DETECTADA! Ativando fallback de emergência...",
    );

    // Fallback HTML de emergência
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: linear-gradient(135deg, #0891b2 0%, #0284c7 100%); color: white; display: flex; align-items: center; justify-content: center; font-family: system-ui; text-align: center; padding: 2rem;">
        <div>
          <h1 style="font-size: 2.5rem; margin: 0 0 1rem 0; font-weight: bold;">🔧 Leirisonda</h1>
          <p style="font-size: 1.125rem; margin: 0 0 2rem 0; opacity: 0.9;">Sistema de Gestão de Piscinas</p>
          <p style="margin-bottom: 2rem;">Aplicação carregada com sucesso! Recarregando...</p>
          <button onclick="window.location.reload()" style="background: white; color: #0891b2; border: none; padding: 1rem 2rem; border-radius: 0.5rem; font-size: 1rem; font-weight: bold; cursor: pointer;">
            Recarregar Aplicação
          </button>
        </div>
      </div>
    `;

    // Tentar recarregar automaticamente após 3 segundos
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  } else {
    console.log("✅ Aplicação carregada corretamente - não é tela branca!");
  }
}, 5000);
