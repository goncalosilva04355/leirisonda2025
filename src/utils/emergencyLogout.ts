/**
 * Emergency Logout Utility
 * Use this to force logout when the UI is not responsive
 */

export const emergencyLogout = () => {
  console.log("🚨 EMERGENCY LOGOUT INITIATED");

  // Clear all authentication data
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAuthenticated");
  localStorage.setItem("manualLogout", "true");

  // Clear session data
  sessionStorage.removeItem("savedLoginCredentials");

  // Clear any cached data
  localStorage.removeItem("app-users");

  console.log("✅ All authentication data cleared");
  console.log("🔄 Reloading page...");

  // Force page reload to ensure clean state
  window.location.reload();
};

// Make it available globally for console access
(window as any).emergencyLogout = emergencyLogout;

console.log(
  "🆘 Emergency logout available: Type 'emergencyLogout()' in console if needed",
);
