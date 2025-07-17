// Diagnóstico específico para problemas de produção
export const productionDiagnostic = {
  checkEnvironment: () => {
    const isProduction = import.meta.env.PROD;
    console.log("🔍 Environment check:", {
      mode: import.meta.env.MODE,
      prod: isProduction,
      dev: import.meta.env.DEV,
      baseUrl: import.meta.env.BASE_URL,
    });
    return isProduction;
  },

  checkAssets: () => {
    const checks = {
      css: !!document.querySelector('style, link[rel="stylesheet"]'),
      scripts: document.scripts.length > 0,
      react: typeof React !== "undefined",
      reactDom: typeof ReactDOM !== "undefined",
    };

    console.log("📦 Assets check:", checks);
    return checks;
  },

  checkConsoleErrors: () => {
    const errors = [];

    // Override console.error to capture errors
    const originalError = console.error;
    console.error = (...args) => {
      errors.push({
        message: args.join(" "),
        timestamp: new Date().toISOString(),
      });
      return originalError.apply(console, args);
    };

    return {
      getErrors: () => errors,
      restoreConsole: () => {
        console.error = originalError;
      },
    };
  },

  runFullDiagnostic: () => {
    console.log("🩺 Executando diagnóstico completo de produção...");

    const results = {
      environment: productionDiagnostic.checkEnvironment(),
      assets: productionDiagnostic.checkAssets(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.log("📊 Resultado do diagnóstico:", results);
    return results;
  },
};

// Auto-executar diagnóstico em produção
if (import.meta.env.PROD) {
  // Aguardar um pouco para deixar a aplicação carregar
  setTimeout(() => {
    productionDiagnostic.runFullDiagnostic();
  }, 2000);
}
