// ROUTE BYPASS - Força ProtectedRoute a passar da tela de loading

(function () {
  "use strict";

  console.log("🛣️ ROUTE BYPASS: Iniciando...");

  function bypassProtectedRoute() {
    // Detectar se estamos no ProtectedRoute loading
    const protectedRoute = document.querySelector(
      '[data-loc*="ProtectedRoute.tsx"]',
    );
    const loadingText =
      document.querySelector('p:contains("A carregar...")') ||
      document.querySelector('p:contains("carregar")');

    if (protectedRoute || loadingText) {
      console.log(
        "🛣️ ROUTE BYPASS: ProtectedRoute detectado - forçando bypass...",
      );

      // Múltiplas estratégias para sair do loading

      // 1. Força navegação direta para dashboard/home
      setTimeout(() => {
        if (window.location.pathname === "/") {
          console.log(
            "🛣️ ROUTE BYPASS: Tentativa 1 - navegação para dashboard",
          );
          window.location.href = "/dashboard";
        }
      }, 2000);

      // 2. Força navegação para obras
      setTimeout(() => {
        if (
          window.location.pathname === "/" ||
          window.location.pathname === "/dashboard"
        ) {
          console.log("🛣️ ROUTE BYPASS: Tentativa 2 - navegação para obras");
          window.location.href = "/obras";
        }
      }, 4000);

      // 3. Modifica o DOM diretamente
      setTimeout(() => {
        if (loadingText && loadingText.parentElement) {
          console.log(
            "🛣️ ROUTE BYPASS: Tentativa 3 - modificando DOM diretamente",
          );
          loadingText.parentElement.innerHTML = `
            <div style="text-align: center; padding: 20px;">
              <h2>✅ Autenticação Bypassed</h2>
              <p>Redirecionando para aplicação...</p>
            </div>
          `;

          setTimeout(() => {
            window.location.href = "/obras";
          }, 1000);
        }
      }, 6000);

      return true;
    }

    return false;
  }

  // Verificar imediatamente
  if (bypassProtectedRoute()) {
    console.log(
      "🛣️ ROUTE BYPASS: ProtectedRoute detectado na verificação inicial",
    );
  }

  // Monitor contínuo
  const routeMonitor = setInterval(() => {
    if (bypassProtectedRoute()) {
      clearInterval(routeMonitor);
    }
  }, 1000);

  // Parar monitor após 30 segundos
  setTimeout(() => {
    clearInterval(routeMonitor);
  }, 30000);

  // Observer para mudanças no DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.querySelector &&
            node.querySelector('[data-loc*="ProtectedRoute.tsx"]')
          ) {
            console.log("🛣️ ROUTE BYPASS: ProtectedRoute adicionado ao DOM");
            setTimeout(bypassProtectedRoute, 500);
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Interface mobile - adicionar botão de bypass manual
  setTimeout(() => {
    const testContainer = document.getElementById("mobile-test-ui");
    if (testContainer) {
      const routeBtn = document.createElement("button");
      routeBtn.style.cssText = `
        width: 100%; 
        margin: 2px 0; 
        padding: 8px; 
        background: #673AB7; 
        color: white; 
        border: none; 
        border-radius: 4px; 
        font-size: 11px;
      `;
      routeBtn.textContent = "🛣️ BYPASS LOADING";
      routeBtn.onclick = () => {
        console.log("🛣️ ROUTE BYPASS: Bypass manual ativado");

        const status = document.getElementById("test-status");
        if (status) {
          status.textContent = "Bypassing loading...";
          status.style.color = "#673AB7";
        }

        // Tentar múltiplas rotas
        const routes = ["/dashboard", "/obras", "/main", "/app"];
        routes.forEach((route, index) => {
          setTimeout(
            () => {
              console.log("🛣️ ROUTE BYPASS: Tentando rota:", route);
              window.location.href = route;
            },
            (index + 1) * 1000,
          );
        });
      };

      testContainer.appendChild(routeBtn);
    }
  }, 2000);

  console.log("🛣️ ROUTE BYPASS: Sistema configurado");
})();
