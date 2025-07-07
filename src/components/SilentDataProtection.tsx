import React, { useEffect } from "react";
import { enhancedDataProtection } from "../utils/dataProtectionEnhanced";
import { APP_SETTINGS } from "../config/appSettings";

// Componente invisível que roda em segundo plano para proteger dados
export const SilentDataProtection: React.FC = () => {
  useEffect(() => {
    try {
      if (!APP_SETTINGS.dataProtection.enabled) {
        return;
      }

      console.log("🛡️ Silent Data Protection initialized");

      // Proteção está ativa através do enhancedDataProtection
      // que já foi inicializado automaticamente

      // Verificar status periodicamente (apenas log, sem UI)
      const statusCheck = setInterval(() => {
        const status = enhancedDataProtection.getProtectionStatus();
        if (status.protected) {
          console.log("🛡️ Data protection active:", status.criticalData);
        }
      }, 60000); // A cada minuto

      // Backup preventivo a cada 5 minutos
      const preventiveBackup = setInterval(() => {
        enhancedDataProtection.createEmergencyBackup("preventive");
      }, 300000); // 5 minutos

      return () => {
        clearInterval(statusCheck);
        clearInterval(preventiveBackup);
      };
    } catch (error) {
      console.warn("🛡️ Data Protection initialization error:", error);
    }
  }, []);

  // Componente invisível - não renderiza nada
  return null;
};
