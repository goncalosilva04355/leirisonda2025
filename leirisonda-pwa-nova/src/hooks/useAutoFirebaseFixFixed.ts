import { useEffect, useState, useRef, useCallback } from "react";

interface FirebaseStatus {
  isHealthy: boolean;
  authAvailable: boolean;
  dbAvailable: boolean;
  lastCheck: number;
  autoFixAttempts: number;
}

export const useAutoFirebaseFixFixed = () => {
  // Initialize state with factory function for safer initialization
  const [status, setStatus] = useState<FirebaseStatus>(() => ({
    isHealthy: false,
    authAvailable: false,
    dbAvailable: false,
    lastCheck: 0,
    autoFixAttempts: 0,
  }));

  const fixingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkFirebaseHealth = useCallback(async (): Promise<FirebaseStatus> => {
    try {
      const { getDB, getAuthService } = await import("../firebase/config");

      const authService = await getAuthService();
      const dbService = await getDB();

      const authAvailable = !!authService;
      const dbAvailable = !!dbService;
      const isHealthy = authAvailable && dbAvailable;

      return {
        isHealthy,
        authAvailable,
        dbAvailable,
        lastCheck: Date.now(),
        autoFixAttempts: status.autoFixAttempts,
      };
    } catch (error) {
      console.warn("🔍 Firebase health check failed:", error);
      return {
        isHealthy: false,
        authAvailable: false,
        dbAvailable: false,
        lastCheck: Date.now(),
        autoFixAttempts: status.autoFixAttempts,
      };
    }
  }, [status.autoFixAttempts]);

  const attemptAutoFix = useCallback(async (): Promise<boolean> => {
    if (fixingRef.current) {
      console.log("🔧 Auto-fix already in progress, skipping...");
      return false;
    }

    fixingRef.current = true;

    try {
      console.log(
        "🔧 Auto-fixing Firebase connection with AGGRESSIVE methods...",
      );

      // Try aggressive fix first (especially for iOS/Safari)
      const { AggressiveFirebaseFix } = await import(
        "../firebase/aggressiveFirebaseFix"
      );
      const aggressiveResult = await AggressiveFirebaseFix.fixFirestore();

      if (aggressiveResult.success) {
        console.log(
          `✅ AGGRESSIVE FIX SUCCESSFUL using ${aggressiveResult.method}`,
        );

        // Wait for services to stabilize
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Verify the fix worked
        const newStatus = await checkFirebaseHealth();

        setStatus((prev) => ({
          ...newStatus,
          autoFixAttempts: prev.autoFixAttempts + 1,
        }));

        // Trigger user migration check after successful Firebase fix
        if (newStatus.isHealthy) {
          console.log(
            "🔄 Triggering user migration check after Firebase fix...",
          );
          window.dispatchEvent(new CustomEvent("firebaseFixed"));
        }

        return newStatus.isHealthy;
      }

      // Fallback to original method if aggressive fix fails
      console.log("🔧 Aggressive fix failed, trying standard method...");
      const { UltimateSimpleFirebase } = await import(
        "../firebase/ultimateSimpleFirebase"
      );
      const success = await UltimateSimpleFirebase.simpleInit();

      if (success) {
        console.log("✅ Standard auto-fix successful - Firebase restored");

        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newStatus = await checkFirebaseHealth();

        setStatus((prev) => ({
          ...newStatus,
          autoFixAttempts: prev.autoFixAttempts + 1,
        }));

        return newStatus.isHealthy;
      } else {
        console.warn(
          "⚠️ All auto-fix methods failed - Firebase still not working",
        );
        setStatus((prev) => ({
          ...prev,
          autoFixAttempts: prev.autoFixAttempts + 1,
        }));
        return false;
      }
    } catch (error) {
      console.error("❌ Auto-fix error:", error);
      setStatus((prev) => ({
        ...prev,
        autoFixAttempts: prev.autoFixAttempts + 1,
      }));
      return false;
    } finally {
      fixingRef.current = false;
    }
  }, [checkFirebaseHealth]);

  const monitorAndFix = useCallback(async () => {
    try {
      // Check current health
      const currentStatus = await checkFirebaseHealth();
      setStatus(currentStatus);

      // If not healthy and we haven't tried too many times
      if (!currentStatus.isHealthy && currentStatus.autoFixAttempts < 5) {
        console.log("🚨 Firebase not healthy, attempting auto-fix...");
        await attemptAutoFix();
      } else if (currentStatus.autoFixAttempts >= 5) {
        console.log(
          "⚠️ Max auto-fix attempts reached, stopping auto-corrections",
        );
      }
    } catch (error) {
      console.error("❌ Error in monitorAndFix:", error);
    }
  }, [checkFirebaseHealth, attemptAutoFix]);

  // Start monitoring when hook is used
  useEffect(() => {
    console.log(
      "🔍 FIREBASE AUTO-MONITOR: Sistema de monitorização automática iniciado",
    );
    console.log("🔧 FIREBASE AUTO-FIX: Detecção e correção automática ativada");
    console.log("⏰ FIREBASE MONITOR: Verificação a cada 30 segundos");

    // Initial check immediately
    monitorAndFix();

    // DESATIVADO: Sistema a causar loops e refreshs constantes
    // intervalRef.current = setInterval(() => {
    //   monitorAndFix();
    // }, 30000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("🔍 FIREBASE AUTO-MONITOR: Sistema desativado");
      }
    };
  }, [monitorAndFix]);

  // Also check when user tries to login (additional trigger)
  const checkOnUserAction = useCallback(async () => {
    try {
      if (!status.isHealthy) {
        console.log("🔍 User action triggered Firebase check...");
        await monitorAndFix();
      }
    } catch (error) {
      console.error("❌ Error in checkOnUserAction:", error);
    }
  }, [status.isHealthy, monitorAndFix]);

  return {
    status,
    checkOnUserAction,
    isMonitoring: !!intervalRef.current,
  };
};
