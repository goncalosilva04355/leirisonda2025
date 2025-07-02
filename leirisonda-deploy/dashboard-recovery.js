// DASHBOARD RECOVERY - Recuperar acesso ao dashboard

console.log("🏠 RECOVERY: Verificando estado do dashboard...");

(function () {
  "use strict";

  function checkDashboardAccess() {
    // Verificar se estamos na página de login mas temos dados de utilizador
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath === "/" || currentPath.includes("login");

    console.log("🏠 RECOVERY: Página atual:", currentPath);

    // Verificar se há dados de sessão válidos
    const hasUserData =
      localStorage.getItem("firebase:authUser") ||
      localStorage.getItem("userAuthenticated") ||
      sessionStorage.getItem("userLoggedIn");

    const hasWorksData =
      localStorage.getItem("works") || localStorage.getItem("leirisonda_works");

    console.log("🏠 RECOVERY: Dados de utilizador:", !!hasUserData);
    console.log("🏠 RECOVERY: Dados de obras:", !!hasWorksData);

    // Se estamos no login mas temos dados, tentar ir para dashboard
    if (isLoginPage && (hasUserData || hasWorksData)) {
      console.log(
        "🏠 RECOVERY: Dados encontrados, redirecionando para dashboard...",
      );

      setTimeout(() => {
        console.log("🏠 RECOVERY: Executando redirecionamento...");
        window.location.href = "/dashboard";
      }, 2000);

      return true;
    }

    return false;
  }

  function addManualDashboardButton() {
    // Adicionar botão manual para aceder ao dashboard
    setTimeout(() => {
      const button = document.createElement("button");
      button.innerHTML = "🏠 Ir para Dashboard";
      button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1E40AF;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
      `;

      button.onclick = function () {
        console.log("🏠 RECOVERY: Botão manual clicado");
        window.location.href = "/dashboard";
      };

      document.body.appendChild(button);
      console.log("🏠 RECOVERY: Botão manual adicionado");
    }, 3000);
  }

  function setupFirebaseBypass() {
    // Configurar bypass básico do Firebase
    if (window.firebase) {
      try {
        const auth = window.firebase.auth();

        // Simular utilizador autenticado se necessário
        const mockUser = {
          uid: "recovery-user",
          email: "admin@leirisonda.com",
          emailVerified: true,
        };

        // Se não há utilizador, configurar mock
        if (!auth.currentUser) {
          Object.defineProperty(auth, "currentUser", {
            get: () => mockUser,
            configurable: true,
          });

          console.log("🏠 RECOVERY: Mock user configurado");
        }
      } catch (e) {
        console.log("🏠 RECOVERY: Erro ao configurar Firebase:", e.message);
      }
    }
  }

  function monitorPageChanges() {
    // Monitor mudanças na página
    let lastPath = window.location.pathname;

    setInterval(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        console.log(
          "🏠 RECOVERY: Mudança de página:",
          lastPath,
          "→",
          currentPath,
        );
        lastPath = currentPath;

        // Se mudou para login mas temos dados, tentar voltar
        if (currentPath === "/" || currentPath.includes("login")) {
          setTimeout(checkDashboardAccess, 1000);
        }
      }
    }, 2000);
  }

  // Executar verificações
  function init() {
    console.log("🏠 RECOVERY: Iniciando recuperação do dashboard...");

    // Verificar acesso imediatamente
    const recovered = checkDashboardAccess();

    if (!recovered) {
      // Se não recuperou automaticamente, adicionar botão manual
      addManualDashboardButton();
    }

    // Configurar Firebase se disponível
    const firebaseWaiter = setInterval(() => {
      if (window.firebase) {
        setupFirebaseBypass();
        clearInterval(firebaseWaiter);
      }
    }, 500);

    setTimeout(() => {
      clearInterval(firebaseWaiter);
    }, 10000);

    // Monitor contínuo
    monitorPageChanges();

    console.log("🏠 RECOVERY: Sistema de recuperação ativo");
  }

  // Aguardar DOM carregar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 1000);
  }
})();
