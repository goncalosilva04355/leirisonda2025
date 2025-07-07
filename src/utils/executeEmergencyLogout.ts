/**
 * Utility to execute emergency logout immediately
 * Use this to force logout all users and revoke all sessions
 */

import { emergencyLogoutService } from "../services/emergencyLogoutService";

export const executeEmergencyLogout = async (): Promise<void> => {
  try {
    console.log("🚨 EXECUTING EMERGENCY LOGOUT - ALL USERS WILL BE LOGGED OUT");

    const result = await emergencyLogoutService.forceLogoutAllUsers();

    if (result.success) {
      console.log("✅ EMERGENCY LOGOUT SUCCESSFUL:", result.message);
      console.log("📊 Details:", result.details);

      // Log success without alert to avoid persistent popups
      console.log("✅ Emergency Logout completed successfully");

      // Force page reload
      window.location.reload();
    } else {
      console.error("❌ EMERGENCY LOGOUT FAILED:", result.message);
      console.error("📊 Details:", result.details);

      // Show error to user
      alert(
        `❌ Emergency Logout falhou: ${result.message}\n\nConsulte a consola para mais detalhes.`,
      );
    }
  } catch (error: any) {
    console.error("💥 CRITICAL ERROR IN EMERGENCY LOGOUT:", error);
    alert(`💥 Erro crítico no Emergency Logout: ${error.message}`);
  }
};

// Auto-execute emergency logout if this module is imported
// This provides immediate action for the user's problem
export const autoExecuteEmergencyLogout = (): void => {
  console.log("🔥 AUTO-EXECUTING EMERGENCY LOGOUT TO SOLVE USER ACCESS ISSUE");

  // Execute after a short delay to allow imports to complete
  setTimeout(() => {
    executeEmergencyLogout();
  }, 1000);
};

// Export for manual execution
export default executeEmergencyLogout;
