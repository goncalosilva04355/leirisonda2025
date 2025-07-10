/**
 * Firebase Diagnostic Tool - Disabled
 * Firestore is not available, so diagnostic functions are disabled
 */

// Disabled imports to prevent Firestore errors
// import { initializeApp, getApps, deleteApp, getApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

import { isFirebaseReady } from "../firebase/configWithoutFirestore";

export interface DiagnosticResult {
  success: boolean;
  message: string;
  errors: string[];
  recommendations: string[];
}

/**
 * Firebase Diagnostic - Disabled
 */
export const runFirebaseDiagnostic = async (): Promise<DiagnosticResult> => {
  console.log("🚫 Firebase diagnostic disabled - Firestore not available");

  return {
    success: false,
    message: "Firebase diagnostic disabled - Firestore not available",
    errors: ["Firestore service not enabled"],
    recommendations: [
      "Firebase diagnostic is disabled to prevent initialization errors",
      "Use local storage for data operations",
      "Check Firebase project configuration if needed",
    ],
  };
};

/**
 * Quick Firebase check - simplified
 */
export const quickFirebaseCheck = async (): Promise<boolean> => {
  try {
    return isFirebaseReady();
  } catch (error) {
    console.warn("Firebase check failed:", error);
    return false;
  }
};

/**
 * Auto-fix Firebase issues - disabled
 */
export const autoFixFirebaseIssues = async (): Promise<DiagnosticResult> => {
  console.log("🚫 Firebase auto-fix disabled - Firestore not available");

  return {
    success: false,
    message: "Firebase auto-fix disabled - Firestore not available",
    errors: ["Auto-fix requires Firestore service"],
    recommendations: [
      "Manual configuration may be needed",
      "Check Firebase project settings",
      "Verify service availability",
    ],
  };
};

/**
 * Check if diagnostic is available
 */
export const isDiagnosticAvailable = (): boolean => {
  return false; // Always false since Firestore is disabled
};
