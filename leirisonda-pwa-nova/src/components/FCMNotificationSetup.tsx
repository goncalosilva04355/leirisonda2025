import React, { useEffect, useState } from "react";
import { fcmService } from "../services/fcmService";

export const FCMNotificationSetup: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        setIsLoading(true);
        const initialized = await fcmService.initialize();
        setIsInitialized(initialized);

        const permission = fcmService.getPermissionState();
        setHasPermission(permission === "granted");

        console.log("✅ FCM Setup: Inicialização completa", {
          initialized,
          hasPermission: permission === "granted",
        });
      } catch (error) {
        console.error("❌ FCM Setup: Erro na inicialização:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFCM();
  }, []);

  // Este componente não renderiza nada visível, apenas configura o FCM
  return null;
};
