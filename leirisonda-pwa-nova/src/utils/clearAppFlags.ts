// Clear any flags that might force the simple app
export const clearAppFlags = () => {
  console.log("🧹 Limpando flags da aplicação...");

  // Clear force simple app flag
  localStorage.removeItem("forceSimpleApp");
  localStorage.removeItem("lastAppError");

  // Clear any other problematic flags
  localStorage.removeItem("appError");
  localStorage.removeItem("useSimpleApp");

  console.log("✅ Flags da aplicação limpas");
};

// Auto-clear on import
clearAppFlags();
