import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Handle common development errors
    if (error.message?.includes("useAuth must be used within")) {
      console.warn(
        "AuthProvider context error caught, ignoring during development",
      );
      return { hasError: false, retryCount: 0 };
    }

    // Handle Firebase initialization errors
    if (
      error.message?.includes("Firebase") ||
      error.message?.includes("firebase")
    ) {
      console.warn("Firebase error caught:", error.message);
      // Try to continue without breaking the app
      return { hasError: false, retryCount: 0 };
    }

    // Handle module loading errors
    if (
      error.message?.includes("Loading chunk") ||
      error.message?.includes("ChunkLoadError")
    ) {
      console.warn("Chunk loading error, will reload");
      // Auto-reload for chunk errors
      setTimeout(() => window.location.reload(), 1000);
      return { hasError: false, retryCount: 0 };
    }

    return { hasError: true, error, retryCount: 0 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ignore specific development errors
    if (
      error.message?.includes("useAuth must be used within") ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("ChunkLoadError")
    ) {
      return;
    }

    console.error("🚨 Application Error:", error);
    console.error("🚨 Error Info:", errorInfo);

    // Store error details
    this.setState({
      errorInfo,
      retryCount: this.state.retryCount + 1,
    });

    // Auto-reload after multiple errors (possible infinite loop protection)
    if (this.state.retryCount > 3) {
      console.warn("Multiple errors detected, forcing page reload...");
      setTimeout(() => window.location.reload(), 2000);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    // Force page reload to reset state
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Oops! Algo correu mal
            </h1>
            <p className="text-gray-600 mb-6">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Recarregar
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
