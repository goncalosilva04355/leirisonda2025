// NAVIGATION STABILIZER - Para loops de redirecionamento

console.log("🔄 STABILIZER: Iniciando estabilizador de navegação...");

(function () {
  "use strict";

  let redirectHistory = [];
  let stabilizationActive = false;
  let lastStableRoute = null;

  // Detectar loops de redirecionamento
  function detectNavigationLoop() {
    const currentPath = window.location.pathname;
    const now = Date.now();

    // Adicionar à história
    redirectHistory.push({
      path: currentPath,
      timestamp: now,
    });

    // Manter apenas últimos 10 redirects
    if (redirectHistory.length > 10) {
      redirectHistory = redirectHistory.slice(-10);
    }

    // Verificar se há loop nos últimos 30 segundos
    const recentRedirects = redirectHistory.filter(
      (r) => now - r.timestamp < 30000,
    );
    const loginRedirects = recentRedirects.filter(
      (r) => r.path === "/" || r.path.includes("login"),
    );
    const dashboardRedirects = recentRedirects.filter((r) =>
      r.path.includes("dashboard"),
    );

    // Se há muitos redirects entre login e dashboard, é um loop
    if (loginRedirects.length >= 3 && dashboardRedirects.length >= 2) {
      console.warn("🔄 STABILIZER: Loop detectado!", {
        loginRedirects: loginRedirects.length,
        dashboardRedirects: dashboardRedirects.length,
        recent: recentRedirects.length,
      });
      return true;
    }

    return false;
  }

  // Estabilizar navegação
  function stabilizeNavigation() {
    if (stabilizationActive) return;

    console.log("🛑 STABILIZER: Ativando estabilização...");
    stabilizationActive = true;

    // Parar todos os redirects automáticos
    const originalLocationReplace = window.location.replace;
    const originalLocationAssign = window.location.assign;
    const originalLocationHref = Object.getOwnPropertyDescriptor(
      window.location,
      "href",
    );

    // Interceptar mudanças de localização
    Object.defineProperty(window.location, "href", {
      get: originalLocationHref.get,
      set: function (value) {
        console.log("🛑 STABILIZER: Redirect bloqueado:", value);
        // Não executar redirect durante estabilização
        return;
      },
      configurable: true,
    });

    window.location.replace = function (url) {
      console.log("🛑 STABILIZER: location.replace bloqueado:", url);
      return;
    };

    window.location.assign = function (url) {
      console.log("🛑 STABILIZER: location.assign bloqueado:", url);
      return;
    };

    // Bloquear history pushState/replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      console.log("🛑 STABILIZER: history.pushState bloqueado");
      return;
    };

    history.replaceState = function () {
      console.log("🛑 STABILIZER: history.replaceState bloqueado");
      return;
    };

    // Restaurar navegação normal após 10 segundos
    setTimeout(() => {
      console.log("🔄 STABILIZER: Restaurando navegação normal...");

      Object.defineProperty(window.location, "href", originalLocationHref);
      window.location.replace = originalLocationReplace;
      window.location.assign = originalLocationAssign;
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;

      stabilizationActive = false;

      // Tentar navegação manual para dashboard se estamos no login
      if (
        window.location.pathname === "/" ||
        window.location.pathname.includes("login")
      ) {
        addManualNavigationUI();
      }
    }, 10000);
  }

  // Adicionar interface manual de navegação
  function addManualNavigationUI() {
    // Remover UI existente
    const existing = document.getElementById("manual-nav-ui");
    if (existing) existing.remove();

    const navUI = document.createElement("div");
    navUI.id = "manual-nav-ui";
    navUI.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 3px solid #EF4444;
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        z-index: 99999;
        text-align: center;
        max-width: 400px;
      ">
        <h3 style="
          color: #EF4444;
          margin: 0 0 20px 0;
          font-size: 18px;
        ">🔄 Loop de Navegação Detectado</h3>
        
        <p style="
          color: #666;
          margin: 0 0 25px 0;
          font-size: 14px;
          line-height: 1.4;
        ">
          O sistema detectou redirects automáticos em loop.
          <br>Escolha onde quer ir:
        </p>
        
        <div style="
          display: flex;
          gap: 15px;
          flex-direction: column;
        ">
          <button id="goto-dashboard" style="
            background: #10B981;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
          ">🏠 Ir para Dashboard</button>
          
          <button id="stay-login" style="
            background: #6B7280;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
          ">🔐 Ficar no Login</button>
          
          <button id="force-refresh" style="
            background: #F59E0B;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
          ">🔄 Recarregar Página</button>
        </div>
      </div>
    `;

    document.body.appendChild(navUI);

    // Event listeners
    document.getElementById("goto-dashboard").onclick = function () {
      console.log("🏠 STABILIZER: Navegação manual para dashboard");
      navUI.remove();

      // Forçar navegação direta
      window.stop(); // Parar qualquer carregamento
      setTimeout(() => {
        window.location = "/dashboard";
      }, 100);
    };

    document.getElementById("stay-login").onclick = function () {
      console.log("🔐 STABILIZER: Ficar no login");
      navUI.remove();
    };

    document.getElementById("force-refresh").onclick = function () {
      console.log("🔄 STABILIZER: Recarregamento forçado");
      window.location.reload(true);
    };
  }

  // Desativar todos os scripts de recovery durante estabilização
  function disableOtherRecoveryScripts() {
    // Desativar dashboard-recovery.js
    window.dashboardRecoveryDisabled = true;

    // Desativar outros sistemas de redirect
    if (window.autoRedirectInterval) {
      clearInterval(window.autoRedirectInterval);
    }

    if (window.recoveryTimeout) {
      clearTimeout(window.recoveryTimeout);
    }
  }

  // Monitor de navegação
  function startNavigationMonitor() {
    let monitorCount = 0;

    const monitor = setInterval(() => {
      monitorCount++;

      const isLoop = detectNavigationLoop();

      if (isLoop && !stabilizationActive) {
        console.warn("🔄 STABILIZER: Loop detectado - ativando estabilização");
        disableOtherRecoveryScripts();
        stabilizeNavigation();
        clearInterval(monitor);
      }

      // Parar monitor após 2 minutos
      if (monitorCount > 60) {
        clearInterval(monitor);
        console.log("🔄 STABILIZER: Monitor finalizado");
      }
    }, 2000);
  }

  // Inicializar
  function init() {
    // Registar página atual
    detectNavigationLoop();

    // Iniciar monitor
    startNavigationMonitor();

    console.log("🔄 STABILIZER: Sistema de estabilização ativo");
  }

  // Aguardar DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
