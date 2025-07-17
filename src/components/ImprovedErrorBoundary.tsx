import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

export class ImprovedErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      "🚨 ImprovedErrorBoundary caught an error:",
      error,
      errorInfo,
    );

    this.setState({
      error,
      errorInfo,
    });

    // Check if it's a ReadableStream error and try to fix it
    if (
      error.message?.includes("ReadableStream") ||
      error.message?.includes("initializeReadableStreamDefaultReader") ||
      error.stack?.includes("firebase_firestore.js")
    ) {
      console.log("🔧 ReadableStream error detected, attempting automatic fix");

      // Try to fix the error automatically
      import("../utils/firebaseErrorFix").then(({ FirebaseErrorFix }) => {
        FirebaseErrorFix.fixReadableStreamError(error).then((fixed) => {
          if (fixed) {
            console.log("✅ ReadableStream error fixed, retrying in 2 seconds");
            setTimeout(() => {
              this.handleRetry();
            }, 2000);
          }
        });
      });
    }

    // Log error details for debugging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error("Error details:", errorDetails);

    // Store error in localStorage for debugging
    try {
      const storedErrors = JSON.parse(
        localStorage.getItem("app_errors") || "[]",
      );
      storedErrors.push(errorDetails);
      // Keep only last 10 errors
      if (storedErrors.length > 10) {
        storedErrors.splice(0, storedErrors.length - 10);
      }
      localStorage.setItem("app_errors", JSON.stringify(storedErrors));
    } catch (e) {
      console.warn("Could not store error details:", e);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      // Não forçar reload - deixar utilizador decidir
      console.log(
        "❌ Máximo de tentativas atingido - reload automático desativado",
      );
    }
  };

  handleGoHome = () => {
    window.location.assign("/");
  };

  handleClearData = () => {
    if (
      window.confirm(
        "Isto irá limpar todos os dados locais e recarregar a aplicação. Continuar?",
      )
    ) {
      try {
        localStorage.clear();
        sessionStorage.clear();
        // Clear service worker cache if available
        if ("caches" in window) {
          caches.keys().then((names) => {
            names.forEach((name) => {
              caches.delete(name);
            });
          });
        }
      } catch (e) {
        console.error("Error clearing data:", e);
      }
      window.location.reload();
    }
  };

  getErrorType = (error: Error): string => {
    if (
      error.message?.includes("ReadableStream") ||
      error.message?.includes("initializeReadableStreamDefaultReader") ||
      error.message?.includes("readableStreamGetReaderForBindings") ||
      error.stack?.includes("firebase_firestore.js")
    ) {
      return "readablestream";
    }
    if (
      error.message?.includes("quota") ||
      error.message?.includes("resource-exhausted")
    ) {
      return "quota";
    }
    if (
      error.message?.includes("network") ||
      error.message?.includes("fetch")
    ) {
      return "network";
    }
    if (
      error.message?.includes("localStorage") ||
      error.message?.includes("storage")
    ) {
      return "storage";
    }
    if (
      error.stack?.includes("firebase") ||
      error.message?.includes("firebase")
    ) {
      return "firebase";
    }
    if (error.stack?.includes("React") || error.stack?.includes("Component")) {
      return "react";
    }
    return "unknown";
  };

  getErrorMessage = (
    errorType: string,
  ): { title: string; description: string; actions: string[] } => {
    switch (errorType) {
      case "readablestream":
        return {
          title: "Erro de compatibilidade",
          description:
            "Problema de compatibilidade com o navegador detectado. A aplicação está a aplicar correções automáticas.",
          actions: ["retry"],
        };
      case "quota":
        return {
          title: "Limite de dados atingido",
          description:
            "A aplicação atingiu o limite de operações. Aguarde alguns minutos e tente novamente.",
          actions: ["retry"],
        };
      case "network":
        return {
          title: "Erro de ligação",
          description: "Verifique a sua ligação à internet e tente novamente.",
          actions: ["retry", "home"],
        };
      case "storage":
        return {
          title: "Erro de armazenamento",
          description: "O armazenamento local pode estar cheio ou corrompido.",
          actions: ["retry", "clear", "home"],
        };
      case "firebase":
        return {
          title: "Erro de sincronização",
          description:
            "Problema com a sincronização de dados. A aplicação funcionará em modo local.",
          actions: ["retry", "home"],
        };
      case "react":
        return {
          title: "Erro da interface",
          description: "Ocorreu um erro na interface da aplicação.",
          actions: ["retry", "clear", "home"],
        };
      default:
        return {
          title: "Erro inesperado",
          description: "Ocorreu um erro inesperado na aplicação.",
          actions: ["retry", "clear", "home"],
        };
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorType = this.getErrorType(this.state.error);
      const errorMessage = this.getErrorMessage(errorType);
      const canRetry = this.state.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-red-600">
                  {errorMessage.title}
                </h1>
                <p className="text-gray-600 mt-1">{errorMessage.description}</p>
              </div>
            </div>

            {this.state.retryCount > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Tentativas de recuperação: {this.state.retryCount}/
                  {this.maxRetries}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              {errorMessage.actions.includes("retry") && canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar novamente
                </button>
              )}

              {!canRetry && (
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recarregar página
                </button>
              )}

              {errorMessage.actions.includes("home") && (
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Página inicial
                </button>
              )}

              {errorMessage.actions.includes("clear") && (
                <button
                  onClick={this.handleClearData}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Limpar dados
                </button>
              )}
            </div>

            <details className="mb-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Detalhes técnicos (para suporte)
              </summary>
              <div className="mt-3 p-3 bg-gray-100 rounded-lg text-xs font-mono">
                <div className="mb-2">
                  <strong>Erro:</strong> {this.state.error.message}
                </div>
                <div className="mb-2">
                  <strong>Tipo:</strong> {errorType}
                </div>
                <div className="mb-2">
                  <strong>Timestamp:</strong> {new Date().toISOString()}
                </div>
                {this.state.error.stack && (
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1">
                      {this.state.error.stack.substring(0, 500)}
                      {this.state.error.stack.length > 500 && "..."}
                    </pre>
                  </div>
                )}
              </div>
            </details>

            <div className="text-xs text-gray-500 border-t pt-4">
              <p>
                Se o problema persistir, contacte o suporte técnico com os
                detalhes acima.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ImprovedErrorBoundary;
