/**
 * Indicador de que o sistema está em modo estável (sem loops/refreshs)
 */

import React from "react";
import { SystemConfig } from "../config/systemConfig";

export function StableModeIndicator() {
  const isStableMode =
    SystemConfig.DISABLE_AUTO_SYNC &&
    SystemConfig.DISABLE_AUTO_LOGIN &&
    SystemConfig.FORCE_EMERGENCY_MODE;

  if (!isStableMode) return null;

  return (
    <div className="fixed top-2 right-2 bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-md text-sm z-50 shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span>Modo Estável Ativo</span>
      </div>
    </div>
  );
}
