// Criar dados de exemplo no localStorage para demonstração de migração
export function createSampleLocalData() {
  console.log("🧪 Criando dados de exemplo no localStorage...");

  // Dados de exemplo para clientes
  const sampleClients = [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "912345678",
      address: "Rua das Flores, 123, Leiria",
      nif: "123456789",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "987654321",
      address: "Avenida Central, 456, Marinha Grande",
      nif: "987654321",
      createdAt: new Date().toISOString(),
    },
  ];

  // Dados de exemplo para piscinas
  const samplePools = [
    {
      id: "1",
      name: "Piscina Residencial Silva",
      location: "Leiria",
      client: "João Silva",
      type: "Exterior",
      status: "Ativa",
      dimensions: "8x4m",
      depth: "1.5m",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Piscina Comunitária Santos",
      location: "Marinha Grande",
      client: "Maria Santos",
      type: "Semi-olímpica",
      status: "Ativa",
      dimensions: "25x12m",
      depth: "2m",
      createdAt: new Date().toISOString(),
    },
  ];

  // Dados de exemplo para obras
  const sampleWorks = [
    {
      id: "1",
      title: "Construção Piscina Silva",
      description: "Construção de piscina residencial com deck",
      client: "João Silva",
      location: "Leiria",
      status: "Em progresso",
      startDate: new Date().toISOString(),
      estimatedEndDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Renovação Sistema Santos",
      description: "Renovação do sistema de filtração",
      client: "Maria Santos",
      location: "Marinha Grande",
      status: "Agendada",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedEndDate: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  // Dados de exemplo para manutenções
  const sampleMaintenance = [
    {
      id: "1",
      type: "Limpeza Completa",
      poolName: "Piscina Residencial Silva",
      client: "João Silva",
      scheduledDate: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "Agendada",
      description: "Limpeza completa e tratamento químico",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      type: "Manutenção Filtros",
      poolName: "Piscina Comunitária Santos",
      client: "Maria Santos",
      scheduledDate: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "Agendada",
      description: "Substituição e limpeza de filtros",
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    // Guardar no localStorage
    localStorage.setItem("clients", JSON.stringify(sampleClients));
    localStorage.setItem("pools", JSON.stringify(samplePools));
    localStorage.setItem("works", JSON.stringify(sampleWorks));
    localStorage.setItem("maintenance", JSON.stringify(sampleMaintenance));

    console.log("✅ Dados de exemplo criados no localStorage:", {
      clients: sampleClients.length,
      pools: samplePools.length,
      works: sampleWorks.length,
      maintenance: sampleMaintenance.length,
    });
  } catch (error) {
    console.error("❌ Erro ao criar dados de exemplo:", error);
  }
}

// Executar automaticamente se não existirem dados
export function ensureSampleData() {
  try {
    const existingClients = localStorage.getItem("clients");
    const existingPools = localStorage.getItem("pools");

    // Se não há dados, criar exemplos
    if (!existingClients || !existingPools) {
      createSampleLocalData();
    } else {
      console.log("📋 Dados já existem no localStorage");
    }
  } catch (error) {
    console.error("❌ Erro ao verificar dados:", error);
  }
}

// Executar automaticamente
setTimeout(() => {
  ensureSampleData();
}, 1000);
