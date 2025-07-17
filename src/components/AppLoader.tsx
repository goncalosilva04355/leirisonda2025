import React, { useState, useEffect } from "react";

interface AppLoaderProps {
  children: React.ReactNode;
}

export default function AppLoader({ children }: AppLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 AppLoader: Inicializando aplicação...");

        // Dar tempo para todos os módulos carregarem
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Verificar se elementos críticos estão disponíveis
        if (typeof window === "undefined") {
          throw new Error("Window object não disponível");
        }

        if (!document.getElementById("root")) {
          throw new Error("Root element não encontrado");
        }

        console.log("✅ AppLoader: Verificações básicas passaram");

        // Aguardar um pouco mais para garantir que tudo está pronto
        await new Promise((resolve) => setTimeout(resolve, 200));

        console.log("✅ AppLoader: Aplicação pronta para renderizar");
        setIsLoading(false);
      } catch (error) {
        console.error("❌ AppLoader: Erro na inicialização:", error);
        setHasError(true);
        setErrorMessage(
          error instanceof Error ? error.message : "Erro desconhecido",
        );
      }
    };

    initializeApp();
  }, []);

  if (hasError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#dc2626",
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Leirisonda
          </h1>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "1rem",
            }}
          >
            Erro na inicialização da aplicação
          </p>
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.375rem",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <code
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
              }}
            >
              {errorMessage}
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #3b82f6",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <h2
            style={{
              color: "#1f2937",
              fontSize: "1.125rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            Leirisonda
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            Carregando aplicação...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
