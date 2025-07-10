// Simple Config - DISABLED (Firestore not available)
console.log("🚫 Simple config disabled - Firestore not available");

export const app = null;
export const db = null;
export const auth = null;

export const getFirebaseApp = () => {
  console.log("🚫 Firebase app disabled - Firestore not available");
  return null;
};
