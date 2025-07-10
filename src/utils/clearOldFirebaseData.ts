// Clear old Firebase configuration data

export const clearOldFirebaseData = () => {
  console.log("🧹 Clearing old Firebase data from localStorage...");

  // Keys that might contain old Firebase data
  const keysToCheck = [
    "firebase:authUser",
    "firebase:host",
    "firebase:heartbeat",
    "firebaseLocalStorageDb",
    "firebase-app-check-store",
    "firebase:previous_websocket_failure",
  ];

  let cleared = 0;

  // Check all localStorage keys
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key) {
      // Check if key contains old project ID
      if (
        key.includes("leirisonda-16f8b") ||
        key.includes("firestore") ||
        keysToCheck.includes(key) ||
        key.startsWith("firebase:")
      ) {
        console.log(`🗑️ Removing: ${key}`);
        localStorage.removeItem(key);
        cleared++;
      }
    }
  }

  // Also clear sessionStorage
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i);
    if (key) {
      if (
        key.includes("leirisonda-16f8b") ||
        key.includes("firestore") ||
        key.startsWith("firebase:")
      ) {
        console.log(`🗑️ Removing from session: ${key}`);
        sessionStorage.removeItem(key);
        cleared++;
      }
    }
  }

  console.log(`✅ Cleared ${cleared} old Firebase entries`);
  return cleared;
};

// Force refresh Firebase configuration
export const forceFirebaseRefresh = async () => {
  console.log("🔄 Force refreshing Firebase configuration...");

  try {
    // Clear old data
    clearOldFirebaseData();

    // Clear Firebase app instances
    const { getApps, deleteApp } = await import("firebase/app");
    const apps = getApps();

    for (const app of apps) {
      if (app.options.projectId === "leirisonda-16f8b") {
        console.log(`🗑️ Deleting old app: ${app.name}`);
        await deleteApp(app);
      }
    }

    // Force page reload to reinitialize everything
    console.log("🔄 Reloading page to apply changes...");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error("❌ Error refreshing Firebase:", error);
  }
};
