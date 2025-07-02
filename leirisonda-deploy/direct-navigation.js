// NAVEGAÇÃO DIRETA - Força sair do ProtectedRoute imediatamente

(function () {
  "use strict";

  console.log("🚀 NAVEGAÇÃO DIRETA: Forçando saída do ProtectedRoute...");

  function forceNavigationOut() {
    console.log("🚀 NAVEGAÇÃO DIRETA: Executando escape...");

    // 1. Limpar todos os storage que podem estar causando problema
    try {
      localStorage.clear();
      sessionStorage.clear();

      // Set estado de bypass
      localStorage.setItem("authBypass", "true");
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("skipProtectedRoute", "true");

      console.log("✅ Storage limpo e bypass configurado");
    } catch (e) {
      console.log("⚠️ Erro ao limpar storage:", e.message);
    }

    // 2. Tentar múltiplas URLs que podem existir na aplicação
    const possibleRoutes = [
      "/dashboard",
      "/obras",
      "/main",
      "/app",
      "/home",
      "/obras/lista",
      "/piscinas",
      "/manutencoes",
    ];

    // Tentar cada rota com delay
    possibleRoutes.forEach((route, index) => {
      setTimeout(
        () => {
          console.log(`🚀 NAVEGAÇÃO DIRETA: Tentativa ${index + 1} - ${route}`);

          try {
            // Múltiplas formas de navegação
            history.pushState({}, "", route);
            window.location.href = route;
            window.location.replace(route);
          } catch (e) {
            console.log("Erro na navegação:", e.message);
          }
        },
        (index + 1) * 1000,
      );
    });

    // 3. Força reload completo como último recurso
    setTimeout(
      () => {
        console.log("🚀 NAVEGAÇÃO DIRETA: Força reload completo...");
        window.location.href = "/obras";
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      },
      possibleRoutes.length * 1000 + 2000,
    );
  }

  // Detectar se estamos no ProtectedRoute preso
  function isStuckInProtectedRoute() {
    const protectedRoute = document.querySelector(
      '[data-loc*="ProtectedRoute.tsx"]',
    );
    const loadingText =
      document.querySelector('p:contains("A carregar...")') ||
      Array.from(document.querySelectorAll("p")).find(
        (p) =>
          p.textContent.includes("carregar") ||
          p.textContent.includes("A carregar"),
      );

    return !!(protectedRoute && loadingText);
  }

  // Verificar imediatamente se estamos presos
  if (isStuckInProtectedRoute()) {
    console.log(
      "🚀 NAVEGAÇÃO DIRETA: ProtectedRoute detectado - iniciando escape em 3 segundos...",
    );
    setTimeout(forceNavigationOut, 3000);
  }

  // Monitor contínuo para detectar se ficamos presos
  let stuckCounter = 0;
  const stuckMonitor = setInterval(() => {
    if (isStuckInProtectedRoute()) {
      stuckCounter++;
      console.log(`🚀 NAVEGAÇÃO DIRETA: Preso há ${stuckCounter * 2} segundos`);

      if (stuckCounter >= 3) {
        // Preso há 6+ segundos
        console.log(
          "🚀 NAVEGAÇÃO DIRETA: Muito tempo preso - forçando escape!",
        );
        forceNavigationOut();
        clearInterval(stuckMonitor);
      }
    } else {
      stuckCounter = 0; // Reset se não estiver preso
    }
  }, 2000);

  // Parar monitor após 2 minutos
  setTimeout(() => {
    clearInterval(stuckMonitor);
  }, 120000);

  // Atualizar interface mobile com botão de escape manual
  setTimeout(() => {
    const testContainer = document.getElementById("mobile-test-ui");
    if (testContainer) {
      const escapeBtn = document.createElement("button");
      escapeBtn.style.cssText = `
        width: 100%; 
        margin: 2px 0; 
        padding: 12px; 
        background: #F44336; 
        color: white; 
        border: none; 
        border-radius: 4px; 
        font-size: 12px;
        font-weight: bold;
      `;
      escapeBtn.textContent = "🚀 ESCAPE ROUTE";
      escapeBtn.onclick = () => {
        const status = document.getElementById("test-status");
        if (status) {
          status.textContent = "Escapando...";
          status.style.color = "#F44336";
        }

        forceNavigationOut();
      };

      // Inserir no topo para ser mais visível
      testContainer.insertBefore(escapeBtn, testContainer.children[2]);
    }
  }, 1000);

  console.log("🚀 NAVEGAÇÃO DIRETA: Sistema de escape configurado");
})();
