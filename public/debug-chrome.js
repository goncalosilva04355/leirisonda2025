// Script de debug específico para Chrome
// Detecta e reporta problemas comuns

(function () {
  console.log("🔍 Debug Chrome iniciado");

  // Verificar se é Chrome
  const isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  console.log("Chrome detectado:", isChrome);

  // Verificar HTTPS
  const isHTTPS = location.protocol === "https:";
  console.log("HTTPS:", isHTTPS);

  // Verificar Service Worker
  if ("serviceWorker" in navigator) {
    console.log("✅ Service Worker suportado");

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      console.log("Service Workers registados:", registrations.length);
      registrations.forEach((reg, index) => {
        console.log(`SW ${index}:`, reg.scope);
      });
    });
  } else {
    console.warn("❌ Service Worker não suportado");
  }

  // Verificar Console Errors
  const originalError = console.error;
  console.error = function (...args) {
    console.warn("🚨 Erro detectado:", args);
    originalError.apply(console, args);
  };

  // Verificar localStorage
  try {
    localStorage.setItem("debug-test", "ok");
    localStorage.removeItem("debug-test");
    console.log("✅ localStorage funcional");
  } catch (e) {
    console.warn("❌ localStorage com problemas:", e);
  }

  // Verificar se app carregou
  setTimeout(() => {
    const appElement = document.querySelector(
      "#root, [data-reactroot], main, .app",
    );
    if (appElement) {
      console.log("✅ App React carregada");
    } else {
      console.warn("❌ App React não encontrada");
    }
  }, 2000);

  // Log informações do navegador
  console.log("Navegador:", {
    userAgent: navigator.userAgent,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    language: navigator.language,
  });

  console.log("🔍 Debug Chrome completo");
})();
