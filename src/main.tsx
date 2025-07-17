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

// Função para detectar modo seguro
const shouldUseSafeMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const forceSimple =
    urlParams.get("simple") === "true" ||
    localStorage.getItem("forceSimpleApp") === "true";
  const forceAdvanced =
    urlParams.get("advanced") === "true" ||
    localStorage.getItem("forceAdvancedApp") === "true";
  const isProduction = import.meta.env.PROD;

  console.log("🔍 Mode detection:", {
    forceSimple,
    forceAdvanced,
    isProduction,
    url: window.location.href,
  });

  // Se está forçando modo avançado, usar app completa
  if (forceAdvanced) {
    return false;
  }

  // Se está forçando modo simples, usar modo seguro
  if (forceSimple) {
    return true;
  }

  // Em produção, usar AppProduction por padrão se não foi especificado
  if (isProduction) {
    return true; // Usar modo produção simplificado por padrão
  }

  return false; // Desenvolvimento usa app completa
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
  console.log("🔄 Verificando modo de funcionamento...");
  console.log("📊 Estado do ambiente:", {
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE,
    shouldUseSafe: shouldUseSafeMode(),
    forceSimple: localStorage.getItem("forceSimpleApp"),
    forceAdvanced: localStorage.getItem("forceAdvancedApp"),
    url: window.location.href,
  });

  // Se estiver em modo seguro ou produção, decidir qual app usar
  if (shouldUseSafeMode()) {
    const isProduction = import.meta.env.PROD;
    const forceSimple = localStorage.getItem("forceSimpleApp") === "true";

    console.log("✅ Usando modo seguro/produção:", {
      isProduction,
      forceSimple,
    });

    if (isProduction && !forceSimple) {
      console.log("🏭 Modo produção ativo - usando AppProduction");

      // Carregar AppProduction
      import("./AppProduction")
        .then(({ default: AppProduction }) => {
          console.log("📦 AppProduction importada com sucesso!");
          console.log("🎯 Tipo do componente:", typeof AppProduction);

          const root = ReactDOM.createRoot(rootElement);
          console.log("🌳 Root criada:", root);

          const element = React.createElement(AppProduction);
          console.log("⚛️ Elemento React criado:", element);

          root.render(element);
          console.log("✅ AppProduction renderizada com sucesso!");

          // Verificar se realmente renderizou
          setTimeout(() => {
            const hasContent = rootElement.children.length > 0;
            console.log("🔍 Verificação pós-render:", {
              hasChildren: hasContent,
              innerHTML: rootElement.innerHTML.substring(0, 200) + "...",
            });
          }, 1000);
        })
        .catch((error) => {
          console.error(
            "❌ Erro ao carregar AppProduction, usando fallback:",
            error,
          );
          console.error("❌ Stack trace:", error.stack);
          console.error("❌ Detalhes do erro:", {
            message: error.message,
            name: error.name,
            cause: error.cause,
          });

          console.log("🛡️ Renderizando SafeModeApp como fallback...");
          ReactDOM.createRoot(rootElement).render(
            React.createElement(SafeModeApp),
          );
          console.log("✅ SafeModeApp renderizada após erro!");
        });
    } else {
      console.log("🛡️ Modo seguro ativo - usando app simplificada");
      ReactDOM.createRoot(rootElement).render(React.createElement(SafeModeApp));
      console.log("✅ App simplificada renderizada!");
    }
  } else {
    console.log("🚀 Tentando carregar app completa...");

    // Tentar carregar app completa
    import("./App")
      .then(({ default: App }) => {
        import("./components/ErrorBoundary")
          .then(({ default: ErrorBoundary }) => {
            ReactDOM.createRoot(rootElement).render(
              React.createElement(ErrorBoundary, {}, React.createElement(App)),
            );
            console.log("✅ App completa carregada com sucesso!");
          })
          .catch((error) => {
            console.error(
              "❌ Erro ao carregar ErrorBoundary, usando app produção:",
              error,
            );
            import("./AppProduction")
              .then(({ default: AppProduction }) => {
                ReactDOM.createRoot(rootElement).render(
                  React.createElement(AppProduction),
                );
              })
              .catch(() => {
                localStorage.setItem("forceSimpleApp", "true");
                window.location.reload();
              });
          });
      })
      .catch((error) => {
        console.error(
          "❌ Erro ao carregar App principal, usando app produção:",
          error,
        );
        import("./AppProduction")
          .then(({ default: AppProduction }) => {
            ReactDOM.createRoot(rootElement).render(
              React.createElement(AppProduction),
            );
          })
          .catch(() => {
            localStorage.setItem("forceSimpleApp", "true");
            window.location.reload();
          });
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
