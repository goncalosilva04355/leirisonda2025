/**
 * Indicador de que o sistema está em modo estável (sem loops/refreshs)
 */

import React from "react";
import { SystemConfig } from "../config/systemConfig";

export function StableModeIndicator() {
  const isUltraStabilized =
    typeof window !== "undefined" && (window as any).ULTRA_STABILIZED;
  const isEmergencyMode =
    typeof window !== "undefined" && (window as any).EMERGENCY_MODE_ACTIVE;
  const isFirebaseReactivated =
    !SystemConfig.FORCE_EMERGENCY_MODE && SystemConfig.ENABLE_FIREBASE_DEV;
  const isStableMode =
    SystemConfig.DISABLE_AUTO_SYNC &&
    SystemConfig.DISABLE_AUTO_LOGIN &&
    SystemConfig.FORCE_EMERGENCY_MODE;

  // Sempre mostrar se Firebase foi reativado
  if (
    !isStableMode &&
    !isEmergencyMode &&
    !isUltraStabilized &&
    !isFirebaseReactivated
  )
    return null;

  const getConfig = () => {
    if (isUltraStabilized) {
      return {
        bg: "bg-purple-100 border border-purple-300 text-purple-800",
        dot: "bg-purple-500",
        text: "🛡️ Sistema Ultra-Estabilizado",
      };
    } else if (isEmergencyMode) {
      return {
        bg: "bg-red-100 border border-red-300 text-red-800",
        dot: "bg-red-500",
        text: "🚨 Modo Emergência Total",
      };
    } else {
      return {
        bg: "bg-green-100 border border-green-300 text-green-800",
        dot: "bg-green-500",
        text: "Modo Estável Ativo",
      };
    }
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
      {isUltraStabilized && (
        <div className="text-xs mt-1 opacity-75">
          Todos os sistemas problemáticos desativados
        </div>
      )}
    </div>
  );
}
