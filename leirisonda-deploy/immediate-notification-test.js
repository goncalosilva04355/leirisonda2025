// IMMEDIATE NOTIFICATION TEST - Teste imediato de notificações

console.log("⚡ IMMEDIATE: Teste imediato de notificações iniciando...");

(function () {
  "use strict";

  // Teste imediato
  function immediateTest() {
    console.log("⚡ IMMEDIATE: Executando teste...");
    console.log("⚡ Browser:", navigator.userAgent);
    console.log("⚡ Notification support:", "Notification" in window);
    console.log("⚡ Current permission:", Notification?.permission);

    if (!("Notification" in window)) {
      console.error("❌ IMMEDIATE: Notificações não suportadas neste browser");
      alert("❌ Notificações não suportadas neste browser");
      return false;
    }

    if (Notification.permission === "granted") {
      console.log("✅ IMMEDIATE: Permissão já concedida, enviando teste...");

      try {
        const notification = new Notification("Teste Imediato", {
          body: "Se você vê esta notificação, o sistema funciona!",
          icon: "/leirisonda-logo.svg",
        });

        notification.onclick = function () {
          console.log("✅ IMMEDIATE: Notificação foi clicada!");
          notification.close();
        };

        console.log("✅ IMMEDIATE: Notificação enviada com sucesso");
        return true;
      } catch (error) {
        console.error("❌ IMMEDIATE: Erro ao enviar notificação:", error);
        alert("❌ Erro ao enviar notificação: " + error.message);
        return false;
      }
    } else if (Notification.permission === "default") {
      console.log("⚠️ IMMEDIATE: Permissão não foi pedida ainda");

      Notification.requestPermission().then((permission) => {
        console.log("⚡ IMMEDIATE: Nova permissão:", permission);

        if (permission === "granted") {
          immediateTest(); // Recursive call after permission
        } else {
          console.error("❌ IMMEDIATE: Permissão negada");
          alert(
            "❌ Permissão de notificação negada. Ative nas configurações do browser.",
          );
        }
      });
    } else {
      console.error("❌ IMMEDIATE: Permissão negada permanentemente");
      alert(
        "❌ Notificações bloqueadas. Vá em configurações do browser > notificações e permita para este site.",
      );
      return false;
    }
  }

  // Executar teste imediatamente
  immediateTest();

  // Criar função global para teste manual
  window.testeNotificacao = immediateTest;

  // Criar botão bem visível
  setTimeout(() => {
    const button = document.createElement("button");
    button.innerHTML = "🚨 TESTE NOTIFICAÇÃO";
    button.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: #EF4444;
      color: white;
      border: none;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10001;
    `;

    button.onclick = immediateTest;
    button.title = "Clique para testar notificações";

    document.body.appendChild(button);

    console.log(
      "⚡ IMMEDIATE: Botão de teste criado (canto superior esquerdo)",
    );
    console.log(
      "⚡ IMMEDIATE: Também pode testar digitando: testeNotificacao()",
    );
  }, 1000);
})();
