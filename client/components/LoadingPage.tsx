import React from "react";
import { LoadingSpinner } from "./ui/loading-spinner";

interface LoadingPageProps {
  message?: string;
  showLogo?: boolean;
}

export const LoadingPage = React.memo<LoadingPageProps>(
  ({ message = "A inicializar sistema...", showLogo = true }) => {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-5"
        style={{
          background:
            "linear-gradient(135deg, rgb(97, 165, 214) 0%, rgb(0, 119, 132) 100%)",
          fontFamily: "Open Sans, sans-serif",
        }}
      >
        <div className="text-center text-white">
          {showLogo && (
            <div
              className="w-32 h-32 bg-white rounded-3xl mx-auto mb-8 flex items-center justify-center p-4"
              style={{
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                animation: "fadeIn 0.6s ease-out",
              }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fb4eb4a9e6feb44b09201dbb824b8737c?format=webp&width=800"
                alt="Leirisonda Logo"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          )}

          <LoadingSpinner size="lg" className="mb-6" message="" />

          <h2 className="text-2xl font-bold mb-2">Leirisonda</h2>
          <p className="text-lg opacity-90 mb-4">{message}</p>
          <div className="flex items-center justify-center space-x-1 text-sm opacity-75">
            <span>Sistema Avançado de Gestão de Obras</span>
          </div>
        </div>

        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
    );
  },
);

LoadingPage.displayName = "LoadingPage";
