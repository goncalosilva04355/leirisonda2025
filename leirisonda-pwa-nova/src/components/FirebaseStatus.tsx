import React from "react";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";

interface FirebaseStatusProps {
  isConnected: boolean;
  className?: string;
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({
  isConnected,
  className = "",
}) => {
  if (isConnected) {
    return (
      <div
        className={`flex items-center space-x-2 text-green-600 text-sm ${className}`}
      >
        <Wifi className="h-4 w-4" />
        <span>Sincronização ativa</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center space-x-2 text-yellow-600 text-sm ${className}`}
    >
      <WifiOff className="h-4 w-4" />
      <span>Modo local - dados apenas neste dispositivo</span>
    </div>
  );
};

export const FirebaseStatusBanner: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Modo Local Ativo:</strong> Os seus dados estão guardados
            localmente neste dispositivo. Para sincronizar entre dispositivos,
            contacte o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
};
