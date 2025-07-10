// Firebase Force Init - DISABLED (Firestore not available)
console.log("🚫 Firebase force init disabled - Firestore not available");

export const forceInitializeFirebase = async () => {
  console.log("🚫 Firebase force init disabled - Firestore not available");
  return false;
};

export const resetFirebase = async () => {
  console.log("🚫 Firebase reset disabled - Firestore not available");
  return false;
};

export default { forceInitializeFirebase, resetFirebase };
