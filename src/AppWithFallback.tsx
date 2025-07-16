import React, { useState, useEffect, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import AppSimple from "./AppSimple";
import SplashPage from "./pages/SplashPage";

// Lazy load da aplicação principal
const App = React.lazy(() => import("./App"));

const AppWithFallback: React.FC = () => {
  const [useSimpleApp, setUseSimpleApp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  console.log("🚀 AppWithFallback iniciando...", { useSimpleApp, retryCount });

  // Verificar se deve usar app simples baseado em preferência do usuário
  useEffect(() => {
    const forceSimple = localStorage.getItem("forceSimpleApp");
    const lastError = localStorage.getItem("lastAppError");

    // TEMPORARIAMENTE: Always try main app first (remove flag)
    if (forceSimple === "true") {
      console.log("🔄 Removendo flag forceSimpleApp para tentar app principal");
      localStorage.removeItem("forceSimpleApp");
    }

    if (lastError && retryCount === 0) {
      console.log(
        "⚠️ Erro anterior detectado, removendo e tentando app principal",
      );
      localStorage.removeItem("lastAppError");
    }
  }, [retryCount]);

  // Loading fallback - simple loading without SplashPage
  const LoadingFallback = () => {
    const subtitle =
      retryCount > 0
        ? `A carregar aplicação... (Tentativa ${retryCount + 1} de ${maxRetries + 1})`
        : "A carregar aplicação principal...";

    return (
      <div className="min-h-screen bg-blue-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Leirisonda</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </div>
    );
  };

  // Error boundary customizado para capturar erros da app principal
  class AppErrorBoundary extends React.Component<
    { children: React.ReactNode; onError: (error: string) => void },
    { hasError: boolean }
  > {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      console.error("🚨 App principal falhou:", error);
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
      console.error("🚨 Detalhes do erro da app principal:", {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });

      // Salvar erro no localStorage para próxima sessão
      localStorage.setItem(
        "lastAppError",
        JSON.stringify({
          message: error.message,
          timestamp: new Date().toISOString(),
        }),
      );

      this.props.onError(error.message);
    }

    render() {
      if (this.state.hasError) {
        return null; // Deixar o componente pai lidar com o erro
      }
      return this.props.children;
    }
  }

  // Se deve usar app simples ou se houve muitos erros
  if (useSimpleApp || retryCount >= maxRetries) {
    console.log("📱 Usando app simples:", {
      useSimpleApp,
      retryCount,
      maxRetries,
    });
    return <AppSimple />;
  }

  // Tentar carregar app principal
  return (
    <AppErrorBoundary
      onError={(errorMessage) => {
        console.error(
          "❌ App principal falhou, iniciando fallback...",
          errorMessage,
        );
        setError(errorMessage);

        if (retryCount < maxRetries) {
          console.log(
            `🔄 Tentando novamente... (${retryCount + 1}/${maxRetries})`,
          );
          setRetryCount((prev) => prev + 1);

          // Em vez de reload, usar app simples diretamente
          console.log("🔄 Alternando para app simples devido a erro");
          setUseSimpleApp(true);
        } else {
          console.log("🏳️ Máximo de tentativas atingido, usando app simples");
          setUseSimpleApp(true);
        }
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </AppErrorBoundary>
  );
};

export default AppWithFallback;
