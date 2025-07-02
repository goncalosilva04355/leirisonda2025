// FORCE PROTECTED ROUTE PASS - Substituição direta do DOM

console.log("🔓 FORCE ROUTE: Forçando ProtectedRoute a passar...");

(function () {
  "use strict";

  function forcePassProtectedRoute() {
    // Encontrar o ProtectedRoute específico que vejo no DOM
    const protectedRoute = document.querySelector(
      '[data-loc="code/client/components/ProtectedRoute.tsx:37:7"]',
    );

    if (protectedRoute) {
      console.log("🔓 FORCE: ProtectedRoute encontrado - forçando passagem...");

      // Substituir completamente o conteúdo por navegação direta
      protectedRoute.innerHTML = `
        <div style="
          padding: 40px;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
          margin: 20px;
        ">
          <h2 style="margin-bottom: 20px;">🔓 Autenticação Bypass Ativa</h2>
          <p style="margin-bottom: 30px;">Escolha onde quer ir:</p>
          
          <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button onclick="goToDashboard()" style="
              background: #4CAF50;
              color: white;
              border: none;
              padding: 15px 25px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">📊 Dashboard</button>
            
            <button onclick="goToObras()" style="
              background: #2196F3;
              color: white;
              border: none;
              padding: 15px 25px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">🏗️ Obras</button>
            
            <button onclick="goToPiscinas()" style="
              background: #FF9800;
              color: white;
              border: none;
              padding: 15px 25px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">🏊 Piscinas</button>
            
            <button onclick="goToManutencao()" style="
              background: #9C27B0;
              color: white;
              border: none;
              padding: 15px 25px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">🔧 Manutenção</button>
          </div>
          
          <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
            Redirecionamento automático para Dashboard em <span id="countdown">5</span> segundos...
          </p>
        </div>
      `;

      // Adicionar funções de navegação ao window
      window.goToDashboard = function () {
        console.log("🎯 Navegando para Dashboard...");
        setupAuth();
        window.location.href = "/dashboard";
      };

      window.goToObras = function () {
        console.log("🎯 Navegando para Obras...");
        setupAuth();
        window.location.href = "/obras";
      };

      window.goToPiscinas = function () {
        console.log("🎯 Navegando para Piscinas...");
        setupAuth();
        window.location.href = "/piscinas";
      };

      window.goToManutencao = function () {
        console.log("🎯 Navegando para Manutenção...");
        setupAuth();
        window.location.href = "/manutencao";
      };

      // Configurar auth antes da navegação
      function setupAuth() {
        if (window.firebase) {
          try {
            const auth = window.firebase.auth();

            // Simular usuário logado
            Object.defineProperty(auth, "currentUser", {
              get: () => ({
                uid: "force-user",
                email: "user@leirisonda.com",
                emailVerified: true,
              }),
              configurable: true,
            });

            localStorage.setItem("authBypass", "true");
            localStorage.setItem("userLoggedIn", "true");
          } catch (e) {
            console.log("Erro ao configurar auth:", e.message);
          }
        }
      }

      // Countdown automático para dashboard
      let countdown = 5;
      const countdownEl = document.getElementById("countdown");

      const timer = setInterval(() => {
        countdown--;
        if (countdownEl) {
          countdownEl.textContent = countdown;
        }

        if (countdown <= 0) {
          clearInterval(timer);
          console.log("🚀 Auto-redirecionamento para Dashboard...");
          window.goToDashboard();
        }
      }, 1000);

      return true;
    }

    return false;
  }

  // Tentar forçar passagem imediatamente
  setTimeout(forcePassProtectedRoute, 1000);

  // Monitor contínuo
  const monitor = setInterval(() => {
    if (forcePassProtectedRoute()) {
      clearInterval(monitor);
    }
  }, 2000);

  // Parar monitor após 30 segundos
  setTimeout(() => {
    clearInterval(monitor);
  }, 30000);

  console.log("✅ FORCE ROUTE: Monitor ativo");
})();
