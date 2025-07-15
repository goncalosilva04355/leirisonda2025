// Debug script para detectar problemas de carregamento
console.log("🔍 Debug script carregado - verificando estado da aplicação");

// Verificar se o React está carregado
setTimeout(() => {
  const root = document.getElementById("root");
  if (!root) {
    console.error("❌ Elemento root não encontrado");
    return;
  }

  if (root.children.length === 0) {
    console.error("❌ Elemento root está vazio - possível erro no React");

    // Adicionar indicação visual
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; background: #f8f9fa; color: #333; text-align: center;">
        <h1 style="color: #dc3545;">🔍 Debug: Aplicação não carregou</h1>
        <p>O React não renderizou corretamente. Possíveis causas:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>Erro de JavaScript durante a inicialização</li>
          <li>Problema com imports do Firebase</li>
          <li>Erro nos hooks ou components</li>
        </ul>
        <p><strong>Verifique o console para mais detalhes</strong></p>
        <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Recarregar Página
        </button>
      </div>
    `;
  } else {
    console.log("✅ Aplicação React carregada com sucesso");
  }
}, 3000);

// Capturar erros JavaScript
window.addEventListener("error", (event) => {
  console.error("🚨 Erro JavaScript detectado:", event.error);
  console.error("📍 Localização:", event.filename, "linha", event.lineno);
});

// Capturar promessas rejeitadas
window.addEventListener("unhandledrejection", (event) => {
  console.error("🚨 Promise rejeitada:", event.reason);
});
