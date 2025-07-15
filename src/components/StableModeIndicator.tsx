/**
 * Indicador de que o sistema está em modo estável (sem loops/refreshs)
 */

import React from "react";
import { SystemConfig } from "../config/systemConfig";

export function StableModeIndicator() {
  const isFirebaseReactivated =
    !SystemConfig.FORCE_EMERGENCY_MODE && SystemConfig.ENABLE_FIREBASE_DEV;

  // Mostrar se Firebase foi reativado
  if (!isFirebaseReactivated) return null;

  const getConfig = () => {
    return {
      bg: "bg-blue-100 border border-blue-300 text-blue-800",
      dot: "bg-blue-500",
      text: "✅ Sistema Ativo",
    };
  };

  const config = getConfig();

  return (
    <div
      className={`fixed top-2 right-2 px-3 py-1 rounded-md text-sm z-50 shadow-sm ${config.bg}`}
    >
      <div className="flex items-center space-x-2">
        <span
          className={`w-2 h-2 rounded-full animate-pulse ${config.dot}`}
        ></span>
        <span>{config.text}</span>
      </div>
      <div className="text-xs mt-1 opacity-75">
        Auto-sync ativo em dev e produção
      </div>
    </div>
  );
}
