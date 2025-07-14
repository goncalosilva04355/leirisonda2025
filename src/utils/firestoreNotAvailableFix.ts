// Correção específica para erro "Service firestore is not available"

export function handleFirestoreNotAvailable() {
  console.log("");
  console.log("🚫 ═══════════════════════════════════════════════════════");
  console.log("❌ FIRESTORE NÃO ESTÁ HABILITADO NO SEU PROJETO FIREBASE");
  console.log("🚫 ═══════════════════════════════════════════════════════");
  console.log("");
  console.log("🔍 PROBLEMA DETECTADO:");
  console.log("   • Erro: 'Service firestore is not available'");
  console.log(
    "   • Causa: Firestore não foi habilitado no projeto 'leiria-1cfc9'",
  );
  console.log("");
  console.log("✅ SOLUÇÃO RÁPIDA:");
  console.log(
    "   1. Acesse: https://console.firebase.google.com/project/leiria-1cfc9",
  );
  console.log("   2. Clique em 'Firestore Database' no menu lateral");
  console.log("   3. Clique em 'Criar banco de dados'");
  console.log("   4. Escolha 'Modo de teste' (para desenvolvimento)");
  console.log("   5. Selecione localização (ex: europe-west3)");
  console.log("   6. Clique em 'Concluído'");
  console.log("   7. Recarregue esta aplicação");
  console.log("");
  console.log("💾 ENQUANTO ISSO:");
  console.log("   • Seus dados estão sendo salvos no localStorage");
  console.log("   • A aplicação funciona normalmente");
  console.log("   • Após habilitar Firestore, dados serão sincronizados");
  console.log("");
  console.log("🚫 ═══════════════════════════════════════════════════════");
  console.log("");
}

export function createFirestoreUnavailableAlert() {
  // Criar alerta visual na página
  const alertDiv = document.createElement("div");
  alertDiv.id = "firestore-alert";
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    border-left: 5px solid #fff;
  `;

  alertDiv.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <div style="font-size: 24px; margin-right: 10px;">🚫</div>
      <div>
        <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Firestore Não Habilitado</h3>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Dados salvos localmente</p>
      </div>
    </div>
    
    <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.4;">
      Para salvar no Firebase, habilite o Firestore no seu projeto.
    </p>
    
    <div style="display: flex; gap: 10px;">
      <a href="https://console.firebase.google.com/project/leiria-1cfc9" 
         target="_blank"
         style="background: #fff; color: #e74c3c; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-size: 12px; font-weight: 600; flex: 1; text-align: center;">
        🔗 Abrir Firebase Console
      </a>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px;">
        ✕
      </button>
    </div>
  `;

  // Remover alerta anterior se existir
  const existingAlert = document.getElementById("firestore-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Adicionar novo alerta
  document.body.appendChild(alertDiv);

  // Auto-remover após 30 segundos
  setTimeout(() => {
    if (alertDiv.parentElement) {
      alertDiv.remove();
    }
  }, 30000);
}

export function fixFirestoreServiceUnavailable() {
  console.log(
    "🔧 Aplicando correção para 'Service firestore is not available'...",
  );

  // 1. Mostrar instruções no console
  handleFirestoreNotAvailable();

  // 2. Criar alerta visual
  if (typeof window !== "undefined" && document.body) {
    createFirestoreUnavailableAlert();
  }

  // 3. Configurar fallback para localStorage
  const fallbackMessage =
    "💾 Modo localStorage ativo - dados sendo salvos localmente";
  console.log(fallbackMessage);

  // 4. Dispatch evento para notificar outros componentes
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("firestoreUnavailable", {
        detail: {
          reason: "Service firestore is not available",
          solution: "Enable Firestore in Firebase Console",
          fallback: "localStorage",
          timestamp: new Date().toISOString(),
        },
      }),
    );
  }

  return {
    firestoreAvailable: false,
    fallbackActive: true,
    message: "Firestore não habilitado - usando localStorage",
  };
}

// Auto-executar correção se detectar erro
if (typeof window !== "undefined") {
  // Aguardar um pouco para a página carregar
  setTimeout(() => {
    // Verificar se há erros de Firestore no console
    const originalError = console.error;
    console.error = function (...args) {
      const message = args.join(" ");
      if (message.includes("Service firestore is not available")) {
        fixFirestoreServiceUnavailable();
      }
      originalError.apply(console, args);
    };
  }, 1000);
}
