// Secure Firebase Configuration using Environment Variables Only
// This removes all hardcoded API keys to prevent secrets scanning issues

// Environment variables validation function
function validateEnvVar(key: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

// Get Firebase configuration from environment variables only
export function getSecureFirebaseConfig() {
  try {
    const config = {
      apiKey: validateEnvVar(
        "VITE_FIREBASE_API_KEY",
        import.meta.env.VITE_FIREBASE_API_KEY,
      ),
      authDomain: validateEnvVar(
        "VITE_FIREBASE_AUTH_DOMAIN",
        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      ),
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
      projectId: validateEnvVar(
        "VITE_FIREBASE_PROJECT_ID",
        import.meta.env.VITE_FIREBASE_PROJECT_ID,
      ),
      storageBucket: validateEnvVar(
        "VITE_FIREBASE_STORAGE_BUCKET",
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      ),
      messagingSenderId: validateEnvVar(
        "VITE_FIREBASE_MESSAGING_SENDER_ID",
        import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      ),
      appId: validateEnvVar(
        "VITE_FIREBASE_APP_ID",
        import.meta.env.VITE_FIREBASE_APP_ID,
      ),
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
    };

    console.log("✅ Firebase: Configuration loaded from environment variables");
    console.log("🏠 Project ID:", config.projectId);
    console.log("🏠 Auth Domain:", config.authDomain);

    return config;
  } catch (error) {
    console.error("❌ Firebase: Configuration error:", error);

    // In development, provide helpful error message
    if (import.meta.env.DEV) {
      console.error(`
🔧 Firebase Setup Required:
Please create a .env file in your project root with:

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.region.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=1:your_sender_id:web:your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID

For production deployments, set these as environment variables in your hosting platform.
      `);
    }

    throw error;
  }
}

// Check if Firebase configuration is available
export function isFirebaseConfigured(): boolean {
  try {
    getSecureFirebaseConfig();
    return true;
  } catch {
    return false;
  }
}

// Export configuration getter as default
export default getSecureFirebaseConfig;
