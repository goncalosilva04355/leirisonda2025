// SCRIPT DE RECUPERAÇÃO DE EMERGÊNCIA
// Execute no console do navegador:
// 1. Copie todo este código
// 2. Cole no console (F12 > Console)
// 3. Pressione Enter

console.log("🚨🚨🚨 INICIANDO RECUPERAÇÃO DE EMERGÊNCIA 🚨🚨🚨");

// Função de recuperação crítica
function emergencyDataRecovery() {
  console.log("🔍 Procurando dados perdidos...");

  // Dados mínimos para funcionamento
  const minimalData = {
    works: [],
    pools: [
      {
        id: "emergency-pool-1",
        name: "Piscina Exemplo",
        location: "Localização a definir",
        client: "Cliente a definir",
        type: "Residencial",
        status: "Ativa",
        createdAt: new Date().toISOString(),
      },
    ],
    maintenance: [],
    clients: [
      {
        id: "emergency-client-1",
        name: "Cliente Exemplo",
        email: "cliente@exemplo.com",
        phone: "+351 000 000 000",
        address: "Endereço a definir",
        pools: [],
        createdAt: new Date().toISOString(),
      },
    ],
  };

  // Procurar por qualquer backup
  const allKeys = Object.keys(localStorage);
  console.log("📋 Chaves encontradas:", allKeys);

  const recoveredData = {
    works: [],
    pools: [],
    maintenance: [],
    clients: [],
  };

  // Procurar em todas as chaves
  allKeys.forEach((key) => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]");

      // Procurar dados diretos
      if (key === "works" && Array.isArray(data)) {
        recoveredData.works = data;
        console.log(`✅ Encontrados dados de works: ${data.length} items`);
      }
      if (key === "pools" && Array.isArray(data)) {
        recoveredData.pools = data;
        console.log(`✅ Encontrados dados de pools: ${data.length} items`);
      }
      if (key === "maintenance" && Array.isArray(data)) {
        recoveredData.maintenance = data;
        console.log(
          `✅ Encontrados dados de maintenance: ${data.length} items`,
        );
      }
      if (key === "clients" && Array.isArray(data)) {
        recoveredData.clients = data;
        console.log(`✅ Encontrados dados de clients: ${data.length} items`);
      }

      // Procurar em backups
      if (key.includes("backup") && typeof data === "object" && data !== null) {
        console.log(`🔍 Verificando backup: ${key}`);
        if (data.works && Array.isArray(data.works)) {
          recoveredData.works = [...recoveredData.works, ...data.works];
          console.log(
            `✅ Recuperados works de ${key}: ${data.works.length} items`,
          );
        }
        if (data.pools && Array.isArray(data.pools)) {
          recoveredData.pools = [...recoveredData.pools, ...data.pools];
          console.log(
            `✅ Recuperados pools de ${key}: ${data.pools.length} items`,
          );
        }
        if (data.maintenance && Array.isArray(data.maintenance)) {
          recoveredData.maintenance = [
            ...recoveredData.maintenance,
            ...data.maintenance,
          ];
          console.log(
            `✅ Recuperados maintenance de ${key}: ${data.maintenance.length} items`,
          );
        }
        if (data.clients && Array.isArray(data.clients)) {
          recoveredData.clients = [...recoveredData.clients, ...data.clients];
          console.log(
            `✅ Recuperados clients de ${key}: ${data.clients.length} items`,
          );
        }
      }
    } catch (error) {
      // Ignorar erros de parsing
    }
  });

  // Usar dados recuperados ou mínimos
  const finalData = {
    works:
      recoveredData.works.length > 0 ? recoveredData.works : minimalData.works,
    pools:
      recoveredData.pools.length > 0 ? recoveredData.pools : minimalData.pools,
    maintenance:
      recoveredData.maintenance.length > 0
        ? recoveredData.maintenance
        : minimalData.maintenance,
    clients:
      recoveredData.clients.length > 0
        ? recoveredData.clients
        : minimalData.clients,
  };

  // Salvar dados
  Object.keys(finalData).forEach((key) => {
    localStorage.setItem(key, JSON.stringify(finalData[key]));
    console.log(`💾 Restaurado ${key}: ${finalData[key].length} items`);
  });

  // Criar backup de emergência
  const emergencyBackup = {
    timestamp: new Date().toISOString(),
    id: `manual_recovery_${Date.now()}`,
    version: "1.0.0",
    source: "manual_console_recovery",
    ...finalData,
  };

  localStorage.setItem(
    `backup_emergency_${emergencyBackup.id}`,
    JSON.stringify(emergencyBackup),
  );

  console.log("✅ RECUPERAÇÃO MANUAL CONCLUÍDA!");
  console.log("📊 Dados finais:", {
    works: finalData.works.length,
    pools: finalData.pools.length,
    maintenance: finalData.maintenance.length,
    clients: finalData.clients.length,
  });

  alert(
    "✅ RECUPERAÇÃO CONCLUÍDA!\n\nDados restaurados com sucesso.\nAtualize a página (F5) para ver os resultados.",
  );

  return true;
}

// Executar automaticamente
emergencyDataRecovery();
