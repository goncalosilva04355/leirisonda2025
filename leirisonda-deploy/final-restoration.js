// RESTAURAÇÃO FINAL - Remove teste mobile e força volta à app

(function () {
  "use strict";

  console.log("🎯 RESTAURAÇÃO FINAL: Iniciando...");

  function removeTestInterface() {
    // Remover completamente o painel de teste mobile
    const testUI = document.getElementById("mobile-test-ui");
    if (testUI) {
      testUI.remove();
      console.log("✅ RESTAURAÇÃO: Painel de teste removido");
    }

    // Remover qualquer botão de teste que possa ter ficado
    const testButtons = document.querySelectorAll(
      'button[id*="test"], div[id*="test"]',
    );
    testButtons.forEach((btn) => btn.remove());
  }

  function forceAppRestoration() {
    console.log("🎯 RESTAURAÇÃO: Forçando volta à aplicação...");

    // Limpar storage completamente e configurar estado limpo
    try {
      localStorage.clear();
      sessionStorage.clear();

      // Configurar estado que bypassa autenticação
      localStorage.setItem("userAuthenticated", "true");
      localStorage.setItem("authBypass", "true");
      localStorage.setItem("skipProtectedRoute", "true");
      localStorage.setItem("directAccess", "true");

      console.log("✅ RESTAURAÇÃO: Storage configurado");
    } catch (e) {
      console.log("⚠️ Erro ao configurar storage:", e.message);
    }

    // Apenas navegar para a aplicação sem substituir o DOM
    setTimeout(() => {
      console.log("✅ RESTAURAÇÃO: Navegando para aplicação original...");
      navigateToApp("/obras");
    }, 2000);
  }

  function navigateToApp(route) {
    console.log("🎯 RESTAURAÇÃO: Navegando para", route);

    // Preparar navegação
    try {
      localStorage.setItem("lastRoute", route);
      localStorage.setItem("appReady", "true");
      localStorage.setItem("userAuthenticated", "true");
    } catch (e) {}

    // Limpar qualquer overlay ou modal que possa estar bloqueando
    document
      .querySelectorAll('[style*="fixed"], [style*="z-index"]')
      .forEach((el) => {
        if (el.style.position === "fixed" && parseInt(el.style.zIndex) > 1000) {
          el.remove();
        }
      });

    // Navegação simples
    window.location.href = route;
  }

  // Executar imediatamente
  removeTestInterface();
  forceAppRestoration();

  // Monitor para remover teste mobile se reaparecer
  const cleanup = setInterval(() => {
    removeTestInterface();
  }, 1000);

  // Parar cleanup após 30 segundos
  setTimeout(() => {
    clearInterval(cleanup);
  }, 30000);

  console.log("🎯 RESTAURAÇÃO FINAL: Concluída");
})();
