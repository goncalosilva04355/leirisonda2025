#!/usr/bin/env node

/**
 * Script para preparar o build de produção para o Builder.io
 * Este script garante que o index.html correto seja usado
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 Preparando build de produção para Builder.io...");

// 1. Executar o build de produção
const { execSync } = require("child_process");

try {
  console.log("📦 Executando build de produção...");
  execSync("npm run build:client", { stdio: "inherit" });

  // 2. Verificar se o ficheiro dist/index.html existe
  const distIndexPath = path.join(process.cwd(), "dist", "index.html");
  if (!fs.existsSync(distIndexPath)) {
    throw new Error("❌ Ficheiro dist/index.html não encontrado");
  }

  console.log("✅ Build de produção criado com sucesso!");

  // 3. Ler o conteúdo do index.html compilado
  const compiledIndexContent = fs.readFileSync(distIndexPath, "utf8");

  // 4. Verificar se contém referências aos assets compilados
  if (
    compiledIndexContent.includes("/assets/index-") &&
    compiledIndexContent.includes(".js") &&
    !compiledIndexContent.includes("/src/main.tsx")
  ) {
    console.log("✅ Index.html de produção está correto:");
    console.log("   - Referencia ficheiros JavaScript compilados");
    console.log("   - Não referencia /src/main.tsx");

    // Mostrar as referências encontradas
    const jsRefs = compiledIndexContent.match(/\/assets\/[^"]+\.js/g);
    const cssRefs = compiledIndexContent.match(/\/assets\/[^"]+\.css/g);

    if (jsRefs) {
      console.log("📁 Ficheiros JavaScript encontrados:");
      jsRefs.forEach((ref) => console.log(`   - ${ref}`));
    }

    if (cssRefs) {
      console.log("🎨 Ficheiros CSS encontrados:");
      cssRefs.forEach((ref) => console.log(`   - ${ref}`));
    }
  } else {
    throw new Error("❌ Index.html não está corretamente compilado");
  }

  console.log("\n🎉 Build de produção pronto para uso no Builder.io!");
  console.log("📋 Próximos passos:");
  console.log("   1. Use o ficheiro dist/index.html para exportação");
  console.log(
    "   2. Certifique-se que todos os assets em dist/assets/ são incluídos",
  );
  console.log(
    "   3. Configure o servidor para servir os ficheiros estáticos corretamente",
  );
} catch (error) {
  console.error("❌ Erro:", error.message);
  process.exit(1);
}
