// Mobile Config - DISABLED (Firestore not available)
console.log("🚫 Mobile config disabled - Firestore not available");

export const mobileApp = null;
export const mobileDb = null;
export const mobileAuth = null;

export const initializeMobileFirebase = () => {
  console.log("🚫 Mobile Firebase disabled - Firestore not available");
  return false;
};
