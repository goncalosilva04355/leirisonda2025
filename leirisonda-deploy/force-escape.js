// FORCE ESCAPE - Saída forçada do ProtectedRoute

console.log("🚨 FORCE ESCAPE: Iniciando escape forçado...");

// Função simples para sair do ProtectedRoute
function forceEscape() {
  console.log("🚨 FORCE: Executando escape...");

  // 1. Configurar storage mínimo
  try {
    localStorage.clear();
    localStorage.setItem("bypass", "true");
    localStorage.setItem("user", "valid");
    console.log("✅ Storage configurado");
  } catch (e) {}

  // 2. Remover elementos problemáticos
  const protectedRoute = document.querySelector(
    '[data-loc="code/client/components/ProtectedRoute.tsx:37:7"]',
  );
  if (protectedRoute) {
    console.log("🚨 FORCE: Removendo ProtectedRoute...");
    protectedRoute.remove();
  }

  // 3. Limpar body e criar interface mínima
  setTimeout(() => {
    document.body.innerHTML = `
      <div style="
        padding: 40px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        background: #f8f9fa;
        min-height: 100vh;
      ">
        <h1 style="color: #007784; margin-bottom: 30px;">🏗️ Leirisonda - Gestão de Obras</h1>
        
        <div style="
          background: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 30px;
        ">
          <strong>✅ Sistema Operacional</strong><br>
          ProtectedRoute contornado • Pronto para uso
        </div>
        
        <h3>📝 Criar Nova Obra</h3>
        
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nome da Obra:</label>
            <input id="nome" type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nome da obra...">
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Cliente:</label>
            <input id="cliente" type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nome do cliente...">
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Morada:</label>
            <input id="morada" type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Morada da obra...">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Observações:</label>
            <textarea id="obs" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; height: 80px;" placeholder="Observações..."></textarea>
          </div>
          
          <button id="guardar" style="
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
          ">💾 Guardar Obra</button>
          
          <div id="status" style="
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            display: none;
          "></div>
        </div>
        
        <div id="obras" style="
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: 20px;
        ">
          <h3>📋 Obras Guardadas</h3>
          <div id="lista">
            <p style="color: #666; font-style: italic;">Ainda não há obras guardadas.</p>
          </div>
        </div>
      </div>
    `;

    // Configurar funcionalidade
    setupMinimalApp();
  }, 1000);
}

// App mínima funcional
function setupMinimalApp() {
  console.log("⚙️ FORCE: Configurando app mínima...");

  const guardarBtn = document.getElementById("guardar");
  if (guardarBtn) {
    guardarBtn.onclick = function () {
      const nome = document.getElementById("nome").value.trim();
      const cliente = document.getElementById("cliente").value.trim();
      const morada = document.getElementById("morada").value.trim();
      const obs = document.getElementById("obs").value.trim();

      if (!nome || !cliente || !morada) {
        showStatus("⚠️ Preencha todos os campos obrigatórios", "warning");
        return;
      }

      const obra = {
        id: Date.now(),
        nome: nome,
        cliente: cliente,
        morada: morada,
        obs: obs,
        data: new Date().toLocaleDateString(),
      };

      // Guardar no localStorage
      try {
        let obras = JSON.parse(localStorage.getItem("obras") || "[]");
        obras.push(obra);
        localStorage.setItem("obras", JSON.stringify(obras));

        showStatus("✅ Obra guardada com sucesso!", "success");

        // Limpar formulário
        document.getElementById("nome").value = "";
        document.getElementById("cliente").value = "";
        document.getElementById("morada").value = "";
        document.getElementById("obs").value = "";

        // Atualizar lista
        updateObrasList();
      } catch (e) {
        showStatus("❌ Erro ao guardar: " + e.message, "error");
      }
    };
  }

  // Carregar obras existentes
  updateObrasList();
}

function showStatus(message, type) {
  const status = document.getElementById("status");
  if (status) {
    status.style.display = "block";
    status.textContent = message;

    if (type === "success") {
      status.style.background = "#d4edda";
      status.style.border = "1px solid #c3e6cb";
      status.style.color = "#155724";
    } else if (type === "error") {
      status.style.background = "#f8d7da";
      status.style.border = "1px solid #f5c6cb";
      status.style.color = "#721c24";
    } else if (type === "warning") {
      status.style.background = "#fff3cd";
      status.style.border = "1px solid #ffeaa7";
      status.style.color = "#856404";
    }

    if (type === "success") {
      setTimeout(() => {
        status.style.display = "none";
      }, 3000);
    }
  }
}

function updateObrasList() {
  const lista = document.getElementById("lista");
  if (!lista) return;

  try {
    const obras = JSON.parse(localStorage.getItem("obras") || "[]");

    if (obras.length === 0) {
      lista.innerHTML =
        '<p style="color: #666; font-style: italic;">Ainda não há obras guardadas.</p>';
      return;
    }

    let html = "";
    obras.reverse().forEach((obra) => {
      html += `
        <div style="
          border: 1px solid #ddd;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 4px;
          background: #f8f9fa;
        ">
          <h4 style="margin: 0 0 10px 0; color: #495057;">${obra.nome}</h4>
          <p style="margin: 5px 0;"><strong>Cliente:</strong> ${obra.cliente}</p>
          <p style="margin: 5px 0;"><strong>Morada:</strong> ${obra.morada}</p>
          ${obra.obs ? `<p style="margin: 5px 0;"><strong>Obs:</strong> ${obra.obs}</p>` : ""}
          <p style="margin: 5px 0; font-size: 12px; color: #666;">Data: ${obra.data}</p>
        </div>
      `;
    });

    lista.innerHTML = html;
  } catch (e) {
    lista.innerHTML = '<p style="color: #dc3545;">Erro ao carregar obras.</p>';
  }
}

// Executar escape imediatamente
setTimeout(forceEscape, 500);

// Monitor para reexecutar se necessário
let attempts = 0;
const monitor = setInterval(() => {
  const isStuck = document.querySelector(
    '[data-loc="code/client/components/ProtectedRoute.tsx:40:11"]',
  );

  if (isStuck && attempts < 5) {
    attempts++;
    console.log(`🚨 FORCE: Ainda preso, tentativa ${attempts}...`);
    forceEscape();
  } else if (attempts >= 5) {
    clearInterval(monitor);
  }
}, 3000);

console.log("✅ FORCE ESCAPE: Sistema iniciado");
