import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export class SyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 SyncErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo: errorInfo.componentStack,
    });

    // Check if it's a Firebase quota error
    if (
      error.message?.includes("quota") ||
      error.message?.includes("resource-exhausted")
    ) {
      console.warn("🔥 Firebase quota exceeded error caught by boundary");
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isQuotaError =
        this.state.error?.message?.includes("quota") ||
        this.state.error?.message?.includes("resource-exhausted");

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-medium text-red-800">
              {isQuotaError
                ? "Limite de sincronização atingido"
                : "Erro na sincronização"}
            </h3>
          </div>

          <p className="text-sm text-red-600 mb-3">
            {isQuotaError
              ? "O Firebase atingiu o limite de operações. A sincronização será retomada automaticamente em alguns minutos."
              : "Ocorreu um erro na sincronização dos dados. Tente novamente."}
          </p>

          {!isQuotaError && (
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          )}

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-3">
              <summary className="text-xs text-red-500 cursor-pointer">
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre className="text-xs text-red-600 mt-1 p-2 bg-red-100 rounded overflow-auto">
                {this.state.error.message}
                {this.state.errorInfo}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para reportar erros de sync programaticamente
export const useSyncErrorHandler = () => {
  const handleSyncError = (error: Error) => {
    console.error("🚨 Sync error:", error);

    if (
      error.message?.includes("quota") ||
      error.message?.includes("resource-exhausted")
    ) {
      console.warn("🔥 Firebase quota exceeded - auto-sync will pause");
      return "quota-exceeded";
    }

    return "general-error";
  };

  return { handleSyncError };
};
