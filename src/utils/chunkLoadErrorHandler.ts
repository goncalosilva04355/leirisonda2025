/**
 * Handler para erros de carregamento de chunks dinâmicos
 * Resolve problemas de "Load failed" em produção
 */

// Retry mechanism for failed chunk loads
const retryChunkLoad = async (
  fn: () => Promise<any>,
  retries = 3,
): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (
      retries > 0 &&
      (error.message?.includes("Loading chunk") ||
        error.message?.includes("Load failed") ||
        error.message?.includes("Failed to fetch"))
    ) {
      console.warn(
        `🔄 Retry chunk load (${retries} attempts left):`,
        error.message,
      );
      // Wait a bit before retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return retryChunkLoad(fn, retries - 1);
    }
    throw error;
  }
};

// Wrap dynamic imports with retry logic
export const dynamicImport = (importFn: () => Promise<any>) => {
  return retryChunkLoad(importFn);
};

// Global chunk load error handler
window.addEventListener("error", (event) => {
  if (
    event.filename &&
    event.filename.includes(".js") &&
    (event.message.includes("Loading chunk") ||
      event.message.includes("Load failed"))
  ) {
    console.error("🚨 Chunk load error detected:", event);

    // Show user-friendly error
    const shouldReload = confirm(
      "Erro ao carregar a aplicação. Deseja recarregar a página?",
    );

    if (shouldReload) {
      // Clear cache and reload
      if ("caches" in window) {
        caches
          .keys()
          .then((names) => {
            names.forEach((name) => caches.delete(name));
          })
          .finally(() => window.location.reload());
      } else {
        window.location.reload();
      }
    }
  }
});

// Handle unhandled promise rejections from failed chunks
window.addEventListener("unhandledrejection", (event) => {
  const error = event.reason;
  if (
    error &&
    typeof error === "object" &&
    (error.message?.includes("Loading chunk") ||
      error.message?.includes("Load failed") ||
      error.message?.includes("Failed to fetch"))
  ) {
    console.error("🚨 Unhandled chunk load rejection:", error);
    event.preventDefault(); // Prevent default error handling

    // Auto-reload after chunk load failure
    setTimeout(() => {
      console.log("🔄 Auto-reloading due to chunk load failure...");
      window.location.reload();
    }, 2000);
  }
});

console.log("✅ Chunk load error handler initialized");
