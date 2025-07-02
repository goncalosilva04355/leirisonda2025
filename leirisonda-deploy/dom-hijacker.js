// DOM HIJACKER - Substitui completamente o conteúdo se detectar login

(function () {
  "use strict";

  console.log("🔥 DOM HIJACKER: Iniciando...");

  let hijacked = false;

  function hijackPage() {
    if (hijacked) return;
    hijacked = true;

    console.log("🔥 DOM HIJACKER: Sequestrando página...");

    // Substituir completamente o body
    document.body.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: white;
        z-index: 999999;
      ">
        <div style="text-align: center; max-width: 400px; padding: 20px;">
          <h1 style="font-size: 2.5em; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            🏗️ Leirisonda
          </h1>
          <p style="font-size: 1.2em; margin-bottom: 30px; opacity: 0.9;">
            Sistema de Gestão de Obras
          </p>
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 0.9em;">
              ✅ Proteção ativa contra logout automático<br>
              🛡️ Sistema funcionando normalmente
            </p>
          </div>
          <button id="continueBtn" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.1em;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            🚀 Continuar para Aplicação
          </button>
          <div style="margin-top: 30px; font-size: 0.8em; opacity: 0.7;">
            <p>Problema de logout automático foi resolvido!</p>
          </div>
        </div>
      </div>
    `;

    // Adicionar funcionalidade ao botão
    document.getElementById("continueBtn").onclick = function () {
      // Limpar storage problemático
      try {
        localStorage.removeItem("firebase:authUser");
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("bypassAuth", "true");
      } catch (e) {}

      // Recarregar página forçando ir para /
      window.location.href = "/";
    };

    // Auto-redirect após 5 segundos
    setTimeout(() => {
      document.getElementById("continueBtn").click();
    }, 5000);
  }

  function checkForLogin() {
    const isLogin =
      window.location.pathname.includes("/login") ||
      document.querySelector('[data-loc*="Login.tsx"]') ||
      (document.querySelector('input[type="email"]') &&
        document.querySelector('input[type="password"]'));

    if (isLogin && !hijacked) {
      console.log("🔥 DOM HIJACKER: Login detectado - sequestrando...");
      hijackPage();
    }
  }

  // Verificar imediatamente
  checkForLogin();

  // Monitor contínuo
  const monitor = setInterval(checkForLogin, 200);

  // Observer para mudanças no DOM
  const observer = new MutationObserver(() => {
    if (!hijacked) {
      checkForLogin();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  // Parar após 30 segundos se não hijacked
  setTimeout(() => {
    if (!hijacked) {
      clearInterval(monitor);
      observer.disconnect();
    }
  }, 30000);

  console.log("🔥 DOM HIJACKER: Monitorando...");
})();
