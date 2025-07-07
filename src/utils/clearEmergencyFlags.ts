/**
 * Clear emergency logout flags to allow normal app operation
 */

export const clearEmergencyFlags = (): void => {
  try {
    console.log("🧹 Clearing emergency logout flags...");

    // Remove emergency flags
    localStorage.removeItem("emergencyLogoutActive");
    localStorage.removeItem("autoLoginDisabled");

    console.log("✅ Emergency flags cleared - app can operate normally");
  } catch (error) {
    console.error("❌ Error clearing emergency flags:", error);
  }
};

// Auto-execute to clear flags immediately
clearEmergencyFlags();

export default clearEmergencyFlags;
