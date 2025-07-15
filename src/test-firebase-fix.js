// Test to verify Firebase initialization fix
console.log("🧪 Testing Firebase initialization fix...");

// Check environment variables
console.log("Environment variables:");
console.log("- DEV:", import.meta.env.DEV);
console.log("- NETLIFY:", import.meta.env.NETLIFY);
console.log("- VITE_IS_NETLIFY:", import.meta.env.VITE_IS_NETLIFY);
console.log("- VITE_FORCE_FIREBASE:", import.meta.env.VITE_FORCE_FIREBASE);

// Test Firebase imports
try {
  const { isFirebaseReady, isFirestoreReady } = await import(
    "./firebase/leiriaConfig"
  );
  console.log("Firebase status:");
  console.log("- Firebase ready:", isFirebaseReady());
  console.log("- Firestore ready:", isFirestoreReady());

  if (!isFirebaseReady() && !isFirestoreReady()) {
    console.log("✅ SUCCESS: Firebase correctly disabled in development mode");
  } else {
    console.log("⚠️ WARNING: Firebase is active in development mode");
  }
} catch (error) {
  console.error("❌ Error testing Firebase:", error);
}
