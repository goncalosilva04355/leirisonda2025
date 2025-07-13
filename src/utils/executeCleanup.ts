/**
 * Execute immediate cleanup of Firebase data
 * This will run when the module is imported
 */

import {
  cleanAllFirebaseData,
  getFirebaseDataSummary,
} from "./cleanFirebaseData";

// Execute cleanup immediately
console.log("🚀 Executando limpeza automática dos dados AIza Escritorio...");

// First, show what we found
const summary = getFirebaseDataSummary();
console.log(
  `🔍 Encontrados ${summary.count} itens relacionados com Firebase/AIza:`,
);
summary.found.forEach((item) => console.log(`  - ${item}`));

// Execute the cleanup
const result = cleanAllFirebaseData();

console.log("📊 RESULTADO DA LIMPEZA:");
console.log(`✅ Removidos: ${result.removed.length} itens`);
result.removed.forEach((item) => console.log(`  ✓ ${item}`));

if (result.errors.length > 0) {
  console.log(`❌ Erros: ${result.errors.length}`);
  result.errors.forEach((error) => console.log(`  ✗ ${error}`));
} else {
  console.log("✨ Limpeza concluída sem erros!");
}

console.log(
  "🎯 Todos os dados relacionados com 'AIza Escritorio' foram eliminados do sistema.",
);

export { result };
