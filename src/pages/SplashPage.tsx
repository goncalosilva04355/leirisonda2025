import React from "react";

interface SplashPageProps {
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
}

export const SplashPage: React.FC<SplashPageProps> = ({
  title = "Leirisonda",
  subtitle = "A carregar aplicação principal...",
  showProgress = true,
}) => {
  return (
    <div className="min-h-screen bg-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Logo Leirisonda */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 mx-auto border border-gray-200 max-w-sm">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F9413eeead84d4fecb67b4e817e791c86?format=webp&width=800"
              alt="Leirisonda - Furos e Captações de Água, Lda"
              className="w-full h-auto object-contain"
              style={{ maxHeight: "80px" }}
            />
          </div>
        </div>

        {/* Conteúdo da Splash */}
        <div className="text-center space-y-6">
          {/* Título */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
            <p className="text-gray-600 text-sm">
              Sistema de Gestão de Piscinas
            </p>
          </div>

          {/* Mensagem de status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">{subtitle}</p>
          </div>

          {/* Indicador de progresso */}
          {showProgress && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-400 h-2 rounded-full animate-pulse"
                  style={{
                    width: "60%",
                    animation: "progress 2s ease-in-out infinite",
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">Por favor aguarde...</p>
            </div>
          )}

          {/* Informações adicionais */}
          <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-100">
            <p>Furos e Captações de Água, Lda</p>
            <p className="mt-1">
              Versão {new Date().getFullYear()}.
              {String(new Date().getMonth() + 1).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>

      {/* Estilos CSS inline para animação */}
      <style>{`
        @keyframes progress {
          0% { width: 30%; }
          50% { width: 80%; }
          100% { width: 30%; }
        }
      `}</style>
    </div>
  );
};

export default SplashPage;
