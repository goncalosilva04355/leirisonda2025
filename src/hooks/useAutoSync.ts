import { useCallback } from "react";

export const useAutoSync = () => {
  const triggerSync = useCallback(() => {
    try {
      console.log("🔄 Auto sync triggered");
      return true;
    } catch (error) {
      console.error("Error in auto sync:", error);
      return false;
    }
  }, []);

  return {
    triggerSync,
    isSyncing: false,
    lastSyncTime: new Date(),
  };
};
