import React from "react";
import { Wifi, WifiOff } from "lucide-react";

interface FirebaseStatusProps {
  isConnected: boolean;
  onReconnect?: () => void;
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({
  isConnected,
  onReconnect,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <Wifi className="h-4 w-4 text-green-600" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-600" />
      )}
      <span className="text-sm">
        {isConnected ? "Firebase Conectado" : "Firebase Desconectado"}
      </span>
      {!isConnected && onReconnect && (
        <button
          onClick={onReconnect}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Reconectar
        </button>
      )}
    </div>
  );
};

export const FirebaseStatusBanner: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <FirebaseStatus isConnected={true} />
    </div>
  );
};
