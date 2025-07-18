// Utility to clear problematic login credentials and reset auth state
export function clearLoginIssues(): void {
  console.log("🧹 Limpando problemas de login...");

  try {
    // Clear saved credentials that might be causing auto-login issues
    sessionStorage.removeItem("savedLoginCredentials");
    localStorage.removeItem("autoLoginEnabled");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");

    // Clear Firebase auth persistence data
    const firebaseKeys = Object.keys(localStorage).filter(
      (key) =>
        key.includes("firebase") ||
        key.includes("auth") ||
        key.includes("user") ||
        key.startsWith("@firebase"),
    );

    firebaseKeys.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`🗑️ Removido: ${key}`);
    });

    // Clear any cached auth tokens
    if ("indexedDB" in window) {
      // Clear Firebase IndexedDB data
      try {
        indexedDB.deleteDatabase("firebase-auth-db");
        console.log("🗑️ Firebase auth database cleared");
      } catch (error) {
        console.warn("⚠️ Could not clear Firebase auth database:", error);
      }
    }

    console.log("✅ Problemas de login limpos - pode fazer login normalmente");
  } catch (error) {
    console.error("❌ Erro ao limpar problemas de login:", error);
  }
}

// Manual function - only run when explicitly called
export function runLoginCleanup(): void {
  console.log("🔧 Executando limpeza manual de problemas de login");
  clearLoginIssues();
}
