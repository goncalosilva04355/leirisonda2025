import { useState, useEffect } from "react";

// Simplified auto data sync - only Firebase
export function useDataMutationSync() {
  const [isEnabled, setIsEnabled] = useState(true);

  return {
    isEnabled,
    setEnabled: setIsEnabled,
    forceSyncNow: () => console.log("Firebase-only sync"),
  };
}
