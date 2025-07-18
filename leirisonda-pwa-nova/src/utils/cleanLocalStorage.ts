export const cleanLocalStorageDuplicates = () => {
  console.log("🧹 Limpando duplicados do localStorage...");

  const keys = ["works", "maintenance", "pools", "clients"];
  let totalCleaned = 0;

  keys.forEach((key) => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return;

      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return;

      const originalLength = parsed.length;

      // Remover duplicados baseado no ID
      const seen = new Set();
      const unique = parsed.filter((item) => {
        if (!item.id) return true; // Manter itens sem ID

        if (seen.has(item.id)) {
          console.log(`🗑️ Removendo duplicado local ${key}: ${item.id}`);
          return false;
        }

        seen.add(item.id);
        return true;
      });

      if (unique.length !== originalLength) {
        localStorage.setItem(key, JSON.stringify(unique));
        const cleaned = originalLength - unique.length;
        totalCleaned += cleaned;
        console.log(
          `✅ ${key}: ${cleaned} duplicados removidos (${unique.length}/${originalLength} restantes)`,
        );
      } else {
        console.log(`✅ ${key}: sem duplicados (${unique.length} itens)`);
      }
    } catch (error) {
      console.error(`❌ Erro ao limpar ${key}:`, error);
    }
  });

  console.log(
    `🎉 Limpeza do localStorage concluída: ${totalCleaned} duplicados removidos`,
  );

  if (totalCleaned > 0) {
    console.log("🔄 Recomendado recarregar a página para aplicar mudanças");
  }

  return { cleaned: totalCleaned };
};

// Executar limpeza automaticamente
setTimeout(() => {
  console.log("🚀 Auto-limpeza do localStorage iniciando...");
  cleanLocalStorageDuplicates();
}, 2000);

// Disponibilizar globalmente
(window as any).cleanLocalStorageDuplicates = cleanLocalStorageDuplicates;

console.log(
  "🧹 COMANDO: Digite 'cleanLocalStorageDuplicates()' para limpar localStorage",
);

export default cleanLocalStorageDuplicates;
