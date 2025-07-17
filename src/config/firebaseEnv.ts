// Secure Firebase Configuration using Environment Variables Only
import {
  getSecureFirebaseConfig,
  isFirebaseConfigured,
} from "./firebaseEnvSecure";

// Get the secure Firebase configuration
export const LEIRIA_FIREBASE_CONFIG = (() => {
  try {
    return getSecureFirebaseConfig();
  } catch (error) {
    console.error("❌ Failed to load Firebase configuration:", error);
    throw new Error(
      "Firebase configuration is required. Please check your environment variables.",
    );
  }
})();

// Function to get Firebase configuration
export function getFirebaseConfig() {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase configuration is not properly set up. Please check your environment variables.",
    );
  }

  const config = LEIRIA_FIREBASE_CONFIG;
  const isNetlifyBuild =
    import.meta.env.NETLIFY === "true" ||
    import.meta.env.VITE_IS_NETLIFY === "true";

  console.log("🔍 Firebase Environment Detection:");
  console.log("  - Environment:", isNetlifyBuild ? "Netlify" : "Local/Other");
  console.log("  - Project ID:", config.projectId);
  console.log("  - Auth Domain:", config.authDomain);
  console.log("✅ Firebase: Configuration loaded from environment variables");

  return config;
}

// Exportação padrão
export default LEIRIA_FIREBASE_CONFIG;
