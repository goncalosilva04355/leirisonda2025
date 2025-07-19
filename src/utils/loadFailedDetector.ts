/**
 * Detector de erros "Load failed" para diagnosticar problemas de carregamento
 */

// Capturar erros de módulos não carregados
window.addEventListener("error", (event) => {
  if (event.message && event.message.includes("Load failed")) {
    console.error("🚨 LOAD FAILED DETECTADO:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack,
    });

    // Mostrar notificação visual
    showLoadFailedNotification(event.message);
  }

  // Also catch React rendering errors that might be causing the issue
  if (
    event.message &&
    (event.message.includes("Cannot read") ||
      event.message.includes("undefined") ||
      event.message.includes("renderWithHooks"))
  ) {
    console.error("🚨 REACT RENDERING ERROR:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      stack: event.error?.stack,
    });
  }

  // Catch Firebase ReadableStream errors
  if (
    event.message &&
    (event.message.includes("ReadableStream") ||
      event.message.includes("getReader") ||
      event.message.includes("initializeReadableStreamDefaultReader"))
  ) {
    console.error("🔥 FIREBASE READABLESTREAM ERROR:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      stack: event.error?.stack,
    });

    showLoadFailedNotification(
      "Erro de conectividade Firebase - Modo offline ativo",
    );
  }
});

// Capturar erros de Promise rejeitadas (módulos ES6)
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  if (
    reason &&
    (reason.message?.includes("Load failed") ||
      reason.message?.includes("Failed to fetch") ||
      reason.message?.includes("Loading chunk"))
  ) {
    console.error("🚨 PROMISE REJECTION - LOAD FAILED:", {
      reason: reason,
      stack: reason?.stack,
    });

    showLoadFailedNotification(
      reason.message || "Erro de carregamento de módulo",
    );
  }
});

function showLoadFailedNotification(message: string) {
  // Criar notificação visual
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dc2626;
    color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    max-width: 400px;
    font-family: system-ui;
    font-size: 14px;
  `;

  notification.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 8px;">⚠️ Erro de Carregamento</div>
    <div style="margin-bottom: 12px;">${message}</div>
    <button onclick="window.location.reload()" style="
      background: white;
      color: #dc2626;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    ">Recarregar Página</button>
  `;

  document.body.appendChild(notification);

  // Remover após 10 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 10000);
}

// Verificar se fetch está disponível
if (!window.fetch) {
  console.error("🚨 FETCH API não disponível - possível causa de Load failed");
}

// Verificar se ES6 modules estão sendo suportados
try {
  new Function('import("")');
  console.log("✅ ES6 modules suportados");
} catch (error) {
  console.error(
    "🚨 ES6 modules não suportados - possível causa de Load failed",
  );
}

console.log("🔍 Load Failed Detector ativo");
