import React from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

interface FirebaseAutoMonitorProps {
  firebaseStatus: {
    status: {
      isHealthy: boolean;
      authAvailable: boolean;
      dbAvailable: boolean;
      autoFixAttempts: number;
    };
    isMonitoring: boolean;
  };
}

export const FirebaseAutoMonitor: React.FC<FirebaseAutoMonitorProps> = ({
  firebaseStatus,
}) => {
  const { status, isMonitoring } = firebaseStatus;

  if (!isMonitoring) return null;

  const getStatusColor = () => {
    if (status.isHealthy) return "text-green-500";
    if (status.autoFixAttempts > 0) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusIcon = () => {
    if (status.isHealthy) {
      return <Wifi className="h-3 w-3" />;
    } else if (status.autoFixAttempts > 0) {
      return <RefreshCw className="h-3 w-3 animate-spin" />;
    } else {
      return <WifiOff className="h-3 w-3" />;
    }
  };

  const getTooltip = () => {
    if (status.isHealthy) {
      return "Firebase: Conectado e funcional";
    } else if (status.autoFixAttempts > 0) {
      return `Firebase: Auto-correção (tentativa ${status.autoFixAttempts}/5)`;
    } else {
      return "Firebase: Problema detectado, modo local ativo";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-40 ${getStatusColor()}`}
      title={getTooltip()}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 shadow-sm border border-gray-200">
        {getStatusIcon()}
      </div>
    </div>
  );
};

export default FirebaseAutoMonitor;
