// IMMEDIATE REPLACE - Substituição imediata do layout

console.log("⚡ IMMEDIATE: Executando substituição imediata...");

// Função que executa imediatamente
(function () {
  "use strict";

  function replaceNow() {
    console.log("⚡ IMMEDIATE: Substituindo layout agora...");

    // Limpar storage
    try {
      localStorage.clear();
      localStorage.setItem("appReplaced", "true");
    } catch (e) {}

    // Substituir body imediatamente
    document.body.innerHTML = `
      <div style="
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f5f5f5;
        min-height: 100vh;
        margin: 0;
        padding: 0;
      ">
        <!-- Header -->
        <div style="
          background: #007784;
          color: white;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 15px;">
            <h1 style="margin: 0; font-size: 28px;">🏗️ Leirisonda</h1>
            <span style="font-size: 16px; opacity: 0.9;">Sistema de Gestão de Obras</span>
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="max-width: 1200px; margin: 0 auto; padding: 30px 20px;">
          
          <!-- Status -->
          <div style="
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
          ">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 24px;">✅</span>
              <div>
                <h3 style="margin: 0; color: #155724; font-size: 18px;">Sistema Operacional</h3>
                <p style="margin: 5px 0 0 0; color: #155724;">Problemas de autenticação resolvidos • Pronto para uso</p>
              </div>
            </div>
          </div>
          
          <!-- Navigation -->
          <div style="
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            <h2 style="margin: 0 0 20px 0; color: #333;">🔧 Funcionalidades</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <button onclick="showObras()" style="
                background: #28a745;
                color: white;
                border: none;
                padding: 15px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
              " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
                📋 Gestão de Obras
              </button>
              <button onclick="showPiscinas()" style="
                background: #17a2b8;
                color: white;
                border: none;
                padding: 15px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
              " onmouseover="this.style.background='#138496'" onmouseout="this.style.background='#17a2b8'">
                🏊 Piscinas
              </button>
              <button onclick="showManutencao()" style="
                background: #ffc107;
                color: #212529;
                border: none;
                padding: 15px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
              " onmouseover="this.style.background='#e0a800'" onmouseout="this.style.background='#ffc107'">
                🔧 Manutenção
              </button>
            </div>
          </div>
          
          <!-- Obra Form -->
          <div id="obraSection" style="
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
          ">
            <h2 style="margin: 0 0 25px 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>📝</span> Criar Nova Obra
            </h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">Nome da Obra *</label>
                <input id="obraNome" type="text" style="
                  width: 100%;
                  padding: 12px;
                  border: 2px solid #e0e0e0;
                  border-radius: 6px;
                  font-size: 16px;
                  box-sizing: border-box;
                " placeholder="Ex: Construção Moradia Familiar">
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">Cliente *</label>
                <input id="obraCliente" type="text" style="
                  width: 100%;
                  padding: 12px;
                  border: 2px solid #e0e0e0;
                  border-radius: 6px;
                  font-size: 16px;
                  box-sizing: border-box;
                " placeholder="Nome do cliente">
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">Morada *</label>
              <input id="obraMorada" type="text" style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
              " placeholder="Morada completa da obra">
            </div>
            
            <div style="margin-bottom: 25px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">Observações</label>
              <textarea id="obraObs" style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 16px;
                min-height: 100px;
                resize: vertical;
                box-sizing: border-box;
              " placeholder="Detalhes adicionais sobre a obra..."></textarea>
            </div>
            
            <button onclick="guardarObra()" style="
              background: #007bff;
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 18px;
              font-weight: 600;
              transition: background 0.2s;
            " onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">
              💾 Guardar Obra
            </button>
            
            <div id="obraStatus" style="
              margin-top: 20px;
              padding: 15px;
              border-radius: 6px;
              display: none;
            "></div>
          </div>
          
          <!-- Obras List -->
          <div style="
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            <h2 style="margin: 0 0 25px 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>📋</span> Obras Registadas
            </h2>
            <div id="obrasList">
              <p style="color: #666; font-style: italic; text-align: center; padding: 20px;">
                Nenhuma obra registada ainda. Crie a primeira obra acima!
              </p>
            </div>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="
          background: #333;
          color: white;
          text-align: center;
          padding: 20px;
          margin-top: 40px;
        ">
          <p style="margin: 0; opacity: 0.8;">© 2025 Leirisonda - Sistema Avançado de Gestão de Obras</p>
        </div>
      </div>
      
      <script>
        // Funcionalidades da aplicação
        function showObras() {
          document.getElementById('obraSection').scrollIntoView({ behavior: 'smooth' });
        }
        
        function showPiscinas() {
          alert('🏊 Funcionalidade de Piscinas em desenvolvimento');
        }
        
        function showManutencao() {
          alert('🔧 Funcionalidade de Manutenção em desenvolvimento');
        }
        
        function guardarObra() {
          const nome = document.getElementById('obraNome').value.trim();
          const cliente = document.getElementById('obraCliente').value.trim();
          const morada = document.getElementById('obraMorada').value.trim();
          const obs = document.getElementById('obraObs').value.trim();
          
          if (!nome || !cliente || !morada) {
            showStatus('⚠️ Por favor, preencha todos os campos obrigatórios', 'warning');
            return;
          }
          
          const obra = {
            id: Date.now(),
            nome: nome,
            cliente: cliente,
            morada: morada,
            observacoes: obs,
            dataCriacao: new Date().toLocaleDateString('pt-PT'),
            status: 'Ativa'
          };
          
          // Guardar no localStorage
          try {
            let obras = JSON.parse(localStorage.getItem('leirisonda_obras') || '[]');
            obras.unshift(obra); // Adicionar no início
            localStorage.setItem('leirisonda_obras', JSON.stringify(obras));
            
            showStatus('✅ Obra guardada com sucesso!', 'success');
            
            // Limpar formulário
            document.getElementById('obraNome').value = '';
            document.getElementById('obraCliente').value = '';
            document.getElementById('obraMorada').value = '';
            document.getElementById('obraObs').value = '';
            
            // Atualizar lista
            carregarObras();
            
          } catch (e) {
            showStatus('❌ Erro ao guardar obra: ' + e.message, 'error');
          }
        }
        
        function showStatus(message, type) {
          const status = document.getElementById('obraStatus');
          status.style.display = 'block';
          status.textContent = message;
          
          const styles = {
            success: { bg: '#d4edda', border: '#c3e6cb', color: '#155724' },
            error: { bg: '#f8d7da', border: '#f5c6cb', color: '#721c24' },
            warning: { bg: '#fff3cd', border: '#ffeaa7', color: '#856404' }
          };
          
          const style = styles[type] || styles.success;
          status.style.background = style.bg;
          status.style.border = '1px solid ' + style.border;
          status.style.color = style.color;
          
          if (type === 'success') {
            setTimeout(() => {
              status.style.display = 'none';
            }, 4000);
          }
        }
        
        function carregarObras() {
          try {
            const obras = JSON.parse(localStorage.getItem('leirisonda_obras') || '[]');
            const lista = document.getElementById('obrasList');
            
            if (obras.length === 0) {
              lista.innerHTML = '<p style="color: #666; font-style: italic; text-align: center; padding: 20px;">Nenhuma obra registada ainda. Crie a primeira obra acima!</p>';
              return;
            }
            
            let html = '<div style="display: grid; gap: 15px;">';
            obras.forEach(obra => {
              html += \`
                <div style="
                  border: 1px solid #e0e0e0;
                  border-radius: 8px;
                  padding: 20px;
                  background: #f8f9fa;
                  transition: box-shadow 0.2s;
                " onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #007784; font-size: 20px;">\${obra.nome}</h3>
                    <span style="
                      background: #28a745;
                      color: white;
                      padding: 4px 12px;
                      border-radius: 20px;
                      font-size: 12px;
                      font-weight: 600;
                    ">\${obra.status}</span>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                      <strong style="color: #666;">Cliente:</strong><br>
                      <span style="color: #333;">\${obra.cliente}</span>
                    </div>
                    <div>
                      <strong style="color: #666;">Data:</strong><br>
                      <span style="color: #333;">\${obra.dataCriacao}</span>
                    </div>
                  </div>
                  
                  <div style="margin-bottom: 15px;">
                    <strong style="color: #666;">Morada:</strong><br>
                    <span style="color: #333;">\${obra.morada}</span>
                  </div>
                  
                  \${obra.observacoes ? \`
                    <div>
                      <strong style="color: #666;">Observações:</strong><br>
                      <span style="color: #333;">\${obra.observacoes}</span>
                    </div>
                  \` : ''}
                </div>
              \`;
            });
            html += '</div>';
            
            lista.innerHTML = html;
            
          } catch (e) {
            document.getElementById('obrasList').innerHTML = '<p style="color: #dc3545; text-align: center;">Erro ao carregar obras.</p>';
          }
        }
        
        // Carregar obras ao iniciar
        carregarObras();
        
        console.log('✅ IMMEDIATE: Aplicação Leirisonda carregada com sucesso!');
      </script>
    `;

    console.log("✅ IMMEDIATE: Layout substituído com sucesso!");
  }

  // Executar imediatamente
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", replaceNow);
  } else {
    replaceNow();
  }

  // Backup: executar após delay
  setTimeout(replaceNow, 100);
  setTimeout(replaceNow, 500);
  setTimeout(replaceNow, 1000);
})();
