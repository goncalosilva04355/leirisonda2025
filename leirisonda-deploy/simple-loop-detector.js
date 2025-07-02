// SIMPLE LOOP DETECTOR - Detector simples de loops sem interceptação

console.log("🔄 LOOP DETECTOR: Iniciando detector simples...");

(function () {
  "use strict";

  let pageVisits = [];
  let uiShown = false;

  // Registrar visita à página
  function registerPageVisit() {
    const currentPath = window.location.pathname;
    const now = Date.now();

    pageVisits.push({
      path: currentPath,
      timestamp: now,
      url: window.location.href,
    });

    // Manter apenas últimas 20 visitas
    if (pageVisits.length > 20) {
      pageVisits = pageVisits.slice(-10);
    }

    console.log("🔄 LOOP DETECTOR: Página registrada:", currentPath);
  }

  // Verificar se há loop
  function checkForLoop() {
    if (uiShown) return false;

    const now = Date.now();
    const recent = pageVisits.filter((v) => now - v.timestamp < 30000); // últimos 30 segundos

    if (recent.length < 4) return false;

    // Contar visitas por tipo de página
    const loginVisits = recent.filter(
      (v) => v.path === "/" || v.path.includes("login"),
    );
    const dashboardVisits = recent.filter((v) => v.path.includes("dashboard"));

    console.log("🔄 LOOP DETECTOR: Visitas recentes:", {
      total: recent.length,
      login: loginVisits.length,
      dashboard: dashboardVisits.length,
    });

    // Se há muitas alternâncias entre login e dashboard
    if (
      loginVisits.length >= 2 &&
      dashboardVisits.length >= 2 &&
      recent.length >= 5
    ) {
      return true;
    }

    // Se a mesma página foi visitada muitas vezes
    const samePage = recent.filter((v) => v.path === window.location.pathname);
    if (samePage.length >= 4) {
      return true;
    }

    return false;
  }

  // Mostrar interface de escolha manual
  function showManualNavigationUI() {
    if (uiShown) return;
    uiShown = true;

    console.log("🛑 LOOP DETECTOR: Mostrando interface manual");

    // Criar overlay
    const overlay = document.createElement("div");
    overlay.id = "loop-detector-ui";
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      ">
        <div style="
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        ">
          <div style="
            font-size: 48px;
            margin-bottom: 20px;
          ">🔄</div>
          
          <h2 style="
            color: #DC2626;
            margin: 0 0 15px 0;
            font-size: 24px;
          ">Loop de Navegação Detectado</h2>
          
          <p style="
            color: #6B7280;
            margin: 0 0 30px 0;
            font-size: 16px;
            line-height: 1.5;
          ">
            O sistema detectou redirecionamentos automáticos em loop entre páginas.
            <br><br>
            Escolha onde quer ir:
          </p>
          
          <div style="
            display: flex;
            flex-direction: column;
            gap: 15px;
          ">
            <button onclick="goToDashboard()" style="
              background: #10B981;
              color: white;
              border: none;
              padding: 15px 25px;
              border-radius: 12px;
              font-size: 18px;
              font-weight: bold;
              cursor: pointer;
              transition: background 0.2s;
            " 
            onmouseover="this.style.background='#059669'"
            onmouseout="this.style.background='#10B981'">
              🏠 Ir para Dashboard
            </button>
            
            <button onclick="stayAtLogin()" style="
              background: #6B7280;
              color: white;
              border: none;
              padding: 15px 25px;
              border-radius: 12px;
              font-size: 18px;
              cursor: pointer;
              transition: background 0.2s;
            " 
            onmouseover="this.style.background='#4B5563'"
            onmouseout="this.style.background='#6B7280'">
              🔐 Permanecer no Login
            </button>
            
            <button onclick="forceReload()" style="
              background: #F59E0B;
              color: white;
              border: none;
              padding: 15px 25px;
              border-radius: 12px;
              font-size: 18px;
              cursor: pointer;
              transition: background 0.2s;
            " 
            onmouseover="this.style.background='#D97706'"
            onmouseout="this.style.background='#F59E0B'">
              🔄 Recarregar Página
            </button>
            
            <button onclick="clearDataAndReload()" style="
              background: #DC2626;
              color: white;
              border: none;
              padding: 15px 25px;
              border-radius: 12px;
              font-size: 18px;
              cursor: pointer;
              transition: background 0.2s;
            " 
            onmouseover="this.style.background='#B91C1C'"
            onmouseout="this.style.background='#DC2626'">
              🗑️ Limpar Dados e Recarregar
            </button>
          </div>
          
          <p style="
            color: #9CA3AF;
            margin: 20px 0 0 0;
            font-size: 12px;
          ">
            Esta interface desaparecerá automaticamente em 60 segundos
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Funções globais para os botões
    window.goToDashboard = function () {
      console.log("🏠 LOOP DETECTOR: Navegando para dashboard");
      overlay.remove();
      uiShown = false;

      // Navegação forçada
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    };

    window.stayAtLogin = function () {
      console.log("🔐 LOOP DETECTOR: Permanecendo no login");
      overlay.remove();
      uiShown = false;

      // Ir para raiz se não estamos lá
      if (window.location.pathname !== "/") {
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      }
    };

    window.forceReload = function () {
      console.log("🔄 LOOP DETECTOR: Recarregamento forçado");
      window.location.reload(true);
    };

    window.clearDataAndReload = function () {
      console.log("🗑️ LOOP DETECTOR: Limpando dados e recarregando");

      // Limpar dados de sessão
      try {
        sessionStorage.clear();

        // Limpar alguns dados específicos que podem causar loops
        const problematicKeys = [
          "authBypass",
          "userAuthenticated",
          "skipProtectedRoute",
          "leirisonda_force_sync",
          "leirisonda_new_work_notification",
        ];

        problematicKeys.forEach((key) => {
          localStorage.removeItem(key);
        });
      } catch (e) {
        console.log("Erro ao limpar dados:", e);
      }

      setTimeout(() => {
        window.location.reload(true);
      }, 500);
    };

    // Auto-remover após 60 segundos
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
        uiShown = false;
      }
    }, 60000);
  }

  // Monitor principal
  function startMonitoring() {
    // Registrar visita inicial
    registerPageVisit();

    // Verificar periodicamente por loops
    const checkInterval = setInterval(() => {
      if (checkForLoop()) {
        console.warn("🔄 LOOP DETECTOR: Loop detectado!");
        showManualNavigationUI();
        clearInterval(checkInterval);
      }
    }, 3000);

    // Parar monitor após 2 minutos se não houve loop
    setTimeout(() => {
      clearInterval(checkInterval);
      console.log(
        "🔄 LOOP DETECTOR: Monitor finalizado - sem loops detectados",
      );
    }, 120000);

    // Monitor de mudanças de página
    let lastPath = window.location.pathname;
    const pathMonitor = setInterval(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        console.log(
          "🔄 LOOP DETECTOR: Mudança de página:",
          lastPath,
          "→",
          currentPath,
        );
        lastPath = currentPath;
        registerPageVisit();
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(pathMonitor);
    }, 300000); // 5 minutos
  }

  // Inicializar
  function init() {
    startMonitoring();
    console.log("🔄 LOOP DETECTOR: Sistema ativo");
  }

  // Aguardar DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 500);
  }
})();
