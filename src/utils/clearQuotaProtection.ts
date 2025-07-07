// Clear all quota protection flags
export const clearQuotaProtection = () => {
  // Clear localStorage flags
  localStorage.removeItem("firebase-quota-exceeded");
  localStorage.removeItem("firebase-quota-check-time");
  localStorage.removeItem("firebase-emergency-shutdown");
  localStorage.removeItem("firebase-emergency-time");
  localStorage.removeItem("firebase-sync-enabled");

  console.log("✅ All quota protection flags cleared");
  console.log("🔄 Firebase sync re-enabled");

  return true;
};

// Auto-clear on import
if (typeof window !== "undefined") {
  clearQuotaProtection();
}
