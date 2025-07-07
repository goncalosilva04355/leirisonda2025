import { useState } from "react";

// Simplified data cleanup for Firebase-only mode
export function useDataCleanup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanupStats = {
    isClean: true,
    hasData: false,
  };

  const initializeCleanApp = async () => {
    setIsLoading(true);
    try {
      console.log("App is now Firebase-only - no cleanup needed");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ensureUserSync = async () => {
    return true; // Firebase handles user sync automatically
  };

  const refreshStats = () => {
    // Stats are static since we're Firebase-only
  };

  return {
    isLoading,
    error,
    cleanupStats,
    initializeCleanApp,
    ensureUserSync,
    refreshStats,
  };
}
