/**
 * Monitor de erros Firebase em tempo real
 */

import React, { useState, useEffect } from "react";

interface FirebaseError {
  timestamp: string;
  error: string;
  type: string;
  count: number;
}

export function FirebaseErrorMonitor() {
  const [errors, setErrors] = useState<FirebaseError[]>([]);
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    // Override console.error to catch Firebase errors
    const originalConsoleError = console.error;

    console.error = (...args: any[]) => {
      // Call original console.error
      originalConsoleError.apply(console, args);

      // Check if it's a Firebase error
      const errorString = args.join(" ");

      if (
        errorString.includes("getImmediate") ||
        errorString.includes("Firestore") ||
        errorString.includes("Firebase")
      ) {
        const timestamp = new Date().toLocaleTimeString();
        const newError: FirebaseError = {
          timestamp,
          error: errorString.substring(0, 100) + "...",
          type: errorString.includes("getImmediate")
            ? "getImmediate"
            : "firebase",
          count: 1,
        };

        setErrors((prev) => {
          // Check if same error already exists
          const existingIndex = prev.findIndex(
            (e) => e.error === newError.error,
          );

          if (existingIndex >= 0) {
            // Increment count
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              count: updated[existingIndex].count + 1,
              timestamp: newError.timestamp,
            };
            return updated;
          } else {
            // Add new error
            return [newError, ...prev.slice(0, 4)]; // Keep only last 5 errors
          }
        });
      }
    };

    // Cleanup
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // Auto-show monitor if there are getImmediate errors
  useEffect(() => {
    const hasGetImmediateError = errors.some((e) => e.type === "getImmediate");
    if (hasGetImmediateError && !showMonitor) {
      setShowMonitor(true);
    }
  }, [errors, showMonitor]);

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 max-w-sm">
      <button
        onClick={() => setShowMonitor(!showMonitor)}
        className={`
          px-3 py-2 rounded text-sm font-medium shadow-lg
          ${
            errors.some((e) => e.type === "getImmediate")
              ? "bg-red-500 text-white animate-pulse"
              : "bg-yellow-500 text-white"
          }
        `}
      >
        🚨 Erros: {errors.reduce((sum, e) => sum + e.count, 0)}
      </button>

      {showMonitor && (
        <div className="mt-2 bg-white border border-red-400 rounded-lg p-3 shadow-xl max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-red-600">Firebase Errors</div>
            <button
              onClick={() => setErrors([])}
              className="text-xs text-gray-500 underline"
            >
              Limpar
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {errors.map((error, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`font-medium ${
                      error.type === "getImmediate"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {error.type === "getImmediate"
                      ? "🚨 getImmediate"
                      : "⚠️ Firebase"}
                  </div>
                  <div className="text-gray-500">
                    {error.count > 1 ? `${error.count}x` : ""} {error.timestamp}
                  </div>
                </div>
                <div className="text-gray-700 mt-1">{error.error}</div>
              </div>
            ))}
          </div>

          {errors.some((e) => e.type === "getImmediate") && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded p-2">
              <div className="font-medium text-red-800 text-xs">
                🔧 Solução:
              </div>
              <div className="text-red-700 text-xs mt-1">
                • Aguardar inicialização completa
                <br />
                • Recarregar página se persistir
                <br />• Verificar conexão de internet
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
