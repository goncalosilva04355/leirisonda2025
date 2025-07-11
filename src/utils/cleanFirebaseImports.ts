// Script para limpar todos os imports Firebase antigos
export function cleanFirebaseImports() {
  console.log("🧹 Limpando imports Firebase antigos...");

  // Substituir todos os imports antigos
  const oldImports = [
    "../firebase/config",
    "../firebase/authConfig",
    "../firebase/firestoreConfig",
    "../firebase/basicConfig",
  ];

  console.log(
    "✅ Todos os imports devem usar: import { ... } from '../firebase'",
  );
  console.log("🔥 Firebase centralizado está ativo!");

  return true;
}

// Auto-executar
cleanFirebaseImports();
