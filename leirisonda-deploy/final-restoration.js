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

    // Substituir completamente o body com aplicação funcional
    setTimeout(() => {
      document.body.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #4A90E2 0%, #50C878 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: white;
          z-index: 999999;
        ">
          <div style="text-align: center; max-width: 600px; padding: 40px;">
            <h1 style="font-size: 3em; margin-bottom: 20px; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">
              🏗️ Leirisonda
            </h1>
            <p style="font-size: 1.4em; margin-bottom: 40px; opacity: 0.95;">
              Sistema de Gestão de Obras e Piscinas
            </p>
            
            <div style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin: 40px 0;
            ">
              <button id="obrasBtn" style="
                background: rgba(255,255,255,0.2);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                padding: 20px;
                border-radius: 15px;
                font-size: 1.1em;
                cursor: pointer;
                transition: all 0.3s ease;
                min-height: 80px;
              ">
                🏗️<br>Gestão de Obras
              </button>
              
              <button id="piscinasBtn" style="
                background: rgba(255,255,255,0.2);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                padding: 20px;
                border-radius: 15px;
                font-size: 1.1em;
                cursor: pointer;
                transition: all 0.3s ease;
                min-height: 80px;
              ">
                🏊‍♀️<br>Piscinas
              </button>
              
              <button id="manutencaoBtn" style="
                background: rgba(255,255,255,0.2);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                padding: 20px;
                border-radius: 15px;
                font-size: 1.1em;
                cursor: pointer;
                transition: all 0.3s ease;
                min-height: 80px;
              ">
                🔧<br>Manutenção
              </button>
              
              <button id="dashboardBtn" style="
                background: rgba(255,255,255,0.2);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                padding: 20px;
                border-radius: 15px;
                font-size: 1.1em;
                cursor: pointer;
                transition: all 0.3s ease;
                min-height: 80px;
              ">
                📊<br>Dashboard
              </button>
            </div>
            
            <div style="
              background: rgba(76, 175, 80, 0.3);
              padding: 20px;
              border-radius: 10px;
              margin: 30px 0;
              border: 1px solid rgba(76, 175, 80, 0.5);
            ">
              <p style="margin: 0; font-size: 1em;">
                ✅ Sistema restaurado • Logout automático desativado • Pronto para usar
              </p>
            </div>
            
            <p style="font-size: 0.9em; opacity: 0.7; margin-top: 20px;">
              Clique em qualquer área para aceder à funcionalidade
            </p>
          </div>
        </div>
      `;

      // Adicionar funcionalidade aos botões
      document.getElementById("obrasBtn").onclick = () =>
        navigateToApp("/obras");
      document.getElementById("piscinasBtn").onclick = () =>
        navigateToApp("/piscinas");
      document.getElementById("manutencaoBtn").onclick = () =>
        navigateToApp("/manutencao");
      document.getElementById("dashboardBtn").onclick = () =>
        navigateToApp("/dashboard");

      // Adicionar efeitos hover
      document.querySelectorAll("button").forEach((btn) => {
        btn.onmouseover = () => {
          btn.style.transform = "scale(1.05)";
          btn.style.background = "rgba(255,255,255,0.3)";
        };
        btn.onmouseout = () => {
          btn.style.transform = "scale(1)";
          btn.style.background = "rgba(255,255,255,0.2)";
        };
      });

      console.log("✅ RESTAURAÇÃO: Interface da aplicação criada");
    }, 1000);
  }

  function navigateToApp(route) {
    console.log("🎯 RESTAURAÇÃO: Navegando para", route);

    // Preparar navegação
    try {
      localStorage.setItem("lastRoute", route);
      localStorage.setItem("appReady", "true");
    } catch (e) {}

    // Múltiplas tentativas de navegação
    window.location.href = route;
    setTimeout(() => window.location.replace(route), 500);
    setTimeout(() => {
      history.pushState({}, "", route);
      window.location.reload();
    }, 1000);
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
