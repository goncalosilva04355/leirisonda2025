/**
 * Indicador de que o sistema está em modo estável (sem loops/refreshs)
 */

import React from "react";
import { SystemConfig } from "../config/systemConfig";

export function StableModeIndicator() {
  const isEmergencyMode =
    typeof window !== "undefined" && (window as any).EMERGENCY_MODE_ACTIVE;
  const isStableMode =
    SystemConfig.DISABLE_AUTO_SYNC &&
    SystemConfig.DISABLE_AUTO_LOGIN &&
    SystemConfig.FORCE_EMERGENCY_MODE;

  if (!isStableMode && !isEmergencyMode) return null;

  return (
    <div
      className={`fixed top-2 right-2 px-3 py-1 rounded-md text-sm z-50 shadow-sm ${
        isEmergencyMode
          ? "bg-red-100 border border-red-300 text-red-800"
          : "bg-green-100 border border-green-300 text-green-800"
      }`}
    >
      <div className="flex items-center space-x-2">
        <span
          className={`w-2 h-2 rounded-full animate-pulse ${
            isEmergencyMode ? "bg-red-500" : "bg-green-500"
          }`}
        ></span>
        <span>
          {isEmergencyMode ? "🚨 Modo Emergência Total" : "Modo Estável Ativo"}
        </span>
      </div>
    </div>
  );
}
