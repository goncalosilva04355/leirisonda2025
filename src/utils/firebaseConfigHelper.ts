// Firebase Configuration Helper for Utility Files
// Centralized secure access to Firebase configuration

import { getSecureFirebaseConfig } from "../config/firebaseEnvSecure";

/**
 * Get Firebase configuration for utility functions
 * Uses environment variables and throws descriptive errors if not configured
 */
export function getUtilFirebaseConfig() {
  try {
    return getSecureFirebaseConfig();
  } catch (error) {
    console.error("❌ Firebase configuration required for utility function");
    console.error("💡 Ensure environment variables VITE_FIREBASE_* are set");
    throw new Error(
      "Firebase configuration is required. Please check your environment variables.",
    );
  }
}

/**
 * Get minimal config for REST API calls (only needs apiKey and projectId)
 */
export function getRestApiConfig() {
  const config = getUtilFirebaseConfig();
  return {
    apiKey: config.apiKey,
    projectId: config.projectId,
  };
}

/**
 * Check if Firebase configuration is available
 */
export function isConfigAvailable(): boolean {
  try {
    getUtilFirebaseConfig();
    return true;
  } catch {
    return false;
  }
}

export default getUtilFirebaseConfig;
